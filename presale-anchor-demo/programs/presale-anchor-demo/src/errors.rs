
use anchor_lang::prelude::*;

#[error_code]
pub enum PresaleError {
    #[msg("Sold Out")]
    SoldOut,

}