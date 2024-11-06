"use client"

import Card from "@/components/Card";
import CardGrid from "@/components/card-grid/CardGrid";
import { CustomConnectButton } from "@/components/ui/ConnectButton";
import Spacer from "@/components/ui/Spacer";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from 'react-dropzone';
import { FaSpinner } from 'react-icons/fa';
import "./style.css"
import { setCards } from "@/redux/cardSlice";
import { v4 as uuidv4 } from 'uuid';
import { getRandomRarity, getRandomType } from "@/utils/rarityUtils";
const FileUploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} width="12" height="12" viewBox="0 0 24 24" fill="none" role="img" color="white"><path fillRule="evenodd" clipRule="evenodd" d="M13.25 1.26003C12.9109 1.25 12.5071 1.25 11.997 1.25H11.25C8.44974 1.25 7.04961 1.25 5.98005 1.79497C5.03924 2.27433 4.27433 3.03924 3.79497 3.98005C3.25 5.04961 3.25 6.44974 3.25 9.25V14.75C3.25 17.5503 3.25 18.9504 3.79497 20.02C4.27433 20.9608 5.03924 21.7257 5.98005 22.205C7.04961 22.75 8.44974 22.75 11.25 22.75H12.75C15.5503 22.75 16.9504 22.75 18.02 22.205C18.9608 21.7257 19.7257 20.9608 20.205 20.02C20.75 18.9504 20.75 17.5503 20.75 14.75V10.003C20.75 9.49288 20.75 9.08913 20.74 8.75001H17.2H17.1695H17.1695C16.6354 8.75002 16.1895 8.75003 15.8253 8.72027C15.4454 8.68924 15.0888 8.62212 14.7515 8.45028C14.2341 8.18663 13.8134 7.76593 13.5497 7.24849C13.3779 6.91122 13.3108 6.55457 13.2797 6.17468C13.25 5.81045 13.25 5.3646 13.25 4.83044V4.80001V1.26003ZM20.5164 7.25001C20.3941 6.86403 20.2252 6.4939 20.0132 6.14791C19.704 5.64333 19.2716 5.21096 18.4069 4.34621L18.4069 4.34619L17.6538 3.59315L17.6538 3.59314C16.789 2.72839 16.3567 2.29601 15.8521 1.9868C15.5061 1.77478 15.136 1.6059 14.75 1.48359V4.80001C14.75 5.37244 14.7506 5.75666 14.7748 6.05253C14.7982 6.33966 14.8401 6.47694 14.8862 6.5675C15.0061 6.8027 15.1973 6.99393 15.4325 7.11377C15.5231 7.15991 15.6604 7.2018 15.9475 7.22526C16.2434 7.24943 16.6276 7.25001 17.2 7.25001H20.5164ZM12.5303 10.4697C12.2374 10.1768 11.7626 10.1768 11.4697 10.4697L8.96967 12.9697C8.67678 13.2626 8.67678 13.7374 8.96967 14.0303C9.26256 14.3232 9.73744 14.3232 10.0303 14.0303L11.25 12.8107V17C11.25 17.4142 11.5858 17.75 12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V12.8107L13.9697 14.0303C14.2626 14.3232 14.7374 14.3232 15.0303 14.0303C15.3232 13.7374 15.3232 13.2626 15.0303 12.9697L12.5303 10.4697Z" fill="currentColor"></path></svg>
);

