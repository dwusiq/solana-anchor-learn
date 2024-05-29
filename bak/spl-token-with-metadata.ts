import * as anchor from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
} from "@solana/web3.js"
import { getAssociatedTokenAddressSync, tokenMetadataInitialize } from "@solana/spl-token";
import { SplTokenWithMetadata } from "../target/types/spl_token_with_metadata";

describe("NFT Minter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.SplTokenWithMetadata as anchor.Program<SplTokenWithMetadata>;

  // Derive the PDA to use as mint account address.
  // This same PDA is also used as the mint authority.
  const [mintPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    program.programId
  );

  const metadata = {
    name: "Solana Gold",
    symbol: "GOLDSOL",
    uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
  };


  // Generate new keypair to use as address for mint account.
  const mintKeypair = new Keypair();
  const metadataPair = new Keypair();
  const tokenMetadataProgramKeyPair = new Keypair();
  it("Create a token!", async () => {
    const transactionSignature = await program.methods
      .createToken(metadata.name, metadata.symbol, metadata.uri)
      .accounts({
        payer: payer.publicKey,
        mintAccount: mintKeypair.publicKey,
      })
      .rpc();

    console.log("Success!");
    console.log(`   Mint Address: ${mintPDA}`);
    console.log(`   Transaction Signature: ${transactionSignature}`);
  });

  it("Mint 1 Token!", async () => {
    // Derive the associated token address account for the mint and payer.
    const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
      mintPDA,
      payer.publicKey
    );

    // Amount of tokens to mint.
    const amount = new anchor.BN(100);

    const transactionSignature = await program.methods
      .mintToken(amount)
      .accounts({
        payer: payer.publicKey,
        associatedTokenAccount: associatedTokenAccountAddress,
      })
      .rpc();

    console.log("Success!");
    console.log(
      `   Associated Token Account Address: ${associatedTokenAccountAddress}`
    );
    console.log(`   Transaction Signature: ${transactionSignature}`);
  });
});