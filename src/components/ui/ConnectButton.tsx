"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { useAppDispatch } from '../../hooks/useRedux';
import { setUser, clearUser } from '../../redux/userSlice';
import { User } from '../../types/User';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletCenter } from '@/accounts/useWalletCenter';
import { AccountsContext } from '@/accounts/AccountsContext';

export const CustomConnectButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { connectWallet, disconnectWallet } = useWalletCenter();
  const { accounts, setAccounts, setSelectedAccountId, selectedAccountId, selectedAccount } =
    useContext(AccountsContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handlePolkadotConnect = async () => {
    setIsConnecting(true);
    try {
      const accounts = await connectWallet('polkadot-js');
      if (!accounts || accounts.size === 0) {
        throw new Error('No accounts found');
      }
      
      const firstAccount = accounts.values().next().value;
      if (!firstAccount?.address) {
        throw new Error('Invalid account data');
      }
      
      // Cập nhật accounts context
      setAccounts(prev => new Map(prev).set(firstAccount.address, firstAccount));
      
      // Tạo và lưu thông tin user
      const user = new User(firstAccount.address);
      user.walletType = 'polkadot';
      dispatch(setUser(user));
      
      // Cập nhật selected account
      const accountId = Array.from(accounts.keys()).indexOf(firstAccount.address);
      setSelectedAccountId(accountId);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to connect to Polkadot wallet:", error);
      // Hiển thị thông báo lỗi cho người dùng
      alert(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handlePolkadotDisconnect = () => {
    disconnectWallet('polkadot-js');
    dispatch(clearUser());
    localStorage.removeItem('selectedAccount');
    setAccounts(new Map());
    setSelectedAccountId(-1);
  };

  useEffect(() => {
    if (!isEvmConnected && !accounts.size) {
      dispatch(clearUser());
      localStorage.removeItem('selectedAccount');
    }
  }, [isEvmConnected, accounts]);

  useEffect(() => {
    if (accounts.size > 0) {
      localStorage.setItem('selectedAccount', JSON.stringify(accounts.values().next().value));
    }
  }, [accounts]);

  useEffect(() => {
    const savedAccount = localStorage.getItem('selectedAccount');
    if (savedAccount) {
      const account = JSON.parse(savedAccount);
      // Tự động kết nối lại với ví đã lưu
      if (account.walletType === 'polkadot') {
        connectWallet('polkadot-js').then((accounts) => {
          if (accounts && accounts.size > 0) {
            const firstAccount = accounts.values().next().value;
            if (firstAccount.address === account.address) {
              setAccounts((prevAccounts) => new Map(prevAccounts).set(firstAccount.address, firstAccount));
              console.log("Accounts:", accounts);
              const user = new User(firstAccount.address);
              user.walletType = 'polkadot';
              dispatch(setUser(user));
              const accountId = Array.from(accounts.keys()).indexOf(firstAccount.address);
              setSelectedAccountId(accountId);
            }
          }
        }).catch((error) => {
          console.error("Failed to reconnect to Polkadot wallet:", error);
        });
      }
    }
  }, [connectWallet, accounts, dispatch, setSelectedAccountId]);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  // Kiểm tra xem có wallet nào được kết nối không
  const isAnyWalletConnected = isEvmConnected || (accounts.size > 0);

  if (isAnyWalletConnected) {
    if (accounts.size > 0) {
      const connectedWallet = accounts.values().next().value;
      console.log("Connected Wallets:", accounts);
      console.log("Connected Wallet:", connectedWallet);
      const address = connectedWallet.normalizedAddress;
      console.log("Connected Wallet Address:", address);
      const name = connectedWallet.name;
      console.log("Connected Wallet Name:", name);
      console.log("Connected Accounts:", accounts);
      console.log("Connected Selected Account:", selectedAccount);

      if (connectedWallet && address) {
        console.log("Connected Wallet Address:", address);
        const walletName = connectedWallet.name || "Unknown Wallet";
        const walletAddress = address || "Unknown Address";

        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <span>{walletName}</span>
              <span className="text-gray-400">
                {`${(walletAddress as string).slice(0, 6)}...${(walletAddress as string).slice(-4)}`}
              </span>
            </div>
            <button
              onClick={handlePolkadotDisconnect}
              className="fu-btn profile flex items-center justify-center bg-red-600 text-white font-silkscreen font-semibold px-3 py-1 text-sm hover:bg-red-700 transition-all duration-300"
            >
              Disconnect
            </button>
          </div>
        );
      } else {
        console.log("No connected wallet found or address is undefined.");
      }
    }
    return <ConnectButton />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="max-phonescreen:h-[7vw] max-phonescreen:w-[20vw] max-phonescreen:text-[3vw] max-phonescreen:leading-[3vw]
        fu-btn profile flex items-center justify-center bg-primary text-secondary-background font-silkscreen font-semibold h-[3vw] uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap py-[8px] px-[10px] hover:scale-[1.05] transition-all duration-300"
      >
        CONNECT WALLET
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full mt-2 right-0 bg-secondary-background rounded-md shadow-lg z-50"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
          >
            <div className="flex flex-col p-2 gap-2">
              <ConnectButton label="EVM WALLET" />
              <button
                onClick={handlePolkadotConnect}
                disabled={isConnecting}
                className="max-phonescreen:h-[7vw] max-phonescreen:w-[20vw] max-phonescreen:text-[3vw] max-phonescreen:leading-[3vw]
                fu-btn profile flex items-center justify-center bg-primary text-secondary-background font-silkscreen font-semibold h-[3vw] uppercase text-[1.5vw] leading-[1.5vw] whitespace-nowrap py-[8px] px-[10px] hover:scale-[1.05] transition-all duration-300"
              >
                {isConnecting ? 'Connecting...' : 'POLKADOT WALLET'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};