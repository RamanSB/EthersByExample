"use client";
import { useWallet } from "@/contexts/WalletContext";
import { Signer } from "ethers";
import { ethers } from "ethers";
import Image from "next/image";
import { MutableRefObject, useRef, useState } from "react";

export default function Signatures() {

    const PAGE_TITLE = "Signatures";
    const PAGE_DESCRIPTION = "We will discuss the different types of data that can be signed using our private keys and we will take a closer look at how we can align the code we write with EthersJS with Solidity.";
    const RELEVANT_EIPS = [191, 712];
    const MESSAGE_PREFIX = "\x19Ethereum Signed Message:\n";

    /*  const retrievePublicKey = async (message: string | undefined, signature: string | null) => {
         if (!(message && signature)) {
             throw new Error("Both message and signature are required, either one or both are missing.");
         }
 
         const publicKey = ethers.verifyMessage(message, signature);
         setPublicKey(publicKey);
         return publicKey;
     } */
    const { signer, address }: { signer: Signer | null, address: string | null } = useWallet();

    const signStructuredData = async () => {
        if (!signer) {
            return;
        }
        const domain = {
            name: 'VotingApp',
            version: '1',
            chainId: 8453,
            verifyingContract: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
        };

        const types = {
            Vote: [
                { name: 'voter', type: 'address' },
                { name: 'candidate', type: 'string' },
                { name: 'voteCount', type: 'uint256' }
            ]
        };

        const value = {
            voter: address,
            candidate: '0xNascosta',
            voteCount: 69
        };

        const signature = await signer.signTypedData(domain, types, value);

        // Verify signature
        const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);
        console.log("Recovered Address: ", recoveredAddress);
        console.log(recoveredAddress === address); // Should print true
    }

    return <main className="p-4">
        <div className="flex w-full flex-col">
            <h1 className="text-3xl font-bold">{PAGE_TITLE}</h1>
            <p className="text-sm my-2">Relevant EIPS: {RELEVANT_EIPS.map((eip: number, idx: number) => <a href={`https://eips.ethereum.org/EIPS/eip-${eip}`}>{eip},&nbsp;</a>)}</p>
            <p className="text-sm">{PAGE_DESCRIPTION}</p>
            <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl my-2">The sections beneath introduces pre-requisite knowledge such as converting strings to bytes and hashing the byte string, before delving in to explaining how we can sign different types of data ranging from: <b>Personal Sign Messages</b>, <b>Transactions</b> & <b>Typed Data.</b></p>

            <StringBytesAndHashing />
            <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl my-2">So we know about Strings, Bytes & Hashing - but what's a signature and why do we need signatures?<br /><br />A signature is a cryptographic mechanism used to verify the authenticity and integrity of data. When you sign data with your private key, you create a signature that others can use to ensure that the data has not been tampered with and that it indeed comes from you. This process is crucial for secure communications, ensuring that messages and transactions are genuine and have not been altered.<br /><br />A signature is 65 bytes and can be split in to 3 components, these components, along with the message hash can be used to recover the public key associated with the private key who signed the message.<br /><br />Think about all the time your MetaMask extension opens and prompts you to click Sign, do you know what your signing? A <b>personal sign message</b>? A <b>transaction</b>? Perhaps <b>typed data</b>? (What even is that).
                The following information involves knowledge of EIP-191 & EIP-712, when reading these standards I was extremely confused, I was also confused when learning about these EIPs from *Cyfrin Updrafts* advanced foundry course and it is what led me to build this resource today.

                <br /><br /><i>* - Signatures are created by signing data with your private key. The algorithm associated with this is known as ECDSA, I'm not going to delve in to this, but in essence it uses the <b>secp256k1</b> eliptical curve to produce 3 signature components known as <code>r, s & v</code></i></p>
            <PersonalSignMessages />
            <div className="collapse bg-base-300 my-2">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">Typed Structured Data & EIP-712</div>
                <div className="collapse-content">
                    <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl">Notice how the data is presented in structured manner when attempting to sign typed structured data, which makes it more readable This is what EIP-712 has proposed; A mechanism for hashing and signing (typed structured) data opposed to bytestrings.</p>
                    <button className="btn btn-primary my-2" onClick={() => { signStructuredData() }}>Sign Typed Structured Data</button>
                    <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl">EIP-712 is compliant with EIP-191.<br />
                        Version Byte: 0x01<br />
                        Version Specific Data: 32-byte domain separator<br />
                        Data To Sign: 32-byte <code>hashStruct(message)</code>
                    </p>
                </div>
            </div>
        </div>
    </main >
}

const InfoSvgIcon = () => {
    return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>);
}

const StringBytesAndHashing = () => {
    return <div className="collapse bg-base-300 my-2">
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
}