function AddProposalPage() {
    const dispatch = useAppDispatch();
    const { cards } = useAppSelector((state) => state.card);
    const [nftName, setNftName] = useState('');
    const [nftTitle, setNftTitle] = useState('');
    const [url, setUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localImageFile, setLocalImageFile] = useState(null);
    const [localImagePreview, setLocalImagePreview] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setLocalImageFile(file);
        setLocalImagePreview(URL.createObjectURL(file));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {'image/*': []},
        multiple: false
    });

    const generateCombinedImage = async (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            const canvas = canvasRef.current;
            if (!canvas) {
                resolve(null);
                return;
            }
    
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(null);
                return;
            }
    
            const img = new Image();
            img.onload = () => {
                const aspectRatio = 0.718;
                const cardWidth = 400;
                const cardHeight = cardWidth / aspectRatio;
                canvas.width = cardWidth;
                canvas.height = cardHeight;
    
                // Create gradient background for the frame
                const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
                gradient.addColorStop(0, '#2a0845');
                gradient.addColorStop(1, '#6441A5');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, cardWidth, cardHeight);
    
                // Draw image with object-fit: cover
                const frameMargin = 20;
                const imageWidth = cardWidth - frameMargin * 2;
                const imageHeight = cardHeight - frameMargin * 3;
                const imageAspectRatio = img.width / img.height;
                let drawWidth, drawHeight, offsetX, offsetY;
    
                if (imageAspectRatio > imageWidth / imageHeight) {
                    drawHeight = imageHeight;
                    drawWidth = drawHeight * imageAspectRatio;
                    offsetX = frameMargin + (imageWidth - drawWidth) / 2;
                    offsetY = frameMargin * 2;
                } else {
                    drawWidth = imageWidth;
                    drawHeight = drawWidth / imageAspectRatio;
                    offsetX = frameMargin;
                    offsetY = frameMargin * 2 + (imageHeight - drawHeight) / 2;
                }
    
                ctx.save();
                ctx.beginPath();
                ctx.rect(frameMargin, frameMargin * 2, imageWidth, imageHeight);
                ctx.clip();
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                ctx.restore();
    
                // Outer frame
                ctx.strokeStyle = '#8A2BE2';
                ctx.lineWidth = 8;
                ctx.strokeRect(10, 10, cardWidth - 20, cardHeight - 20);
    
                // Inner frame
                ctx.strokeStyle = '#4B0082';
                ctx.lineWidth = 4;
                ctx.strokeRect(frameMargin, frameMargin, cardWidth - frameMargin * 2, cardHeight - frameMargin * 2);
    
                // Corner accents
                const cornerSize = 30;
                ctx.strokeStyle = '#9370DB';
                ctx.lineWidth = 2;
                // Top-left
                ctx.beginPath();
                ctx.moveTo(5, 35);
                ctx.lineTo(5, 5);
                ctx.lineTo(35, 5);
                ctx.stroke();
                // Top-right
                ctx.beginPath();
                ctx.moveTo(cardWidth - 35, 5);
                ctx.lineTo(cardWidth - 5, 5);
                ctx.lineTo(cardWidth - 5, 35);
                ctx.stroke();
                // Bottom-left
                ctx.beginPath();
                ctx.moveTo(5, cardHeight - 35);
                ctx.lineTo(5, cardHeight - 5);
                ctx.lineTo(35, cardHeight - 5);
                ctx.stroke();
                // Bottom-right
                ctx.beginPath();
                ctx.moveTo(cardWidth - 35, cardHeight - 5);
                ctx.lineTo(cardWidth - 5, cardHeight - 5);
                ctx.lineTo(cardWidth - 5, cardHeight - 35);
                ctx.stroke();
    
                // Draw name at the top
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, cardWidth, 40);
                ctx.fillStyle = '#ce8eeb';
                ctx.font = 'bold 24px "Courier New", monospace';
                ctx.textAlign = 'center';
                ctx.fillText(nftName, cardWidth / 2, 28);
    
                // Draw title at the bottom
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, cardHeight - 40, cardWidth, 40);
                ctx.fillStyle = '#E6E6FA';
                ctx.font = '20px "Courier New", monospace';
                ctx.textAlign = 'center';
                ctx.fillText(nftTitle, cardWidth / 2, cardHeight - 15);
    
                // Add some tech-inspired details
                ctx.strokeStyle = 'rgba(147, 112, 219, 0.5)';
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(frameMargin, 50 + i * 20);
                    ctx.lineTo(cardWidth - frameMargin, 50 + i * 20);
                    ctx.stroke();
                }
    
                // Circular element
                ctx.strokeStyle = '#9370DB';
                ctx.beginPath();
                ctx.arc(cardWidth - 40, 60, 15, 0, Math.PI * 2);
                ctx.stroke();
    
                // Data-like lines
                ctx.beginPath();
                ctx.moveTo(40, 60);
                ctx.lineTo(cardWidth - 70, 60);
                ctx.moveTo(40, 70);
                ctx.lineTo(cardWidth - 90, 70);
                ctx.moveTo(40, 80);
                ctx.lineTo(cardWidth - 80, 80);
                ctx.stroke();
    
                canvas.toBlob((blob) => {
                    resolve(blob);
                });
            };
            img.src = localImagePreview;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let cloudinaryUrl = '';
            if (localImageFile) {
                const combinedImageBlob = await generateCombinedImage();
                if (combinedImageBlob) {
                    const formData = new FormData();
                    formData.append('file', combinedImageBlob, 'combined_image.png');

                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Upload failed');
                    }

                    const data = await response.json();
                    cloudinaryUrl = data.url;
                }
            }

            // Simulating API call for form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Form submitted:', { nftName, nftTitle, imageUrl: cloudinaryUrl });
            const newCard = {
                id: uuidv4(), // Generate a unique ID
                name: nftName,
                number: "160", 
                set: "custom", 
                types: [getRandomType()],
                subtypes: ["Basic"],
                supertype: "card",
                rarity: getRandomRarity(),
                img: cloudinaryUrl,
            };
            const updatedCards = [newCard, ...cards];
            dispatch(setCards(updatedCards));

            setNftName('');
            setNftTitle('');
            setLocalImageFile(null);
            setLocalImagePreview('');
            setUrl('');
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
        {/* <div className='v11e5678D'></div> */}
        <div className='background-container min-h-[100vh] border-2 border-solid border-primary rounded-[20px] bg-background overflow-hidden bg-custom-bg bg-custom-pos bg-custom-size bg-custom-repeat bg-custom-attachment flex flex-col'>
            <Spacer size='3vw'/>
            <div className='flex justify-between items-center px-[3vw]'>
                <div className='flex items-center '>
                    <div className="flex flex-col">
                        <Link href="/" className='text-primary mr-4 text-xl font-silkscreen'>
                            Home /
                        </Link>
                    </div>
                    <div className='text-primary font-bold font-pixel uppercase text-[5.5vw] leading-[5.5vw] whitespace-nowrap'>
                        Replace NFT
                    </div>
                </div>
                
                <div className='connect-btn text-primary font-pixel uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap'>
                    <CustomConnectButton />
                </div>
            </div>
            <Spacer size='3vw'/>

            <div className="add-profile-container flex px-[3vw] ">
                <div className="left-column w-[65%] pr-4 ">
                    <input
                        type="text"
                        id="uri"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter Address"
                        className="w-[50%] px-4 py-2 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <CardGrid>
                        {cards.map((card) => (
                            <Card key={card.id} {...card} />
                        ))}
                    </CardGrid>
                </div>
                <div className="right-column w-[35%] pl-4 overflow-y-auto">
                    <div className="add-profile-form">
                        <h2 className="text-primary font-pixel text-2xl mb-4">Add Profile Form</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="nftName" className="block text-primary font-pixel mb-2">NFT Name</label>
                                <input
                                    type="text"
                                    id="nftName"
                                    value={nftName}
                                    onChange={(e) => setNftName(e.target.value)}
                                    className="w-full px-4 py-2 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="relative w-full pt-[24px]">
                                    <div className="absolute z-0 top-0 left-0 flex items-center gap-[4px] pt-[4px] pb-[32px] px-[8px] rounded-tl-[12px] rounded-tr-[12px] bg-primary">
                                        <FileUploadIcon className="w-[12px] h-[12px]"/>
                                        <span className="text-white font-pixel text-[1vw] leading-[1vw]">
                                            Upload Image
                                        </span>
                                    </div>
                                    <div className="upload__frame rounded-md flex relative overflow-visible before:rounded-md before:z-0 before:absolute before:bg-gradient-to-br before:p-12 before:inset-0 before:from-primary before:from-0% before:via-primary before:via-26% before:to-[#ffffff21] before:to-40%">
                                        <div {...getRootProps()} className="z-[1]  w-full p-4 text-center font-pixel font-semibold text-primary cursor-pointer relative min-h-[15vw] flex flex-col items-center justify-center">
                                            <input {...getInputProps()} disabled={isSubmitting} />
                                            {isDragActive ? (
                                                <p>Drop the image here ...</p>
                                            ) : (
                                                <p>Drag and drop an image here, or click to select a file</p>
                                            )}
                                            {localImagePreview && (
                                                <div className="mt-4">
                                                    <img src={localImagePreview} alt="Preview" className="max-w-full h-auto" />
                                                    <p className="mt-2 text-sm">Click or drag a new image to replace</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute left-[1px] top-[1px] right-[1px] bottom-[1px] rounded-md overflow-hidden p-[20px] border-image min-w-0 flex flex-col gap-300 bg-background outline-dashed outline-[1.5px] outline-background"></div>
                                    </div>
                                </div>
                                
                            </div>
                            <div>
                                <label htmlFor="nftTitle" className="block text-primary font-pixel mb-2">NFT Title</label>
                                <input
                                    type="text"
                                    id="nftTitle"
                                    value={nftTitle}
                                    onChange={(e) => setNftTitle(e.target.value)}
                                    className="w-full px-4 py-2 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="bg-primary text-white font-pixel py-2 px-4 rounded-md hover:bg-secondary transition-colors flex items-center justify-center w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Spacer size='3vw'/>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
    );
}

export default AddProposalPage;