use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, MintTo, Token, TokenAccount},
};

use crate::{constants::{AUTHORITY_SEED, LIQUIDITY_SEED, PRESALE_ACCOUNT_SEED}, state::PresaleInfo};
use anchor_lang::system_program;


pub fn pay_to_mint(
    _ctx: Context<PayToMint>,
    _amount: u64
) -> Result<()> {

    system_program::transfer(
        CpiContext::new(
            _ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: _ctx.accounts.payer.to_account_info(),
                to: _ctx.accounts.presale_info_account.to_account_info(),
            },
        ),
        _amount,
    )?;

    // Mint the liquidity to user
    let authority_bump = _ctx.bumps.token_mint_authority;
    let authority_seeds = &[
        &_ctx.accounts.presale_info.id.to_bytes(),//key()
        AUTHORITY_SEED,
        &[authority_bump],
    ];
    let signer_seeds = &[&authority_seeds[..]];
    token::mint_to(
        CpiContext::new_with_signer(
            _ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: _ctx.accounts.presale_mint.to_account_info(),
                to: _ctx.accounts.buyer_token_account.to_account_info(),
                authority: _ctx.accounts.token_mint_authority.to_account_info(),
            },
            signer_seeds,
        ),
        _amount,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct PayToMint<'info> {
    /// CHECK: Read only authority
    #[account(
        seeds = [
            presale_info.id.as_ref(),
            AUTHORITY_SEED,
        ],
        bump,
    )]
    pub token_mint_authority: AccountInfo<'info>,

    /// The account paying for all rents
    pub buyer: Signer<'info>,

    #[account(
        mut,
        seeds = [
            presale_info.id.as_ref(),
            LIQUIDITY_SEED,
        ],
        bump,
    )]
    pub presale_mint: Box<Account<'info, Mint>>,

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

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = presale_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Box<Account<'info, TokenAccount>>,

    /// The account paying for all rents
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Solana ecosystem accounts
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
