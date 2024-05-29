#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

mod state;
mod constants;
mod errors;
mod instructions;

// Set the correct key here
declare_id!("Gb1K1EFKCxEv5yrY8voPduHJwvvv1eXe2x3Cha2DZn5Y");

#[program]
pub mod presale_anchor_demo {
    pub use super::instructions::*;
    use super::*;

    pub fn create_pool(ctx: Context<CreatePool>, id: Pubkey) -> Result<()> {
        instructions::create_pool(ctx,id)
    }

    pub fn deposit_liquidity(
        ctx: Context<DepositLiquidity>,
        amount_a: u64,
        // amount_b: u64,
    ) -> Result<()> {
        instructions::deposit_liquidity(ctx, amount_a)
    }

}
