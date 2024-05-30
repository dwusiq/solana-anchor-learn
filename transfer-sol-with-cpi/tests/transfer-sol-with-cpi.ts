import * as anchor from "@coral-xyz/anchor"
import {
    Keypair,
    PublicKey,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import { TransferSolWithCpi } from "../target/types/transfer_sol_with_cpi";

describe("cpi-transfer-sol", () => {
    const provider = anchor.AnchorProvider.env();//在Anchor.toml的provider配置
    anchor.setProvider(provider);

    const payer = provider.wallet as anchor.Wallet//在Anchor.toml的provider.wallet配置
    const program = anchor.workspace.TransferSolWithCpi as anchor.Program<TransferSolWithCpi>//protrams的各个目录(一般一个程序一个program)，编译后的文件

    //1个SOL
    const transferAmount = 1 * LAMPORTS_PER_SOL;

    //随机新建一个用户接收sol
    const recipient = new Keypair();

    it("Transer SOL with CPI", async () => {
        await printBalances(payer.publicKey, recipient.publicKey, "Before");
        await program.methods.transferSol(new anchor.BN(transferAmount)).accounts({
            payer: payer.publicKey,
            recipient: recipient.publicKey
        }).rpc();
        await printBalances(payer.publicKey, recipient.publicKey, "After");
    });


    //打印相关钱包的SOL余额
    async function printBalances(payerPubkey: PublicKey,
        recipientPubkey: PublicKey,
        timeframe: string
    ) {
        let payerBalance = await provider.connection.getBalance(payerPubkey);
        let recipientBalance = await provider.connection.getBalance(recipientPubkey);
        console.log(`${timeframe} balances:`)
        console.log(`   Payer: ${payerBalance / LAMPORTS_PER_SOL}`)
        console.log(`   Recipient: ${recipientBalance / LAMPORTS_PER_SOL}`)
    }

});