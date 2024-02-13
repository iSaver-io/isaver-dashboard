/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers';
import type { FunctionFragment, Result, EventFragment } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from '../../../../../common';

export interface VRFConsumerBaseV2UpgradeableInterface extends utils.Interface {
  functions: {
    'rawFulfillRandomWords(uint256,uint256[])': FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: 'rawFulfillRandomWords'): FunctionFragment;

  encodeFunctionData(
    functionFragment: 'rawFulfillRandomWords',
    values: [BigNumberish, BigNumberish[]]
  ): string;

  decodeFunctionResult(functionFragment: 'rawFulfillRandomWords', data: BytesLike): Result;

  events: {
    'Initialized(uint8)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Initialized'): EventFragment;
}

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface VRFConsumerBaseV2Upgradeable extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: VRFConsumerBaseV2UpgradeableInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    rawFulfillRandomWords(
      requestId: BigNumberish,
      randomWords: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  rawFulfillRandomWords(
    requestId: BigNumberish,
    randomWords: BigNumberish[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    rawFulfillRandomWords(
      requestId: BigNumberish,
      randomWords: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    'Initialized(uint8)'(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;
  };

  estimateGas: {
    rawFulfillRandomWords(
      requestId: BigNumberish,
      randomWords: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    rawFulfillRandomWords(
      requestId: BigNumberish,
      randomWords: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
