const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config()  // store environment variables from '.env' to process.env
// Moonbeam Development Node Private Key
const privateKeyDev =
   '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
// Moonbase Alpha Private Key --> Please change this to your own Private Key with funds
// NOTE: Do not store your private key in plaintext files
//       this is only for demostration purposes only
const privateKeyMoonbase =
   'YOUR_PRIVATE_KEY_HERE_ONLY_FOR_DEMOSTRATION_PURPOSES';

module.exports = {
   networks: {
      // Moonbeam Development Network
      dev: {
         provider: () => {
            if (!privateKeyDev.trim()) {
               throw new Error(
                  'Please enter a private key with funds, you can use the default one'
               );
            }
            return new HDWalletProvider(
               process.env.GANACHE_SEED_PHRASE,
               'http://ganache:8545/'
            );
         },
         network_id: 1337,
         gasPrice: 200000000000
      },
      // Moonbase Alpha TestNet
      moonbase: {
         provider: () => {
            if (!privateKeyMoonbase.trim()) {
               throw new Error(
                  'Please enter a private key with funds to send transactions to TestNet'
               );
            }
            if (privateKeyDev == privateKeyMoonbase) {
               throw new Error(
                  'Please change the private key used for Moonbase to your own with funds'
               );
            }
            return new HDWalletProvider(
               privateKeyMoonbase,
               'https://rpc.api.moonbase.moonbeam.network'
            );
         },
         network_id: 1287,
      },
   },
   // Solidity 0.7.0 Compiler
   compilers: {
      solc: {
         version: '^0.8.9',
         settings: {          // See the solidity docs for advice about optimization and evmVersion
           optimizer: {
             enabled: true,
             runs: 200
           },
           // evmVersion: "byzantium"
         }
      },
   },
   // Moonbeam Truffle Plugin & Truffle Plugin for Verifying Smart Contracts
   plugins: ['moonbeam-truffle-plugin', 'truffle-plugin-verify'],
};
