use anchor_lang::prelude::*;

declare_id!("CjoYx1gxc3jUSHVEVCuLHUzRiB6SFYbwquPo8x4Fkb8r");

#[program]
pub mod program_transfer_sol {
    use super::*;

    pub fn transfer_sol_with_program(_ctx: Context<TransferSolWithProgram>, amount: u64) -> Result<()> {
        **_ctx.accounts.payer.try_borrow_mut_lamports()? -= amount;
        **_ctx.accounts.recipient.try_borrow_mut_lamports()? += amount;
        // msg!("hello");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferSolWithProgram<'info> {
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut,owner=id())]
    payer: UncheckedAccount<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
}
