const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tier Tests", function () {

    it("Should return base tier uri for initial highest mintable token ID.", async function () {
        const HBC = await ethers.getContractFactory("HBC");
        const hbc = await HBC.deploy();
        await hbc.deployed();

        const highestMintableTokenID = await hbc.getHighestMintableTokenID();

        const mintTx = await hbc.mint(highestMintableTokenID);
        await mintTx.wait();

        const uri = await hbc.uri(highestMintableTokenID);

        expect(uri).to.equal(`ipfs://QmUgTHU4LmDpJXzLEfmBraaD3uAqwd1jecsV15DJc8GURJ/metadata/${highestMintableTokenID}.json`);
    });

    it("Should return highest mintable tokenID and latest tier after tier addition.", async function () {
        const HBC = await ethers.getContractFactory("HBC");
        const hbc = await HBC.deploy();
        await hbc.deployed();

        const tierUri = "ipfs://some-long-url/metadata/3750.json";

        const addTierTx = await hbc.addTier(3750, tierUri);
        await addTierTx.wait();

        const latestTier = await hbc.getLatestTier();
        const highestMintableTokenID = await hbc.getHighestMintableTokenID();
        expect(highestMintableTokenID).to.equal(3750);
        expect(latestTier).to.equal(2);
    });

    it("Should return uri for second level tier after tier addition.", async function () {
        const HBC = await ethers.getContractFactory("HBC");
        const hbc = await HBC.deploy();
        await hbc.deployed();

        const tierUri = "ipfs://some-long-url/metadata/";

        const addTierTx = await hbc.addTier(3750, tierUri);
        await addTierTx.wait();

        const mintTokenTx = await hbc.batchMint([3001, 3750]);
        await mintTokenTx.wait();

        const minUri = await hbc.uri(3001);
        const maxUri = await hbc.uri(3750);

        expect(minUri).to.equal(`${tierUri}3001.json`);
        expect(maxUri).to.equal(`${tierUri}3750.json`);
    });

    it("Should revert tier addition when tokenID is not high enough.", async function () {
        const HBC = await ethers.getContractFactory("HBC");
        const hbc = await HBC.deploy();
        await hbc.deployed();

        const addTierTx = hbc.addTier(3000, "")
        expect(addTierTx).to.be.revertedWith("Max tokenID must be larger than the existing one.");
    });
});