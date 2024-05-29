// import * as anchor from "@coral-xyz/anchor"
// import { CpiTransferSol } from "../target/types/cpi_transfer_sol";
// import {
//     Keypair,
//     PublicKey,
//     LAMPORTS_PER_SOL,
// } from "@solana/web3.js"
// import { CounterAnchor } from "../target/types/counter_anchor";

// describe("countor-anchor", () => {
//     const provider = anchor.AnchorProvider.env();//在Anchor.toml的provider配置
//     anchor.setProvider(provider);

//     const payer = provider.wallet as anchor.Wallet//在Anchor.toml的provider.wallet配置
//     const program = anchor.workspace.CounterAnchor as anchor.Program<CounterAnchor>//protrams的各个目录(一般一个程序一个program)，编译后的文件


//     //专门给counter随机新建一个用户
//     const counterKeyPair = new Keypair();
//     it("Init Counter-Anchor", async () => {
//         await program.methods.initialize(new anchor.BN(10)).accounts({
//             payer: payer.publicKey,
//             counter: counterKeyPair.publicKey//以后就可由counterKeyPair.publicKey指向这个counter的数据地址
//         }).signers([counterKeyPair]).rpc();//TODO ??? 为什么不是payer???

//         const currentData = await program.account.counterData.fetch(counterKeyPair.publicKey);//传入counter的内存地址检索数据
//         console.log(`currentData-before:${currentData.data}`);
//     });


//     it("Increase Counter-Anchor", async () => {
//         await program.methods.increaseCounter().accounts({
//             counter: counterKeyPair.publicKey//代码中有逻辑需要用到counter的数据，因此需要传入counter的内存地址
//         }).rpc();
//         const currentData = await program.account.counterData.fetch(counterKeyPair.publicKey);//传入counter的内存地址检索数据
//         console.log(`currentData-after:${currentData.data}`);
//     });


// });