import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  TransactionSignature,
} from "@solana/web3.js";
import fs from "fs";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  getAccount,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { config } from "../config";
import bs58 from "bs58";

export class SolanaCashMachineService {
  private static instance: SolanaCashMachineService;
  private connection: Connection;
  private serviceWallet: Keypair;
  private customUSDCMint: PublicKey | null;

  constructor() {
    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    // Create a new Keypair from the decoded secret key
    const secretKeyUint8Array = bs58.decode(config.solPrivateKey);
    this.serviceWallet = Keypair.fromSecretKey(secretKeyUint8Array);
    this.customUSDCMint = null;
  }

  // Singleton instance getter
  public static getInstance(): SolanaCashMachineService {
    if (!SolanaCashMachineService.instance) {
      SolanaCashMachineService.instance = new SolanaCashMachineService();
    }
    return SolanaCashMachineService.instance;
  }

  public getMintAddress(): string | null {
    return this.customUSDCMint ? this.customUSDCMint.toString() : null;
  }

  async getUSDCBalance(userWalletAddress: PublicKey): Promise<string> {
    if (!this.customUSDCMint) {
      throw new Error("Custom USDC Mint address is not set.");
    }
    const mintAddress = this.customUSDCMint;

    // Find the associated token account for the user's wallet address and the custom USDC mint
    const accounts = await this.connection.getParsedTokenAccountsByOwner(
      userWalletAddress,
      { programId: TOKEN_PROGRAM_ID }
    );
    const userTokenAccountInfo = accounts.value.find(
      (account) =>
        account.account.data.parsed.info.mint === mintAddress.toString()
    );

    if (!userTokenAccountInfo) {
      throw new Error("Token account for specified user and mint not found.");
    }

    const tokenAccountAddress = new PublicKey(userTokenAccountInfo.pubkey);

    // Now that we have the correct token account, we can query its balance
    const accountInfo = await getAccount(this.connection, tokenAccountAddress);
    const balance = accountInfo.amount;

    // Adjust the balance for token decimals
    const decimals = 6; // Assuming 6 decimals for your custom USDC
    const adjustedBalance = (
      balance / BigInt(Math.pow(10, decimals))
    ).toString();

    return adjustedBalance;
  }

  async mintCustomUSDC(toAccount: PublicKey, amount: number): Promise<string> {
    // Check if the mint address already exists in the environment variable
    const existingMintAddress = config.usdcMintAddress;

    // If it exists, use it, otherwise create a new mint and update the environment variable
    if (existingMintAddress) {
      this.customUSDCMint = new PublicKey(existingMintAddress);
    } else {
      this.customUSDCMint = await createCustomUSDCMint(
        this.connection,
        this.serviceWallet
      );
      process.env.CUSTOM_USDC_MINT = this.customUSDCMint.toString();
    }

    try {
      // Ensure the customUSDCMint has been set
      if (!this.customUSDCMint) {
        throw new Error("Mint address has not been set.");
      }

      // Get or create the associated token account for the recipient (toAccount)
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        this.serviceWallet, // Payer of the transaction fees, not necessarily the owner of the wallet you're checking
        this.customUSDCMint, // Your custom USDC mint address
        toAccount, // The user's public key you're checking the balance for
        true // Commitment level, which you can adjust as needed
      );

      // Mint tokens to the specified account
      const signature = await mintTo(
        this.connection,
        this.serviceWallet, // Payer of the transaction fees and the minting authority
        this.customUSDCMint, // Mint address
        toTokenAccount.address, // The account to receive the minted tokens
        this.serviceWallet, // Authority to mint new tokens (must be the owner or have delegated authority)
        amount, // Amount to mint
        [] // Multi-signers, if any (optional)
      );

      // The mintTo function call returns the transaction signature directly
      return signature;
    } catch (error) {
      console.error("Error in mintCustomUSDC:", error);
      throw error;
    }
  }
}

async function createCustomUSDCMint(
  connection: Connection,
  payer: Keypair
): Promise<PublicKey> {
  const mint = await createMint(
    connection,
    payer, // payer of the transaction
    payer.publicKey, // mint authority
    null, // freeze authority
    6 // decimals, USDC typically has 6 decimals
  );
  return mint;
}
