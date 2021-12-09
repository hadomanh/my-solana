use anchor_lang::prelude::*;

declare_id!("FK9Ka941SaYwFExKpMJUhk1pcmLaTegqucN99udQeZTw");

#[program]
mod my_solana {
    use super::*;

    pub fn create(ctx: Context<Create>, payload: CreatePayload) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.name = payload.name;
        base_account.count = payload.count;
        Ok(())
    }

    pub fn increase(ctx: Context<Increment>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.count += 1;
        Ok(())
    }

    pub fn increase_amount(ctx: Context<Increment>, data: u64) ->ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.count += data;
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreatePayload {
    pub name: String,
    pub count: u64,
}

// Transaction instructions
#[derive(Accounts, AnchorSerialize, AnchorDeserialize)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 16 + 16)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// Transaction instructions
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

// An account that goes inside a transaction instruction
#[account]
pub struct BaseAccount {
    pub name: String,
    pub count: u64,
}
