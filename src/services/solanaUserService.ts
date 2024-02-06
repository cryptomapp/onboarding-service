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

export class SolanaUserService {
  private static instance: SolanaUserService;
  private connection: Connection;
  private programId: PublicKey;
  private stateAddress: PublicKey;
  private serviceWallet: Keypair;

  constructor() {
    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    this.programId = new PublicKey(PROGRAM_ID);

    // Create a new Keypair from the decoded secret key
    const secretKeyUint8Array = bs58.decode(config.solPrivateKey);
    this.serviceWallet = Keypair.fromSecretKey(secretKeyUint8Array);

    this.stateAddress = new PublicKey(
      "9Zxs8fDSskUJ5S1vEsFe9eraz3f1NsQ83BKpwQvqNHw1"
    );
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

  async checkIfUserExists(userPublicKey: PublicKey): Promise<boolean> {
    try {
      const [userAccountPDA] = this.calculatePDA(userPublicKey, "user");
      const accountInfo: AccountInfo<Buffer> | null =
        await this.connection.getAccountInfo(userAccountPDA);
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
