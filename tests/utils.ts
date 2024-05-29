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

export const expectRevert = async (promise: Promise<any>) => {
  try {
    await promise;
    throw new Error("Expected a revert");
  } catch {
    return;
  }
};

export const mintingTokens = async ({
  connection,
  creator,
  holder = creator,
  mintAKeypair,
  mintedAmount = 100,
  decimals = 6,
}: {
  connection: Connection;
  creator: Signer;
  holder?: Signer;
  mintAKeypair: Keypair;
  mintedAmount?: number;
  decimals?: number;
}) => {
  // Mint tokens
  await connection.confirmTransaction(
    await connection.requestAirdrop(creator.publicKey, 10 ** 10)
  );
  await createMint(
    connection,
    creator,
    creator.publicKey,
    creator.publicKey,
    decimals,
    mintAKeypair
  );

  await getOrCreateAssociatedTokenAccount(
    connection,
    holder,
    mintAKeypair.publicKey,
    holder.publicKey,
    true
  );

  await mintTo(
    connection,
    creator,
    mintAKeypair.publicKey,
    getAssociatedTokenAddressSync(
      mintAKeypair.publicKey,
      holder.publicKey,
      true
    ),
    creator.publicKey,
    mintedAmount * 10 ** decimals
  );
};

export interface TestValues {
  id: PublicKey;
  admin: Keypair;
  poolKey:PublicKey;
  mintAKeypair: Keypair;
  poolAuthority: PublicKey;
  mintLiquidity: PublicKey;
  depositAmountA: anchor.BN;
  liquidityAccount: PublicKey;
}

type TestValuesDefaults = {
  [K in keyof TestValues]+?: TestValues[K];
};
export function createValues(defaults?: TestValuesDefaults): TestValues {
  const id = defaults?.id || Keypair.generate().publicKey;
  const admin = Keypair.generate();
  const programId = anchor.workspace.ProgramMintSpl.programId;
  const poolKey = PublicKey.findProgramAddressSync(
    [id.toBuffer()],
    programId
  )[0];


  
  // Making sure tokens are in the right order
  const mintAKeypair = Keypair.generate();
  const poolAuthority = PublicKey.findProgramAddressSync(
    [
      id.toBuffer(),
      // mintAKeypair.publicKey.toBuffer(),
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
    mintAKeypair,
    mintLiquidity,
    poolAuthority,
    liquidityAccount: getAssociatedTokenAddressSync(
      mintLiquidity,
      admin.publicKey,
      true
    ),
    depositAmountA: new BN(4 * 10 ** 6)
    };
}
