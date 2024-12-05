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
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="injected-svg" data-src="https://cdn.hugeicons.com/icons/arrow-down-01-stroke-sharp.svg"  role="img" color="#000000">
    <path d="M5.99977 9.00005L11.9998 15L17.9998 9" stroke="#000000" strokeWidth="2" stroke-miterlimit="16"></path>
    </svg>
);
export default function ProfilelPage() {
    const dispatch = useAppDispatch();
    const { cards, activeCardId } = useAppSelector((state) => state.card);

    const { toast } = useToast();
    const account = useAccount();
    const chainId = useChainId();
    let contractAddress: `0x${string}` | undefined;
    let blockexplorer: string | undefined;

    const [isOptionsVisible, setOptionsVisible] = useState(false); 
    const optionsRef = useRef<HTMLDivElement | null>(null); 

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 }, 
        visible: { opacity: 1, y: 0 },   
    };

    const toggleOptions = () => {
        setOptionsVisible(!isOptionsVisible); 
    };
    
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
            setOptionsVisible(false); 
        }
    };
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); 
        };
    }, []);


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


            const tokenCodeContributes = await Promise.all(result.map(async (tokenId) => {
                console.log("tokenId", tokenId);
                try {
                    const tokenCode = await readContract(config, {
                        abi: nftAbi,
                        address: contractAddress,
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
                    address: contractAddress,
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
                        address: contractAddress,
                        functionName: 'getUriForContributorAndLevel',
                        args: [tokenCodeContributes[index], tokenLevel[index]],
                    });

                    if (result === "") {
                        const result = await readContract(config, {
                            abi: nftAbi,
                            address: contractAddress,
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
                        address: contractAddress,
                        functionName: 'tokenURI',
                        args: [tokenId],
                    });
                    console.log("tokenURI Link ảnh đây Đạt nhé", result);
                    return result;
                }
            }));
            
            console.log("tokenUriForContributorAndLevel", tokenUriForContributorAndLevel);
            
            setUriArray(tokenUriForContributorAndLevel);
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
                <Spacer className='h-[3vw] max-phonescreen:h-[4vw]' />
                <div className='
                max-phonescreen:flex-col max-phonescreen:items-start max-phonescreen:gap-2
                flex justify-between items-center px-[3vw]'>
                    <div className='flex items-center'>
                        <Link href="/" className='
                        max-phonescreen:text-[5vw] max-phonescreen:leading-[5vw]
                        text-primary mr-4 text-xl font-silkscreen'>
                            Home /
                        </Link>
                        <div className='
                        max-phonescreen:text-[8.5vw] max-phonescreen:leading-[8.5vw]
                        text-primary font-bold font-pixel uppercase text-[5.5vw] leading-[5.5vw] whitespace-nowrap'>
                            Profile 
                        </div>
                    </div>
                    <div className='
                    max-phonescreen:gap-1
                    flex gap-3 flex-row-reverse'>
                        <div className='relative' ref={optionsRef}> {/* Attach ref here */}
                            <button 
                                onClick={toggleOptions} 
                                className=' 
                                max-phonescreen:text-[3vw] max-phonescreen:leading-[3vw] max-phonescreen:h-[27px]
                                fu-btn flex items-center justify-center bg-primary text-secondary-background font-silkscreen font-semibold h-[3vw] uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap py-[8px] px-[10px] hover:scale-[1.05] transition-all duration-300'
                            >
                                <span>Options</span>
                                <ArrowDownIcon className='ml-2' />
                            </button>
                            <AnimatePresence>
                                {isOptionsVisible && ( // Conditionally render the buttons with animation
                                    <motion.div
                                        className='absolute top-14 right-0 z-10 shadow-lg rounded-md flex flex-col gap-3'
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={dropdownVariants}
                                        transition={{ duration: 0.2 }} // Animation duration
                                    >
                                        <Link href="/profile/add_id_discord" className='
                                        max-phonescreen:text-[3vw] max-phonescreen:leading-[3vw] max-phonescreen:h-[27px]
                                        fu-btn flex items-center justify-center bg-primary text-secondary-background font-silkscreen font-semibold h-[3vw] uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap py-[8px] px-[10px] hover:scale-[1.05] transition-all duration-300'>
                                            Add ID Discord
                                        </Link>
                                        <Link
                                            href="#"
                                            onClick={handlePublishProfile}
                                            className='
                                            max-phonescreen:text-[3vw] max-phonescreen:leading-[3vw] max-phonescreen:h-[27px]
                                            fu-btn flex items-center justify-center bg-primary text-secondary-background font-silkscreen font-semibold h-[3vw] uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap py-[8px] px-[10px] hover:scale-[1.05] transition-all duration-300'
                                        >
                                            <span className='text-black'>Publish Profile</span>
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className='
                        max-phonescreen:text-[3vw] max-phonescreen:leading-[3vw] max-phonescreen:h-[27px]
                        connect-btn text-primary font-pixel uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap'>
                            <CustomConnectButton />
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
    );
}
