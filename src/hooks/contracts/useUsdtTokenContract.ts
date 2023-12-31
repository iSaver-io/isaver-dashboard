import { BigNumber } from 'ethers';
import { erc20ABI, useContract, useNetwork, useProvider, useSigner } from 'wagmi';

import { ChainIDsEnum } from '@/config';
import Contracts from '@/config/contracts.json';
import { ERC20 } from '@/types.common';
import { waitForTransaction } from '@/utils/waitForTransaction';

const POLYGON_USDT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';

export const useUsdtTokenContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { chain } = useNetwork();

  let address;
  if (chain?.network === 'matic') {
    address = POLYGON_USDT_ADDRESS;
  } else if (chain?.network === 'maticmum') {
    address = (Contracts as any)[ChainIDsEnum.mumbai][0].contracts.ERC20BurnableMock.address;
  } else {
    address = (Contracts as any)[ChainIDsEnum.hardhat][0].contracts.ERC20BurnableMock.address;
  }

  const contract = useContract({
    address,
    abi: erc20ABI,
    signerOrProvider: signer || provider,
  }) as unknown as unknown as ERC20;

  const balanceOf = async (address: string): Promise<BigNumber> => {
    return contract.balanceOf(address);
  };

  const decimals = async () => {
    return contract.decimals();
  };

  const allowance = async (owner: string, spender: string): Promise<BigNumber> => {
    return contract.allowance(owner, spender);
  };

  const approve = async (spender: string, amount: BigNumber): Promise<string> => {
    const tx = await contract.approve(spender, amount);
    return waitForTransaction(tx);
  };

  return {
    contract,
    balanceOf,
    decimals,
    allowance,
    approve,
  };
};
