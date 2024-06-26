/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import * as beet from '@metaplex-foundation/beet'

/**
 * @category Instructions
 * @category Initialize
 * @category generated
 */
export type InitializeInstructionArgs = {
  usdcMint: web3.PublicKey
  transactionFeePercentage: number
  daoPubkey: web3.PublicKey
  onboardingServiceWalletPubkey: web3.PublicKey
  merchantIdServiceWalletPubkey: web3.PublicKey
  transactionServiceWalletPubkey: web3.PublicKey
  reviewServiceWalletPubkey: web3.PublicKey
}
/**
 * @category Instructions
 * @category Initialize
 * @category generated
 */
export const initializeStruct = new beet.BeetArgsStruct<
  InitializeInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['usdcMint', beetSolana.publicKey],
    ['transactionFeePercentage', beet.u8],
    ['daoPubkey', beetSolana.publicKey],
    ['onboardingServiceWalletPubkey', beetSolana.publicKey],
    ['merchantIdServiceWalletPubkey', beetSolana.publicKey],
    ['transactionServiceWalletPubkey', beetSolana.publicKey],
    ['reviewServiceWalletPubkey', beetSolana.publicKey],
  ],
  'InitializeInstructionArgs'
)
/**
 * Accounts required by the _initialize_ instruction
 *
 * @property [_writable_, **signer**] state
 * @property [_writable_, **signer**] user
 * @category Instructions
 * @category Initialize
 * @category generated
 */
export type InitializeInstructionAccounts = {
  state: web3.PublicKey
  user: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const initializeInstructionDiscriminator = [
  175, 175, 109, 31, 13, 152, 155, 237,
]

/**
 * Creates a _Initialize_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Initialize
 * @category generated
 */
export function createInitializeInstruction(
  accounts: InitializeInstructionAccounts,
  args: InitializeInstructionArgs,
  programId = new web3.PublicKey('6gVqqXEwoTX7AZTBYQDEaXntMiBPnTAyBbuMCeqk5avi')
) {
  const [data] = initializeStruct.serialize({
    instructionDiscriminator: initializeInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.state,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.user,
      isWritable: true,
      isSigner: true,
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
