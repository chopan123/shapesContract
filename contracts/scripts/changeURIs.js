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
  const setBaseURIResponse = await contract.setBaseURI(shapeConfig.baseURI)
  console.log("setBaseURIResponse:", setBaseURIResponse)
  // Change token URI
  const setContractURIResponse = await contract.setContractURI(shapeConfig.contractURI)
  console.log("setContractURIResponse:", setContractURIResponse)

  // invoke callback
  callback();
}
