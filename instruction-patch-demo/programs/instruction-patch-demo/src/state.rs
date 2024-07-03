use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct DataInfo {
    pub data_value: u64,
}



#[derive(Default)]
pub struct Discriminators {
    pub before_ix: [u8; 8],
    pub after_ix: [u8; 8]
}
