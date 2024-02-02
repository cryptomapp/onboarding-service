// import {
//   Connection,
//   PublicKey,
//   clusterApiUrl,
//   Transaction,
//   sendAndConfirmTransaction,
//   Keypair,
// } from "@solana/web3.js";
// import fs from "fs";
// import {
//   createMint,
//   getOrCreateAssociatedTokenAccount,
//   mintTo,
// } from "@solana/spl-token";

// export class SolanaCashMachineService {
//   private static instance: SolanaCashMachineService;
//   private connection: Connection;
//   private serviceWallet: Keypair;
//   private customUSDCMint: PublicKey | null;

//   constructor() {
//     this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
//     // todo: read from config (env)
//     this.serviceWallet = Keypair.fromSecretKey(
//       Uint8Array.from(
//         JSON.parse(
//           fs.readFileSync("/Users/twentone37/my-solana-wallet.json", "utf-8")
//         )
//       )
//     );
//     this.customUSDCMint = null;
//   }

//   // Singleton instance getter
//   public static getInstance(): SolanaCashMachineService {
//     if (!SolanaCashMachineService.instance) {
//       SolanaCashMachineService.instance = new SolanaCashMachineService();
//     }
//     return SolanaCashMachineService.instance;
//   }

//   async mintCustomUSDC(toAccount: PublicKey, amount: number): Promise<string> {
//     const existingMintAddress = process.env.CUSTOM_USDC_MINT; // Example

//     if (existingMintAddress) {
//       this.customUSDCMint = new PublicKey(existingMintAddress);
//     } else {
//       // If it doesn't exist, create it
//       this.customUSDCMint = await createCustomUSDCMint(
//         this.connection,
//         this.serviceWallet
//       );
//       process.env.CUSTOM_USDC_MINT = this.customUSDCMint.toString();
//     }
//     try {
//       const mintAuthority = this.serviceWallet; // Your service wallet is the mint authority
//       const mintPublicKey = new PublicKey("Your_Custom_USDC_Mint_Account");

//       // Create a mint transaction
//       const transaction = new Transaction();

//       // Get or create the associated token account for the `toAccount`
//       const toTokenAccount = await getOrCreateAssociatedTokenAccount(
//         this.connection,
//         mintAuthority,
//         mintPublicKey,
//         toAccount
//       );

//       // Add the mintTo instruction
//       transaction.add(
//         await mintTo(
//           this.connection,
//           mintAuthority,
//           mintPublicKey,
//           toTokenAccount.address,
//           mintAuthority,
//           amount,
//           []
//         )
//       );

//       // Fetch the recent blockhash
//       transaction.recentBlockhash = (
//         await this.connection.getRecentBlockhash()
//       ).blockhash;

//       // Sign the transaction
//       transaction.sign(mintAuthority);

//       // Send the transaction
//       return await sendAndConfirmTransaction(this.connection, transaction, [
//         mintAuthority,
//       ]);
//     } catch (error) {
//       console.error("Error in mintCustomUSDC:", error);
//       throw error;
//     }
//   }
// }

// async function createCustomUSDCMint(
//   connection: Connection,
//   payer: Keypair
// ): Promise<PublicKey> {
//   const mint = await createMint(
//     connection,
//     payer, // payer of the transaction
//     payer.publicKey, // mint authority
//     null, // freeze authority, set to null if not needed
//     6 // decimals, USDC typically has 6 decimals
//   );
//   return mint;
// }
