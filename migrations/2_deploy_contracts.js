const UniswapV2Router02Contract = artifacts.require("UniswapV2Router02Contract");

module.exports = async function (deployer) {

    await deployer.deploy(UniswapV2Router02Contract, '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
    const _UniswapV2Router02Contract = await UniswapV2Router02Contract.deployed();

};