use anchor_lang::prelude::*;

declare_id!("A45WqrL8wTCZ1DwhJpRbTWfnFsoGPirCwoRyEz75ZCBi");

// automatically generate module using program idl found in ./idls
declare_program!(call_to);
use call_to::accounts::PowerStatus;
use call_to::cpi::accounts::SwitchPower;
use call_to::cpi::switch_power;
use call_to::program::CallTo;

#[program]
pub mod call_from {
    use super::*;

    pub fn pull_lever(ctx: Context<PullLever>, name: String) -> Result<()> {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.lever_program.to_account_info(),
            SwitchPower {
                power: ctx.accounts.power.to_account_info(),
            },
        );
        switch_power(cpi_ctx, name)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct PullLever<'info> {
    #[account(mut)]
    pub power: Account<'info, PowerStatus>,
    pub lever_program: Program<'info, CallTo>,
}
