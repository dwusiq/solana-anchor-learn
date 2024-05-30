#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

mod state;
mod constants;
mod errors;
mod instructions;

// Set the correct key here
declare_id!("4tQznmypRWh9ro1EQXPz4r8FzJ3U6cW7tp4yyRa2YdbT");

#[program]
pub mod mint_spl_with_program {
    pub use super::instructions::*;
    use super::*;

    pub fn initialize(ctx: Context<CreatePool>, id: Pubkey) -> Result<()> {
        instructions::create_pool(ctx,id)
    }

    pub fn mint_spl_too(
        ctx: Context<MintSplTo>,
        amount_a: u64,
        // amount_b: u64,
    ) -> Result<()> {
        instructions::mint_spl_to(ctx, amount_a)
    }

}
