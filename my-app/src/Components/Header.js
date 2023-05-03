import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              Swap
            </button>
            <button className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              Pools
            </button>
          </div>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