const PersonalSignMessages = () => {
    const { signer } = useWallet();
    const messageRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const [signedMessage, setSignedMessage] = useState<string | null>(null);


    const signMessage = async (message: string | undefined, setState: Function): Promise<string> => {
        if (!signer) {
            throw new Error("No signer is available, please connect your wallet.");
        }
        if (!message) {
            throw new Error("Invalid message: ", message as any);
        }

        console.log("Signing: ", message)
        const signature = await signer.signMessage(message);
        if (signature) {
            setState(signature);
        }
        console.log(`Signature: ${signature}`);
        return signature;
    }

    return (<div className="collapse bg-base-300 my-2">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">Personal Sign Messages & EIP-191</div>
        <div className="collapse-content">
            <h2 className="my-2 font-bold">EIP-191</h2>
            <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl">EIP-191 Proposes a Standard for signed data. Simply put, it introduces a format that we must adhere to when signing data. The standard is<br /><br /><code>{`0x19 <1 byte version> <version specific data> <data-to-sign>`}</code><br /><br /></p>
            <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl">Prior to EIP-191, signatures could be susceptible to ‘Replay Attacks’. If you had a signed transaction from a particular user, you could resubmit this to the network, resulting in a transaction being processed without the user’s explicit consent again. EIP-191 provides context to the data being signed, ensuring that the signed data is bound to a specific context and preventing it from being misused in different contexts.
                <br /><br />
                0x19: A prefix chosen to create a distinct and recognizable format for EIP-191 signed data.
                <br />
                1 byte version: Denotes the type of data we are signing. EIP-191 introduces 0x00 (Signing any data that is intended for a validator) & 0x45 (Signing a message).
                <br />
                We will cover the version specific data and data to sign below.
            </p>
            <h2 className="font-bold mt-4 mb-2">Personal Sign Messages (0x45)</h2>


            <div className="flex flex-row">
                <div className="max-w-screen-lg">
                    <p className="text-sm break-words whitespace-pre-wrap max-w-screen-xl">The first type of message we will examine is the 'personal_sign' message. This is simply a human-readable, plaintext message for the purposes of authentication or agreement to terms. Suppose we sign the plaintext in the image (right); someone could take our signature and create another message, let's say a transaction, and then submit that transaction and provide our signature. If the signature verification service solely checks if the signature corresponds to my public key, then funds could be drained from my account.<br /> <br />By introducing a format for signing `personal_sign` messages, we can ensure that the signature we provide is for a specific context only, preventing it from being misused. Now that we understand what a `personal_sign` message is and how it could be misused, we realize the importance of context in signatures.<br /><br />EIP-191 introduces a standard format for `personal_sign` messages, which includes a 1-byte version identifier, 0x45, to specify the type of message. The standardized format for `personal_sign` messages as defined by EIP-191 is:
                        <br /><br />
                        <mark>`0x19 0x45 (E)thereum Signed Message:\n + len(message) {`<data to sign>`}`</mark>
                        <br /><br />
                        This format ensures that the signature is tied to the specific context of the message, making it clear that the signature is intended for a human-readable message and not for other purposes like transactions. By including the prefix `0x19` and version byte `0x45`, along with the message length, EIP-191 ensures that signatures are uniquely bound to their intended context, enhancing security and preventing misuse.</p>
                </div>
                <Image src="/example-mm-message-prompt-signature.jpeg" alt="Example of personal_sign message" height={200} width={200} />
            </div>
            <h2 className="font-bold mt-4 mb-2">Playground</h2>
            <div className="inline-flex">
                <input type="text" placeholder="Type text to sign, i.e. Hello World" className="input input-bordered w-72" ref={messageRef} />
                <button className="btn btn-primary ml-2" onClick={() => { signMessage(messageRef.current?.value, setSignedMessage) }}>Sign</button>
            </div>

            {signedMessage && <div className="my-2 text-sm">
                Signature: {signedMessage}
                <p className="break-words whitespace-pre-wrap max-w-screen-xl my-2">In order to get the above signature we didn't just hash the text "Hello World" and sign it, we actually formatted the data we want to sign with the format stated in EIP-191, we actually hashed as the Solidity function below states.
                    <Image className="my-2" src="/solidity-hashPersonalSignMessage.png" alt="" width={700} height={400} />
                    Recall from the pre-requisite section when we used <code>ethers.hashMessage("Hello World"),</code> the output of applying sha256 or keccak256 to "Hello World" was different to applying hashMessage. From the above function you can see we are hashing more data in addition to just the byte string, we are including data outlined in the format provided by EIP-191 for personal_sign messages.<br />
                    <br />
                    Executing the test below in Solidity should yield a hash that matches that from <code>ethers.hashMessage("Hello World")</code> (scroll up to view)
                    <Image className="my-2" src="/solidity-hash-example-test.png" alt="" width={700} height={400} />
                </p>
            </div>}
        </div>
    </div>)
}