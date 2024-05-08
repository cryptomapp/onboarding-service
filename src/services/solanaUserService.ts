import {
  Connection,
  PublicKey,
  clusterApiUrl,
  AccountInfo,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";

import { PROGRAM_ID, User } from "../generated";
import {
  createInitializeUserInstruction,
  createInitializeUserWithReferrerInstruction,
} from "../generated";
import bs58 from "bs58";
import { config } from "../config";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

export class SolanaUserService {
  private static instance: SolanaUserService;
  private connection: Connection;
  private programId: PublicKey;
  private stateAddress: PublicKey;
  private serviceWallet: Keypair;
  private usdcMintAddress: PublicKey;

  constructor() {
    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    this.programId = new PublicKey(PROGRAM_ID);

    // Create a new Keypair from the decoded secret key
    const secretKeyUint8Array = bs58.decode(config.solPrivateKey!);
    this.serviceWallet = Keypair.fromSecretKey(secretKeyUint8Array);
    this.stateAddress = new PublicKey(config.stateAddress);
    this.usdcMintAddress = new PublicKey(config.usdcMintAddress);
  }

  // Singleton instance getter
  public static getInstance(): SolanaUserService {
    if (!SolanaUserService.instance) {
      SolanaUserService.instance = new SolanaUserService();
    }
    return SolanaUserService.instance;
  }

  calculatePDA(publicKey: PublicKey, seedPrefix: string): [PublicKey, number] {
    const seeds = seedPrefix
      ? [Buffer.from(seedPrefix), publicKey.toBuffer()]
      : [publicKey.toBuffer()];
    return PublicKey.findProgramAddressSync(seeds, this.programId);
  }

  async getUserUsdcAccount(
    userPublicKey: PublicKey
  ): Promise<[string, boolean]> {
    // Calculate the expected address for the user's USDC associated token account
    const usdcAccountAddress = await getAssociatedTokenAddress(
      this.usdcMintAddress,
      userPublicKey
    );

    // Check if the USDC account exists on the blockchain
    const usdcAccountInfo = await this.connection.getAccountInfo(
      usdcAccountAddress
    );

    // Return the USDC account address as a string and a boolean indicating if the account is initialized
    return [usdcAccountAddress.toString(), usdcAccountInfo !== null];
  }

  async checkIfUserExists(userPublicKey: PublicKey): Promise<boolean> {
    console.log("checkIfUserExists user PK:", userPublicKey);
    try {
      const [userAccountPDA] = this.calculatePDA(userPublicKey, "user");
      console.log("UserAccountPDA: ", userAccountPDA);
      const accountInfo: AccountInfo<Buffer> | null =
        await this.connection.getAccountInfo(userAccountPDA);
      console.log("AccountInfo: ", accountInfo);
      return accountInfo !== null; // A non-null accountInfo implies the PDA exists
    } catch (error) {
      console.error("Error in checkIfUserExists:", error);
      return false;
    }
  }

  async getUser(userPublicKey: PublicKey): Promise<User> {
    try {
      // Calculate the PDA for the user account
      const [userAccountPDA] = this.calculatePDA(userPublicKey, "user");

      // Fetch the user account data
      const user = await User.fromAccountAddress(
        this.connection,
        userAccountPDA
      );

      return user;
    } catch (error) {
      console.error("Error in getUser:", error);
      throw error;
    }
  }

  async initializeUser(userPublicKey: PublicKey): Promise<string> {
    try {
      // Calculate the PDA for the user account
      const [userAccountPDA] = this.calculatePDA(userPublicKey, "user");

      // Get the associated token account address
      const usdcAccountAddress = await getAssociatedTokenAddress(
        this.usdcMintAddress,
        userPublicKey
      );

      // Check if the USDC account already exists
      const usdcAccountInfo = await this.connection.getAccountInfo(
        usdcAccountAddress
      );

      // Create the instruction for initializing the user
      const instruction = createInitializeUserInstruction(
        {
          userAccount: userAccountPDA,
          userPubkey: userPublicKey,
          serviceWallet: this.serviceWallet.publicKey,
          state: this.stateAddress,
          systemProgram: SystemProgram.programId,
        },
        this.programId
      );

      const transaction = new Transaction();

      // Fetch the recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash(
        "finalized"
      );
      transaction.recentBlockhash = blockhash;

      if (!usdcAccountInfo) {
        // If the USDC account does not exist, add an instruction to create it
        const createAtaInstruction = createAssociatedTokenAccountInstruction(
          this.serviceWallet.publicKey, // Payer of the transaction
          usdcAccountAddress, // Associated Token Account address
          userPublicKey, // Owner of the new account
          this.usdcMintAddress // Mint address for the token
        );
        transaction.add(createAtaInstruction);
      }

      // Add the instruction to the transaction
      transaction.add(instruction);

      // Sign the transaction with the service's wallet
      transaction.sign(this.serviceWallet);

      // Send the transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.serviceWallet]
      );

      return signature;
    } catch (error) {
      console.error("Error in initializeUser:", error);
      throw error;
    }
  }

  async initializeUserWithReferrer(
    userPublicKey: PublicKey,
    referrerPublicKey: PublicKey
  ): Promise<string> {
    try {
      // Calculate PDAs for the user and referrer accounts
      const [userAccountPDA] = this.calculatePDA(userPublicKey, "user");
      const [referrerAccountPDA] = this.calculatePDA(referrerPublicKey, "user");

      // Get the associated token account address
      const usdcAccountAddress = await getAssociatedTokenAddress(
        this.usdcMintAddress,
        userPublicKey
      );

      // Check if the USDC account already exists
      const usdcAccountInfo = await this.connection.getAccountInfo(
        usdcAccountAddress
      );

      // Create the instruction for initializing the user with a referrer
      const instruction = createInitializeUserWithReferrerInstruction(
        {
          userAccount: userAccountPDA,
          referrerAccount: referrerAccountPDA,
          userPubkey: userPublicKey,
          referrer: referrerPublicKey,
          serviceWallet: this.serviceWallet.publicKey,
          state: this.stateAddress,
          systemProgram: SystemProgram.programId,
        },
        this.programId
      );

      const transaction = new Transaction();

      // Fetch the recent blockhash
      const { blockhash } = await this.connection.getRecentBlockhash(
        "finalized"
      );
      transaction.recentBlockhash = blockhash;

      if (!usdcAccountInfo) {
        // If the USDC account does not exist, add an instruction to create it
        const createAtaInstruction = createAssociatedTokenAccountInstruction(
          this.serviceWallet.publicKey, // Payer of the transaction
          usdcAccountAddress, // Associated Token Account address
          userPublicKey, // Owner of the new account
          this.usdcMintAddress // Mint address for the token
        );
        transaction.add(createAtaInstruction);
      }

      // Add the instruction to the transaction
      transaction.add(instruction);

      // Sign the transaction with the service's wallet
      transaction.sign(this.serviceWallet);

      // Send the transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.serviceWallet]
      );

      return signature;
    } catch (error) {
      console.error("Error in initializeUserWithReferrer:", error);
      throw error;
    }
  }
}
