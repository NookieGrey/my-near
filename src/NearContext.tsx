import {createContext, FC, ReactElement, useCallback, useContext, useMemo, useState} from "react";
import {Account, connect, Contract, keyStores, WalletConnection} from "near-api-js";

const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

const NearContext = createContext({
  isInitializedContext: false,
  signUp: async () => ({
    accountID: "",
    accountBalance: {
      total: "",
      stateStaked: "",
      staked: "",
      available: "",
    },
    color: [0, 0, 0]
  }),
  signIn: async () => {
  },
  signOut: () => {
  },
  setNearColor: async (rgb: [number, number, number]) => [0, 0, 0]
});

const CONTRACT_ADDRESS = "frontend-test-1.badconfig.testnet";

export const NearContextProvider: FC<{ children: ReactElement }> = ({children}) => {
  const [walletConnection, setWalletConnection] = useState<WalletConnection>();
  const [account, setAccount] = useState<Account>();

  const signUp = useCallback(async () => {
    const connectionConfig = {
      networkId: "testnet",
      keyStore: myKeyStore, // first create a key store
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };

    const nearConnection = await connect(connectionConfig);

    const walletConnection = new WalletConnection(nearConnection, null);

    setWalletConnection(walletConnection);

    const accountID = walletConnection.getAccountId();

    const account = await nearConnection.account(accountID);
    setAccount(account);

    const accountBalance = await account.getAccountBalance();
    const color = await account.viewFunction(CONTRACT_ADDRESS, 'get');

    return {
      accountID,
      accountBalance,
      color,
    }
  }, []);

  const signIn = useCallback(async () => {
    await walletConnection?.requestSignIn({
      contractId: CONTRACT_ADDRESS,
    });

  }, [walletConnection]);

  const signOut = useCallback(() => {
    walletConnection?.signOut();
  }, [walletConnection]);

  const setNearColor = useCallback(async ([r, g, b]: [number, number, number]) => {
    if (!account) return;

    const contract = new Contract(
      account,
      CONTRACT_ADDRESS,
      {
        viewMethods: [],
        changeMethods: ["set"],
      }
    );

    // @ts-ignore
    await contract.set(
      {
        r: r,
        g: g,
        b: b,
      },
    );

    return await account.viewFunction(CONTRACT_ADDRESS, 'get');
  }, [account]);

  const value = useMemo(() => ({
    isInitializedContext: true,
    signUp,
    signIn,
    signOut,
    setNearColor,
  }), [signUp, signIn, signOut]);

  return (
    <NearContext.Provider value={value}>
      {children}
    </NearContext.Provider>
  )
}

export const useNear = () => useContext(NearContext);