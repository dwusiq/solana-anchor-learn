use anchor_lang::prelude::*;

declare_id!("EqxkjVkcBkfBtA7dbs7rdegWNTR63zJLU2UsENU12hz9");

#[program]
pub mod spl_token_2022 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
