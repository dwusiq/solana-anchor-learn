// use anchor_lang::prelude::*;

// use crate::{constants::*, state::PresaleTerm};

// pub fn create_leveragefi(_ctx: Context<CreatePresaleTerm>, presle_price: u64) -> Result<()> {
//     let term = &mut _ctx.accounts.presaleTerm;
//     term.pay_token_mint = _ctx.accounts.pay_token_mint;
//     term.selle_token_mint = _ctx.accounts.selle_token_mint;
//     term.admin = _ctx.accounts.admin;
//     term.paid_token_total = 0;
//     term.paused = false;
//     term.rate_denominator = 10000;
//     Ok(())
// }

// #[derive(Accounts)]
// pub struct CreatePresaleTerm<'info> {
//     #[account(
//         init,
//         payer = payer,
//         space = 8 + std::mem::size_of::<PresaleTerm>(),
//         seeds = [admin.as_ref(),pay_token_mint.key().as_ref(), selle_token_mint.key().as_ref()],
//         bump,
//         bump
//     )]
//     pub presaleTerm: Account<'info, PresaleTerm>,

//     /// User pay this token to purchase other token
//     pub pay_token_mint: Box<Account<'info, Mint>>,

//     /// The mint for the selling token
//     pub selle_token_mint: Box<Account<'info, Mint>>,

//     /// The admin of the PresaleTerm
//     pub admin: AccountInfo<'info>,
//     /// The account paying for all rents
//     #[account(
//         mut,
//         // constraint = payer.key() == ADMIN
//     )]
//     pub payer: Signer<'info>,
//     /// Solana ecosystem accounts
//     pub system_program: Program<'info, System>,
// }
