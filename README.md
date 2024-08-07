# anchor写的一些Solana案例

### 心得
solana程序不能只看rust代码怎么写，得结合ts的调用方法，才能更好的理解其中的语法


* build: `anchor build`
* test: `anchor test --skip-local-validator`
* 测试指定文件：`anchor test -t tests/counter-anchor.ts --verbose`
* 如果入参账户是个struct，则用Box<>封装，这样数据会存放在堆，而不是栈，因为栈是有限的。如`Box<Account<'info, Mint>>` 替代`Account<'info,Mint>,`;


### 术语

* ATA(associated token account): 关联代币账户
* SPL(Solana Program Library): 一组针对Sealevel并行运行时的链上程序的集合，其中包括了Token Program，简称为SPL Token
* CPI(Cross-Program Invocation)：指合约见的调用，即跨合约调用
* PDA(Program Derived Address): 是一种特殊的公钥地址（他没有私钥）,solana 设计的时候，将他的签名权限交给了生成他的程序
* 




### `Anchor.toml`文件介绍
```
[toolchain]

[features]
seeds = false
skip-lint = false


# 配置一些program的id,跟各个promgram/src/lib.rs的declare_id值一至
[programs.localnet]
counter_anchor = "6mFGG3gPrtS7ZoGBdpBn8UgqXhhdr3LY1vgsjR9DatSJ"
cpi_transfer_sol = "DB4iqb4KQ2CGquvV5UgJraVqvSGehUYiyiZKi258hcay"
program_transfer_sol = "CjoYx1gxc3jUSHVEVCuLHUzRiB6SFYbwquPo8x4Fkb8r"
spl_token = "anJhGr9sX629it2oyrsqQmUMGF2iwyGq5PA1mMEosTe"


[registry]
url = "https://api.apr.dev"


[provider]
cluster = "http://127.0.0.1:8899"  # 指定了 Solana 集群的 URL。在这里是本地运行的集群
wallet = "/Users/qiang/.config/solana/id.json" # 指定了钱包地址


[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"


# 指定了用于测试的验证器 URL，这里是一个 QuikNode 提供的 Solana 主网验证器 
[test.validator]
url = "https://dark-intensive-dream.solana-mainnet.quiknode.pro/bcea36be83c7f3b3e1afbb625fa47048926bf67f/"
```