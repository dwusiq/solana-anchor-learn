import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IDL as nxLendIdl } from "./idl/types/nx_lend";
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Get()
  // getHello(): string {
  //   const connection = new Connection("https://dark-intensive-dream.solana-mainnet.quiknode.pro/bcea36be83c7f3b3e1afbb625fa47048926bf67f/");
  //   const programID = new PublicKey("DkPByb2tiqB8qTzVREw3x6DFddiYroFS4ptT5AgMtAAq");
  //   console.log(`>>>>>>>>>current RPC_URL: ${connection.rpcEndpoint}`);

  //   //program
  //   const program = new Program(nxLendIdl as anchor.Idl, programID, { connection })
  //   console.log(`>>>>>>>>>current NX_PROGRAM_ID: ${program.programId}`);

  //   return this.appService.getHello();
  // }


  @Get("/position")
  async calculatePoint() {
    const connection = new Connection("https://dark-intensive-dream.solana-mainnet.quiknode.pro/bcea36be83c7f3b3e1afbb625fa47048926bf67f/");
    const programID = new PublicKey("DkPByb2tiqB8qTzVREw3x6DFddiYroFS4ptT5AgMtAAq");
    console.log(`>>>>>>>>>current RPC_URL: ${connection.rpcEndpoint}`);

    //program
    const program = new Program(nxLendIdl as anchor.Idl, programID, { connection })
    console.log(`>>>>>>>>>current NX_PROGRAM_ID: ${program.programId}`);

    let user_pk = new PublicKey("DZktgvHVfMbzvCDmLUDAYiz8QCCQDEuvfquYkYha1TpX");
    let marketPk = PublicKey.findProgramAddressSync([Buffer.from("nx_market"), program.programId.toBuffer()], program.programId)[0]
    let position_account = PublicKey.findProgramAddressSync([Buffer.from("v_sol_position_account"), marketPk.toBuffer(), user_pk.toBuffer()], program.programId)[0]

    let position_account_data: any = await program.account.vSolPosition.fetch(position_account);
    print_nx_object("position_account_data",position_account_data);
  }
}


function print_nx_object(obj_name: string, object: any) {
  console.log(`\r\n>> ${obj_name} detail info:`);
  for (let key in object) {
    console.log( object[key],"type>>>",typeof  object[key]);
      let value = key == "positions" ? JSON.stringify(object[key]) : object[key];
      console.log(key + ': ' + value);
  }
}
