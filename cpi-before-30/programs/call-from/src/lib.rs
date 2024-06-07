use anchor_lang::prelude::*;


use call_to::program::CallTo;
use call_to::cpi::accounts::UpdateData;
use call_to::{self, DataAcount};

declare_id!("G1pmmxExNW5H3nBx4uNk45QZiFX6QcRKSA3KdUm2qgia");

#[program]
pub mod call_from {
    use super::*;

    pub fn set_remote(ctx: Context<SetRemote>,data:u64) -> Result<()> {
        call_to::cpi::switch_power(ctx.accounts.set_data_ctx(), data)
    }
}

#[derive(Accounts)]
pub struct SetRemote<'info>  {
    #[account(mut)]
    pub call_to_date_account: Account<'info, DataAcount>,
    pub call_to_program: Program<'info, CallTo>,
}



impl<'info> SetRemote<'info> {
    pub fn set_data_ctx(&self) -> CpiContext<'_, '_, '_, 'info, UpdateData<'info>> {
        let cpi_program = self.call_to_program.to_account_info();
        let cpi_accounts: UpdateData = UpdateData {
            date_account: self.call_to_date_account.to_account_info()
        };
        CpiContext::new(cpi_program, cpi_accounts)
    }
}