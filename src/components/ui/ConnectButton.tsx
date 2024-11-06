"use client";

import React, { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useAppDispatch } from '../../hooks/useRedux';
import { setUser, clearUser } from '../../redux/userSlice';
import { User } from '../../types/User';

export const CustomConnectButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      const user = User.fromConnectedWallet(address);
      dispatch(setUser(user));
    } else {
      dispatch(clearUser());
    }
  }, [isConnected, address, dispatch]);

  return <ConnectButton />;
};