use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Pool {
    /// The primary key of the Pool
    pub id: Pubkey,
}
