use anchor_lang::prelude::*;

declare_id!("H29DAsjGaKSzm5pDmMTsp4FodtazxUxT8SoszZpiMvUw");

#[program]
pub mod transfer_sol_with_program {
    use super::*;

    pub fn transfer_sol(_ctx: Context<TransferSol>, amount: u64) -> Result<()> {
        **_ctx.accounts.payer.try_borrow_mut_lamports()? -= amount;
        **_ctx.accounts.recipient.try_borrow_mut_lamports()? += amount;
        // msg!("hello");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferSol<'info> {
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut,owner=id())]
    payer: UncheckedAccount<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
}


