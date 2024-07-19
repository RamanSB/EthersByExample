"use client";
import { MutableRefObject, useRef, useState } from "react"
import { Signature, ethers, toUtf8Bytes } from "ethers";
import { useWallet } from "@/contexts/WalletContext";

export default function Signatures() {

    const { signer } = useWallet();
    const [signedMessage, setSignedMessage] = useState<string | null>(null);
    const [signatureComponents, setSignatureComponents] = useState({ r: "", s: "", v: 0 });
    const [publicKey, setPublicKey] = useState<string | null>();
    const messageRef: MutableRefObject<HTMLInputElement | null> = useRef(null);



    const signMessage = async (): Promise<void> => {
        const message = messageRef.current?.value;
        if (!signer) {
            throw new Error("No signer is available, please connect your wallet.");
        }
        if (!message) {
            throw new Error("Invalid message: ", message as any);
        }
        const signedMessage: string = await signer.signMessage(message); // Signature.
        console.log(`Signing: ${message}`);
        console.log(`Signed: ${signedMessage}`);
        if (signedMessage) {
            setSignedMessage(signedMessage);
        }
        const signature: Signature = ethers.Signature.from(signedMessage);
        const { r, s, v } = signature;
        setSignatureComponents({ r, s, v });
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
            <div className="card bg-blue-200 rounded-box flex flex-column justify-center p-4">
                <h3 className="text-xl font-bold">Signing a Message</h3>
                <p className="my-2">We demonstrate how to sign a message and also recover the public key associated with the signature. <br />Please enter a message to sign below.</p>
                <div className="inline-flex">
                    <input type="text" placeholder="Enter a message" className="input input-bordered w-full max-w-xs" ref={messageRef} />
                    <button className="btn bg-base-300 ml-1" onClick={() => signMessage()} >Sign</button>
                </div>
                {signedMessage && (
                    <>
                        <div className="mockup-code my-4">
                            <pre data-prefix="$"><code>Using your private key to sign: {messageRef.current?.value}</code></pre>
                            <pre data-prefix=">" className="text-warning whitespace-pre-wrap break-words"><code>Signature: {signedMessage}</code></pre>
                            <pre data-prefix=">" className="text-warning whitespace-pre-wrap break-words"><code>Signature components<br />r: {signatureComponents.r}<br />s: {signatureComponents.s}<br />v: {signatureComponents.v}</code></pre>

                        </div>
                    </>
                )}
                <div className="collapse bg-base-200 mt-2">
                    <input type="checkbox" />
                    <div className="collapse-title inline-flex"><InfoSvgIcon /> <p className="text-md font-medium ml-2">How does this work?</p></div>
                    <div className="collapse-content">
                        <ul>
                            <ul>
                                <li>1) Text is encoded as UTF-8, converting it into a <code>Uint8Array</code> of bytes.{messageRef.current && <><br /><code className="text-red-500">Byte Array: [{toUtf8Bytes(messageRef.current.value).join(", ")}]</code></>}</li>
                                <li>2) The byte array is hashed using SHA-256 or Keccak-256 to produce a digest.{messageRef.current && <><br /><code className="text-red-500">Hashed Message: {ethers.sha256(toUtf8Bytes(messageRef.current.value))}</code></>}</li>
                                <li>3) The digest is signed using the private key with ECDSA on the secp256k1 curve.</li>
                                <li>4) The signing operation produces the signature components r, s, and v.</li>
                            </ul>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="divider" />


            <div className="card bg-blue-200 rounded-box flex flex-column justify-center p-4">
                <h3 className="text-xl font-bold">Verifying a Message</h3>
                <p className="my-2"> Once we have a signature we can verify who had signed a particular message by identifying their public key, this allows us to be certain that a particular wallet, public-key or entity signed a message. <br /> All we require is the original message and the signature.</p>
                <div className="inline-flex my-2">
                    <input type="text" placeholder="Enter a message" className="input input-bordered w-full max-w-xs" ref={messageRef} />
                    <button className="btn bg-base-300 ml-1" onClick={() => signMessage()} >Sign</button>
                </div>
                <div className="inline-flex">
                    <input type="text" placeholder="Signature will appear here" className="input input-bordered w-full max-w-xs" value={signedMessage || ""} disabled />
                    <button className="btn bg-base-300 ml-1" onClick={() => retrievePublicKey(messageRef.current?.value, signedMessage)}>Verify</button>
                </div>
                {publicKey && <div className="mt-2 inline-flex">
                    <p className="text-md">Public Key:{" "}<code className="text-red-600">{publicKey}</code></p>
                </div>}
            </div>
        </div>
    </main>
}

const InfoSvgIcon = () => {
    return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>);
}