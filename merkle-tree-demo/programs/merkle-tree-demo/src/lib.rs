use anchor_lang::prelude::*;

pub mod merkle_proof;

declare_id!("6UE9mhnmKzQdKUATJF7YYfpb49hh7Q5DJMKeD3XLy6Bi");

#[program]
pub mod merkle_tree_demo {
    use super::*;

    pub fn init_merkle(ctx: Context<InitzeMerkle>, root: [u8; 32]) -> Result<()> {
        let merkle_account = &mut ctx.accounts.merkle_account;
        merkle_account.merkle_root = root;
        Ok(())
    }

    pub fn verify_merkle(
        ctx: Context<VerifyMerkle>,
        withdraw_amount: u64,
        proof: Vec<[u8; 32]>,
    ) -> Result<()> {
        // Verify the merkle proof.
        let merkle_account = &ctx.accounts.merkle_account;
        let payer = &ctx.accounts.payer;
        let node = anchor_lang::solana_program::keccak::hashv(&[
            &payer.key().to_bytes(),
            &withdraw_amount.to_le_bytes(),
        ]);

        msg!("node: {:?}", node.0);
        let rsp =   merkle_proof::verify(proof.clone(), merkle_account.merkle_root, node.0);
        msg!("rsp: {:?}", rsp);
        require!(
            merkle_proof::verify(proof, merkle_account.merkle_root, node.0),
            ErrorCode::InvalidProof
        );

        msg!("Verified!");
        Ok(())
    }

    #[derive(Accounts)]
    pub struct VerifyMerkle<'info> {
        /// Payer of the claim.
        #[account(mut)]
        pub payer: Signer<'info>,

        #[account( seeds = [ b"MerkleAccount".as_ref() ],bump )]
        pub merkle_account: Account<'info, MerkleAccount>,

        /// The [System] program.
        pub system_program: Program<'info, System>,
    }
}

#[derive(Accounts)]
pub struct InitzeMerkle<'info> {
    /// Payer of the claim.
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
    init_if_needed,
    seeds = [ b"MerkleAccount".as_ref() ],
    bump,
    space = 8 + std::mem::size_of::<MerkleAccount>(),
    payer = payer
    )]
    pub merkle_account: Account<'info, MerkleAccount>,

    /// The [System] program.
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct MerkleAccount {
    pub merkle_root: [u8; 32],
}



/// Error codes.
#[error_code]
pub enum ErrorCode {
    #[msg("Invalid Merkle proof.")]
    InvalidProof
}
