"use client";
import { signIn } from "next-auth/react"; 
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
import { useSearchParams } from "next/navigation";

function AddIDDiscordPage() {
    const searchParams = useSearchParams();
    const [discordIdAuth, setDiscordIdAuth] = useState<string | null>(null); // State để lưu ID Discord đã xác thc

    const [currentDiscordId, setCurrentDiscordId] = useState<string | null>(null); // State để lưu ID Discord hiện tại

    const { toast } = useToast();
    const chainId = useChainId();
    const account = useAccount();
    let contractAddress: `0x${string}` | undefined;
    let blockexplorer: string | undefined;
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Thêm biến trạng thái để theo dõi xác thực

    const handleLogin = async () => {
        const clientId = '1306227974579949568'; // Replace with your Discord client ID
        const redirectUri = 'https://discord.com/oauth2/authorize?client_id=1306227974579949568&response_type=code&redirect_uri=https%3A%2F%2Fdragonft.org%2Fapi%2Fauth%2Fdiscord%2Fcallback&scope=identify'; // Replace with your redirect URI
        const scope = 'identify'; // Add any other scopes you need
        
        window.location.href = redirectUri; // Redirect to Discord OAuth2
        setIsAuthenticated(true); // Đánh dấu là đã xác thực
    };
    useEffect(() => {
        const discordId = searchParams.get('discordId'); // Get the discordId from the search parameters

        if (discordId) {
            setDiscordIdAuth(discordId); // Set the authenticated Discord ID
            console.log("discord Id", discordId); // Ghi log discordId
            setIsAuthenticated(true); // Đặt trạng thái xác thực thành true
        } else {
            console.warn("No discordId found in search parameters."); // Cảnh báo nếu không tìm thấy discordId
        }
    }, [searchParams]);

    useEffect(() => {
        if (isAuthenticated && discordIdAuth && currentDiscordId === null && account.address) {
            console.log("Submitting with discordIdAuth:", discordIdAuth); // Ghi log discordIdAuth trước khi gọi handleSubmit
            handleSubmit(); // Gọi handleSubmit chỉ khi đã xác thực, có discordIdAuth và ví đã được kết nối
        } else {
            console.warn("Conditions not met for handleSubmit:", { isAuthenticated, discordIdAuth, currentDiscordId, accountAddress: account.address }); // Cảnh báo nếu điều kiện không được thỏa mãn
        }
    }, [isAuthenticated, discordIdAuth, currentDiscordId, account.address]);

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
                console.log(account.address);
                const result = await readContract(config, {
                    abi: nftAbi,
                    address: contractAddress,
                    functionName: 'getDiscordId',
                    args: [account.address],
                });
                console.log("result", result);

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

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        if (!contractAddress) {
            toast({
                variant: "destructive",
                title: "Network Error",
                description: "Please select a supported network",
            });
            return;
        }

        // Kiểm tra xem ví đã được kết nối chưa
        if (!account.address) {
            toast({
                variant: "destructive",
                title: "Wallet Not Connected",
                description: "Please connect your wallet before proceeding.",
            });
            return;
        }

        try {
            console.log("Calling setDiscordId on contract:", contractAddress); // Ghi log địa chỉ hợp đồng
            await writeContract({
                address: contractAddress,
                abi: nftAbi,
                functionName: "setDiscordId",
                args: [account.address, discordIdAuth],
                chain: config[chainId],
                account: account.address,
            });
        } catch (error) {
            console.error("Error during transaction:", error);
            toast({
                variant: "destructive",
                title: "Transaction Cancelled",
                description: `${(error as BaseError).shortMessage || "An unknown error occurred"}`,
            });
            if (error instanceof Error) {
                toast({
                    variant: "destructive",
                    title: "Error Details",
                    description: error.message,
                });
            }
        }
    };

    const handleChangeDiscordId = () => {
        setCurrentDiscordId(null); // Reset current Discord ID to allow re-authentication
        handleLogin(); // Redirect to Discord login
    };

    return (
        <>
            <div className='v11e5678D'></div>
            <div className='background-container min-h-[100vh] border-2 border-solid border-primary rounded-[20px] bg-background overflow-hidden bg-custom-bg bg-custom-pos bg-custom-size bg-custom-repeat bg-custom-attachment'>
            <Spacer className='h-[3vw] max-phonescreen:h-[4vw]' />
                <div className='
                max-phonescreen:flex-col max-phonescreen:items-start max-phonescreen:gap-2
                flex justify-between items-center px-[3vw]'>
                    <div className='flex items-center'>
                        <Link href="/" className='
                        max-phonescreen:text-[4vw] max-phonescreen:leading-[4vw]
                        text-primary mr-4 text-xl font-silkscreen'>
                            Home /
                        </Link>
                        <Link href="/profile" className='
                        max-phonescreen:text-[4vw] max-phonescreen:leading-[4vw]
                        text-primary mr-4 text-xl font-silkscreen'>
                            profile /
                        </Link>
                        <div className='
                        max-phonescreen:text-[5.5vw] max-phonescreen:leading-[5.5vw]
                        text-primary font-bold font-pixel uppercase text-[4.5vw] leading-[5.5vw] whitespace-nowrap'>
                            ADD ID DISCORD 
                        </div>
                    </div>
                    <div className='
                    max-phonescreen:text-[3vw] max-phonescreen:leading-[3vw] max-phonescreen:h-[27px]
                    connect-btn text-primary font-pixel uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap'>
                            <CustomConnectButton />
                    </div>
                </div>

                <div className="w-full mt-10">
                    <div className="
                    max-phonescreen:w-[calc(100%-20px)]
                    bg-secondary-background p-8 rounded-lg max-w-2xl mx-auto">
                        {currentDiscordId ? (
                            <div className="mb-4">
                                <p className="text-lg font-medium text-gray-300">Your Discord ID: {currentDiscordId}</p>
                                <button
                                    onClick={handleChangeDiscordId}
                                    className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 mt-4"
                                >
                                    Change ID Discord
                                </button>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <button
                                    onClick={handleLogin}
                                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                                >
                                    Login with Discord
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="
                    max-phonescreen:w-[calc(100%-20px)]
                    mt-8 bg-secondary p-6 rounded-lg max-w-2xl mx-auto">
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

export default AddIDDiscordPage;