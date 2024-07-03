use crate::state::DataInfo;
use anchor_lang::prelude::*;

pub fn initialize_data(_ctx: Context<InitializeData>, _data: u64) -> Result<()> {
    let data_info = &mut _ctx.accounts.data_info_account;
    data_info.data_value = _data;
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeData<'info> {
    #[account(mut)]
    payer: Signer<'info>,
    #[account(init,space = 8 + std::mem::size_of::<DataInfo>(),payer=payer)]
    data_info_account: Account<'info, DataInfo>,
    system_program: Program<'info, System>,
}
