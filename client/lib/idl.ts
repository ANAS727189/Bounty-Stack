import { Idl, IdlAccounts, IdlTypes } from '@coral-xyz/anchor';


export const idl = {
  "address": "BAZdzAroYAZYNrt8PxpxbvrA87wdMighpPSzS4NcDaYY",
  "metadata": {
    "name": "bounty_escrow",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "award_bounty",
      "discriminator": [ 24, 150, 101, 41, 109, 41, 64, 114 ],
      "accounts": [
        { "name": "bounty_account", "writable": true, "pda": { "seeds": [ { "kind": "const", "value": [ 98, 111, 117, 110, 116, 121 ] }, { "kind": "arg", "path": "question_id" } ] } },
        { "name": "asker", "writable": true, "signer": true, "relations": [ "bounty_account" ] },
        { "name": "winner", "docs": [ "It's 'mut' because it's receiving SOL." ], "writable": true },
        { "name": "system_program", "address": "11111111111111111111111111111111" }
      ],
      "args": [ { "name": "question_id", "type": "string" } ]
    },
    {
      "name": "cancel_bounty",
      "discriminator": [ 79, 65, 107, 143, 128, 165, 135, 46 ],
      "accounts": [
        { "name": "bounty_account", "writable": true, "pda": { "seeds": [ { "kind": "const", "value": [ 98, 111, 117, 110, 116, 121 ] }, { "kind": "arg", "path": "question_id" } ] } },
        { "name": "asker", "writable": true, "signer": true, "relations": [ "bounty_account" ] },
        { "name": "system_program", "address": "11111111111111111111111111111111" }
      ],
      "args": [ { "name": "question_id", "type": "string" } ]
    },
    {
      "name": "post_bounty",
      "docs": [ "INSTRUCTION 1: POST A NEW BOUNTY", "Creates a new bounty escrow account (a PDA) and funds it with SOL." ],
      "discriminator": [ 40, 217, 222, 103, 151, 83, 147, 130 ],
      "accounts": [
        { "name": "bounty_account", "writable": true, "pda": { "seeds": [ { "kind": "const", "value": [ 98, 111, 117, 110, 116, 121 ] }, { "kind": "arg", "path": "question_id" } ] } },
        { "name": "asker", "writable": true, "signer": true },
        { "name": "system_program", "address": "11111111111111111111111111111111" }
      ],
      "args": [ { "name": "question_id", "type": "string" }, { "name": "bounty_amount", "type": "u64" } ]
    }
  ],
  "accounts": [
    {
      "name": "BountyAccount",
      "discriminator": [ 79, 173, 237, 26, 118, 105, 127, 194 ]
    }
  ],
  "errors": [
    { "code": 6000, "name": "BountyNotOpen", "msg": "This bounty has already been awarded or cancelled." },
    { "code": 6001, "name": "Unauthorized", "msg": "You are not the original asker and cannot perform this action." }
  ],
  "types": [
    {
      "name": "BountyAccount",
      "docs": [ "This is the main data account that holds the escrowed SOL" ],
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "asker", "docs": [ "The wallet of the person who posted the question." ], "type": "pubkey" },
          { "name": "bounty_amount", "docs": [ "The amount of SOL (in lamports) to be paid out." ], "type": "u64" },
          { "name": "question_id", "docs": [ "The unique ID from the Web2 backend (e.g., \"q_uuid123\")." ], "type": "string" },
          { "name": "state", "docs": [ "The state of the bounty (Open, Awarded, Cancelled)." ], "type": { "defined": { "name": "BountyState" } } },
          { "name": "bump", "docs": [ "The bump seed for the PDA." ], "type": "u8" }
        ]
      }
    },
    {
      "name": "BountyState",
      "docs": [ "The state of the bounty" ],
      "type": { "kind": "enum", "variants": [ { "name": "Open" }, { "name": "Awarded" }, { "name": "Cancelled" } ] }
    }
  ]
} as const;



export type BountyEscrow = typeof idl & Idl;
export type BountyAccount = IdlAccounts<BountyEscrow>['BountyAccount'];

export type BountyState = IdlTypes<BountyEscrow>['BountyState'];