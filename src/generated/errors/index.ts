/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ErrorWithCode = Error & { code: number }
type MaybeErrorWithCode = ErrorWithCode | null | undefined

const createErrorFromCodeLookup: Map<number, () => ErrorWithCode> = new Map()
const createErrorFromNameLookup: Map<string, () => ErrorWithCode> = new Map()

/**
 * UserDoesNotExist: 'The specified user does not exist.'
 *
 * @category Errors
 * @category generated
 */
export class UserDoesNotExistError extends Error {
  readonly code: number = 0x1770
  readonly name: string = 'UserDoesNotExist'
  constructor() {
    super('The specified user does not exist.')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, UserDoesNotExistError)
    }
  }
}

createErrorFromCodeLookup.set(0x1770, () => new UserDoesNotExistError())
createErrorFromNameLookup.set(
  'UserDoesNotExist',
  () => new UserDoesNotExistError()
)

/**
 * UserAlreadyExists: 'The specified user already exists.'
 *
 * @category Errors
 * @category generated
 */
export class UserAlreadyExistsError extends Error {
  readonly code: number = 0x1771
  readonly name: string = 'UserAlreadyExists'
  constructor() {
    super('The specified user already exists.')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, UserAlreadyExistsError)
    }
  }
}

createErrorFromCodeLookup.set(0x1771, () => new UserAlreadyExistsError())
createErrorFromNameLookup.set(
  'UserAlreadyExists',
  () => new UserAlreadyExistsError()
)

/**
 * ReferrerDoesNotExist: 'The specified referrer does not exist.'
 *
 * @category Errors
 * @category generated
 */
export class ReferrerDoesNotExistError extends Error {
  readonly code: number = 0x1772
  readonly name: string = 'ReferrerDoesNotExist'
  constructor() {
    super('The specified referrer does not exist.')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, ReferrerDoesNotExistError)
    }
  }
}

createErrorFromCodeLookup.set(0x1772, () => new ReferrerDoesNotExistError())
createErrorFromNameLookup.set(
  'ReferrerDoesNotExist',
  () => new ReferrerDoesNotExistError()
)

/**
 * TransactionAmountTooLow: 'Transaction amount is too low.'
 *
 * @category Errors
 * @category generated
 */
export class TransactionAmountTooLowError extends Error {
  readonly code: number = 0x1773
  readonly name: string = 'TransactionAmountTooLow'
  constructor() {
    super('Transaction amount is too low.')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, TransactionAmountTooLowError)
    }
  }
}

createErrorFromCodeLookup.set(0x1773, () => new TransactionAmountTooLowError())
createErrorFromNameLookup.set(
  'TransactionAmountTooLow',
  () => new TransactionAmountTooLowError()
)

/**
 * InsufficientFunds: 'Insufficient funds for the transaction.'
 *
 * @category Errors
 * @category generated
 */
export class InsufficientFundsError extends Error {
  readonly code: number = 0x1774
  readonly name: string = 'InsufficientFunds'
  constructor() {
    super('Insufficient funds for the transaction.')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InsufficientFundsError)
    }
  }
}

createErrorFromCodeLookup.set(0x1774, () => new InsufficientFundsError())
createErrorFromNameLookup.set(
  'InsufficientFunds',
  () => new InsufficientFundsError()
)

/**
 * InvalidRating: 'Invalid rating provided.'
 *
 * @category Errors
 * @category generated
 */
export class InvalidRatingError extends Error {
  readonly code: number = 0x1775
  readonly name: string = 'InvalidRating'
  constructor() {
    super('Invalid rating provided.')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidRatingError)
    }
  }
}

createErrorFromCodeLookup.set(0x1775, () => new InvalidRatingError())
createErrorFromNameLookup.set('InvalidRating', () => new InvalidRatingError())

/**
 * InvalidReferrer: 'Invalid referrer provided.'
 *
 * @category Errors
 * @category generated
 */
export class InvalidReferrerError extends Error {
  readonly code: number = 0x1776
  readonly name: string = 'InvalidReferrer'
  constructor() {
    super('Invalid referrer provided.')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidReferrerError)
    }
  }
}

createErrorFromCodeLookup.set(0x1776, () => new InvalidReferrerError())
createErrorFromNameLookup.set(
  'InvalidReferrer',
  () => new InvalidReferrerError()
)

/**
 * Unauthorized: 'Unauthorized.'
 *
 * @category Errors
 * @category generated
 */
export class UnauthorizedError extends Error {
  readonly code: number = 0x1777
  readonly name: string = 'Unauthorized'
  constructor() {
    super('Unauthorized.')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, UnauthorizedError)
    }
  }
}

createErrorFromCodeLookup.set(0x1777, () => new UnauthorizedError())
createErrorFromNameLookup.set('Unauthorized', () => new UnauthorizedError())

/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 * @category generated
 */
export function errorFromCode(code: number): MaybeErrorWithCode {
  const createError = createErrorFromCodeLookup.get(code)
  return createError != null ? createError() : null
}

/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 * @category generated
 */
export function errorFromName(name: string): MaybeErrorWithCode {
  const createError = createErrorFromNameLookup.get(name)
  return createError != null ? createError() : null
}