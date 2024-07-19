import dotenv from "dotenv";
import { Provider, Wallet, ethers, toUtf8Bytes } from "ethers";

dotenv.config();

/**
 * This method demonstrates how we can sign messages in ethereum using our private key
 * and from the signed message we demonstrate how to recover the public key.
 * 
 * @notice This behaviour can be recreated in Solidity using the precompile 'ecrecover' passing the
 * signature components, v, r, s & the signed digest as args.
 * 
 * @param message - message to be signed.
 * @returns signed string
 */
const signMessage = async (message: string = "Hello Ethers"): Promise<string | undefined> => {

    const identifySignerPublicKey = (signature: string): string => {
        console.log("Recovering public key from signature: ", signature);
        const publicKey = ethers.verifyMessage(message, signature);
        console.log(`Public Key: `, publicKey);
        return publicKey;
    }

    try {
        const defaultProvider: Provider = ethers.getDefaultProvider();
        const wallet: Wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, defaultProvider);
        console.log("Signing message: ", message); ``
        const messageByteArray: Uint8Array = toUtf8Bytes(message);
        console.log("Message bytes:", messageByteArray);
        const signedString = await wallet.signMessage(message);
        console.log("Signed message: ", signedString);
        identifySignerPublicKey(signedString);
        return signedString;
    } catch (error) {
        console.log("Error: ", error);
    }
}


signMessage();