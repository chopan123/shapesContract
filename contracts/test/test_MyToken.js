// Example test script - Uses Mocha and Ganache
const ShapeMonsters = artifacts.require("ShapeMonsters");
const { expect, use } = require('chai')
const addresses = require("/workspace/config/addresses.json")
const config = require("/workspace/config/config.json")
const {keccak256, toWei} = require('web3-utils')
const { MerkleTree } = require('merkletreejs')

use(require('chai-as-promised')).should()

contract('ShapeMonsters', accounts => {
    // Define accounts
    // console.log("accounts: ", accounts)
    const price = config.price
    console.log("price:", price)
    // console.log("network:",network)
    // In test network should be always dev
    const network = 'dev'
    // console.log("addresses:",addresses)
    const whitelistJson = require('/workspace/config/whitelist.json')
    const whitelisted = whitelistJson.dev.whitelist
    const mint = ["0x28a8746e75304c0780E011BEd21C72cD78cd535E",
      "0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E"]
    beforeEach(async () => {
        // Deploy token contract
        shapeMonsters = await ShapeMonsters.new(
          addresses[network].beneficiary,
          addresses[network].royalties,
          "https://invisiblefriends.io/api/",
          "https://invisiblefriends.io/api/contracts/InvisibleFriends",
          { from: accounts[0] });

    });

    // get contract
    // Check Total Supply
    it("allow only whitelisted accounts to mint", async () => {

      console.log("keccak256:", keccak256)
      // const leaves = whitelisted.map(account => web3.utils.keccak256(account.address))
      const leaves = whitelisted.map(account => keccak256(account))
      // Create MerkleTree with previous generated leaves
      // const tree = new MerkleTree(leaves, web3.utils.keccak256, { sort: true })
      const tree = new MerkleTree(leaves, keccak256, { sort: true })
      // Gets root from previous Tree
      const merkleRoot = tree.getHexRoot()

      // Set MerkleTree
      await shapeMonsters.setMerkleRootWhitelist(merkleRoot)
      const merkleProof = tree.getHexProof(keccak256(whitelisted[0]))
      const invalidMerkleProof = tree.getHexProof(keccak256(mint[0]))

      // Open sale
      await shapeMonsters.setWhitelistActive(true);

      // Testing results
      // Minting
      const mintListedResult = await shapeMonsters.mintListed(1, merkleProof, {value: toWei(price), from: whitelisted[0]})
      console.log("mintListedResult:", mintListedResult)
      assert.isDefined(mintListedResult.tx, 'Mint Listed should have a tx hash')

      // Minting with wrong value
      const mintListedWrongValue = await shapeMonsters.mintListed(1, merkleProof, {value: toWei("0"), from: whitelisted[0]})
      // console.log("mintListedWrongValue:", mintListedWrongValue)
      assert.isUndefined(mintListedWrongValue.tx, "minting with wrong value should be rejected")
      assert(mintListedWrongValue.receipt.reason == 'Incorrect payable amount', "minting with wrong value should be rejected")

      // Not whitelisted tries to mint
      const notWhitelistedTriesToMint = await shapeMonsters.mintListed(1,invalidMerkleProof,{value: toWei(price), from: mint[0]})
      // console.log("notWhitelistedTriesToMint:", notWhitelistedTriesToMint)
      assert.isUndefined(notWhitelistedTriesToMint.tx, "minting with wrong value should be rejected")
      assert(notWhitelistedTriesToMint.receipt.reason == 'Invalid proof', "minting with wrong value should be rejected")

    });

    // it("allow only freemint accounts to mint", async () => {
    //
    //   console.log("keccak256:", keccak256)
    //   // const leaves = whitelisted.map(account => web3.utils.keccak256(account.address))
    //   const leaves = whitelisted.map(account => keccak256(account))
    //   // Create MerkleTree with previous generated leaves
    //   // const tree = new MerkleTree(leaves, web3.utils.keccak256, { sort: true })
    //   const tree = new MerkleTree(leaves, keccak256, { sort: true })
    //   // Gets root from previous Tree
    //   const merkleRoot = tree.getHexRoot()
    //
    //   // Set MerkleTree
    //   await shapeMonsters.setMerkleProof(merkleRoot)
    //   const merkleProof = tree.getHexProof(keccak256(whitelisted[0]))
    //   const invalidMerkleProof = tree.getHexProof(keccak256(mint[0]))
    //
    //   // Open sale
    //   await shapeMonsters.isWhitelistActive(true);
    //
    //   // Testing results
    //   // Minting
    //   const mintListedResult = await shapeMonsters.mintListed(1, merkleProof, {value: toWei(price), from: whitelisted[0]})
    //   console.log("mintListedResult:", mintListedResult)
    //   assert.isDefined(mintListedResult.tx, 'Mint Listed should have a tx hash')
    //
    //   // Minting with wrong value
    //   const mintListedWrongValue = await shapeMonsters.mintListed(1, merkleProof, {value: toWei("0"), from: whitelisted[0]})
    //   // console.log("mintListedWrongValue:", mintListedWrongValue)
    //   assert.isUndefined(mintListedWrongValue.tx, "minting with wrong value should be rejected")
    //   assert(mintListedWrongValue.receipt.reason == 'Incorrect payable amount', "minting with wrong value should be rejected")
    //
    //   // Not whitelisted tries to mint
    //   const notWhitelistedTriesToMint = await shapeMonsters.mintListed(1,invalidMerkleProof,{value: toWei(price), from: mint[0]})
    //   // console.log("notWhitelistedTriesToMint:", notWhitelistedTriesToMint)
    //   assert.isUndefined(notWhitelistedTriesToMint.tx, "minting with wrong value should be rejected")
    //   assert(notWhitelistedTriesToMint.receipt.reason == 'Invalid proof', "minting with wrong value should be rejected")
    //
    // });


});
