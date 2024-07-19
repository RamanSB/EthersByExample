import ethers, { BrowserProvider, JsonRpcSigner, Signer } from "ethers";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

interface WalletContextType {
    provider: ethers.Provider | null;
    signer: ethers.Signer | null;
    address: string | null;
    connectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [provider, setProvider] = useState<ethers.Provider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [address, setAddress] = useState<string | null>(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                console.log("eth_requestAccounts");
                console.log(typeof accounts);
                console.log(`Accounts: ${accounts}`);
                const provider: BrowserProvider = new BrowserProvider(window.ethereum);
                const signer: JsonRpcSigner = await provider.getSigner();
                setProvider(provider);
                setAddress(accounts);
                setSigner(signer);
                localStorage.setItem("isWalletConnected", "true");
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
            }
        } else {
            console.error("MetaMask is not installed.");
        }
    }

    useEffect(() => {
        const autoConnect = async () => {
            if (localStorage.getItem("isWalletConnected") === "true" && window.ethereum) {
                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                console.log("eth_accounts");
                console.log(typeof accounts);
                if (accounts.length > 0) {
                    const provider: BrowserProvider = new BrowserProvider(window.ethereum);
                    const signer: Signer = await provider.getSigner();
                    setProvider(provider);
                    setSigner(signer);
                    setAddress(accounts[0]);
                }
            }
        }
        autoConnect();
    }, [])


    return <WalletContext.Provider value={{ provider, signer, connectWallet, address }}>
        {children}
    </WalletContext.Provider>
}

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context == undefined) {
        throw new Error("useWallet must be used within a WalletProvider.");
    }
    return context;
}