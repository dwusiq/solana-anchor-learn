use anchor_lang::prelude::*;

#[error_code]
pub enum MyError {
    #[msg("Program Mismatch")]
    ProgramMismatch,

    #[msg("Missing second ix")]
    MissingAfterInstruction,

    #[msg("Unknown Instruction")]
    UnknownInstruction,

    #[msg("Incorrect account")]
    IncorrectAccount,

    #[msg("Invalid after amount")]
    InvalidAfterAmount,
}

pub type ScopeResult<T = ()> = std::result::Result<T, MyError>;
