"use client";
import { WalletProvider } from "@/contexts/WalletContext";
import { PropsWithChildren } from "react";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
    return <WalletProvider>{children}</WalletProvider>
}

export default Providers;