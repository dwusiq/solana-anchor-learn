#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

mod state;
mod constants;
mod errors;
mod instructions;

// Set the correct key here
declare_id!("R45S53wpaL1uDeCS4P6Zqft9MzkKZXB2hBuZpV7A8T9");

#[program]
pub mod presale_anchor_demo {
    pub use super::instructions::*;
    use super::*;

    pub fn initialize_presale(ctx: Context<InitializePresale>, id: Pubkey) -> Result<()> {
        instructions::initialize_presale(ctx,id)
    }

    pub fn pay_to_mint(ctx: Context<PayToMint>,amount_a: u64) -> Result<()> {
        instructions::pay_to_mint(ctx, amount_a)
    }

}
