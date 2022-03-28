// import deployed contract
const deployments = require('../config/deployments.json')
const ShapeMonsters = artifacts.require("ShapeMonsters");
const shapeConfig = require('../config/config.json')

module.exports = async function(callback) {
  // get network
  const {network} = config
  // console.log("network:", network)
  // Get contract instance
  // console.log(deployments)
  const contractAddress = deployments[network].address
  console.log("contractAddress:", contractAddress)
  // const contract = await ShapeMonsters.at(contractAddress)
  const contract = await ShapeMonsters.deployed()
  console.log("contract:", contract)
  // check if there is code in address:


  // change base uri
  const baseURIResponse = await contract.baseURI()
  console.log("baseURIResponse:", baseURIResponse)
  // Change token URI
  const contractURIResponse = await contract.contractURI()
  console.log("contractURIResponse:", contractURIResponse)

  // invoke callback
  callback();
}
