import {createContext, FC, ReactElement, useCallback, useContext, useMemo, useState} from "react";
import {Wallet} from './near-wallet';

const NearContext = createContext({
  isInitializedContext: false,
  signUp: async () => "",
  signIn: () => {
  },
  signOut: () => {
  },
});

const CONTRACT_ADDRESS = "frontend-test-1.badconfig.testnet";

export const NearContextProvider: FC<{ children: ReactElement }> = ({children}) => {
  const [wallet, setWallet] = useState<Wallet>();

  const signUp = useCallback(async () => {
    // @ts-ignore
    const wallet = new Wallet({createAccessKeyFor: CONTRACT_ADDRESS});

    setWallet(wallet);

    const isSignIn = await wallet.startUp();

    if (isSignIn) {
      // @ts-ignore
      return wallet.accountId;

    } else {
      return "";
    }
  }, [wallet]);

  const signIn = useCallback(() => {
    wallet?.signIn();
  }, [wallet]);

  const signOut = useCallback(() => {
    wallet?.signOut();
  }, [wallet]);

  const value = useMemo(() => ({
    isInitializedContext: true,
    signUp,
    signIn,
    signOut,
  }), [signUp, signIn, signOut]);

  return (
    <NearContext.Provider value={value}>
      {children}
    </NearContext.Provider>
  )
}

export const useNear = () => useContext(NearContext);