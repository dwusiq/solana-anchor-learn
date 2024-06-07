# 跨合约调用
> anchor30版本之前的可以用这个方案，因为30之后，又出了个更简洁的调用方式(也写了案例)，但是编译文件多了一些字段，未验证是否兼容旧的合约


### 基本测试案例
> 测试案例可以直接跑（但是`beforeEach`的内容执行一遍就行了）

### 更深入调用测试
> 如果需要更进一步测试时，可以先部署`call_to`,然后拿他的地址到另一个工程，给`call_from`调用

* 在发起方中`call_to`代码案例(注意这时`AccountInfo`可以不包含详细对象)
    ```
    use anchor_lang::prelude::*;

    declare_id!("2fMXp5XgFHrrRqMgrPjxzh98LMuc79pXRC82KUdKgYKe");


    #[program]
    pub mod call_to {
        use super::*;
        pub fn switch_power(ctx: Context<UpdateData>, value: u64) -> Result<()> {
        //no code
        Ok(())
        }
    }



    #[derive(Accounts)]
    pub struct UpdateData<'info> {
        #[account(mut)]
        pub date_account: AccountInfo<'info>,
    }
    ```

* `call_from`代码基本没变

* 测试`ts`文件
  ```
  import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import { CallFrom } from "../target/types/call_from";
import { CallTo } from "../target/types/call_to";


describe("call-from", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);


  const callFromprogram = anchor.workspace.CallFrom as Program<CallFrom>;


  const callToProgramId = new PublicKey("2fMXp5XgFHrrRqMgrPjxzh98LMuc79pXRC82KUdKgYKe");
  const dataPDA = new PublicKey("EKReozoVU3n7t9xCaM3eUYZnko5ntb55Chs6yNghCEpD");

  it("Calll!", async () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
   await callFromprogram.methods.setRemote(new anchor.BN(randomNumber)).accounts({
     callToPowerAccount: dataPDA,
     callToProgram: callToProgramId
   }).rpc();


    });

    });

  ```