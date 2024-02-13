/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../common";

export interface IContractManagerInterface extends utils.Interface {
  functions: {
    "getAvatarSettings()": FunctionFragment;
    "getAvatarsAddress()": FunctionFragment;
    "getBirthdayPrizesPool()": FunctionFragment;
    "getPowersAddress()": FunctionFragment;
    "getRafflesAddress()": FunctionFragment;
    "getReferralManagerAddress()": FunctionFragment;
    "getSavTokenAddress()": FunctionFragment;
    "getSavrTokenAddress()": FunctionFragment;
    "getStakingAddress()": FunctionFragment;
    "getTeamsAddress()": FunctionFragment;
    "getTicketAddress()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getAvatarSettings"
      | "getAvatarsAddress"
      | "getBirthdayPrizesPool"
      | "getPowersAddress"
      | "getRafflesAddress"
      | "getReferralManagerAddress"
      | "getSavTokenAddress"
      | "getSavrTokenAddress"
      | "getStakingAddress"
      | "getTeamsAddress"
      | "getTicketAddress"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getAvatarSettings",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAvatarsAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getBirthdayPrizesPool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPowersAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRafflesAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getReferralManagerAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSavTokenAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSavrTokenAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getStakingAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTeamsAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTicketAddress",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "getAvatarSettings",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAvatarsAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBirthdayPrizesPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPowersAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRafflesAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getReferralManagerAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSavTokenAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSavrTokenAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStakingAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTeamsAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTicketAddress",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IContractManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IContractManagerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getAvatarSettings(overrides?: CallOverrides): Promise<[string]>;

    getAvatarsAddress(overrides?: CallOverrides): Promise<[string]>;

    getBirthdayPrizesPool(overrides?: CallOverrides): Promise<[string]>;

    getPowersAddress(overrides?: CallOverrides): Promise<[string]>;

    getRafflesAddress(overrides?: CallOverrides): Promise<[string]>;

    getReferralManagerAddress(overrides?: CallOverrides): Promise<[string]>;

    getSavTokenAddress(overrides?: CallOverrides): Promise<[string]>;

    getSavrTokenAddress(overrides?: CallOverrides): Promise<[string]>;

    getStakingAddress(overrides?: CallOverrides): Promise<[string]>;

    getTeamsAddress(overrides?: CallOverrides): Promise<[string]>;

    getTicketAddress(overrides?: CallOverrides): Promise<[string]>;
  };

  getAvatarSettings(overrides?: CallOverrides): Promise<string>;

  getAvatarsAddress(overrides?: CallOverrides): Promise<string>;

  getBirthdayPrizesPool(overrides?: CallOverrides): Promise<string>;

  getPowersAddress(overrides?: CallOverrides): Promise<string>;

  getRafflesAddress(overrides?: CallOverrides): Promise<string>;

  getReferralManagerAddress(overrides?: CallOverrides): Promise<string>;

  getSavTokenAddress(overrides?: CallOverrides): Promise<string>;

  getSavrTokenAddress(overrides?: CallOverrides): Promise<string>;

  getStakingAddress(overrides?: CallOverrides): Promise<string>;

  getTeamsAddress(overrides?: CallOverrides): Promise<string>;

  getTicketAddress(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    getAvatarSettings(overrides?: CallOverrides): Promise<string>;

    getAvatarsAddress(overrides?: CallOverrides): Promise<string>;

    getBirthdayPrizesPool(overrides?: CallOverrides): Promise<string>;

    getPowersAddress(overrides?: CallOverrides): Promise<string>;

    getRafflesAddress(overrides?: CallOverrides): Promise<string>;

    getReferralManagerAddress(overrides?: CallOverrides): Promise<string>;

    getSavTokenAddress(overrides?: CallOverrides): Promise<string>;

    getSavrTokenAddress(overrides?: CallOverrides): Promise<string>;

    getStakingAddress(overrides?: CallOverrides): Promise<string>;

    getTeamsAddress(overrides?: CallOverrides): Promise<string>;

    getTicketAddress(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    getAvatarSettings(overrides?: CallOverrides): Promise<BigNumber>;

    getAvatarsAddress(overrides?: CallOverrides): Promise<BigNumber>;

    getBirthdayPrizesPool(overrides?: CallOverrides): Promise<BigNumber>;

    getPowersAddress(overrides?: CallOverrides): Promise<BigNumber>;

    getRafflesAddress(overrides?: CallOverrides): Promise<BigNumber>;

    getReferralManagerAddress(overrides?: CallOverrides): Promise<BigNumber>;

    getSavTokenAddress(overrides?: CallOverrides): Promise<BigNumber>;

    getSavrTokenAddress(overrides?: CallOverrides): Promise<BigNumber>;

    getStakingAddress(overrides?: CallOverrides): Promise<BigNumber>;

    getTeamsAddress(overrides?: CallOverrides): Promise<BigNumber>;

    getTicketAddress(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getAvatarSettings(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getAvatarsAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getBirthdayPrizesPool(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPowersAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRafflesAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getReferralManagerAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSavTokenAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSavrTokenAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getStakingAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTeamsAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTicketAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
