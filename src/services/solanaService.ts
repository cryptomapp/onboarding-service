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
import { PROGRAM_ID } from "../generated";
import { createInitializeUserInstruction } from "../generated";
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
      "79PmNZeRkGUhpFMg4pKsJyb5Tt6cyDqbqCQ6ZFckXpTL"
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
    console.log("SolanaService: checkIfUserExists");
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
}
