// Example test script - Uses Mocha and Ganache
const ShapeMonsters = artifacts.require("ShapeMonsters");
const { expect, use } = require('chai')
const addresses = require("/workspace/config/addresses.json")
const config = require("/workspace/config/config.json")
const {keccak256, toWei, toBN} = require('web3-utils')
const { MerkleTree } = require('merkletreejs')

use(require('chai-as-promised')).should()

contract('ShapeMonsters', accounts => {
    // Define accounts
    // console.log("accounts: ", accounts)
    const price = config.price
    const whitelistPrice = config.whitelistPrice
    // console.log("price:", price)
    // console.log("network:",network)
    // In test network should be always dev
    const network = 'dev'
    // console.log("addresses:",addresses)
    const whitelistJson = require('/workspace/config/whitelist.json')
    const whitelisted = whitelistJson.dev.whitelist
    const freemintJson = require('/workspace/config/freemint.json')
    const freeminted = freemintJson.dev.freemint
    const minted = ["0x28a8746e75304c0780E011BEd21C72cD78cd535E",
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
    it("allow only whitelisted accounts to minted", async () => {
      // Generate Leaves
      const leaves = whitelisted.map(account => keccak256(account))
      // Create MerkleTree with previous generated leaves
      const tree = new MerkleTree(leaves, keccak256, { sort: true })
      // Gets root from previous Tree
      const merkleRoot = tree.getHexRoot()

      // Set MerkleTree
      await shapeMonsters.setMerkleRootWhitelist(merkleRoot)
      const merkleProof = tree.getHexProof(keccak256(whitelisted[0]))
      const invalidMerkleProof = tree.getHexProof(keccak256(minted[0]))

      // Open sale
      await shapeMonsters.setWhitelistActive(true);

      // Testing results
      // Minting
      const mintListedResult = await shapeMonsters.mintListed(1, merkleProof, {value: toWei(whitelistPrice), from: whitelisted[0]})
      // console.log("mintListedResult:", mintListedResult)
      assert.isDefined(mintListedResult.tx, 'Mint Listed should have a tx hash')

      // Minting
      const mintListedAgain = await shapeMonsters.mintListed(1, merkleProof, {value: toWei(whitelistPrice), from: whitelisted[0]})
      // console.log("mintListedAgain:", mintListedAgain)
      assert.isUndefined(mintListedAgain.tx, "Second whitelist minting should be rejected rejected")
      assert(mintListedAgain.receipt.reason == 'Already minted your Whitelist Spot', "minting with wrong value should be rejected")

      // Minting with wrong value
      const mintListedWrongValue = await shapeMonsters.mintListed(1, merkleProof, {value: toWei("0"), from: whitelisted[0]})
      // console.log("mintListedWrongValue:", mintListedWrongValue)
      assert.isUndefined(mintListedWrongValue.tx, "minting with wrong value should be rejected")
      assert(mintListedWrongValue.receipt.reason == 'Incorrect payable amount', "minting with wrong value should be rejected")


      // Not whitelisted tries to minted
      const notWhitelistedTriesToMint = await shapeMonsters.mintListed(1,invalidMerkleProof,{value: toWei(price), from: minted[0]})
      // console.log("notWhitelistedTriesToMint:", notWhitelistedTriesToMint)
      assert.isUndefined(notWhitelistedTriesToMint.tx, "minting with wrong value should be rejected")
      assert(notWhitelistedTriesToMint.receipt.reason == 'Invalid proof', "minting with wrong value should be rejected")

    });

    it("allow only freemint accounts to minted", async () => {
      // Generate Leaves
      const leaves = freeminted.map(account => keccak256(account))
      // Create MerkleTree with previous generated leaves
      const tree = new MerkleTree(leaves, keccak256, { sort: true })
      // Gets root from previous Tree
      const merkleRoot = tree.getHexRoot()

      // Set MerkleTree
      await shapeMonsters.setMerkleRootFreemint(merkleRoot)
      const merkleProof = tree.getHexProof(keccak256(freeminted[0]))
        const invalidMerkleProof = tree.getHexProof(keccak256(minted[0]))

      // Open sale
      await shapeMonsters.setFreemintActive(true);

      // Testing results
      // Minting
      const freeMint = await shapeMonsters.freeMint(merkleProof, {from: freeminted[0]})
      // console.log("freeMint:", freeMint)
      assert.isDefined(freeMint.tx, 'Mint Listed should have a tx hash')

      // should not mint more than 1
      const freeMintAlreadyMinter = await shapeMonsters.freeMint(merkleProof, {from: freeminted[0]})
      // console.log("freeMint:", freeMint)
      assert.isUndefined(freeMintAlreadyMinter.tx, "freeminting twice should be rejected")
      assert(freeMintAlreadyMinter.receipt.reason == 'Already minted your Free Mint', "reason should be : Already minted your Free Mint")

      // Not whitelisted tries to minted
      const notFreemintedTriesToMint = await shapeMonsters.freeMint(invalidMerkleProof,{value: toWei(price), from: minted[0]})
      // console.log("notFreemintedTriesToMint:", notFreemintedTriesToMint)
      assert.isUndefined(notFreemintedTriesToMint.tx, "minting with wrong value should be rejected")
      assert(notFreemintedTriesToMint.receipt.reason == 'Invalid proof', "minting with wrong value should be rejected")

      //
    });

    it("mint after sale is open", async () => {

      // Mint before sale is open
      const mintSaleClosed = await shapeMonsters.mint(1, {from: minted[0]})
      // console.log("freeMint:", freeMint)
      assert.isUndefined(mintSaleClosed.tx, "mint when sale is closed should be rejected")
      assert(mintSaleClosed.receipt.reason == 'Sale is closed', "reason should be : Sale is closed")

      // Open sale
      await shapeMonsters.setMintActive(true);

      // Minting
      const mint = await shapeMonsters.mint(1, {from: freeminted[0], value: toWei(price)})
      // console.log("mint:", mint)
      assert.isDefined(mint.tx, 'Mint Listed should have a tx hash')

      // Minting
      const amount = 5
      const mintMultiple = await shapeMonsters.mint(amount, {from: freeminted[0], value: toWei((parseInt(price)*amount).toString())})
      // console.log("mintMultiple:", mintMultiple)
      assert.isDefined(mintMultiple.tx, 'Mint should be allow to mint multiple')


      // Not whitelisted tries to minted
      const mintWrongValue = await shapeMonsters.mint(2,{value: toWei(price), from: minted[0]})
      // console.log("mintWrongValue:", mintWrongValue)
      assert.isUndefined(mintWrongValue.tx, "minting with wrong value should be rejected")
      assert(mintWrongValue.receipt.reason == 'Incorrect payable amount', "reason should be : Incorrect payable amount")

      // Big number attack
      const MAX_BN = toBN("115792089237316195423570985008687907853269984665640564039457584007913129639935")
      // console.log("price:", toWei(price).toString() )
      const bigAmount = MAX_BN.div(toBN(toWei(price)))
      // console.log("bigAmount:", bigAmount.toString())
      const corruptValue = (bigAmount.add(toBN("1"))).mul(toBN(toWei(price))).mod(MAX_BN)
      // console.log("corruptValue:", corruptValue.toString())

      const bigAmountMint = await shapeMonsters.mint(bigAmount,{value: corruptValue, from: minted[0]})
      // console.log("bigAmountMint:", bigAmountMint)
      assert.isUndefined(bigAmountMint.tx, "Too much amount should be rejected")
      assert(bigAmountMint.receipt.reason == 'Incorrect payable amount', "Reason should be bad price or max supply")

    });




});
