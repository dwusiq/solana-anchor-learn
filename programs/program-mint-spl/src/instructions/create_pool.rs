use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token},
};
use crate::state::Pool;


use crate::constants::{AUTHORITY_SEED, LIQUIDITY_SEED};

pub fn create_pool(_ctx: Context<CreatePool>, id: Pubkey) -> Result<()> {
    let pool = &mut _ctx.accounts.pool;
    pool.id = id;
    Ok(())
}

#[derive(Accounts)]
#[instruction(id: Pubkey)]
pub struct CreatePool<'info> {

    /// CHECK: Read only authority
    #[account(
        seeds = [
            id.as_ref(),
            AUTHORITY_SEED,
        ],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    #[account(
        init,
        payer = payer,
        seeds = [
            id.as_ref(),
            LIQUIDITY_SEED,
        ],
        bump,
        mint::decimals = 6,
        mint::authority = pool_authority,
    )]
    pub mint_liquidity: Box<Account<'info, Mint>>,

    // pub mint_a: Box<Account<'info, Mint>>,

    #[account(
        init,
        payer = payer,
        space=8+std::mem::size_of::<Pool>(),
        seeds = [
            id.as_ref()
        ],
        bump,
    )]
    pub pool: Account<'info, Pool>,

    /// The account paying for all rents
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Solana ecosystem accounts
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
