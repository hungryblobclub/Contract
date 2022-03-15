const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mint and Transfer Tests", function () {
  
  it("Should be reverted when fetching uri for token not yet minted.", async function () {
    const HBC = await ethers.getContractFactory("HBC");
    const hbc = await HBC.deploy();
    await hbc.deployed();

    expect(hbc.uri(0x000000000000000a)).to.be.revertedWith("URI query for nonexsistent token.");
  });
  
  it("Should return uri with the given hex token id.", async function () {
    const HBC = await ethers.getContractFactory("HBC");
    const hbc = await HBC.deploy();
    await hbc.deployed();

    const mintTx = await hbc.mint(0x000000000000000a);
    await mintTx.wait();

    const uri = await hbc.uri(0x000000000000000a);

    expect(uri).to.equal("ipfs://QmUgTHU4LmDpJXzLEfmBraaD3uAqwd1jecsV15DJc8GURJ/metadata/10.json");
  });

  it("Should batch mint to sender address.", async function () {
    const HBC = await ethers.getContractFactory("HBC");
    const hbc = await HBC.deploy();
    await hbc.deployed();

    const account = await ethers.getSigners();

    const mintTx = await hbc.batchMint([1,2,3,4,5,6,7,8,9,10]);
    await mintTx.wait();
    
    expect(await hbc.balanceOf(account[0].address, 0x0000000000000000)).to.equal(0);
    expect(await hbc.balanceOf(account[0].address, 0x0000000000000001)).to.equal(1);
    expect(await hbc.balanceOf(account[0].address, 0x0000000000000002)).to.equal(1);
    expect(await hbc.balanceOf(account[0].address, 0x0000000000000003)).to.equal(1);
    expect(await hbc.balanceOf(account[0].address, 0x0000000000000004)).to.equal(1);
    expect(await hbc.balanceOf(account[0].address, 0x0000000000000005)).to.equal(1);
    expect(await hbc.balanceOf(account[0].address, 0x0000000000000006)).to.equal(1);
    expect(await hbc.balanceOf(account[0].address, 0x0000000000000007)).to.equal(1);
    expect(await hbc.balanceOf(account[0].address, 0x0000000000000008)).to.equal(1);
    expect(await hbc.balanceOf(account[0].address, 0x0000000000000009)).to.equal(1);
    expect(await hbc.balanceOf(account[0].address, 0x000000000000000a)).to.equal(1);
    expect(await hbc.balanceOf(account[0].address, 0x000000000000000b)).to.equal(0);
  });

  it("Should mint to sender address.", async function () {
    const HBC = await ethers.getContractFactory("HBC");
    const hbc = await HBC.deploy();
    await hbc.deployed();

    const account = await ethers.getSigners();

    const mintTx = await hbc.mint(0x0000000000000010);
    await mintTx.wait();
    
    expect(await hbc.balanceOf(account[0].address, 0x0000000000000010)).to.equal(1);
  });

  it("Should NOT mint token which has already been minted.", async function () {
    const HBC = await ethers.getContractFactory("HBC");
    const hbc = await HBC.deploy();
    await hbc.deployed();

    const mintTx = await hbc.mint(0x0000000000000001);
    await mintTx.wait();
    
    expect(hbc.mint(0x0000000000000001)).to.be.revertedWith("Token is already minted.");
  });

  it("Should NOT mint token with zero ID.", async function () {
    const HBC = await ethers.getContractFactory("HBC");
    const hbc = await HBC.deploy();
    await hbc.deployed();
    
    expect(hbc.mint(0x0000000000000000)).to.be.reverted;
  });

  it("Should NOT mint token with ID out of bounds.", async function () {
    const HBC = await ethers.getContractFactory("HBC");
    const hbc = await HBC.deploy();
    await hbc.deployed();
    
    expect(hbc.mint(0x0000000000005000)).to.be.revertedWith("Token ID is out of bounds.");
  });
});
