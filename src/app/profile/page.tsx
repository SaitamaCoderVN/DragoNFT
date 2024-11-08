'use client';
import Card from '../../components/Card';
import CardGrid from '@/components/card-grid/CardGrid';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import "./profilePage.css"
import Spacer from '@/components/ui/Spacer';
import { CustomConnectButton } from '@/components/ui/ConnectButton';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { useAccount, useChainId } from 'wagmi';
import { BLOCK_EXPLORER_OPAL, BLOCK_EXPLORER_QUARTZ, BLOCK_EXPLORER_UNIQUE, CHAINID, CONTRACT_ADDRESS_OPAL, CONTRACT_ADDRESS_QUARTZ, CONTRACT_ADDRESS_UNIQUE } from '@/components/contract/contracts';
import { nftAbi } from '@/components/contract/abi';
import { readContract } from '@wagmi/core/actions';
import { config } from '@/components/contract/config';
import { useEffect, useState } from 'react';

export default function ProfilelPage() {
    const dispatch = useAppDispatch();
    const { cards, activeCardId } = useAppSelector((state) => state.card);

    const { toast } = useToast();
    const account = useAccount();
    const chainId = useChainId();
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

    const [uriArray, setUriArray] = useState<string[]>([]);

    const fetchTotalOwnerShitNFT = async () => {
        if (account.address) {
            const result = await readContract(config, {
                abi: nftAbi,
                address: contractAddress,
                functionName: 'getSoulBound_Ranking_NFTs',
                args: [ `${account.address}`],
            });

            console.log("result", result);

            const tokenCodeContributes = await Promise.all(result.map(async (tokenId) => {
                console.log("tokenId", tokenId);
                const tokenCode= await readContract(config, {
                    abi: nftAbi,
                    address: contractAddress,
                    functionName: 'getTokenCodeContribute',
                    args: [tokenId],
                });
                console.log("tokenCode",tokenCode);
                return tokenCode;
            }));



            const tokenLevel = await Promise.all(result.map(async (tokenId) => {
                const tokenLevel = await readContract(config, {
                    abi: nftAbi,
                    address: contractAddress,
                    functionName: 'getTokenLevel',
                    args: [tokenId],
                });
                console.log("tokenLevel", tokenLevel);
                return tokenLevel;
            }));

            const tokenUriForContributorAndLevel = await Promise.all(result.map(async (tokenId, index) => {
                try {
                    return await readContract(config, {
                        abi: nftAbi,
                        address: contractAddress,
                        functionName: 'getUriForContributorAndLevel',
                        args: [tokenCodeContributes[index], tokenLevel[index]],
                    });
                } catch (error) {
                    // If getUriForContributorAndLevel cannot be called, call tokenURI
                    return await readContract(config, {
                        abi: nftAbi,
                        address: contractAddress,
                        functionName: 'tokenURI',
                        args: [tokenId],
                    });
                }
            }));

            console.log("tokenUriForContributorAndLevel", tokenUriForContributorAndLevel);

            setUriArray([...tokenUriForContributorAndLevel]);
            // setTokenCodeContributes(tokenCodeContributes);
        }
    };

    useEffect(() => {
        fetchTotalOwnerShitNFT();
    }, [account.address, contractAddress]);

    const handlePublishProfile = () => {
        if (account.address) {
            const profileUrl = `/profile/publish/${account.address}`;
            window.open(profileUrl, '_blank');
        } else {
            alert('Please connect your wallet to publish your profile.');
        }
    };

    return (
        <>
            {/* <div className='v11e5678D'></div> */}
            <div className='background-container min-h-[100vh] border-2 border-solid border-primary rounded-[20px] bg-background overflow-hidden bg-custom-bg bg-custom-pos bg-custom-size bg-custom-repeat bg-custom-attachment'>
                <Spacer size='3vw'/>
                <div className='flex justify-between items-center px-[3vw]'>
                    <div className='flex items-center'>
                        <Link href="/" className='text-primary mr-4 text-xl font-silkscreen'>
                            Home /
                        </Link>
                        <div className='text-primary font-bold font-pixel uppercase text-[5.5vw] leading-[5.5vw] whitespace-nowrap'>
                            Profile 
                        </div>
                    </div>
                    <div className='items-center'>
                        <div className='connect-btn text-primary font-pixel uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap'>
                            <CustomConnectButton />
                        </div>
                        <Link href="/profile/add_id_discord" className='fu-btn flex items-center justify-center bg-primary text-secondary-background font-silkscreen font-semibold h-[3vw] uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap py-[8px] px-[10px] hover:scale-[1.05] transition-all duration-300'>
                            Add ID Discord
                        </Link>
                        <Link
                            href="#"
                            onClick={handlePublishProfile}
                            className='fu-btn flex items-center justify-center bg-primary text-secondary-background font-silkscreen font-semibold h-[3vw] uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap py-[8px] px-[10px] hover:scale-[1.05] transition-all duration-300'
                        >
                            Publish Profile
                        </Link>
                    </div>
                </div>
                <CardGrid>
                    {cards.map((card) => (
                        <Card key={card.id} {...card} />
                    ))}
                </CardGrid>
            </div>
        
        </>
    );
}
