import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import {
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import { TestValues, createValues, mintingTokens } from "./utils";
import { PresaleAnchorDemo } from "../target/types/presale_anchor_demo";

describe("Presale Demo", () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.PresaleAnchorDemo as Program<PresaleAnchorDemo>;
  const payer = provider.wallet as anchor.Wallet//在Anchor.toml的provider.wallet配置


  let values: TestValues;

  beforeEach(async () => {
    values = createValues(program.programId);

    await mintingTokens({
      connection,
      creator: values.admin,
      mintAKeypair: values.mintAKeypair
    });

    await program.methods
      .createPool(values.id)
      .accounts({
        pool:values.poolKey,
        poolAccount: values.poolAccountKey,
        poolAuthority: values.poolAuthority,
        mintLiquidity: values.mintLiquidity,
        // mintA: values.mintAKeypair.publicKey,
      })
      .rpc();
  });

  it("Deposit sol and Mint", async () => {
    await printBalances(payer.publicKey,values.poolAccountKey, "Before");

    await program.methods
      .depositLiquidity(values.depositAmountA)
      .accounts({
        poolAuthority: values.poolAuthority,
        depositor: values.admin.publicKey,
        poolAccount: values.poolAccountKey,
        mintLiquidity: values.mintLiquidity,
        pool:values.poolKey,
        // mintA: values.mintAKeypair.publicKey,
        depositorAccountLiquidity: values.liquidityAccount,
      })
      .signers([values.admin])
      .rpc({ skipPreflight: true });

    const depositTokenAccountLiquditiy =
      await connection.getTokenAccountBalance(values.liquidityAccount);

    expect(depositTokenAccountLiquditiy.value.amount).to.equal(
      values.depositAmountA.toString()
    );

    await printBalances(payer.publicKey,values.poolAccountKey, "After");

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
