import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import {
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import { PresaleAnchorDemo } from "../target/types/presale_anchor_demo";
import { TestValues, createValues, mintingTokens } from "./utils";

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
      .initializePresale(values.id)
      .accounts({
        presaleInfo:values.presaleInfoKey,
        presaleInfoAccount: values.presaleInfoAccountKey,
        tokenMintAuthority: values.tokenMintAuthority,
        presaleMint: values.presaleMint,
        // mintA: values.mintAKeypair.publicKey,
      })
      .rpc();
  });

  it("Deposit sol and Mint SPL", async () => {
    await printBalances(payer.publicKey,values.presaleInfoAccountKey, "Before");

    await program.methods
      .payToMint(values.depositAmountA)
      .accounts({
        presaleInfo:values.presaleInfoKey,
        tokenMintAuthority: values.tokenMintAuthority,
        buyer: values.admin.publicKey,
        presaleInfoAccount: values.presaleInfoAccountKey,
        presaleMint: values.presaleMint,
        buyerTokenAccount: values.liquidityAccount,
      })
      .signers([values.admin])
      .rpc({ skipPreflight: true });

    const depositTokenAccountLiquditiy =
      await connection.getTokenAccountBalance(values.liquidityAccount);

    expect(depositTokenAccountLiquditiy.value.amount).to.equal(
      values.depositAmountA.toString()
    );

    await printBalances(payer.publicKey,values.presaleInfoAccountKey, "After");

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
