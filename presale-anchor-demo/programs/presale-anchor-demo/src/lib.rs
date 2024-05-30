#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

mod constants;
mod errors;
mod instructions;
mod state;

// Set the correct key here
declare_id!("R45S53wpaL1uDeCS4P6Zqft9MzkKZXB2hBuZpV7A8T9");

#[program]
pub mod presale_anchor_demo {
    pub use super::instructions::*;
    use super::*;

    pub fn initialize_presale(
        _ctx: Context<InitializePresale>,
        _id: Pubkey,
        _price: u64,
        _receive_sol_max: u64,
    ) -> Result<()> {
        instructions::initialize_presale(_ctx, _id, _price, _receive_sol_max)
    }

    pub fn pay_to_mint(ctx: Context<PayToMint>, _amount: u64) -> Result<()> {
        instructions::pay_to_mint(ctx, _amount)
    }

    pub fn withdraw_sol(_ctx: Context<WithdrawSol>, _amount: u64) -> Result<()> {
        instructions::withdraw_sol(_ctx, _amount)

    }

}
