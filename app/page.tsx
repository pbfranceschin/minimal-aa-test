'use client'

import { createWeb3AuthSigner } from "./web3auth";
import { useEffect, useState } from "react";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { sepolia, polygonMumbai } from "viem/chains";
import { Web3AuthSigner } from "@alchemy/aa-signers/web3auth";
import Transfer from "@/components/transfer";
import client from "./publicClient";
import Balance from "@/components/balance";
import { VennSmartAccount } from "@/account/account";

// const BLOCK_UPDATE_NUM = 10n;

const chain = polygonMumbai;
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_MUMBAI_ALCHEMY_API_KEY;
// const factoryAddress = '0x2C65c7Ed61246a6702d8bb5643E3B945cbD515C1';
const factoryAddress = "0xee2bcf7220348Cd7cF89353c1E54f6fd7665B10A";

export default function Home() {
  const [provider, setProvider] = useState<AlchemyProvider>();
  const [signer, setSigner] = useState<Web3AuthSigner>();
  const [accountAddress, setAccountAddress] = useState<`0x${string}`>();
  
  useEffect(() => {
    const resolveProvider = async () => {
      if(!ALCHEMY_API_KEY) {
        console.error('missing alchemy apiKey');
        return
      }
      if(!signer) return;
      const _provider = new AlchemyProvider({
        apiKey: ALCHEMY_API_KEY,
        chain,
      }).connect(
        (rpcClient) =>
          new VennSmartAccount({
            chain,
            owner: signer,
            factoryAddress,
            rpcClient,
          })
      );
      setProvider(_provider)
    }
    resolveProvider();
  }, [signer]);

  useEffect(() => {
    const resolveAddress = async () => {
      setAccountAddress(await provider?.getAddress());
    }
    resolveAddress();
  }, [provider])

  const signIn = async () => {
    setSigner(await createWeb3AuthSigner());
  }

  const signOut = async () => {
    await signer?.inner.logout();
    setSigner(undefined);
  }
  console.log('signer', signer)

  console.log('account', accountAddress)
  console.log('provider', provider)
  

  return (
    <main>
      {signer
        ? <button className="m-6 p-6 rounded bg-red-500 hover:bg-red-300" onClick={() => signOut()}>Sign Out</button>
        : <button className="m-6 p-6 rounded bg-blue-500 hover:bg-blue-300" onClick={() => signIn()}>Sign In</button>
      }
      {signer &&
        <>
        <div className="p-6">
          Account Address: {accountAddress}
        </div>
        <Balance accountAddress={accountAddress} />
        <Transfer provider={provider}/>
        </>
      }      
    </main>
  )
}
