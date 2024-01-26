import {
  Connection,
  PublicKey,
  clusterApiUrl,
  AccountInfo,
} from "@solana/web3.js";
import { PROGRAM_ID } from "../generated";

export class SolanaService {
  private static instance: SolanaService;
  private connection: Connection;
  private programId: PublicKey;

  constructor() {
    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    this.programId = new PublicKey(PROGRAM_ID);
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

  async checkIfUserExists(publicKey: PublicKey): Promise<boolean> {
    console.log("SolanaService: checkIfUserExists");
    try {
      const [pda] = this.calculatePDA(publicKey, "user");
      const accountInfo: AccountInfo<Buffer> | null =
        await this.connection.getAccountInfo(pda);
      console.log("accountInfo", accountInfo); // todo: get userPDA
      return accountInfo !== null; // A non-null accountInfo implies the PDA exists
    } catch (error) {
      console.error("Error in checkIfUserExists:", error);
      return false;
    }
  }
}
