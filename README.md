# Solana Onboarding Service

This project provides a gasless onboarding service for the Solana blockchain, enabling user initialization, token minting, and balance checking functionalities without requiring users to pay transaction fees. The service achieves this by utilizing a server-held wallet to cover transaction costs for user onboarding and token operations, making the process seamless and user-friendly.

## Features

- **Gasless User Initialization**: Users can be initialized with or without a referrer without the need to hold SOL for transaction fees.
- **Custom USDC Token Minting**: Allows the minting of custom USDC tokens to user accounts.
- **USDC Token Balance Checking**: Users can check their custom USDC token balances.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14.x or later)
- Yarn package manager
- Solana CLI tools (optional for Solana blockchain interactions)
- A Solana wallet file (`my-solana-wallet.json`) for the service to use for paying transaction fees.

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/cryptomapp/onboarding-service
   cd onboarding-service
   ```

2. **Install dependencies**

   ```sh
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root and specify your environment variables:

   ```plaintext
   # Example .env content
   CUSTOM_USDC_MINT=<Your_Custom_USDC_Mint_Address>
   ```

4. **Run the project**

   - For development:

     ```sh
     yarn dev
     ```

   - To build and run the production version:

     ```sh
     yarn build
     yarn start
     ```

### Using Docker

A `Dockerfile` is provided. To build and run the project using Docker, execute:

```sh
docker build -t solana-onboarding-service .
docker run -p 3000:3000 solana-onboarding-service
```

## Usage

The service exposes several endpoints for interacting with the Solana blockchain:

- **Initialize User**: POST `/api/user/initialize`
- **Initialize User with Referrer**: POST `/api/user/initialize-with-ref`
- **Check if User Exists**: GET `/api/user/:id`
- **Mint Custom USDC**: POST `/api/mint-usdc`
- **Get Custom USDC Mint Info**: GET `/api/mint-info`
- **Get USDC Balance**: GET `/api/usdc-balance/:accountAddress`

## Contributing

Contributions are welcome! Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests to us.

## Security

This project involves handling sensitive information, such as Solana wallet keys. Ensure all sensitive data is properly secured and not exposed in version control.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

## Acknowledgments

- Solana Foundation for the web3.js library
- The SPL Token program for token management functionalities
