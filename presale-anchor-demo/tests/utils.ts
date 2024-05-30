import * as anchor from "@coral-xyz/anchor";
import {
  createMint,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { Keypair, PublicKey, Connection, Signer } from "@solana/web3.js";
import { BN } from "bn.js";

export async function sleep(seconds: number) {
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export const generateSeededKeypair = (seed: string) => {
  return Keypair.fromSeed(
    anchor.utils.bytes.utf8.encode(anchor.utils.sha256.hash(seed)).slice(0, 32)
  );
};

// export const expectRevert = async (promise: Promise<any>) => {
//   try {
//     await promise;
//     throw new Error("Expected a revert");
//   } catch {
//     return;
//   }
// };



export async function expectRevert(func: Promise<any>, expectErrMsg: string) {
  try {
    await func
    throw new Error("Expected a revert");
  } catch (ex) {
    const msg = ex.msg;
    if (msg != expectErrMsg)
      throw new Error(`Error msg not match. left:${msg} right:${expectErrMsg}`);
  }
}

// export const mintingTokens = async ({
//   connection,
//   creator,
//   holder = creator,
//   mintAKeypair,
//   mintedAmount = 100,
//   decimals = 6,
// }: {
//   connection: Connection;
//   creator: Signer;
//   holder?: Signer;
//   mintAKeypair: Keypair;
//   mintedAmount?: number;
//   decimals?: number;
// }) => {
//   // Mint tokens
//   await connection.confirmTransaction(
//     await connection.requestAirdrop(creator.publicKey, 10 ** 10)
//   );
//   await createMint(
//     connection,
//     creator,
//     creator.publicKey,
//     creator.publicKey,
//     decimals,
//     mintAKeypair
//   );

//   await getOrCreateAssociatedTokenAccount(
//     connection,
//     holder,
//     mintAKeypair.publicKey,
//     holder.publicKey,
//     true
//   );

//   await mintTo(
//     connection,
//     creator,
//     mintAKeypair.publicKey,
//     getAssociatedTokenAddressSync(
//       mintAKeypair.publicKey,
//       holder.publicKey,
//       true
//     ),
//     creator.publicKey,
//     mintedAmount * 10 ** decimals
//   );
// };

export interface TestValues {
  id: PublicKey;
  buyer: Keypair;
  presaleInfoKey: PublicKey;
  presaleInfoAccountKey: PublicKey;
  mintAKeypair: Keypair;
  tokenMintAuthority: PublicKey;
  presaleMint: PublicKey;
  // depositAmountA: anchor.BN;
  buyerTokenAccount: PublicKey;
}

type TestValuesDefaults = {
  [K in keyof TestValues]+?: TestValues[K];
};
export function createValues(programId: PublicKey, defaults?: TestValuesDefaults): TestValues {
  const id = defaults?.id || Keypair.generate().publicKey;
  const buyer = Keypair.generate();
  // const programId = anchor.workspace.ProgramMintSpl.programId;
  const presaleInfoKey = PublicKey.findProgramAddressSync(
    [id.toBuffer()],
    programId
  )[0];

  const presaleInfoAccountKey = PublicKey.findProgramAddressSync(
    [
      id.toBuffer(),
      Buffer.from("presale_info"),
    ],
    programId
  )[0];




  // Making sure tokens are in the right order
  const mintAKeypair = Keypair.generate();
  const tokenMintAuthority = PublicKey.findProgramAddressSync(
    [
      id.toBuffer(),
      // mintAKeypair.publicKey.toBuffer(),
      Buffer.from("authority"),
    ],
    programId
  )[0];
  const presaleMint = PublicKey.findProgramAddressSync(
    [
      id.toBuffer(),
      Buffer.from("liquidity"),
    ],
    programId
  )[0];

  return {
    id,
    buyer,
    presaleInfoKey,
    presaleInfoAccountKey,
    mintAKeypair,
    presaleMint,
    tokenMintAuthority,
    buyerTokenAccount: getAssociatedTokenAddressSync(
      presaleMint,
      buyer.publicKey,
      true
    ),
    // depositAmountA: new BN(4 * 10 ** 9)
  };
}
