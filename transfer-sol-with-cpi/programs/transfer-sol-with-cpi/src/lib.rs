use anchor_lang::{accounts::account::Account, prelude::*};

declare_id!("5NtFURkXqn75kiZkKrFh6aK4nH4hT3pYBUyMvU4KY5hh");

#[program]
pub mod transfer_sol_with_cpi {
    use anchor_lang::system_program;

    use super::*;

    pub fn transfer_sol(_ctx: Context<TransferSol>, amount: u64) -> Result<()> {
        system_program::transfer(
            CpiContext::new(
                _ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: _ctx.accounts.payer.to_account_info(),
                    to: _ctx.accounts.recipient.to_account_info(),
                },
            ),
            amount,
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferSol<'info> {
    #[account(mut)]
    payer: Signer<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
