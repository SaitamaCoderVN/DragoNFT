"use client";

import { nftAbi } from "@/components/contract/abi";
import { BLOCK_EXPLORER_OPAL, BLOCK_EXPLORER_QUARTZ, BLOCK_EXPLORER_UNIQUE, CHAINID, CONTRACT_ADDRESS_OPAL, CONTRACT_ADDRESS_QUARTZ, CONTRACT_ADDRESS_UNIQUE } from "@/components/contract/contracts";
import { CustomConnectButton } from "@/components/ui/ConnectButton";
import Spacer from "@/components/ui/Spacer";
import Link from "next/link";
import { useState, useEffect } from 'react';
import {
    type BaseError,
    useChainId,
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt
} from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { readContract } from '@wagmi/core/actions'; // Import hàm readContract
import { isPending } from "@reduxjs/toolkit/react";
import { config } from "@/components/contract/config";

function AddIDDiscordPage() {
    const [discordId, setDiscordId] = useState('');
    const [currentDiscordId, setCurrentDiscordId] = useState<string | null>(null); // State để lưu ID Discord hiện tại

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

    useEffect(() => {
        const fetchDiscordId = async () => {
            if (!contractAddress || !account.address) return;

            try {
                const result = await readContract(config, {
                    abi: nftAbi,
                    address: contractAddress,
                    functionName: 'getDiscordId',
                    args: [],
                });
                setCurrentDiscordId(result as string);
            } catch (error) {
                console.error("Error fetching Discord ID:", error);
            }
        };

        fetchDiscordId();
    }, [account.address, contractAddress]);

    useEffect(() => {
        console.log("Current Discord ID:", currentDiscordId);
    }, [currentDiscordId]);

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
                functionName: "addOrUpdateDiscordId",
                args: [discordId],
                chain: config[chainId],
                account: account.address,
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
                        
                        <div className='text-primary font-bold font-pixel uppercase text-[5.5vw] leading-[5.5vw] whitespace-nowrap'>
                            ADD ID DISCORD 
                        </div>
                    </div>
                    
                    <div className='connect-btn text-primary flex flex-row items-center space-x-4'>
                        <CustomConnectButton />
                    </div>
                </div>

                <div className="w-full mt-10">
                    <div className="bg-secondary-background p-8 rounded-lg max-w-2xl mx-auto">
                        {currentDiscordId && (
                            <div className="mb-4">
                                <p className="text-lg font-medium text-gray-300">Your current Discord ID: {currentDiscordId}</p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="discordId" className="block text-lg font-medium text-gray-300 mb-2">
                                    Discord ID
                                </label>
                                <input
                                    type="text"
                                    id="discordId"
                                    value={discordId}
                                    onChange={(e) => setDiscordId(e.target.value)}
                                    placeholder="Enter Discord ID"
                                    className="w-full px-4 py-2 bg-background text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-black text-[#3f3c40] font-bold py-2 px-4 rounded-md hover:text-[#c7c1c9] transition duration-300"
                                >
                                    Add Discord ID
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

export default AddIDDiscordPage;