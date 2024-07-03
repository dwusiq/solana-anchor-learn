use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar;
use anchor_lang::solana_program::sysvar::instructions::{
    load_current_index_checked, load_instruction_at_checked,
};

use crate::state::{DataInfo, Discriminators};
use crate::MyError;

//第一个被调用的函数
pub fn change_data_first(
    _ctx: Context<ChangeDataFirst>,
    discriminators: Discriminators,
) -> Result<()> {
    let ixs = _ctx.accounts.instructions.to_account_info();
    //校验instructions列表中当前的programId为
    let current_index = load_current_index_checked(&ixs)? as usize;
    let current_ix = load_instruction_at_checked(current_index, &ixs)?;
    if current_ix.program_id != *_ctx.program_id {
        return err!(MyError::ProgramMismatch);
    }

    let current_amount = _ctx.accounts.data_info_account.data_value;
    let expect_next_amount = current_amount + 1; //期望下个函数传进来的值

    /*********************** Check instructions ***********************/

    // // check if next instruction is jupiter swap, for jlp
    let index = current_index + 1;
    // _ctx.accounts.check_swap_ix(index, &ixs)?;

    // check if next instruction is after_repay
    // index += 1;
    _ctx.accounts
        .check_after_ix(index, &ixs, discriminators.after_ix, expect_next_amount)?;

    Ok(())
}


//第二个被调用的函数
pub fn change_data_second(_ctx: Context<ChangeDataSecond>, _data: u64) -> Result<()> {
    let data_info_account = &mut _ctx.accounts.data_info_account;
    data_info_account.data_value = _data;
    msg!("data_info_account.data_value:{}",data_info_account.data_value);
    msg!("_ctx.accounts.data_info_account:{}",_ctx.accounts.data_info_account.data_value);

    Ok(())
}

#[derive(AnchorDeserialize)]
pub struct AfterIxArg {
    pub amount: u64,
}

#[derive(Accounts)]
pub struct ChangeDataFirst<'info> {
    pub request_user: Signer<'info>,
    /// CHECK: check instructions account
    #[account(address = sysvar::instructions::ID)]
    pub instructions: UncheckedAccount<'info>,
    #[account(mut)]
    data_info_account: Account<'info, DataInfo>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ChangeDataSecond<'info> {
    pub request_user: Signer<'info>,
    #[account(mut)]
    data_info_account: Account<'info, DataInfo>,
    system_program: Program<'info, System>,
}

impl<'info> ChangeDataFirst<'info> {
    fn check_after_ix(
        &self,
        index: usize,
        ixs: &AccountInfo<'_>,
        discriminator_after: [u8; 8],
        expected_amount: u64,
    ) -> Result<()> {
        if let Ok(ix) = load_instruction_at_checked(index, ixs) {
            //校验：要求instructionTx的programId等于当前programId
            if ix.program_id != crate::id() {
                return err!(MyError::MissingAfterInstruction);
            }

            //要求函数名等于指定的函数名
            let ix_discriminator: [u8; 8] = ix.data[0..8]
                .try_into()
                .map_err(|_| MyError::UnknownInstruction)?;
            if ix_discriminator != discriminator_after {
                return err!(MyError::MissingAfterInstruction);
            }

            //要求前后两次的签名用户是同一个
            require_keys_eq!(
                ix.accounts[0].pubkey,
                self.request_user.key(),
                MyError::IncorrectAccount
            );

            //前8位是函数名，因此这里从第8位开始往后读取入参
            let ix_data: &[u8] = &ix.data[8..];
            //将参数反序列化为一个对象
            let args = AfterIxArg::try_from_slice(ix_data).unwrap();
            //判断传进来的amount跟期望的一样
            if args.amount != expected_amount {
                return err!(MyError::InvalidAfterAmount);
            }
        } else {
            // no more instructions, so we're missing after_repay
            return err!(MyError::MissingAfterInstruction);
        }

        Ok(())
    }
}
