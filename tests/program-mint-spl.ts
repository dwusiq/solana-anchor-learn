import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { TestValues, createValues, mintingTokens } from "./utils";
import { ProgramMintSpl } from "../target/types/program_mint_spl";

describe("Program Mint SPL", () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.ProgramMintSpl as Program<ProgramMintSpl>;

  let values: TestValues;

  beforeEach(async () => {
    values = createValues();

    await mintingTokens({
      connection,
      creator: values.admin,
      mintAKeypair: values.mintAKeypair
    });

    await program.methods
      .createPool(values.id)
      .accounts({
        pool:values.poolKey,
        poolAuthority: values.poolAuthority,
        mintLiquidity: values.mintLiquidity,
        // mintA: values.mintAKeypair.publicKey,
      })
      .rpc();
  });

  it("Mint SPL equal amounts", async () => {
    await program.methods
      .depositLiquidity(values.depositAmountA)
      .accounts({
        poolAuthority: values.poolAuthority,
        depositor: values.admin.publicKey,
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
  });
});
