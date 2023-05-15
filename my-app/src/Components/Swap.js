import React, { useState } from "react";
import swapRouterAbi from "./abi.json";
import erc20Abi from "./erc20.json";
import Web3 from "web3";
import { ethers } from "ethers";
const UNISWAP = require("@uniswap/sdk");
const {
  Token,
  WETH,
  Fetcher,
  Route,
  Trade,
  TokenAmount,
  TradeType,
  Percent,
} = require("@uniswap/sdk");

// Replace CONTRACT_ADDRESS with the actual address of your contract
const SWAP_ROUTER_CONTRACT_ADDRESS =
  "0x4188C9093D88A02d04c475D7224c31eD30df52ce";

function Swap() {
  // State variables for user input
  const [inputToken, setInputToken] = useState("");
  const [poolAddress, setPoolAddress] = useState("");
  const [outputToken, setOutputToken] = useState("");
  const [inputAmount, setInputAmount] = useState(0);
  const [outputAmount, setOutputAmount] = useState(0);

  // Function to handle token swap
  const handleSwap = async () => {
    // Connect to provider (e.g. Metamask)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();
    const slippage = 1;
    // Create signer and contract instances
    const signer = provider.getSigner();
    const swapRouter = new ethers.Contract(
      SWAP_ROUTER_CONTRACT_ADDRESS,
      swapRouterAbi,
      signer
    );

    // // Calculate amounts
    const amountsIn = ethers.utils.parseUnits(inputAmount.toString(), 18);
    const minAmountOut = amountsIn.sub(amountsIn.mul(slippage).div(100));

    // Get current user address
    const userAddress = await signer.getAddress();

    const tokenInContract = new ethers.Contract(inputToken, erc20Abi, signer);
    const allowance = await tokenInContract.allowance(
      userAddress,
      SWAP_ROUTER_CONTRACT_ADDRESS
    );
    if (allowance.lt(amountsIn)) {
      const approveTx = await tokenInContract.approve(
        SWAP_ROUTER_CONTRACT_ADDRESS,
        amountsIn
      );
      await approveTx.wait();
    }

    // Perform swap
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
    const swapTx = await swapRouter.swapExactTokensForTokens(
      amountsIn,
      minAmountOut,
      [inputToken, outputToken],
      userAddress
    );
    await swapTx.wait();

    console.log(swapRouter);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
    <h2 className="text-2xl font-medium mb-4">Mint Position</h2>

    <div className="mb-4">
      <label
        htmlFor="token1Amount"
        className="text-gray-700 font-medium mb-2 block"
      >
        Pool's Address
      </label>
      <input
        type="text"
        id="token1Address"
        className="w-full border border-gray-400 p-2 rounded-lg"
        onChange={(e) => setPoolAddress(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label
        htmlFor="token1Amount"
        className="text-gray-700 font-medium mb-2 block"
      >
        Token 1 Address:
      </label>
      <input
        type="text"
        id="token1Address"
        className="w-full border border-gray-400 p-2 rounded-lg"
        onChange={(e) => setTokenA(e.target.value)}
      />
      <label
        htmlFor="token1Amount"
        className="text-gray-700 font-medium mt-4 mb-2 block"
      >
        Token 1 Amount:
      </label>
      <input
        type="number"
        id="token1Amount"
        className="w-full border border-gray-400 p-2 rounded-lg"
        onChange={(e) => setAmount0Desired(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label
        htmlFor="token2Amount"
        className="text-gray-700 font-medium mb-2 block"
      >
        Token 2 Address:
      </label>
      <input
        type="text"
        id="token2Address"
        className="w-full border border-gray-400 p-2 rounded-lg"
        onChange={(e) => setTokenB(e.target.value)}
      />
      <label
        htmlFor="token2Amount"
        className="text-gray-700 font-medium mt-4 mb-2 block"
      >
        Token 2 Amount:
      </label>
      <input
        type="number"
        id="token2Amount"
        className="w-full border border-gray-400 p-2 rounded-lg"
        onChange={(e) => setAmount1Desired(e.target.value)}
      />
    </div>
    <button
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
      onClick={(e) => main(e)}
    >
      Add Liquidity
    </button>
  </div>
  );
}

export default Swap;
