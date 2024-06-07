

### FAQ

```
    //Q
    error: package `solana-program v1.18.12` cannot be built because it requires rustc 1.75.0 or newer, while the currently active rustc version is 1.72.0-dev
    Either upgrade to rustc 1.75.0 or newer, or use
    cargo update -p solana-program@1.18.12 --precise ver

    //do
    https://crates.io/search?q=solana-program 找到所提示rust版本所匹配的solana-program版本(其他包也同理)
    cargo update -p solana-program@1.18.12 --precise  1.18.7


    //Q
    Error: Deploying program failed: RPC response error -32002: Transaction simulation failed: Error processing Instruction 0: account data too small for instruction [3 log messages]
    There was a problem deploying: Output { status: ExitStatus(unix_wait_status(256)), stdout: "", stderr: "" }.
    
    //do ： 参考https://solana.com/developers/guides/getstarted/full-stack-solana-development
    //根据programId获得程序的大小(Data Length)
    solana program show BJUyQNxymwAtZ9gcxsAkFqEY5UviX9moAcCRvDBguzu7
    //根据程序的progarmId扩展大小(直接填上面查到的结果)
    solana program extend BJUyQNxymwAtZ9gcxsAkFqEY5UviX9moAcCRvDBguzu7 182952

    //直接执行测试命令，应该就能正常运行了
    anchor test --skip-local-validator
    

    
    //Q
    Error: IDL for program `program_transfer_sol` does not have `metadata.address` field.
    To add the missing field, run `anchor deploy` or `anchor test`.
    //do
    一般这个问题都是变更了相关的program名字导致的。尝试anchor clean 然后anchor build，如果仍存在，则需要检查残留的旧文件名，替换成新的，包括相应的keypair.json文件



    //Q
    invalid account data for instruction
    //do
    合约调用前(比如铸币)，未给用户创建对应的ATA地址。
    const recipientAssociatedAccount: Account = await getOrCreateAssociatedTokenAccount(
        connection,
        owherKeypair, // 代币的Owner账户
        splTokenMintKeyPair.publicKey, //代币Mint账户的PubKey
        tokenRecipient,//接收者的pubKey
        true
    );

    //Q
    Error: AnchorError occurred. Error Code: InstructionDidNotDeserialize. Error Number: 102. Error Message: The program could not deserialize the given instruction.
    //do
    入参跟合约定义的不相同

    //Q
    Error: AnchorError occurred. Error Code: DeclaredProgramIdMismatch. Error Number: 4100. Error Message: The declared program id does not match the actual program id.
    //do
    重新生成target/deploy/xxx-keypair.json导致declare_id变化，因此可以用anchor keys list查看当前的declare_id并更新到lib.rs的值

    //Q solana-test-validator启动本地验证节点报错
    Failed to get validator identity over RPC: error sending request for url (http://127.0.0.1:8899/): connection closed before message completed
    //do
    我上次是因为开启了全局梯子‘proxy’，更改配置为'config'就可以了


   //Q 配置cpi调用，编译报错
   [2024-06-06T12:29:39.530631000Z ERROR cargo_build_sbf] Failed to obtain package metadata: `cargo metadata` exited with an error: error: no matching package named `klend` found
    location searched: /Users/qiang/Codes/TmpCode/kamino-caller/programs/klend
    required by package `kamino-caller v0.1.0 (/Users/qiang/Codes/TmpCode/kamino-caller/programs/kamino-caller)`
    //do
    大概率是引用的lib名字写错了，比如kamino_lending = {path="../klend", features=["cpi"]}
    这里面的kamino_lending要填的是program名字klend，而kamino_lending要填的是klend中配置文件Cargo.toml的[lib]对应的program名字


    //Q 跨合约CPI调用，被调用合约在编译期间就报错：
            Error: AnchorError caused by account: call_to_program. Error Code: InvalidProgramId. Error Number: 3008. Error Message: Program ID was not as expected.
    Program log: Left:
    Program log: HvgLZ4xcKY1YZ8u38zh1b6zsc8brGaM2A9RM73PafRWA
    Program log: Right:
    Program log: 2fMXp5XgFHrrRqMgrPjxzh98LMuc79pXRC82KUdKgYKe
    //do 是因为我们没有被调用合约的keyPair.json文件，同时我们把被调用方的program目录引入到我们工程中，编译期间anchor就会为这个program生成一个新的keypair.json文件，导致两个地址不匹配，编译失败。
    要解决这个问题，我们可以修改调用发起放根目录Anchor.toml文件，把被调用的合约地址注释掉，如:`# call_to = "2fMXp5XgFHrrRqMgrPjxzh98LMuc79pXRC82KUdKgYKe"`
    
```