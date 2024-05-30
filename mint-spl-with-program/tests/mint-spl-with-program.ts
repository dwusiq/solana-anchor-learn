import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { MintSplWithProgram } from "../target/types/mint_spl_with_program";
import { TestValues, createValues } from "./utils";

describe("Program Mint SPL", () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.MintSplWithProgram as Program<MintSplWithProgram>;

  let values: TestValues;

  beforeEach(async () => {
    values = createValues(program.programId);

    await program.methods
      .initialize(values.id)
      .accounts({
        pool: values.poolKey,
        poolAuthority: values.poolAuthority,
        mintLiquidity: values.mintLiquidity,
      })
      .rpc();
  });

  it("Mint SPL equal amounts", async () => {
    await program.methods
      .mintSplToo(values.mintSplAmount)
      .accounts({
        poolAuthority: values.poolAuthority,
        depositor: values.admin.publicKey,
        mintLiquidity: values.mintLiquidity,
        pool: values.poolKey,
        depositorAccountLiquidity: values.liquidityAccount,
      })
      .signers([values.admin])
      .rpc({ skipPreflight: true });

    const depositTokenAccountLiquditiy =
      await connection.getTokenAccountBalance(values.liquidityAccount);

      console.log();
    expect(depositTokenAccountLiquditiy.value.amount).to.equal(
      values.mintSplAmount.toString()
    );
  });
});
