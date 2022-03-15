require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const secrets = require("./secrets");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: secrets.ropsten.url,
      accounts: [secrets.ropsten.account]
    },
    rinkeby: {
      url: secrets.rinkeby.url,
      accounts: [secrets.rinkeby.account]
    },
    mumbai: {
      url: secrets.mumbai.url,
      accounts: [secrets.mumbai.account]
    },
    polygon: {
      url: secrets.polygon.url,
      accounts: [secrets.polygon.account]
    }
  },
  etherscan: {
    apiKey: {
      ropsten: secrets.ropsten.apiKey,
      rinkeby: secrets.rinkeby.apiKey,
      polygonMumbai: secrets.mumbai.apiKey,
      polygon: secrets.polygon.apiKey
    }
  }
};
