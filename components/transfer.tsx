'use client'
import { useState } from "react";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { isAddress, parseEther } from "viem";

export default function Transfer ({ provider } : { provider? : AlchemyProvider}) {
    const [inputValue, setInputValue] = useState<number>();
    const [address, setAddress] = useState<string>();
    const [txHash, setTxHash] = useState<string>();
    
    const resetInputs = () => {
      setAddress(undefined);
      setInputValue(undefined);
    }
  
    const onValueChange = (e: any) => {
      if(!e) return
      const numValue = parseFloat(e.target.value);
      if(numValue <= 0 || isNaN(numValue)){
        setInputValue(0)
      } else {
        setInputValue(numValue);
      }
    }

    console.log('inputValue', inputValue)
  
    const onTransfer = async () => {
      if(!provider) {
        console.error('no provider found')
        alert('no provider found');
        return
      }
      if(!address || !inputValue) {
        alert('enter address and value');
        return
      }
      if(!isAddress(address) || inputValue <=0) {
        alert('enter a valid address');
        return
      }
      let hash: any;
      let err: any;
      try {
        console.log('sending uo...')
        const value = parseEther(inputValue.toString());
        const res = await provider.sendUserOperation({
          target: address,
          data: '0x',
          value
        });
        hash = res.hash;
      } catch (error: any) {
        alert(error.message);
        console.error(error);
        err = error;
      } finally {
        if(!err) {
          resetInputs();
          setTxHash(hash);
          alert('tx sucessfull')
        }
      }
    }
  
    return (
      <div className="border-2 border-slate-400 rounded p-6">
        <div className="p-2">
          Value:
          <input
          className="border-2 rounded"
          placeholder="0.00 MATIC"
          type="number"
          min='0'
          onChange={(e) => onValueChange(e)}
          />
        </div>
        <div className="p-2">
          Address: 
          <input
          className="border-2 rounded"
          title="Address"
          placeholder="0x..."
          type="string"
          onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button className="p-2 bg-blue-500 text-white rounded" onClick={() => onTransfer()}>Transfer</button>
        {txHash && <p className="px-2">tx hash:{txHash}</p>}
      </div>
    )
  }
  