var ShapeMonsters = artifacts.require("ShapeMonsters");
const addresses = require("/workspace/config/addresses.json")

module.exports = function (deployer, network) {
  // console.log(addresses);
  // console.log(network);
  deployer.deploy(ShapeMonsters,
    addresses[network].beneficiary,
    addresses[network].royalties,
    "https://invisiblefriends.io/api/",
    "https://invisiblefriends.io/api/contracts/InvisibleFriends");
};
