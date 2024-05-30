import * as anchor from "@coral-xyz/anchor"
import {
    Keypair,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js"
import { TransferSolWithProgram } from "../target/types/transfer_sol_with_program";

describe("program-transfer-sol", () => {
    const provider = anchor.AnchorProvider.env();//在Anchor.toml的provider配置
    anchor.setProvider(provider);
    const payer = provider.wallet as anchor.Wallet//在Anchor.toml的provider.wallet配置
    const program = anchor.workspace.TransferSolWithProgram as anchor.Program<TransferSolWithProgram>;//需要调用的program

    //1个SOL
    const transferAmount = 1 * LAMPORTS_PER_SOL;

    const programOwnedAccount = new Keypair();//生成account


    it("Ceate and fund account owned by our program", async () => {
        //创建account
        const instruction = SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: programOwnedAccount.publicKey,
            space: 0,
            lamports: 1 * LAMPORTS_PER_SOL,
            programId: program.programId
        });
        const transaction = new Transaction().add(instruction);

        await sendAndConfirmTransaction(provider.connection, transaction, [payer.payer, programOwnedAccount]);
    });

    it("Transfer SOL with Program", async () => {
        await getBalances(programOwnedAccount.publicKey, payer.publicKey, "before")
       //调用函数转账
        await program.methods.transferSol(new anchor.BN(transferAmount))
            .accounts({
                payer: programOwnedAccount.publicKey,
                recipient: payer.publicKey,
            })
            .rpc()

        await getBalances(programOwnedAccount.publicKey, payer.publicKey, "after")
    })


    async function getBalances(
        payerPubkey: PublicKey,
        recipientPubkey: PublicKey,
        timeframe: string
    ) {
        let payerBalance = await provider.connection.getBalance(payerPubkey)
        let recipientBalance = await provider.connection.getBalance(recipientPubkey)
        console.log(`${timeframe} balances:`)
        console.log(`   Payer: ${payerBalance / LAMPORTS_PER_SOL}`)
        console.log(`   Recipient: ${recipientBalance / LAMPORTS_PER_SOL}`)
    }

});
