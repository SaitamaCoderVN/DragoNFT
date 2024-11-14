"use client";

import { nftAbi } from "@/components/contract/abi";
import { BLOCK_EXPLORER_OPAL, BLOCK_EXPLORER_QUARTZ, BLOCK_EXPLORER_UNIQUE, CHAINID, CONTRACT_ADDRESS_OPAL, CONTRACT_ADDRESS_QUARTZ, CONTRACT_ADDRESS_UNIQUE } from "@/components/contract/contracts";
import { CustomConnectButton } from "@/components/ui/ConnectButton";
import Spacer from "@/components/ui/Spacer";
import Link from "next/link";
import { useState } from 'react';
import {
    type BaseError,
    useWaitForTransactionReceipt,
    useWriteContract,
    useChainId,
    useAccount,
} from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { config } from "@/components/contract/config";

function UpgradePage() {
    const [uri, setUri] = useState('');
    const [codeContribute, setCodeContribute] = useState('');
    const [levelFrom, setLevelFrom] = useState<number>(0);
    const [levelTo, setLevelTo] = useState<number>(0);
    const [tokenId, setTokenId] = useState<number>(0);
    
    const { toast } = useToast();
    const chainId = useChainId();
    const account = useAccount();
    let contractAddress: `0x${string}` | undefined;
    let blockexplorer: string | undefined;

    switch (chainId) {
        case CHAINID.UNIQUE:
            contractAddress = CONTRACT_ADDRESS_UNIQUE;
            blockexplorer = BLOCK_EXPLORER_UNIQUE;
            break;
        case CHAINID.QUARTZ:
            contractAddress = CONTRACT_ADDRESS_QUARTZ;
            blockexplorer = BLOCK_EXPLORER_QUARTZ;
            break;
        case CHAINID.OPAL:
            contractAddress = CONTRACT_ADDRESS_OPAL;
            blockexplorer = BLOCK_EXPLORER_OPAL;
            break;
    }

    const { data: hash, error, isPending, writeContract } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!contractAddress) {
            toast({
                variant: "destructive",
                title: "Network Error",
                description: "Please select a supported network",
            });
            return;
        }
        
        try {
            await writeContract({
                address: contractAddress,
                abi: nftAbi,
                functionName: "upgradeNFTLevel",
                args: [BigInt(tokenId), BigInt(levelTo)],
                chain: config[chainId],
                account: account.address as `0x${string}`,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Transaction Cancelled",
                description: `${(error as BaseError).shortMessage || "An unknown error occurred"}`,
            });
        }
    };

    return (
        <>
            <div className='v11e5678D'></div>
            <div className='background-container min-h-[100vh] border-2 border-solid border-primary rounded-[20px] bg-background overflow-hidden bg-custom-bg bg-custom-pos bg-custom-size bg-custom-repeat bg-custom-attachment'>
                <Spacer size='3vw'/>
                <div className='flex justify-between items-center px-[3vw]'>
                    <div className='flex items-center'>
                        <Link href="/" className='text-primary mr-4 text-xl font-silkscreen'>
                            Home /
                        </Link>
                        <Link href="/admin" className='text-primary mr-4 text-xl font-silkscreen'>
                            Admin /
                        </Link>
                        <div className='text-primary font-bold font-pixel uppercase text-[5.5vw] leading-[5.5vw] whitespace-nowrap'>
                            Upgrade NFT
                        </div>
                    </div>
                    
                    <div className='connect-btn text-primary flex flex-row items-center space-x-4'>
                        <CustomConnectButton />
                    </div>
                </div>

                <div className="w-full mt-10">
                    

                    <div className="bg-secondary-background p-8 rounded-lg max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="tokenId" className="block text-lg font-medium text-gray-300 mb-2">
                                    Token ID
                                </label>
                                <input
                                    type="number"
                                    id="tokenId"
                                    placeholder="Enter token ID"
                                    className="w-full px-4 py-2 bg-background text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                    value={tokenId}
                                    onChange={(e) => setTokenId(parseInt(e.target.value, 10))}
                                />
                            </div>

                            <div>
                                <label htmlFor="levelTo" className="block text-lg font-medium text-gray-300 mb-2">
                                    Level To
                                </label>
                                <input
                                    type="number"
                                    id="levelTo"
                                    placeholder="Enter ending level"
                                    className="w-full px-4 py-2 bg-background text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                    value={levelTo}
                                    onChange={(e) => setLevelTo(parseInt(e.target.value, 10))}
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-black text-[#3f3c40] font-bold py-2 px-4 rounded-md hover:text-[#c7c1c9] transition duration-300"
                                >
                                    Upgrade NFT
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 bg-secondary p-6 rounded-lg max-w-2xl mx-auto">
                        <h3 className="text-xl font-semibold text-white mb-4">Transaction Status</h3>
                        {isPending && <p className="text-yellow-300">Waiting for signature...</p>}
                        {isConfirming && <p className="text-yellow-300">Confirming...</p>}
                        {isConfirmed && (
                            <p className="text-green-300">
                                Transaction successful!{' '}
                                <a
                                    href={`${blockexplorer}/tx/${hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    View on block explorer
                                </a>
                            </p>
                        )}
                        {error && (
                            <p className="text-red-300">
                                Error: {(error as BaseError).shortMessage || "An unknown error occurred"}
                            </p>
                        )}
                        {!isPending && !isConfirming && !isConfirmed && !error && (
                            <p className="text-gray-300">No transactions yet</p>
                        )}
                    </div>
                </div>
                <Spacer size='3vw'/>

            </div>
        </>
    );
}

export default UpgradePage;