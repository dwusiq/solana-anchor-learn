use crate::{constants::PRESALE_ACCOUNT_SEED, state::PresaleInfo};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token},
};

use crate::constants::{AUTHORITY_SEED, LIQUIDITY_SEED};

pub fn initialize_presale(
    _ctx: Context<InitializePresale>,
    _id: Pubkey,
    _price: u64,
    _receive_sol_max: u64,
) -> Result<()> {
    let presale_info = &mut _ctx.accounts.presale_info;
    presale_info.id = _id;
    presale_info.owner = _ctx.accounts.owner.key();
    presale_info.price = _price;
    presale_info.receive_sol_max = _receive_sol_max;
    Ok(())
}

#[derive(Accounts)]
#[instruction(id: Pubkey)]
pub struct InitializePresale<'info> {
    /// CHECK: Read only authority
    #[account(
        seeds = [
            id.as_ref(),
            AUTHORITY_SEED,
        ],
        bump,
    )]
    pub token_mint_authority: AccountInfo<'info>,

    #[account(
        seeds = [
            id.as_ref(),
            PRESALE_ACCOUNT_SEED
        ],
        bump,
    )]
    pub presale_info_account: SystemAccount<'info>,

    #[account(
        init,
        payer = payer,
        seeds = [
            id.as_ref(),
            LIQUIDITY_SEED,
        ],
        bump,
        mint::decimals = 6,
        mint::authority = token_mint_authority,
    )]
    pub presale_mint: Box<Account<'info, Mint>>,

    // pub mint_a: Box<Account<'info, Mint>>,
    #[account(
        init,
        payer = payer,
        space=8+std::mem::size_of::<PresaleInfo>(),
        seeds = [
            id.as_ref()
        ],
        bump,
    )]
    pub presale_info: Account<'info, PresaleInfo>,

    /// The admin of the PresaleInfo
    /// CHECK: Read only, delegatable creation
    pub owner: AccountInfo<'info>,

    /// The account paying for all rents
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Solana ecosystem accounts
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}