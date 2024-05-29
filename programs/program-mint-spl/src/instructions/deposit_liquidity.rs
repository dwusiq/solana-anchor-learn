use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, MintTo, Token, TokenAccount},
};

use crate::{constants::{AUTHORITY_SEED, LIQUIDITY_SEED}, state::Pool};

pub fn deposit_liquidity(
    ctx: Context<DepositLiquidity>,
    _amount: u64
) -> Result<()> {
    // Mint the liquidity to user
    let authority_bump = ctx.bumps.pool_authority;
    let authority_seeds = &[
        &ctx.accounts.pool.id.to_bytes(),//key()
        AUTHORITY_SEED,
        &[authority_bump],
    ];
    let signer_seeds = &[&authority_seeds[..]];
    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint_liquidity.to_account_info(),
                to: ctx.accounts.depositor_account_liquidity.to_account_info(),
                authority: ctx.accounts.pool_authority.to_account_info(),
            },
            signer_seeds,
        ),
        _amount,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct DepositLiquidity<'info> {
    /// CHECK: Read only authority
    #[account(
        seeds = [
            pool.id.as_ref(),
            AUTHORITY_SEED,
        ],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    /// The account paying for all rents
    pub depositor: Signer<'info>,

    #[account(
        mut,
        seeds = [
            pool.id.as_ref(),
            LIQUIDITY_SEED,
        ],
        bump,
    )]
    pub mint_liquidity: Box<Account<'info, Mint>>,

    #[account(
        seeds = [
            pool.id.as_ref()
        ],
        bump,
    )]
    pub pool: Account<'info, Pool>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint_liquidity,
        associated_token::authority = depositor,
    )]
    pub depositor_account_liquidity: Box<Account<'info, TokenAccount>>,

    /// The account paying for all rents
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Solana ecosystem accounts
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
