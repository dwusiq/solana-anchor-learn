

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
    solana program show 6mFGG3gPrtS7ZoGBdpBn8UgqXhhdr3LY1vgsjR9DatSJ
    //根据程序的progarmId扩展大小(直接填上面查到的结果)
    solana program extend 6mFGG3gPrtS7ZoGBdpBn8UgqXhhdr3LY1vgsjR9DatSJ 201000
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
```