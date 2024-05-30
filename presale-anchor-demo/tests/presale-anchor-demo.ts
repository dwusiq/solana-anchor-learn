import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import {
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import { PresaleAnchorDemo } from "../target/types/presale_anchor_demo";
import { TestValues, createValues, expectRevert } from "./utils";

describe("Presale Demo", () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.PresaleAnchorDemo as Program<PresaleAnchorDemo>;
  const payer = provider.wallet as anchor.Wallet//在Anchor.toml的provider.wallet配置

  const ONE_SOL = LAMPORTS_PER_SOL;
  const ONE_MINT_SELLING = 10 ** 6;
  console.log(`ONE_SOL:${ONE_SOL}\r\nONE_MINT_SELLING:${ONE_MINT_SELLING}`);

  //param
  let values: TestValues;
  const params = {
    mintTokenPrice: Math.round(0.2 * ONE_SOL / ONE_MINT_SELLING),
    receiveSolMax: ONE_SOL,
    // owner: payer.publicKey
  }
  console.log(`params:${JSON.stringify(params)}`);

  beforeEach(async () => {
    values = createValues(program.programId);

    // await mintingTokens({
    //   connection,
    //   creator: values.admin,
    //   mintAKeypair: values.mintAKeypairÍ
    // });

    await program.methods
      .initializePresale(values.id, new anchor.BN(params.mintTokenPrice), new anchor.BN(params.receiveSolMax))
      .accounts(getAccountsForIntializePresale(values))
      .rpc();
  });

  it("Expect Buy Success: Pay Sol To Mint SPL", async () => {
    const paySolAmount = 0.2 * LAMPORTS_PER_SOL;
    const expectReceiptTokenAmount = paySolAmount / params.mintTokenPrice;

    await program.methods
      .payToMint(new anchor.BN(paySolAmount))
      .accounts(getAccountsForBuyMint(values))
      .signers([values.buyer])
      .rpc({ skipPreflight: true });

    const buyerTokenBalance = await connection.getTokenAccountBalance(values.buyerTokenAccount);
    expect(buyerTokenBalance.value.amount).to.equal(expectReceiptTokenAmount.toString());
    console.log(`paySol:${paySolAmount.toString()}\r\nexpectReceive:${expectReceiptTokenAmount.toString()}\r\nreceive:${buyerTokenBalance.value.amount.toString()}`);
  });


  it("Expect fail: Sold out", async () => {
    await program.methods
      .payToMint(new anchor.BN(0.1 * LAMPORTS_PER_SOL))
      .accounts(getAccountsForBuyMint(values))
      .signers([values.buyer])
      .rpc({ skipPreflight: true })

    await expectRevert(
      program.methods
        .payToMint(new anchor.BN(params.receiveSolMax))
        .accounts(getAccountsForBuyMint(values))
        .signers([values.buyer])
        .rpc({ skipPreflight: true }), "Sold Out");
  });


  it("Expect Withdraw Success", async () => {
    await program.methods
      .payToMint(new anchor.BN(0.5 * LAMPORTS_PER_SOL))
      .accounts(getAccountsForBuyMint(values))
      .signers([values.buyer])
      .rpc({ skipPreflight: true })


    await program.methods
      .withdrawSol(new anchor.BN(0.2 * LAMPORTS_PER_SOL))
      .accounts(getAccountsForWithdraw(values))
      .rpc({ skipPreflight: true })


  });



  /**
 * 获取初始化合约的相关帐号
 * @param values 
 */
  function getAccountsForIntializePresale(values: TestValues) {
    return {
      owner: payer.publicKey,
      presaleInfo: values.presaleInfoKey,
      presaleInfoAccount: values.presaleInfoAccountKey,
      tokenMintAuthority: values.tokenMintAuthority,
      presaleMint: values.presaleMint,
    };
  }


  /**
* 获取铸币的相关帐号
* @param values 
*/
  function getAccountsForBuyMint(values: TestValues) {
    return {
      presaleInfo: values.presaleInfoKey,
      tokenMintAuthority: values.tokenMintAuthority,
      buyer: values.buyer.publicKey,
      presaleInfoAccount: values.presaleInfoAccountKey,
      presaleMint: values.presaleMint,
      buyerTokenAccount: values.buyerTokenAccount,
    };
  }


  /**
    * 获取提币的相关帐号
    * @param values 
    */
  function getAccountsForWithdraw(values: TestValues) {
    return {
      presaleInfo: values.presaleInfoKey,
      presaleInfoAccount: values.presaleInfoAccountKey
    };
  }


});


