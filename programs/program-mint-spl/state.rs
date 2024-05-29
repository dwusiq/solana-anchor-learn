#[account]
#[derive(Default)]
pub struct PresaleTerm {
    /// Account that has admin authority over the presale term
    pub admin: Pubkey,

    /// Disable all protocol operations
    pub paused: bool,

    /// The selling token.  user send pay_token_mint to contract,and contract payout selle_token_mint to user
    pub selle_token_mint: Pubkey,

    /// Users pay this token to purchase tokens sold by the contract
    pub pay_token_mint: Pubkey,

    /// PThe total number of pay_token_mint received by the contract
    pub paid_token_total: u64,

    /// How many pay_tokens do you need to pay to buy a selle_token_mint
    pub selling_token_price: u64,

    /// denominator of all rate. eg: sold_rate=1000,  rate_denominator=10000.  soldRate=0.1
    pub rate_denominator: u16,
}
