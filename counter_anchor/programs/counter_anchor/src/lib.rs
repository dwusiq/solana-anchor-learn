use anchor_lang::prelude::*;

declare_id!("9Mye4h5NaCYyN9EDiXWeNx3HznbwjpvxDXyLNga7hXbA");

#[program]
pub mod counter_anchor {
    use super::*;

    pub fn initialize(_ctx: Context<InitializeCounter>, _init_data: i64) -> Result<()> {
        msg!("_init_data:{}",_init_data);
        _ctx.accounts.counter.data = _init_data;//此时InitializeCounter结构体的数据已存在于
        Ok(())
    }

    pub fn increase_counter(_ctx: Context<IncreaseCounter>) -> Result<()> {
        _ctx.accounts.counter.data= _ctx.accounts.counter.data.checked_add(1).unwrap();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCounter<'info> {
    #[account(mut)]
    payer: Signer<'info>,
    #[account(init,space=8+CounterData::INIT_SPACE,payer=payer)]
    counter: Account<'info, CounterData>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IncreaseCounter<'info> {
    #[account(mut)]
    counter: Account<'info, CounterData>,
}

//存放数据的account
#[account]
#[derive(InitSpace)]
pub struct CounterData {
    data: i64,
}
