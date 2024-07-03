import * as anchor from "@coral-xyz/anchor"
import { web3 } from "@coral-xyz/anchor";
import { Account, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, createMint, getAssociatedTokenAddressSync, getMint, getOrCreateAssociatedTokenAccount, getTokenMetadata, mintTo, tokenMetadataInitializeWithRentTransfer, transfer } from "@solana/spl-token";
import {
    Keypair,
    PublicKey,
} from "@solana/web3.js"

describe("spl-token-2020", () => {
    const provider = anchor.AnchorProvider.env();//在Anchor.toml的provider配置
    anchor.setProvider(provider);
    const connection = provider.connection;

    const ownerAccount = provider.wallet as anchor.Wallet//在Anchor.toml的provider.wallet配置
    // 从 anchor.Wallet 中获取 secretKey
    const tempArraySecret = Object.values(ownerAccount.payer.secretKey);
    const secret = new Uint8Array(tempArraySecret);

    // 使用 @solana/web3.js 的 Keypair.fromSecretKey 方法创建 Keypair
    const ownerKeypair = web3.Keypair.fromSecretKey(secret);
    const authorityPubKey = ownerAccount.publicKey;

    //代币元数据
    const tokenMetadata = {
        tokenName: "My Test Spl Token",
        symbol: "MTST",
        tokenDecimal: 9,
        uri: ""
    }


    //专门给Token随机新建一个用户
    const splTokenMintKeyPair = new Keypair();
    it("Create Spl-Token-2022", async () => {
        //创建新的Token的Mint账户
        await createMint(
            connection,
            ownerKeypair, // 付款账户
            ownerAccount.publicKey, // 代币的创建者
            authorityPubKey, // 代币的授权者，可以为空
            tokenMetadata.tokenDecimal, // 代币的小数位数
            splTokenMintKeyPair,//代币Mint账户专有的KeyPair
        );
        console.log('Token created:', splTokenMintKeyPair.publicKey.toBase58());
    });


    //TODO 修改没起效果
    // it("Init Metadata Spl-Token-2022", async () => {

    //     const updateAuthority = ownerAccount.publicKey;
    //     const mintAuthority = ownerAccount.publicKey;

    //     //初始化代币的元数据
    //     tokenMetadataInitializeWithRentTransfer(
    //         connection,
    //         ownerKeypair, // 代币的Owner账户
    //         splTokenMintKeyPair.publicKey, //代币Mint账户的PubKey
    //         updateAuthority,//授权操作元数据的用户
    //         mintAuthority, //授权铸币的用户
    //         tokenMetadata.tokenName,
    //         tokenMetadata.symbol,
    //         tokenMetadata.uri
    //     );

    //     //查询元数据
    //     const tokenMetadataRsp = await getTokenMetadata(
    //         connection,
    //         splTokenMintKeyPair.publicKey, //代币Mint账户
    //     );

    //     console.log('Spl-Token tokenMetadataRsp:', JSON.stringify(tokenMetadataRsp));

    //     const tttt = await getMint(
    //         connection,
    //         splTokenMintKeyPair.publicKey, //代币Mint账户的PubKey
    //         null,
    //         TOKEN_2022_PROGRAM_ID);
    //         console.log("ttt",tttt);
    // });




    it("Mint Spl-Token-2022", async () => {
        //用户的的ATA(给用户转账之前，必须要先帮他生成ATA地址)
        const mintRecipient = await getOrCreateATA(ownerAccount.publicKey);//本次mint的接收账户（用户的ATA）
        
        await mintTo(
            connection,
            ownerKeypair,  //付款账户
            splTokenMintKeyPair.publicKey, //代币Mint账户的pubKey
            mintRecipient.address,//接收者对应该代币的ADA地址
            ownerKeypair, 
            100,// 铸造的数量
        );

        const balance = await connection.getTokenAccountBalance(mintRecipient.address);
        console.log(`balance:${balance.value.uiAmountString}`);

    });



    it("Transfer Spl-Token-2022", async () => {
        //本次转账的发送账户（用户的ATA）
        const senderATA = await getOrCreateATA(ownerAccount.publicKey);

        //用户的的ATA(给用户转账之前，必须要先帮他生成ATA地址)
        const tokenRecipient = new Keypair();
        const recipientATA = await getOrCreateATA(tokenRecipient.publicKey);//

        const payer = ownerKeypair;//付款账户
        const sourceAtaOwner = ownerKeypair;//
        await transfer(
            connection,
            payer,  //付款账户
            senderATA.address, //从该ATA地址转出
            recipientATA.address,//转token到这个ATA地址
            sourceAtaOwner.publicKey,//转出的ATA账户的owner
            20,//转账金额
        );

        const senderBalance = await connection.getTokenAccountBalance(senderATA.address);
        console.log(`senderBalance:${senderBalance.value.uiAmountString}`);
        const recipientBalance = await connection.getTokenAccountBalance(recipientATA.address);
        console.log(`recipientBalance:${recipientBalance.value.uiAmountString}`);
    });



    /**
     * 获取指定地址在该token下的ATA
     */
    async function getOrCreateATA(tokenHolderPubKey: PublicKey) {
        return await getOrCreateAssociatedTokenAccount(
            connection,
            ownerKeypair, // 创建这个ATA的付款账户
            splTokenMintKeyPair.publicKey, //代币Mint账户的PubKey
            tokenHolderPubKey,//该ATA账户的owner(即私钥生成的PubKey)
        );

    }



});