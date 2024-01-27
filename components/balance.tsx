'use client'
import { useState, useEffect } from "react";
import client from "@/app/publicClient";
import { formatEther } from "viem";

export default function Balance ({accountAddress} : { accountAddress?: `0x${string}`}) {
  const [balance, setBalance] = useState<bigint>();
  const [updater, setUpdater] = useState(false);
  
  useEffect(() => {
    const resolveBalance = async () => {
      if(!accountAddress) return
      setBalance(await client.getBalance({ address: accountAddress }));
    }
    resolveBalance();
  }, [accountAddress, updater]);

  console.log('balance', balance);

  return (
    <>
    <div className="p-6">
      <div >
          Balance: {(balance !== undefined) ? formatEther(balance) : ''}
      </div>
      <div>
        <button className="bg-slate-300 border-2 rounded" onClick={() => setUpdater(!updater)}>refresh</button>
      </div>
    </div>
    </>
  )
  
}