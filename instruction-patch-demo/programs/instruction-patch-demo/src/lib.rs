#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use anchor_lang::Discriminator;

mod instructions;
mod state;

// Set the correct key here
declare_id!("5zB1vCeQxFXkbFiucPB4XqDWTuDNo5FFFYLH54kUh3pR");

#[program]
pub mod instruction_patch_demo {
    use state::Discriminators;

    pub use super::instructions::*;
    use super::*;

    pub fn initialize_data(_ctx: Context<InitializeData>, _data: u64) -> Result<()> {
        instructions::initialize_data(_ctx, _data)
    }

    //修改数据时第一个被调用的instruction(要求第一和第二个一起被调用)
    pub fn change_data_first(ctx: Context<ChangeDataFirst>) -> Result<()> {
        let discriminators = Discriminators {
            before_ix: self::instruction::ChangeDataFirst::discriminator(),
            after_ix: self::instruction::ChangeDataSecond::discriminator(),
        };

        instructions::change_data_first(ctx, discriminators)
    }

    //修改数据时第二个被调用的instruction(要求第一和第二个一起被调用)
    pub fn change_data_second(ctx: Context<ChangeDataSecond>, amount: u64) -> Result<()> {
        instructions::change_data_second(ctx, amount)
    }
}
