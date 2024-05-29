#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

mod state;
mod constants;
mod errors;
mod instructions;

// Set the correct key here
declare_id!("9naL5kvggxMms5morF1X9dzwayuB8FMBXP9eEnawCtMP");

#[program]
pub mod program_mint_spl {
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
