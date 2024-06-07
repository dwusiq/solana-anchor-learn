import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import { CallTo } from "../target/types/call_to";
import { CallFrom } from "../target/types/call_from";



describe("call-from", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);


  const callToProgram = anchor.workspace.CallTo as Program<CallTo>;
  const callFromprogram = anchor.workspace.CallFrom as Program<CallFrom>;


  const dataPDA = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("worker"),
      provider.wallet.publicKey.toBuffer(),
    ],
    callToProgram.programId
  )[0];


  beforeEach(async () => {
    // await callToProgram.methods.initialize().accounts({
    //   dataAccount: dataPDA,
    //   user: provider.wallet.publicKey,
    // }).rpc();
  });


  it("Calll!", async () => {
    await printData("before:");
    const randomNumber = Math.floor(Math.random() * 100) + 1;
   await callFromprogram.methods.setRemote(new anchor.BN(randomNumber)).accounts({
     callToDateAccount: dataPDA,
     callToProgram: callToProgram.programId
   }).rpc();

   await printData("after:");

  });

  async function printData(msg:string){
    const dataAccount = await callToProgram.account.dataAcount.fetch(dataPDA);//传入内存地址检索数据
    console.log(`msg:${dataAccount.currentValue}`);
  }
});
