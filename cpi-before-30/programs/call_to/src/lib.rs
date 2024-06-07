use anchor_lang::prelude::*;

declare_id!("2fMXp5XgFHrrRqMgrPjxzh98LMuc79pXRC82KUdKgYKe");


#[program]
pub mod call_to {
    use super::*;

    pub fn initialize(_ctx: Context<InitializeLever>) -> Result<()> {
        Ok(())
    }

    pub fn switch_power(ctx: Context<UpdateData>, value: u64) -> Result<()> {
        let date_account = &mut ctx.accounts.date_account;
        date_account.current_value = value;

        msg!("date_account.current_value{} ", date_account.current_value);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeLever<'info> {
    #[account(init, payer = user, space = 8 + 8, seeds = [b"worker", user.key().as_ref()], bump)]
    pub data_account: Account<'info, DataAcount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateData<'info> {
    #[account(mut)]
    pub date_account: Account<'info, DataAcount>,
}

#[account]
pub struct DataAcount {
    pub current_value: u64,
}

