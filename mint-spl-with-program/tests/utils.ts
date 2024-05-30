import * as anchor from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";

export async function sleep(seconds: number) {
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export const generateSeededKeypair = (seed: string) => {
  return Keypair.fromSeed(
    anchor.utils.bytes.utf8.encode(anchor.utils.sha256.hash(seed)).slice(0, 32)
  );
};

export const expectRevert = async (promise: Promise<any>) => {
  try {
    await promise;
    throw new Error("Expected a revert");
  } catch {
    return;
  }
};


export interface TestValues {
  id: PublicKey;
  admin: Keypair;
  poolKey: PublicKey;
  poolAccountKey: PublicKey;
  poolAuthority: PublicKey;
  mintLiquidity: PublicKey;
  mintSplAmount: anchor.BN;
  liquidityAccount: PublicKey;
}

type TestValuesDefaults = {
  [K in keyof TestValues]+?: TestValues[K];
};
export function createValues(programId: PublicKey, defaults?: TestValuesDefaults): TestValues {
  const id = defaults?.id || Keypair.generate().publicKey;
  const admin = Keypair.generate();
  // const programId = anchor.workspace.ProgramMintSpl.programId;
  const poolKey = PublicKey.findProgramAddressSync(
    [id.toBuffer()],
    programId
  )[0];

  const poolAccountKey = PublicKey.findProgramAddressSync(
    [
      id.toBuffer(),
      Buffer.from("pool"),
    ],
    programId
  )[0];




  // // Making sure tokens are in the right order
  const poolAuthority = PublicKey.findProgramAddressSync(
    [
      id.toBuffer(),
      Buffer.from("authority"),
    ],
    programId
  )[0];
  const mintLiquidity = PublicKey.findProgramAddressSync(
    [
      id.toBuffer(),
      Buffer.from("liquidity"),
    ],
    programId
  )[0];

  return {
    id,
    admin,
    poolKey,
    poolAccountKey,
    // mintAKeypair,
    mintLiquidity,
    poolAuthority,
    liquidityAccount: getAssociatedTokenAddressSync(
      mintLiquidity,
      admin.publicKey,
      true
    ),
    mintSplAmount: new BN(4 * 10 ** 9)
  };
}
