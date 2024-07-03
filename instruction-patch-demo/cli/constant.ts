import {
    PublicKey,
    Keypair,
    Connection,
} from "@solana/web3.js";
import fs from 'fs';
import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";

import { IDL as instructionPatchDemoIdl } from "../target/types/instruction_patch_demo";

require("dotenv").config()

//env
export const CURRENT_ENV = process.env.ENV;



//PubKey
export const DEMO_PK = new PublicKey(process.env.INSTRUCTION_PATCH_DEMO_ID);


//signer
const keyData = fs.readFileSync(process.env.KEYPAIR_PATH, 'utf-8');
export const SIGNER_KEYPAIR = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keyData)));
export const SIGNER_WALLET = new Wallet(SIGNER_KEYPAIR);
export const SIGNER_PK = SIGNER_WALLET.publicKey;
console.log(`>>>>>>>>>current SIGNER_PK: ${SIGNER_PK}`);


//provider
export const connection = new Connection(process.env.RPC_URL);
export const provider = new AnchorProvider(connection, SIGNER_WALLET, { commitment: "finalized", });//processed < confirmed < finalized
console.log(`>>>>>>>>>current RPC_URL: ${process.env.RPC_URL}`);


//program
export const demoProgram = new Program(instructionPatchDemoIdl as anchor.Idl, DEMO_PK, provider);
console.log(`>>>>>>>>>current DEMO_PK: ${DEMO_PK}`);


