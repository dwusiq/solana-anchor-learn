import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import {
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY
} from "@solana/web3.js"
import { InstructionPatchDemo } from "../target/types/instruction_patch_demo";
import { SIGNER_KEYPAIR, demoProgram, provider } from "../cli/constant";
import { sendTx } from "../cli/utils/tx_utils";
import { sleep } from "../cli/utils/instruction_utils";
// require('dotenv').config();


describe("instruction patch demo", () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.InstructionPatchDemo as Program<InstructionPatchDemo>;
  const payer = provider.wallet as anchor.Wallet//在Anchor.toml的provider.wallet配置
  let dataAccount = new Keypair();

  it("Check instruction patch", async () => {

    try {
      let data_start = 100;

      //init
      await demoProgram.methods
        .initializeData(new anchor.BN(data_start))
        .accounts({
          payer: payer.publicKey,
          dataInfoAccount: dataAccount.publicKey,
          systemProgram: SystemProgram.programId,
        }).signers([dataAccount])
        .rpc();
      await pintData("after initializeData");


      //调用捆绑函数
      let instructionFirst = await demoProgram.methods
        .changeDataFirst().accounts({
          requestUser: payer.publicKey,
          instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
          dataInfoAccount: dataAccount.publicKey,
          systemProgram: SystemProgram.programId,
        }).signers([payer.payer])
        .instruction();


      let nextAmount = data_start + 1;//跟合约中的限制一致，换其他值不行
      let instructionSecond = await demoProgram.methods
        .changeDataSecond(new anchor.BN(nextAmount)).accounts({
          requestUser: payer.publicKey,
          dataInfoAccount: dataAccount.publicKey,
          systemProgram: SystemProgram.programId,
        }).signers([payer.payer])
        .instruction();

      //同时捆绑两个函数一起调用
      await sendTx(["changeData"], [instructionFirst, instructionSecond], [SIGNER_KEYPAIR]);
      await pintData("after changeData");


    } catch (ex) {
      console.error(ex);
      throw ex;
    }

  });


  async function pintData(label: string) {
    let currentData = await demoProgram.account.dataInfo.fetch(dataAccount.publicKey);//传入data的内存地址检索数据
    console.log(`label:${label} currentData:${currentData.dataValue}`);

  }

});


