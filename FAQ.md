

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
    solana program show 5zB1vCeQxFXkbFiucPB4XqDWTuDNo5FFFYLH54kUh3pR
    //根据程序的progarmId扩展大小(直接填上面查到的结果)
    solana program extend 5zB1vCeQxFXkbFiucPB4XqDWTuDNo5FFFYLH54kUh3pR 216680

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
    入参跟合约定义的不相同,注意有一些instruction的入参account定义时在头部加了类似这样的限制`[instruction(id: Pubkey)]`

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
    

    //Q 跨CPI调用时，调用发起方的合约编译报错：
        unresolved import `crate`
        could not find `__client_accounts_withdraw_obligation_collateral_and_redeem_reserve_collateral` in the crate root
    //do
        可能是CPI调用时，将被调用方中定义的结构体放到调用方的函数入参的context了，如调用发起方的context:Context<DepositReserveLiquidityAndObligationCollateral>
    
    //Q 
    执行下面这句初始化program的语句时，报错：“TypeError: Cannot read properties of undefined (reading 'instructions')”
    export const program = new Program(IDL as anchor.Idl, LEVERAGE_KAMINO_PROGRAM_ID_PK, provider);
    //do
    这种情况大概率是programId和IDL文件没匹配（检查IDL文件）


    //Q  
      执行命令`await provider.simulate(transaction, [SIGNER_KEYPAIR]);`预执行合约时报错：
      'Program log: AnchorError caused by account: owner. Error Code: ConstraintMut. Error Number: 2000. Error Message: A mut constraint was violated.',
    //do
     接口入参的上下文有字段定义了#[account(mut)]的，但是实际上业务逻辑没用到这个字段


    //Q
       加入tokenMint之后编译报错
       error[E0599]: no associated item named `__anchor_private_insert_idl_defined` found for struct `anchor_spl::token::Mint` in the current scope
    //do 修改program下面的Cargo.toml文件，加如下内容
      [features]
      idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]

    //Q 调用函数时报错
      'Program log: AnchorError caused by account: token_program. Error Code: AccountNotEnoughKeys. Error Number: 3005. Error Message: Not enough account keys given to the instruction.',
    //do 定义spl代币的mint入参时，用了`pub collateral_in_mint: AccountInfo<'info, Mint>,`，应该用`Box<Account<'info, Mint>>`

    //Q 调用函数为pad生成某个代币的ata地址时，报错：TokenOwnerOffCurveError
    //do 需要这样： `await getAssociatedTokenAddress(USDC_PK,collateralInAccountAuthority,true)`,关键是第三个参数，表示是生成pda的ata地址


    //Q 调用函数时，明明传了account入参，但是还是报错：An account required by the instruction is missing
    //do 我当时用的不是getAssociatedTokenAddress生成的ata地址，而是用了eypair.generate().publicKey获取的地址，这样是不符合ata地址规范的


    //Q 调用函数时报错
      'Program log: AnchorError caused by account: token_program. Error Code: InvalidProgramId. Error Number: 3008. Error Message: Program ID was not as expected.',
      'Program log: Left:',
      'Program log: 4QGA9ZC3UJYiVUydvm8BrfvzCaC2EcjyFHXj3vPVDJkr',
      'Program log: Right:',
      'Program log: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    //do 
      这个问题是在合约部署之后，又在入参的struct，「如：Context<DepositKamino>中的DepositKamino」增加了新的字段导致的。
      合约部署之后，如果需要新增入参字段，就必须加在struct内所有属性的最后面，不能在中间增加，这样会使内存空间跟原来分配的不一致

    //Q 合约部署时报错
      Deploying program "leverage_kamino"...
      Program path: /Users/qiang/Codes/Github/375Labs/Leverage-Kamino/target/deploy/leverage_kamino.so...
      ===========================================================================
      Recover the intermediate account's ephemeral keypair file with
      `solana-keygen recover` and the following 12-word seed phrase:
      ===========================================================================
      trust inspire cargo agent issue column such control sunny blame very carbon
      ===========================================================================
      To resume a deploy, pass the recovered keypair as the
      [BUFFER_SIGNER] to `solana program deploy` or `solana program write-buffer'.
      Or to recover the account's lamports, pass it as the
      [BUFFER_ACCOUNT_ADDRESS] argument to `solana program close`.
      ===========================================================================
      Error: Deploying program failed: RPC response error -32002: Transaction simulation failed: Error processing Instruction 0: account data too small for instruction [3 log messages]
    //do
    一般在合约部署之后，更新了代码，再升级时，报的错。因为首次部署后会给代码分配内存空间，第二次部署后，需要更多的空间，因此，执行命令
     solana program extend prog111111111111111111111111111111111111111 20000[-u d -k ./authority_keypair.json]
     其中：prog111111111111111111111111111111111111111是本次要部署的合约地址，authority_keypair.json是有权限升级合约的用户私钥


     //Q 跨合约CPI调用时，报如下错误：
      'Program KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD invoke [1]',
      'Program log: Instruction: InitUserMetadata',
      "BL728YZbuUtMrcu3FaFokuM1saFpTK93JSnVvZD8v6Jp's writable privilege escalated",
      'Program KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD consumed 12093 of 200000 compute units',
      'Program KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD failed: Cross-program invocation with unauthorized signer or writable account'
      //do
      01、我当时的背景是，A合约通过CPI调用B合约，而B合约是已部署到链上的合约，它有个account入参是个PDA地址，并且这个字段有init修饰。我在实现A合约通过CPI调用B合约时，为了方便编写，直接将这个account这样定义：`pub user_metadata: AccountInfo<'info>`,没有任何修饰。  后来给这个字段加上mut修饰之后，就可以了
      02、后来又碰到一次传递Signer<'info>的，同样报这个错，是因为被CPI调用的函数，定义Signer<'info>是有`#[account(mut)]`修饰的，而调用发起合约的对应account却没被定义为可修改

    //Q Error Message: Fallback functions are not supported.
    //do
    检查函数名是否不匹配

    //Q Error: 413 Request Entity Too Large: {"jsonrpc":"2.0","id":"ab325f98-8a6f-432a-b8f2-c270c2f258e4","error":{"code":-32615,"message":"getMultipleAccounts is limited to a 5 range, upgrade from discover plan at quicknode.com to increase the limit"}}
    //do 我当时是这句报错：`await KaminoMarket.load(connection, K_MARKET_ADDRESS, 200, kLendProgram.programId, true)`,后来替换了正确的K_MARKET_ADDRESS之后就没报错了

   //Q  associated item not found in `TokenAccount`
   //do 把Cargo.toml文件中idl-build = ["anchor-lang/idl-build"]替换为idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]

   //Q #[program]红色波浪线，并提示expected a return type
   //do 函数声明缺少了返回参 “-> Result<()>”

   //Q “error[E0659]: `solana_program` is ambiguous” 或 “perhaps two different versions of crate solana_program are being used?”
   //do
    solana_program版本冲突了，即使是我们通过cargo.toml指定了特定的版本，好像也不能解决一些间接依赖的版本冲突，查看当前的版本冲突cargo tree | grep solana-program
    可以在项目根目录Cargo.lock搜索你不想要的那个版本，然后替换成另外一个想要保留的版本，重新编译解决

   //Q 编译最后显示一行：Error: IDL doesn't exist,并且没有生成IDL文件
   //do anchor版本的问题，anchor --version查看版本，我从0.30.1切换到0.29.0之后就正常了： avm use 0.29.0

   //Q ts怎么从json文件导入为DIL对象：
   //do
      import { Idl } from '@coral-xyz/anchor';
      import rawIdl from '/Users/qiang/Codes/TmpCode/flash-trade/flash-trade-cpi-caller/perpetuals.json';
      export const idl: Idl = rawIdl as Idl;
    如果报如下错误则在`tsconfig.json`加入 "esModuleInterop": true, "resolveJsonModule": true,：
   Cannot find module '/Users/qiang/Codes/TmpCode/flash-trade/flash-trade-cpi-caller/perpetuals.json'. Consider using '--resolveJsonModule' to import module with '.json' extension.

  //Q 调用program的函数时，报错：AnchorError caused by account: token_program. Error Code: InvalidProgramId. Error Number: 3008. Error Message: Program ID was not as expected.',
  //do
  这种情况很可能是：1、字段值确实传错了。2、调用时传参的顺序跟program的IDL中acccount数组顺序不相同

  //Q 明明一个account已经被初始化，但在下一个函数调用时报错：Error Number: 3012. Error Message: The program expected this account to be already initialized.',
  //do 这个一般发生在本地测试环境，选择finalized就不会发生这个问题，而另外两个很容易发生上面的问题，但是选择finalized的话，要等待很久，效率很低
  关注点1: 需要修改数据的account，需要被标注为mut
  关注点2: 初始化connection时
  `export const provider = new AnchorProvider(connection, SIGNER_WALLET, { commitment: "processed", });//processed < confirmed < finalized`
  关注点3: 交易发送后等待确认时commitment要填finalized
  t = await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: txId,
    },
    commitment
  );
```