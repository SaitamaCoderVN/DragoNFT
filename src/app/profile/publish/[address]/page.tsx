"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nftAbi } from "@/components/contract/abi";
import { CONTRACT_ADDRESS_UNIQUE } from "@/components/contract/contracts";
import { readContract } from '@wagmi/core/actions';
import { config } from '@/components/contract/config';

export default function PublishProfilePage() {
    const { address } = useParams();
    const [uriArray, setUriArray] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    const fetchTotalOwnerShitNFT = async () => {
        if (address) {
            try {
                setIsLoading(true);
                const result = await readContract(config, {
                    abi: nftAbi,
                    address: CONTRACT_ADDRESS_UNIQUE,
                    functionName: 'getSoulBound_Ranking_NFTs',
                    args: [ address as `0x${string}`],
                });

                const tokenCodeContributes = await Promise.all(result.map(async (tokenId) => {
                    const tokenCode= await readContract(config, {
                        abi: nftAbi,
                        address: CONTRACT_ADDRESS_UNIQUE,
                        functionName: 'getTokenCodeContribute',
                        args: [tokenId],
                    });
                    return tokenCode;
                }));

                const tokenLevel = await Promise.all(result.map(async (tokenId) => {
                    const tokenLevel = await readContract(config, {
                        abi: nftAbi,
                        address: CONTRACT_ADDRESS_UNIQUE,
                        functionName: 'getTokenLevel',
                        args: [tokenId],
                    });
                    return tokenLevel;
                }));

                const tokenUriForContributorAndLevel = await Promise.all(result.map(async (tokenId, index) => {
                    try {
                        return await readContract(config, {
                            abi: nftAbi,
                            address: CONTRACT_ADDRESS_UNIQUE,
                            functionName: 'getUriForContributorAndLevel',
                            args: [tokenCodeContributes[index], tokenLevel[index]],
                        });
                    } catch (error) {
                        return await readContract(config, {
                            abi: nftAbi,
                            address: CONTRACT_ADDRESS_UNIQUE,
                            functionName: 'tokenURI',
                            args: [tokenId],
                        });
                    }
                }));

                setUriArray(tokenUriForContributorAndLevel.filter(uri => uri !== ""));
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchTotalOwnerShitNFT();
    }, [address]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading profile data</div>;
    }

    return (
        <div>
            <h1>Profile of {address}</h1>
            <ul>
                {uriArray.map((uri, index) => (
                    <li key={index}>
                        <img src={uri} alt={`Image ${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
} 