use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct PresaleInfo {
    /// The primary key of the PresaleInfo
    pub id: Pubkey,
    // How much sol needs to be paid per unit of sell_token
    pub price: u64,
    // How many sols can be received at most?
    pub receive_sol_max: u64,
    // Total number of sols received
    pub received_sol: u64,
    // Owner can withdraw sol
    pub owner: Pubkey,
}
