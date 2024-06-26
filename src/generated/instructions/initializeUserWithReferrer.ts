/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category InitializeUserWithReferrer
 * @category generated
 */
export const initializeUserWithReferrerStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'InitializeUserWithReferrerInstructionArgs'
)
/**
 * Accounts required by the _initializeUserWithReferrer_ instruction
 *
 * @property [_writable_] userAccount
 * @property [_writable_] referrerAccount
 * @property [] userPubkey
 * @property [] referrer
 * @property [_writable_, **signer**] serviceWallet
 * @property [] state
 * @category Instructions
 * @category InitializeUserWithReferrer
 * @category generated
 */
export type InitializeUserWithReferrerInstructionAccounts = {
  userAccount: web3.PublicKey
  referrerAccount: web3.PublicKey
  userPubkey: web3.PublicKey
  referrer: web3.PublicKey
  serviceWallet: web3.PublicKey
  state: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const initializeUserWithReferrerInstructionDiscriminator = [
  205, 153, 70, 180, 11, 233, 167, 216,
]

/**
 * Creates a _InitializeUserWithReferrer_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitializeUserWithReferrer
 * @category generated
 */
export function createInitializeUserWithReferrerInstruction(
  accounts: InitializeUserWithReferrerInstructionAccounts,
  programId = new web3.PublicKey('6gVqqXEwoTX7AZTBYQDEaXntMiBPnTAyBbuMCeqk5avi')
) {
  const [data] = initializeUserWithReferrerStruct.serialize({
    instructionDiscriminator:
      initializeUserWithReferrerInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.userAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.referrerAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.userPubkey,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.referrer,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.serviceWallet,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.state,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
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
