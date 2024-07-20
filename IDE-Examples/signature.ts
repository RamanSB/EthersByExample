import dotenv from "dotenv";
import { Provider, Wallet, ethers, hexlify, keccak256, toUtf8Bytes } from "ethers";

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


// signMessage();

// Without Ethers
const exampleString: string = "Hello World";
const encoder = new TextEncoder(); // Uses UTF8 encoding (encoder.encoding) 
encoder.encode(exampleString); // Uint8Array(11) [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]
// Using ethers
const byteArray: Uint8Array = ethers.toUtf8Bytes(exampleString);
console.log(byteArray); // Uint8Array(11) [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]
const hexRepr = ethers.hexlify(byteArray); // 0x48656c6c6f20576f726c64



// Without Ethers

// With Ethers
// ethers.keccak256(exampleString); // Throws an error (expects arg to of types BytesLike = DataHexString | Uint8Array)
ethers.keccak256(byteArray); // 0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba
ethers.keccak256(hexRepr); // 0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba
ethers.solidityPackedKeccak256(["string"], [exampleString]); // 0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba
ethers.hashMessage(exampleString); // 0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2 <- Can you guess why this is different?

