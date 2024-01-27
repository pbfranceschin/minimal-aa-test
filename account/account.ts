import {
    SimpleSmartContractAccount,
    SmartAccountProvider,
    type SignTypedDataParams,
    type SmartAccountSigner,
 } from "@alchemy/aa-core";
  import {
    concatHex,
    decodeFunctionResult,
    encodeFunctionData,
    type Address,
    type FallbackTransport,
    type Hash,
    type Hex,
    type Transport,
} from "viem";
import { smartAccountAbi, smartAccountFactoryAbi } from "@/abis";
  
  export class VennSmartAccount<
    TTransport extends Transport | FallbackTransport = Transport
  > extends SimpleSmartContractAccount<TTransport> {
    override async signTypedData(params: SignTypedDataParams): Promise<Hash> {
      return this.owner.signTypedData(params);
    }
  
    /**
     * Returns the on-chain EOA owner address of the account.
     *
     * @returns {Address} the on-chain EOA owner of the account
     */
    async getOwnerAddress(): Promise<Address> {
      const callResult = await this.rpcProvider.call({
        to: await this.getAddress(),
        data: encodeFunctionData({
          abi: smartAccountAbi,
          functionName: "owner",
        }),
      });
  
      if (callResult.data == null) {
        throw new Error("could not get on-chain owner");
      }
  
      const decodedCallResult = decodeFunctionResult({
        abi: smartAccountAbi,
        functionName: "owner",
        data: callResult.data,
      });
  
      if (decodedCallResult !== (await this.owner.getAddress())) {
        throw new Error("on-chain owner does not match account owner");
      }
  
      return decodedCallResult;
    }
  
    protected override async getAccountInitCode(): Promise<`0x${string}`> {
      return concatHex([
        this.factoryAddress,
        encodeFunctionData({
          abi: smartAccountFactoryAbi,
          functionName: "createAccount",
          // light account does not support sub-accounts
          args: [await this.owner.getAddress(), 0n],
        }),
      ]);
    }
}
  