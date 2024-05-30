use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::Token};

use crate::{constants::PRESALE_ACCOUNT_SEED, state::PresaleInfo};
use anchor_lang::system_program;

pub fn withdraw_sol(_ctx: Context<WithdrawSol>, _amount: u64) -> Result<()> {
    let authority_bump = _ctx.bumps.presale_info_account;
    let authority_seeds = &[
        &_ctx.accounts.presale_info.id.to_bytes(), //key()
        PRESALE_ACCOUNT_SEED,
        &[authority_bump],
    ];
    let signer_seeds = &[&authority_seeds[..]];

    system_program::transfer(
        CpiContext::new_with_signer(
            _ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: _ctx.accounts.presale_info_account.to_account_info(),
                to: _ctx.accounts.user.to_account_info(),
            },
            signer_seeds,
        ),
        _amount,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawSol<'info> {
    #[account(
        mut,
        seeds = [
            presale_info.id.as_ref()
        ],
        bump,
    )]
    pub presale_info: Account<'info, PresaleInfo>,

    #[account(
        mut,
        seeds = [
            presale_info.id.as_ref(),
            PRESALE_ACCOUNT_SEED
        ],
        bump,
    )]
    pub presale_info_account: SystemAccount<'info>,

    /// The account paying for all rents
    #[account(
        constraint = user.key() == presale_info.owner
        )]
    pub user: Signer<'info>,

    /// Solana ecosystem accounts
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
