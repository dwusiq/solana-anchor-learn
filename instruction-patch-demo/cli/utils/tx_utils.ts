import { SIGNER_KEYPAIR, SIGNER_PK, connection, provider } from "../constant";
import { LAMPORTS_PER_SOL, PublicKey, Keypair, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { buildAndSendTxnWithLogs, buildVersionedTransaction } from "./instruction_utils";



export async function air_drop_sol(receiptor_pk: PublicKey) {
    console.log(`>>${receiptor_pk} balance.before airdrop:${await connection.getBalance(receiptor_pk)}`);

    let airdropSignature = await connection.requestAirdrop(receiptor_pk, 10 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);

    console.log(`>>${receiptor_pk} balance.after airdrop:${await connection.getBalance(receiptor_pk)}`);
}



export async function sendTx(txLabel: string[], instructions: TransactionInstruction[], signer_keypairs: Keypair[]) {
    let payer_pk = signer_keypairs[0].publicKey;
    if (!instructions || instructions.length == 0) return;
    console.log('start txLabel:', txLabel.toString());
    // const ltps = await connection.getAddressLookupTable(lookUpTable).then(res => res.value);

    const blockhash = (await connection.getLatestBlockhash()).blockhash;
    console.log(`payer:${payer_pk} signers:${signer_keypairs.map(r => r.publicKey).join(",")}`);
    const messageV0 = new TransactionMessage({
        payerKey: payer_pk,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message();
    // }).compileToV0Message([ltps]);

    const transaction = new VersionedTransaction(messageV0);
    try {
        await provider.simulate(transaction, signer_keypairs);
        console.log("simulate passed");
    } catch (ex) {
        console.log(ex);
        return;
    }


    let i = 1;
    console.log(`sending tx:${txLabel}`);
    while (i > 0) {
        i--;
        try {
            const preTxn = await buildVersionedTransaction(connection, payer_pk, instructions);
            const txHash = await buildAndSendTxnWithLogs(connection, preTxn, signer_keypairs,true);
            console.log('success. txHash:', txHash);
            break;
        } catch (ex) {
            console.log(ex);
        }
        console.log(`tx:${txLabel}. left times:${i}`);

    }
}
