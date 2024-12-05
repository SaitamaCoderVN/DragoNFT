"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nftAbi } from "@/components/contract/abi";
import { CONTRACT_ADDRESS_UNIQUE } from "@/components/contract/contracts";
import { readContract } from '@wagmi/core/actions';
import { config } from '@/components/contract/config';
import Spacer from '@/components/ui/Spacer';
import CardGrid from '@/components/card-grid/CardGrid';
import Card from '@/components/Card';
import { useAppSelector } from '@/hooks/useRedux';

export default function PublishProfilePage() {
    const { address } = useParams();
    const [uriArray, setUriArray] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const { cards, activeCardId } = useAppSelector((state) => state.card);

    const fetchTotalOwnerShitNFT = async () => {
        if (address) {
            console.log("result", address);
            
            try {
                setIsLoading(true);
                const result = await readContract(config, {
                    abi: nftAbi,
                    address: CONTRACT_ADDRESS_UNIQUE,
                    functionName: 'getSoulBound_Ranking_NFTs',
                    args: [ address as `0x${string}`],
                });
            console.log("result", result);
                
            const tokenCodeContributes = await Promise.all(result.map(async (tokenId) => {
                console.log("tokenId", tokenId);
                try {
                    const tokenCode = await readContract(config, {
                        abi: nftAbi,
                        address: CONTRACT_ADDRESS_UNIQUE,
                        functionName: 'getTokenCodeContribute',
                        args: [tokenId],
                    });
                    console.log("tokenCode", tokenCode);
                    return tokenCode;
                } catch (error) {
                    console.error("Error fetching tokenCodeContribute:", error);
                    return null;
                }
            }));

            const tokenLevel = await Promise.all(result.map(async (tokenId) => {
                const tokenLevel = await readContract(config, {
                    abi: nftAbi,
                    address: CONTRACT_ADDRESS_UNIQUE,
                    functionName: 'getTokenLevel',
                    args: [tokenId],
                });
                console.log("tokenLevel", tokenLevel);
                return tokenLevel;
            }));

            const tokenUriForContributorAndLevel = await Promise.all(result.map(async (tokenId, index) => {
                try {
                    const result = await readContract(config, {
                        abi: nftAbi,
                        address: CONTRACT_ADDRESS_UNIQUE,
                        functionName: 'getUriForContributorAndLevel',
                        args: [tokenCodeContributes[index], tokenLevel[index]],
                    });

                    if (result === "") {
                        const result = await readContract(config, {
                            abi: nftAbi,
                            address: CONTRACT_ADDRESS_UNIQUE,
                            functionName: 'tokenURI',
                            args: [tokenId],
                        });
                        console.log("tokenURI Link ảnh đây Đạt nhé", result);
                        return result;
                    }

                    return result;
                } catch (error) {
                    // If getUriForContributorAndLevel cannot be called, call tokenURI
                    const result = await readContract(config, {
                        abi: nftAbi,
                        address: CONTRACT_ADDRESS_UNIQUE,
                        functionName: 'tokenURI',
                        args: [tokenId],
                    });
                    console.log("tokenURI Link ảnh đây Đạt nhé", result);
                    return result;
                }
                }));

                setUriArray(tokenUriForContributorAndLevel);
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
        <>
            <div className='background-container min-h-[100vh] border-2 border-solid border-primary rounded-[20px] bg-background overflow-hidden bg-custom-bg bg-custom-pos bg-custom-size bg-custom-repeat bg-custom-attachment'>
            <Spacer className='h-[3vw] max-phonescreen:h-[4vw]' />

                <div className='flex justify-between items-center px-[3vw]'>
                    <div className='flex items-center'>
                        <div className='text-primary font-bold font-pixel uppercase text-[3.5vw] leading-[5.5vw] whitespace-nowrap'>
                            Profile of {address.slice(0, 3)}...{address.slice(-3)}
                        </div>
                    </div>
                </div>
                <CardGrid>
                    {uriArray.map((img, index) => (
                        <Card 
                            key={index} 
                            id={`swsh12pt5-${index + 160}`} 
                            name={cards[1].name} 
                            number={cards[1].number} 
                            img={img} // Using the image URL from uriArray
                            set={cards[1].set} 
                            types={cards[1].types} 
                            subtypes={cards[1].subtypes} 
                            supertype={cards[1].supertype} 
                            rarity={cards[1].rarity} 
                        />
                    ))}
                </CardGrid>
            </div>
        </>
        // <div>
        //     <h1>Profile of {address}</h1>
        //     <ul>
        //         {uriArray.map((uri, index) => (
        //             <li key={index}>
        //                 <img src={uri} alt={`Image ${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
        //             </li>
        //         ))}
        //     </ul>
        // </div>
    );
} 