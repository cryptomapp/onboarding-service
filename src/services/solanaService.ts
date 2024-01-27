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
import fs from "fs";

export class SolanaService {
  private static instance: SolanaService;
  private connection: Connection;
  private programId: PublicKey;
  private stateAddress: PublicKey;
  private serviceWallet: Keypair;

  constructor() {
    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    this.programId = new PublicKey(PROGRAM_ID);
    // todo: read from config (env)
    this.serviceWallet = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fs.readFileSync("/Users/twentone37/my-solana-wallet.json", "utf-8")
        )
      )
    );
    this.stateAddress = new PublicKey(
      "8WC3K3MZrQgUtqNf7dsgBM7d8yW5HCtYhUvqh2hqrs3V"
    );
  }

  // Singleton instance getter
  public static getInstance(): SolanaService {
    if (!SolanaService.instance) {
      SolanaService.instance = new SolanaService();
    }
    return SolanaService.instance;
  }

  calculatePDA(publicKey: PublicKey, seedPrefix: string): [PublicKey, number] {
    const seeds = seedPrefix
      ? [Buffer.from(seedPrefix), publicKey.toBuffer()]
      : [publicKey.toBuffer()];
    return PublicKey.findProgramAddressSync(seeds, this.programId);
  }

  async checkIfUserExists(userPublicKey: PublicKey): Promise<boolean> {
    try {
      const [userAccountPDA] = this.calculatePDA(userPublicKey, "user");
      const accountInfo: AccountInfo<Buffer> | null =
        await this.connection.getAccountInfo(userAccountPDA);
      console.log("accountInfo", accountInfo); // todo: get userPDA
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

      console.log("1");
      // Fetch the user account data
      const user = await User.fromAccountAddress(
        this.connection,
        userAccountPDA
      );
      console.log("2");
      console.log("user", user);

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
      console.log("userAccountPDA", userAccountPDA.toBase58());

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
