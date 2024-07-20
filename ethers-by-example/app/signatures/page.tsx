"use client";
import { MutableRefObject, useRef, useState } from "react"
import Image from "next/image";
import { Signature, ethers, hashMessage, toUtf8Bytes } from "ethers";
import { useWallet } from "@/contexts/WalletContext";

export default function Signatures() {

    const PAGE_TITLE = "Signatures";
    const PAGE_DESCRIPTION = "We will discuss the different types of data that can be signed using our private keys and we will take a closer look at how we can align the code we write with EthersJS with Solidity.";
    const RELEVANT_EIPS = [191, 712];

    const MESSAGE_PREFIX = "\x19Ethereum Signed Message:\n";

    const { signer } = useWallet();
    const [signedMessageA, setSignedMessageA] = useState<string | null>(null);
    const [signedMessageB, setSignedMessageB] = useState<string | null>(null);
    const [signatureComponents, setSignatureComponents] = useState({ r: "", s: "", v: 0 });
    const [publicKey, setPublicKey] = useState<string | null>();
    const messageRefA: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const messageRefB: MutableRefObject<HTMLInputElement | null> = useRef(null);


    const signMessage = async (message: string | undefined, setSignedMessageState: Function): Promise<void> => {
        if (!signer) {
            throw new Error("No signer is available, please connect your wallet.");
        }
        if (!message) {
            throw new Error("Invalid message: ", message as any);
        }

        const messageBytes: Uint8Array = ethers.toUtf8Bytes(message);
        const bytesAsHex: string = ethers.hexlify(messageBytes);

        console.log("Message Bytes: ", messageBytes);
        console.log("Hex of messageByte: ", bytesAsHex);

        const messageWithHash = ethers.keccak256(messageBytes);
        console.log(messageWithHash);

        const hashedMessageViaHashMessage = ethers.hashMessage(message);
        console.log(`Hashed message via ethers.hashMessage(): ${hashedMessageViaHashMessage}`);


    }

    const retrievePublicKey = async (message: string | undefined, signature: string | null) => {
        if (!(message && signature)) {
            throw new Error("Both message and signature are required, either one or both are missing.");
        }

        const publicKey = ethers.verifyMessage(message, signature);
        setPublicKey(publicKey);
        return publicKey;
    }

    return <main className="p-4">
        <div className="flex w-full flex-col">
            <h1 className="text-3xl font-bold">{PAGE_TITLE}</h1>
            <p className="text-sm my-2">Relevant EIPS: {RELEVANT_EIPS.map((eip: number, idx: number) => <a href={`https://eips.ethereum.org/EIPS/eip-${eip}`}>{eip},&nbsp;</a>)}</p>
            <p className="text-sm">{PAGE_DESCRIPTION}</p>
            <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl my-2">The sections beneath introduces pre-requisite knowledge such as converting strings to bytes and hashing the digest, before delving in to explaining how we can sign different types of data ranging from: <b>Messages</b>, <b>Transactions</b> & <b>Typed  Data.</b></p>

            <div className="collapse bg-base-300 my-2">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">Introduction to Strings, Bytes & Hashing</div>
                <div className="collapse-content">
                    <h2 className="font-bold mb-2">Strings</h2>
                    <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl">"Hello World" is a string, but computers only understand bits (0s and 1s), so how do we represent a string in terms of bits? <b>Encoding.</b></p>
                    <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl">Simply, encoding involves mapping each possible character that can appear in a string to a numerical value and that numerical value is converted to it's binary representation. <br /><br />The most common forms encoding are ASCII & UTF8. Consider UTF8 to be a more superior encoding that can represent a vast set of characters and ASCII to only represent up to 128 characters.<br /><br />Consider the letter 'H', in both UTF8 & ASCII this is represented with the numerical value 72. In it's binary form it is 01001000.<br />The string " Hello World" can be represented as such: <code className="text-red-500">72, 101, 108, 108, 111,  32,  87, 111, 114, 108, 100</code> (Check for yourself, look it up on a Unicode or ASCII Encoding Table)</p>
                    <h2 className="font-bold my-4">Bytes</h2>
                    <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl">A <b>byte</b> is 8 bits. A bit is either a 0 or 1.</p>
                    <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl">Converting all of the numerical values that we use to represent "Hello World" in to their binary form would result in: <br /><code>01001000 01100101 01101100 01101100 01101111 <b>00100000</b> 01010111 01101111 01110010 01101100 01100100</code><br />The binary representation for each character in the string is displayed in it's 8-bit form aka byte. You can see now that strings can be represented as an array of bytes.</p>
                    <h2 className="my-2 font-bold">Javascript</h2>
                    <Image src="/js-stringsAsByteArray.png" alt="Representing strings as byte arrays" width={800} height={500} />
                    <p className="text-sm my-2">Pay close attention to the hex representation in the final line of the JS code.</p>
                    <h2 className="my-2 font-bold">Solidity</h2>
                    <Image src="/solidity-convertStringToBytes.png" alt="Representing strings as byte arrays" width={800} height={500} />
                    <p className="my-2 text-sm break-words whitespace-pre-wrap max-w-screen-xl">Notice the difference between abi.encode and abi.encodePacked, I will not go through the details now, but understand the latter returns the hex-representation of the string we have converted to in byte form, whereas the former provides additional metadata (offset, length of data & data).</p>
                    <h2 className="font-bold my-4">Hashing</h2>
                    <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl">Hashing is acheived by using a hash function. Examples of these are SHA-256, Keccak-256. A hash function simply takes an input and returns an output known as a hash (hashing). It is practically impossible to take a hash and produce the input provided to the hash function.<br />Don't believe me? I've created this hash (<code>0x5214288fb60c622910856012890e902b9b878a665856fd8bebaa384a87998427</code>) using keccak256, <a href="https://www.x.com/0xNascosta">@me on X</a> if you figure out the input provided.<br /><br />When hashing data, we typically hash the <b>byte array</b> representation of our data. I believe this is because Hash Functions are intended to work with bytes, although some may work directly with strings (more on this below).</p>
                    <h2 className="my-2 font-bold">Javascript</h2>
                    <p className="text-sm my-2">I mentioned above that we typically hash bytes, you can see the the 1st line below throws an error as it expects either a <code>Uint8Array</code> or a <code>DataHexString</code>.</p>
                    <Image src="/js-hashing.png" alt="Hashing data using EthersJS" width={1000} height={300} />
                    <p className="text-sm my-2">Think about why <code>hashMessage</code> produces a different hash? Perhaps we aren't hashing exactly what we intended to hash. We will discuss this in the next section.</p>
                    <h2 className="my-2 font-bold">Solidity</h2>
                    <p className="my-2 text-sm break-words whitespace-pre-wrap max-w-screen-xl">In Solidity, <code>bytes</code> represents a dynamic sized byte array. This makes perfect sense when you realise that strings can be represented as byte arrays.<br />It is imperative to note that hashing the output from <code>abi.encode</code> differs to <code>abi.encodePacked</code>, it makes sense when you realise the byte array representation of the output of the two are also different.< br />
                    </p>
                    <Image src="/solidity-hashing.png" alt="Hashing data in Solidity" width={800} height={500} />
                    <p className="my-2 text-sm break-words whitespace-pre-wrap max-w-screen-xl" >A point to recall is that I mentioned hash functions typically work with bytes (in the case of ethers, it requires a BytesLike object) however in Solidity we also expect the input to the hash function to be of type <code>bytes</code>. You may suspect that I'm violating that rule by providing "Hello World" as a hard-coded string, however Solidity at compile time is implicitly converting that hard-coded string in to bytes. Think about why I'm not passing the <code>word</code> parameter to last <code>keccak256</code> function.</p>
                </div>
            </div>
            <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl my-2">So we know about Strings, Bytes & Hashing - but what's a signature and why do we need signatures?<br /><br />A signature is a cryptographic mechanism used to verify the authenticity and integrity of data. When you sign data with your private key, you create a signature that others can use to ensure that the data has not been tampered with and that it indeed comes from you. This process is crucial for secure communications, ensuring that messages and transactions are genuine and have not been altered.<br /><br />Think about all the time your MetaMask extension opens and prompts you to click Sign, do you know what your signing? A <b>message</b>? A <b>transaction</b>? Perhaps <b>typed data</b>? (What even is that).
                The following information involves knowledge of EIP-191 & EIP-712, when reading these standards I was extremely confused, I was also confused when learning about these EIPs from *Cyfrin Updrafts* advanced foundry course and it is what led me to build this resource today.

                <br /><br /><i>* - Signatures are created by signing data with your private key. The algorithm associated with this is known as ECDSA, I'm not going to delve in to this, but in essence it uses the <b>secp256k1</b> eliptical curve to produce 3 signature components known as <code>r, s & v</code></i></p>
            <div className="collapse bg-base-300 my-2">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">Signing Messages & EIP-191</div>
                <div className="collapse-content">
                    <h2 className="font-bold mb-2">Signing</h2>
                    <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl">"Hello World" is a string, but computers only understand bits (0s and 1s), so how do we represent a string in terms of bits? <b>Encoding.</b></p>

                </div>
            </div>
        </div>
    </main>
}

const InfoSvgIcon = () => {
    return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>);
}