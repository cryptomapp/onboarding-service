/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category ExecuteTransaction
 * @category generated
 */
export type ExecuteTransactionInstructionArgs = {
  amount: beet.bignum
}
/**
 * @category Instructions
 * @category ExecuteTransaction
 * @category generated
 */
export const executeTransactionStruct = new beet.BeetArgsStruct<
  ExecuteTransactionInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['amount', beet.u64],
  ],
  'ExecuteTransactionInstructionArgs'
)
/**
 * Accounts required by the _executeTransaction_ instruction
 *
 * @property [_writable_, **signer**] sender
 * @property [_writable_] senderUsdcAccount
 * @property [_writable_] receiverUsdcAccount
 * @property [_writable_] daoUsdcAccount
 * @property [_writable_] state
 * @property [_writable_] senderUserAccount
 * @property [_writable_] receiverUserAccount
 * @category Instructions
 * @category ExecuteTransaction
 * @category generated
 */
export type ExecuteTransactionInstructionAccounts = {
  sender: web3.PublicKey
  senderUsdcAccount: web3.PublicKey
  receiverUsdcAccount: web3.PublicKey
  daoUsdcAccount: web3.PublicKey
  state: web3.PublicKey
  tokenProgram?: web3.PublicKey
  senderUserAccount: web3.PublicKey
  receiverUserAccount: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const executeTransactionInstructionDiscriminator = [
  231, 173, 49, 91, 235, 24, 68, 19,
]

/**
 * Creates a _ExecuteTransaction_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ExecuteTransaction
 * @category generated
 */
export function createExecuteTransactionInstruction(
  accounts: ExecuteTransactionInstructionAccounts,
  args: ExecuteTransactionInstructionArgs,
  programId = new web3.PublicKey('6gVqqXEwoTX7AZTBYQDEaXntMiBPnTAyBbuMCeqk5avi')
) {
  const [data] = executeTransactionStruct.serialize({
    instructionDiscriminator: executeTransactionInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.sender,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.senderUsdcAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.receiverUsdcAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.daoUsdcAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.state,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.senderUserAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.receiverUserAccount,
      isWritable: true,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
