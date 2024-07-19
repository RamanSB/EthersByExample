"use client";

import { useWallet } from "@/contexts/WalletContext";

const Navbar = () => {

    const { connectWallet, address } = useWallet();

    return <div className="navbar bg-base-200">
        <div className="flex-none">
            <button className="btn btn-square btn-ghost">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-5 w-5 stroke-current">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
        <div className="flex-1">
            <a className="btn btn-ghost text-xl">Ethers By Example</a>
        </div>
        <div className="flex-none">
            <button className="btn bg-gray-300" onClick={() => { connectWallet() }}>{address ? `Connected ${address.substring(0, 4)}...${address.substring(address.length - 2)}` : "Connect Wallet"}</button>
        </div>
    </div>
}

export default Navbar;