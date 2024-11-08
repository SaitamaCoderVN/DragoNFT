"use client"

import { CustomConnectButton } from "@/components/ui/ConnectButton";
import Spacer from "@/components/ui/Spacer";
import Link from "next/link";
import { Player } from "@/types/PlayerData";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
const API_BASE_URL = '/api/leaderboard';


const calculateLevelProgress = (detailedXp: number[]) => {
    if (!detailedXp || detailedXp.length < 2) return 0;
    return Math.floor((detailedXp[0] / detailedXp[1]) * 100);
  };
  
const CircularProgress = ({ level, progress }: { level: number; progress: number }) => {
    const size = 40;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    return (
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 transform -rotate-90">
          <circle
            className="text-gray-700"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-primary"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-white font-bold">{level}</span>
        </div>
      </div>
    );
};
    
const RankBadge = ({ rank }: { rank: number }) => {
    const badgeColors: { [key: number]: string } = {
        1: 'bg-yellow-500',
        2: 'bg-gray-400',
        3: 'bg-amber-600',
    }
    const baseClasses = "flex items-center justify-center w-6 h-6 rounded-full font-bold";
    const colorClass = badgeColors[rank] || 'bg-gray-700 text-gray-300';
    return (
      <div className={`${baseClasses} ${colorClass}`}>
        {rank}
      </div>
    );
};

function GetLevelPage() {
    const [serverUrl, setServerUrl] = useState('');
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetLevels = async () => {
        setLoading(true);
        setError(null);

        // Extract server ID from the URL
        const match = serverUrl.match(/\/(\d+)\//);
        if (!match) {
            setError('Invalid Discord server URL');
            setLoading(false);
            return;
        }

        const serverId = match[1];

        try {
            const response = await fetch(`/api/leaderboard?serverId=${serverId}`);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setPlayers(data.players);
        } catch (err) {
            setError('Error fetching leaderboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleGetLevels();
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
                            Admin
                        </div>
                    </div>
                    <div className='connect-btn text-primary font-pixel uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap'>
                        <CustomConnectButton />
                        <Link href="/admin/config" className='fu-btn flex items-center justify-center bg-primary text-secondary-background font-silkscreen font-semibold h-[3vw] uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap py-[8px] px-[10px] hover:scale-[1.05] transition-all duration-300'>
                            Config
                        </Link>
                        <Link href="/admin/upgrade" className='fu-btn flex items-center justify-center bg-primary text-secondary-background font-silkscreen font-semibold h-[3vw] uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap py-[8px] px-[10px] hover:scale-[1.05] transition-all duration-300'>
                            Upgrade
                        </Link>
                        <Link href="/admin/replace" className='fu-btn flex items-center justify-center bg-primary text-secondary-background font-silkscreen font-semibold h-[3vw] uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap py-[8px] px-[10px] hover:scale-[1.05] transition-all duration-300'>
                          Replace
                        </Link>
                        <Link href="/admin/reward" className='fu-btn flex items-center justify-center bg-primary text-secondary-background font-silkscreen font-semibold h-[3vw] uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap py-[8px] px-[10px] hover:scale-[1.05] transition-all duration-300'>
                          Reward
                        </Link>
                    </div>
                </div>
                <Spacer size='3vw'/>
                
                <motion.div 
                initial={{ height: "150px" }}
                animate={{ height: players.length > 0 ? "555px" : "150px" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="get-level-container relative flex flex-col justify-center items-center overflow-hidden w-[60vw] p-[2px] border-0 border-solid border-border-transparent rounded-[20px] bg-secondary-background mx-auto">
                    <div className="w-full p-4 flex items-center justify-between gap-4">
                        <input
                            type="text"
                            value={serverUrl}
                            onChange={(e) => setServerUrl(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter Discord server URL"
                            className="flex-grow px-4 py-2 bg-background text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                        <button
                            onClick={handleGetLevels}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:scale-105 transition-all duration-300"
                            disabled={loading}
                        >
                            Get
                        </button>
                    </div>

                    <div className="w-full flex-grow overflow-y-auto p-4">
                        {loading && <p className="text-white font-pixel text-center">Loading...</p>}
                        {error && <p className="text-center font-pixel text-red-500">{error}</p>}
                        {!loading && !error && players.length === 0 && (
                            <p className="text-white text-lg font-pixel text-center">Get level detail from server</p>
                        )}
                        <AnimatePresence>

                            {players.map((player, index) => {
                                const levelProgress = player.detailed_xp ? calculateLevelProgress(player.detailed_xp) : 0;
                                return (
                                    <div key={player.id} className="userCard flex items-center justify-between rounded-lg p-4 mb-2 bg-gray-800">
                                        <div className="flex items-center space-x-4">
                                            <RankBadge rank={index + 1} />
                                            <div className="relative">
                                                <img
                                                    src={`https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}.png`}
                                                    alt={player.username}
                                                    className="w-10 h-10 rounded-full"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/api/placeholder/40/40';
                                                    }}
                                                />
                                            </div>
                                            <span className="text-white text-base font-medium font-mono">{player.username}</span>
                                        </div>
                                        <CircularProgress level={player.level} progress={levelProgress} />
                                    </div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                </motion.div>
            </div>
        </>
    );
}

export default GetLevelPage;