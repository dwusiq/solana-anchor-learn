use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, MintTo, Token, TokenAccount},
};

declare_id!("3GpnCihJzMELWMYNsbLDsPcSnbyqkbua3Wq7k1qSi7FH");

#[program]
pub mod program_mint_spl {
    use super::*;

    pub fn initialize(_ctx: Context<InitializeMint>) -> Result<()> {
        Ok(())
    }

        pub fn mint_token_to(_ctx: Context<MintTokenTo>, _amount: u64) -> Result<()> {
            // Mint the liquidity to user
            let authority_bump = _ctx.bumps.mint_authority;
            let authority_seeds = &[
                &_ctx.accounts.payer.key().to_bytes(),
                AUTHORITY_SEED,
                &[authority_bump],
            ];
            let signer_seeds = &[&authority_seeds[..]];
            token::mint_to(
                _ctx.accounts
                    .mint_tokens_context()
                    .with_signer(signer_seeds),
                _amount,
            )?;
            Ok(())
        }
    }
    #[derive(Accounts)]
    pub struct MintTokenTo<'info> {
        /// CHECK: This is not dangerous because we don't read or write from this account
        pub recipient: UncheckedAccount<'info>,
        #[account(
            init_if_needed,
            payer = payer,
            associated_token::mint = mint_local_account,
            associated_token::authority = recipient,
        )]
        pub recipient_account_token: Box<Account<'info, TokenAccount>>,
        /// CHECK: Read only authority
        #[account(
        seeds = [
            payer.key().as_ref(),
            AUTHORITY_SEED,
        ],
        bump,
    )]
        pub mint_authority: AccountInfo<'info>,

        #[account(
        seeds = [
            payer.key().as_ref(),
            MINT_LOCAL_SEED,
        ],
        bump,
        mint::decimals = 6,
        mint::authority = mint_authority,
    )]
        pub mint_local_account: Box<Account<'info, Mint>>,

        /// The account paying for all rents
        #[account(mut)]
        pub payer: Signer<'info>,

        /// Solana ecosystem accounts
        pub token_program: Program<'info, Token>,
        pub associated_token_program: Program<'info, AssociatedToken>,
        pub system_program: Program<'info, System>,
    }

    impl<'info> MintTokenTo<'info> {
        fn mint_tokens_context(&self) -> CpiContext<'_, '_, '_, 'info, MintTo<'info>> {
            CpiContext::new(
                self.token_program.to_account_info(),
                MintTo {
                    mint: self.mint_local_account.to_account_info(),
                    to: self.recipient.to_account_info(),
                    authority: self.mint_authority.to_account_info(),
                },
            )
        }
}

#[derive(Accounts)]
pub struct InitializeMint<'info> {
    /// CHECK: Read only authority
    #[account(
        init,
        payer = payer,
        seeds = [
            payer.key().as_ref(),
            AUTHORITY_SEED,
        ],
        bump,
        space = 8 + std::mem::size_of::<AccountInfo>()
    )]
    pub mint_authority: AccountInfo<'info>,

    #[account(
        init,
        payer = payer,
        seeds = [
            payer.key().as_ref(),
            MINT_LOCAL_SEED,
        ],
        bump,
        mint::decimals = 6,
        mint::authority = mint_authority,
    )]
    pub mint_local_account: Box<Account<'info, Mint>>,

    /// The account paying for all rents
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Solana ecosystem accounts
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[constant]
pub const ADMIN: Pubkey = solana_program::pubkey!("2qHFZzJhvJyzp1xqNAvGgNi8cjmXuBgvHPUkXxzwL5yp");
#[constant]
pub const MINT_LOCAL_SEED: &[u8] = b"mint";
#[constant]
pub const AUTHORITY_SEED: &[u8] = b"authority";
