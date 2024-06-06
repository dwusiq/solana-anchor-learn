import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CallTo } from "../target/types/call_to";
import { CallFrom } from "../target/types/call_from";

describe("cpi", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const CallFrom = anchor.workspace.CallFrom as Program<CallFrom>;
  const CallTo = anchor.workspace.CallTo as Program<CallTo>;

  // Generate a new keypair for the power account
  const powerAccount = new anchor.web3.Keypair();

  it("Initialize the CallTo!", async () => {
    await CallTo.methods
      .initialize()
      .accounts({
        power: powerAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([powerAccount])
      .rpc();
  });

  it("Pull the CallTo!", async () => {
    await CallFrom.methods
      .pullLever("Chris")
      .accounts({
        power: powerAccount.publicKey,
      })
      .rpc();
  });

  it("Pull it again!", async () => {
    await CallFrom.methods
      .pullLever("Ashley")
      .accounts({
        power: powerAccount.publicKey,
      })
      .rpc();
  });
});
