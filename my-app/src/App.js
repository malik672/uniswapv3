import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import swapRouterAbi from "./Components/abi.json";
import Web3 from "web3";
import { ethers } from "ethers";

// Replace CONTRACT_ADDRESS with the actual address of your contract
const SWAP_ROUTER_CONTRACT_ADDRESS =
  "0xE4A5B49cdcfd0d666d20617aC791D402779444a3";

function App() {
  // State variables for user input
  const [inputToken, setInputToken] = useState("");
  const [outputToken, setOutputToken] = useState("");
  const [inputAmount, setInputAmount] = useState(0);
  const [outputAmount, setOutputAmount] = useState(0);

  // Function to handle token swap
  const handleSwap = async () => {
    // Connect to provider (e.g. Metamask)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();

    // Create signer and contract instances
    const signer = provider.getSigner();
    const swapRouter = new ethers.Contract(
      SWAP_ROUTER_CONTRACT_ADDRESS,
      swapRouterAbi,
      signer
    );

    // Convert input amount to wei
    const inputAmountWei = ethers.utils.parseEther(inputAmount.toString());

    // Set transaction options
    const options = { gasPrice: ethers.utils.parseUnits("30", "gwei") };

    // Get token addresses
    const inputTokenAddress = inputToken.toLowerCase();
    const outputTokenAddress = outputToken.toLowerCase();

    // Get token info
    const inputTokenInfo = await swapRouter.getTokenInfo(inputTokenAddress);
    const outputTokenInfo = await swapRouter.getTokenInfo(outputTokenAddress);

    // Calculate min output amount based on slippage tolerance
    const slippageTolerance = ethers.utils.parseUnits("1", "basis points"); // 1 basis point = 0.01%
    const minOutputAmount = outputAmount.sub(
      outputAmount
        .mul(slippageTolerance)
        .div(ethers.utils.parseUnits("10000", "basis points"))
    );

    // Swap tokens
    const tx = await swapRouter.exactInputSingle({
      tokenIn: inputTokenAddress,
      tokenOut: outputTokenAddress,
      amountIn: inputAmountWei,
      amountOutMinimum: minOutputAmount,
      deadline: Math.floor(Date.now() / 1000) + 300, // 5 minute deadline
      recipient: ethers.constants.AddressZero,
      feeOnTransfer: false,
      ...options,
    });

    // Wait for transaction confirmation
    await tx.wait();

    // Reset input fields
    setInputToken("");
    setOutputToken("");
    setInputAmount(0);
    setOutputAmount(0);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          Uniswap V3 Token Swapper
        </h1>
        <div className="flex mb-4">
          <div className="flex-1 mr-2">
            <label htmlFor="inputToken" className="block font-medium text-gray-700">
              Input Token
            </label>
            <input
              type="text"
              id="inputToken"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div className="flex-1 ml-2">
            <label htmlFor="outputToken" className="block font-medium text-gray-700">
              Output Token
            </label>
            <input
              type="text"
              id="outputToken"
              value={outputToken}
              onChange={(e) => setOutputToken(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className="flex mb-4">
          <div className="flex-1 mr-2">
            <label htmlFor="inputAmount" className="block font-medium text-gray-700">
              Input Amount
            </label>
            <input
              type="number"
              id="inputAmount"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div className="flex-1 ml-2">
            <label htmlFor="outputAmount" className="block font-medium text-gray-700">
              Output Amount
            </label>
            <input
              type="number"
              id="outputAmount"
              value={outputAmount}
              onChange={(e) => setOutputAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className="flex justify-center border-b-2 mb-4">
          <div className="w-1/2"></div>
        </div>
        <div className="text-center">
          <button
            onClick={handleSwap}
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
          >
            Swap Tokens
          </button>
        </div>
      </div>
    </div>
  );
  
}

export default App;
