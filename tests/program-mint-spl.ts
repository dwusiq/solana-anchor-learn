import * as anchor from "@coral-xyz/anchor"
import {
    Keypair,
    PublicKey,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import { ProgramMintSpl } from "../target/types/program_mint_spl";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { web3 } from "@coral-xyz/anchor";

describe("program-mint-spl", () => {
    const provider = anchor.AnchorProvider.env();//在Anchor.toml的provider配置
    anchor.setProvider(provider);

    const payer = provider.wallet as anchor.Wallet//在Anchor.toml的provider.wallet配置
    const program = anchor.workspace.ProgramMintSpl as anchor.Program<ProgramMintSpl>//protrams的各个目录(一般一个程序一个program)，编译后的文件


    const mintAuthority = PublicKey.findProgramAddressSync(
        [
            payer.publicKey.toBuffer(),
            Buffer.from("authority"),
        ],
        program.programId
    )[0];


    const mintLocalAccount = PublicKey.findProgramAddressSync(
        [
            payer.publicKey.toBuffer(),
            Buffer.from("mint"),
        ],
        program.programId
    )[0];


    //专门给counter随机新建一个用户
    const contractKeyPair = new Keypair();
    it("Init Program-Mint-Spl", async () => {
        console.log(`payer:${payer.publicKey}\r\nmintAuthority:${mintAuthority.toBase58()}\r\ncontractKeyPair:${contractKeyPair.publicKey}\r\nmintLocalAccount:${mintLocalAccount.toBase58()}`);
        await program.methods.initialize().accounts({
            payer: payer.publicKey,
            mintAuthority: mintAuthority,
            mintLocalAccount: mintLocalAccount,
            tokenProgram: TOKEN_PROGRAM_ID
        }).rpc();

        // const currentData = await program.account.counterData.fetch(counterKeyPair.publicKey);//传入counter的内存地址检索数据
        // console.log(`currentData-before:${currentData.data}`);
    });


    it("Increase Counter-Anchor", async () => {
        const recipientKeyPair = new Keypair();

        const recipientATA = await getAssociatedTokenAddress(
            // connection,
            // payer, // 创建这个ATA的付款账户
            mintLocalAccount, //代币Mint账户的PubKey
            recipientKeyPair.publicKey,//该ATA账户的owner(即私钥生成的PubKey)
        );
        await program.methods.mintTokenTo(new anchor.BN(200)).accounts({
            payer: payer.publicKey,
            recipient: recipientKeyPair.publicKey,
            recipientAccountToken: recipientATA,
            mintAuthority: mintAuthority,
            mintLocalAccount: mintLocalAccount,
            tokenProgram: TOKEN_PROGRAM_ID
        }).rpc();
        // const currentData = await program.account.counterData.fetch(counterKeyPair.publicKey);//传入counter的内存地址检索数据
        // console.log(`currentData-after:${currentData.data}`);
    });

    /** 
 * 获取指定地址在该token下的ATA
 */
    // async function getOrCreateATA(tokenHolderPubKey: PublicKey) {

    //     const connection = provider.connection;

    //     const tempArraySecret = Object.values(payer.payer.secretKey);
    //     const secret = new Uint8Array(tempArraySecret);

    //     // 使用 @solana/web3.js 的 Keypair.fromSecretKey 方法创建 Keypair
    //     const ownerKeypair = web3.Keypair.fromSecretKey(secret);

    //     return await getAssociatedTokenAddress(
    //         connection,
    //         ownerKeypair, // 创建这个ATA的付款账户
    //         mintLocalAccount, //代币Mint账户的PubKey
    //         tokenHolderPubKey,//该ATA账户的owner(即私钥生成的PubKey)
    //     );
    // }


});