"use client";

import { nftAbi } from "@/components/contract/abi";
import { BLOCK_EXPLORER_OPAL, CHAINID, CONTRACT_ADDRESS_OPAL } from "@/components/contract/contracts";
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

function QuestPage() {
    const [uri, setUri] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [level, setLevel] = useState('');
    const [codeContribute, setCodeContribute] = useState<`0x${string}`>('0x0000000000000000000000000000000000000000000000000000000000000000');
    const [amount, setAmount] = useState('');
    const [token, setToken] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [recipientOrCode, setRecipientOrCode] = useState('');
    const [levelFrom, setLevelFrom] = useState('');
    const [levelTo, setLevelTo] = useState('');
    
    const { toast } = useToast();
    const chainId = useChainId();
    const account = useAccount();
    let contractAddress: `0x${string}` | undefined;
    let blockexplorer: string | undefined;

    switch (chainId) {
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
                functionName: "mint_DragonNFT",
                args: [
                    { 
                        eth: toAddress as `0x${string}`, 
                        sub: BigInt(0) 
                    }, 
                    codeContribute, 
                    Number(0), 
                    uri
                ],

                chain: config[chainId],
                account: toAddress as `0x${string}`,
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
            <Spacer className='h-[3vw] max-phonescreen:h-[4vw]' />

                <div className='flex justify-between items-center px-[3vw]'>
                    <div className='flex items-center'>
                        <Link href="/" className='text-primary mr-4 text-xl font-silkscreen'>
                            Home /
                        </Link>
                        
                        <div className='text-primary font-bold font-pixel uppercase text-[5.5vw] leading-[5.5vw] whitespace-nowrap'>
                            quest 
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
                                <label htmlFor="questType" className="block text-lg font-medium text-gray-300 mb-2">
                                    Quest Type
                                </label>
                                <select
                                    id="questType"
                                    className="w-full px-4 py-2 bg-background text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                    onChange={(e) => {
                                        const isAddressQuest = e.target.value === 'address';
                                        const levelFields = document.getElementById('levelFields');
                                        const recipientAddressContainer = document.getElementById('recipientAddressContainer');
                                        if (levelFields) {
                                            levelFields.style.display = isAddressQuest ? 'none' : 'block';
                                        }
                                        if (recipientAddressContainer) {
                                            recipientAddressContainer.style.display = isAddressQuest ? 'block' : 'none';
                                        }
                                    }}
                                >
                                    <option value="nft">Quest by NFT</option>
                                    <option value="address">Quest by Address</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="amount" className="block text-lg font-medium text-gray-300 mb-2">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    placeholder="Enter amount"
                                    className="w-full px-4 py-2 bg-background text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                />
                            </div>

                            <div>
                                <label htmlFor="token" className="block text-lg font-medium text-gray-300 mb-2">
                                    Token
                                </label>
                                <select
                                    id="token"
                                    className="w-full px-4 py-2 bg-background text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                    onChange={(e) => {
                                        const isNative = e.target.value === 'native';
                                        const tokenAddressContainer = document.getElementById('tokenAddressContainer');
                                        if (tokenAddressContainer) {
                                            tokenAddressContainer.style.display = isNative ? 'none' : 'block';
                                        }
                                    }}
                                >
                                    <option value="native">Native Token</option>
                                    <option value="address">Token Address</option>
                                </select>
                            </div>

                            <div id="tokenAddressContainer" style={{ display: 'none' }}>
                                <label htmlFor="tokenAddress" className="block text-lg font-medium text-gray-300 mb-2">
                                    Token Address (optional)
                                </label>
                                <input
                                    type="text"
                                    id="tokenAddress"
                                    placeholder="Enter token address"
                                    className="w-full px-4 py-2 bg-background text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                />
                            </div>

                            <div id="recipientAddressContainer" style={{ display: 'none' }}>
                                <label htmlFor="recipientOrCode" className="block text-lg font-medium text-gray-300 mb-2">
                                    Recipient Wallet Address
                                </label>
                                <input
                                    type="text"
                                    id="recipientOrCode"
                                    placeholder="Enter recipient address"
                                    className="w-full px-4 py-2 bg-background text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                />
                            </div>

                            <div id="levelFields">
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <label htmlFor="codeContribute" className="block text-lg font-medium text-gray-300 mb-2">
                                            Code Contribute
                                        </label>
                                        <input
                                            type="text"
                                            id="codeContribute"
                                            placeholder="Enter code contribute"
                                            className="w-full px-4 py-2 bg-background text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor="levelFrom" className="block text-lg font-medium text-gray-300 mb-2">
                                            Level From
                                        </label>
                                        <input
                                            type="number"
                                            id="levelFrom"
                                            placeholder="Enter starting level"
                                            className="w-full px-4 py-2 bg-background text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor="levelTo" className="block text-lg font-medium text-gray-300 mb-2">
                                            Level To
                                        </label>
                                        <input
                                            type="number"
                                            id="levelTo"
                                            placeholder="Enter ending level"
                                            className="w-full px-4 py-2 bg-background text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-black text-[#3f3c40] font-bold py-2 px-4 rounded-md hover:text-[#c7c1c9] transition duration-300"
                                >
                                    Mint SoulBound NFT
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
                <Spacer className='h-[3vw] max-phonescreen:h-[4vw]' />


            </div>
        </>
    );
}

export default QuestPage;