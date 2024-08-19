import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MerkleTreeDemo } from "../target/types/merkle_tree_demo";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { toString } from "@pacote/u64";
import { NewFormat, parseBalanceMap } from "./utiils/parse-balance-map";

describe("merkle-tree-demo", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();//在Anchor.toml的provider配置
  anchor.setProvider(provider);
  const program = anchor.workspace.MerkleTreeDemo as Program<MerkleTreeDemo>;
  const payer = provider.wallet as anchor.Wallet//在Anchor.toml的provider.wallet配置
  let payerPk = payer.publicKey;
  let merkleAccountPda = PublicKey.findProgramAddressSync([Buffer.from("MerkleAccount")], program.programId)[0];


  let userAmounts: NewFormat[] = [
    { address: "HHpxo1QYJjRq4ZLukvy5yBJhc1XaAwbzHx3N865f3e4u", earnings: "10" },
    { address: "8UJbH95BgaBAq5tLRDY8u5kmsZB9As9iRDXbiey5sRRv", earnings: "20" },
    { address: "DRyLzR1rX64YaCNvNLcJNvuFfWoKLssXQMwMbt8RYSXW", earnings: "30" },
    { address: "3sfJwQ4oQ6KhmgEynEuqzjJJCvtUEE3ur12tusB8kzGQ", earnings: "40" },
    { address: "6sszPCaaySKzChEghTniJFTjFyoRRziRAkou7zkHpB6y", earnings: "50" },
    { address: payerPk.toBase58(), earnings: "60" },
  ]


  it("Is proof!", async () => {
    //param 
    const { claims, merkleRoot, tokenTotal } = parseBalanceMap(userAmounts);

    //init merkle
    await program.methods.initMerkle(Array.from(merkleRoot)).accounts(
      {
        payer: payer.publicKey,
        merkleAccount: merkleAccountPda,
        systemProgram: SystemProgram.programId,
      }
    ).rpc();


    //verify merkle
    const entry = claims[payerPk.toString()];
    await program.methods.verifyMerkle(
      new anchor.BN(toString(entry.amount)),
      entry.proof.map((node) => Array.from(node))
    ).accounts(
      {
        payer: payer.publicKey,
        merkleAccount: merkleAccountPda,
        systemProgram: SystemProgram.programId,
      }
    ).rpc();
  });
});
