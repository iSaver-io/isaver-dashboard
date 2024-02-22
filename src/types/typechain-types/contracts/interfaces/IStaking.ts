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
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../common";

export declare namespace IStaking {
  export type UserStakingInfoStruct = {
    totalClaimed: BigNumberish;
    currentSavTokenStaked: BigNumberish;
    currentSavrTokenStaked: BigNumberish;
    isSubscribed: boolean;
    subscribedTill: BigNumberish;
  };

  export type UserStakingInfoStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    boolean,
    BigNumber
  ] & {
    totalClaimed: BigNumber;
    currentSavTokenStaked: BigNumber;
    currentSavrTokenStaked: BigNumber;
    isSubscribed: boolean;
    subscribedTill: BigNumber;
  };

  export type StakeStruct = {
    amount: BigNumberish;
    timeStart: BigNumberish;
    timeEnd: BigNumberish;
    apr: BigNumberish;
    profit: BigNumberish;
    isClaimed: boolean;
    isSAVRToken: boolean;
  };

  export type StakeStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    boolean,
    boolean
  ] & {
    amount: BigNumber;
    timeStart: BigNumber;
    timeEnd: BigNumber;
    apr: BigNumber;
    profit: BigNumber;
    isClaimed: boolean;
    isSAVRToken: boolean;
  };
}

export interface IStakingInterface extends utils.Interface {
  functions: {
    "claimSuperPlan(uint256)": FunctionFragment;
    "deposit(uint256,uint256,bool,address)": FunctionFragment;
    "depositSuperPlan(uint256,uint256)": FunctionFragment;
    "getAvailableStakeReward(uint256,address,uint256)": FunctionFragment;
    "getAvailableSuperStakeReward(uint256,address)": FunctionFragment;
    "getUserPlanInfo(uint256,address)": FunctionFragment;
    "getUserStakes(uint256,address)": FunctionFragment;
    "hasAnySubscription(address)": FunctionFragment;
    "hasSubscription(uint256,address)": FunctionFragment;
    "renewPowerSubscriptionB(address)": FunctionFragment;
    "subscribe(uint256)": FunctionFragment;
    "withdraw(uint256,uint256)": FunctionFragment;
    "withdrawSuperPlan(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "claimSuperPlan"
      | "deposit"
      | "depositSuperPlan"
      | "getAvailableStakeReward"
      | "getAvailableSuperStakeReward"
      | "getUserPlanInfo"
      | "getUserStakes"
      | "hasAnySubscription"
      | "hasSubscription"
      | "renewPowerSubscriptionB"
      | "subscribe"
      | "withdraw"
      | "withdrawSuperPlan"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "claimSuperPlan",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BigNumberish, BigNumberish, boolean, string]
  ): string;
  encodeFunctionData(
    functionFragment: "depositSuperPlan",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAvailableStakeReward",
    values: [BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAvailableSuperStakeReward",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserPlanInfo",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserStakes",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasAnySubscription",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasSubscription",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "renewPowerSubscriptionB",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "subscribe",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawSuperPlan",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "claimSuperPlan",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositSuperPlan",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAvailableStakeReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAvailableSuperStakeReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserPlanInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserStakes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasAnySubscription",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasSubscription",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renewPowerSubscriptionB",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "subscribe", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawSuperPlan",
    data: BytesLike
  ): Result;

  events: {
    "ActivityChanged(uint256,bool)": EventFragment;
    "Claimed(address,uint256,uint256,uint256,bool,uint256)": EventFragment;
    "Staked(address,uint256,uint256,uint256,uint256,bool,uint256)": EventFragment;
    "StakedSuperPlan(address,uint256,uint256,uint256)": EventFragment;
    "StakingPlanCreated(uint256,uint256,uint256)": EventFragment;
    "Subscribed(address,uint256)": EventFragment;
    "SuperAprUpdated(uint256,uint256,uint256)": EventFragment;
    "SuperClaimed(address,uint256,uint256,uint256)": EventFragment;
    "SuperPlanActivityChanged(uint256,bool)": EventFragment;
    "SuperStakingPlanCreated(uint256,uint256)": EventFragment;
    "SuperWithdrawn(address,uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ActivityChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Claimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Staked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StakedSuperPlan"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StakingPlanCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Subscribed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SuperAprUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SuperClaimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SuperPlanActivityChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SuperStakingPlanCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SuperWithdrawn"): EventFragment;
}

export interface ActivityChangedEventObject {
  stakingPlanId: BigNumber;
  isActive: boolean;
}
export type ActivityChangedEvent = TypedEvent<
  [BigNumber, boolean],
  ActivityChangedEventObject
>;

export type ActivityChangedEventFilter = TypedEventFilter<ActivityChangedEvent>;

export interface ClaimedEventObject {
  user: string;
  stakingPlanId: BigNumber;
  stakeIndex: BigNumber;
  amount: BigNumber;
  isSAVRToken: boolean;
  timestamp: BigNumber;
}
export type ClaimedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, boolean, BigNumber],
  ClaimedEventObject
>;

export type ClaimedEventFilter = TypedEventFilter<ClaimedEvent>;

export interface StakedEventObject {
  user: string;
  stakingPlanId: BigNumber;
  stakeIndex: BigNumber;
  amount: BigNumber;
  profit: BigNumber;
  isSAVRToken: boolean;
  timestamp: BigNumber;
}
export type StakedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, BigNumber, boolean, BigNumber],
  StakedEventObject
>;

export type StakedEventFilter = TypedEventFilter<StakedEvent>;

export interface StakedSuperPlanEventObject {
  user: string;
  superStakingPlanId: BigNumber;
  amount: BigNumber;
  timestamp: BigNumber;
}
export type StakedSuperPlanEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  StakedSuperPlanEventObject
>;

export type StakedSuperPlanEventFilter = TypedEventFilter<StakedSuperPlanEvent>;

export interface StakingPlanCreatedEventObject {
  stakingPlanId: BigNumber;
  duration: BigNumber;
  apr: BigNumber;
}
export type StakingPlanCreatedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber],
  StakingPlanCreatedEventObject
>;

export type StakingPlanCreatedEventFilter =
  TypedEventFilter<StakingPlanCreatedEvent>;

export interface SubscribedEventObject {
  user: string;
  stakingPlanId: BigNumber;
}
export type SubscribedEvent = TypedEvent<
  [string, BigNumber],
  SubscribedEventObject
>;

export type SubscribedEventFilter = TypedEventFilter<SubscribedEvent>;

export interface SuperAprUpdatedEventObject {
  superPlanId: BigNumber;
  newApr: BigNumber;
  timestamp: BigNumber;
}
export type SuperAprUpdatedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber],
  SuperAprUpdatedEventObject
>;

export type SuperAprUpdatedEventFilter = TypedEventFilter<SuperAprUpdatedEvent>;

export interface SuperClaimedEventObject {
  user: string;
  superStakingPlanId: BigNumber;
  profit: BigNumber;
  timestamp: BigNumber;
}
export type SuperClaimedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  SuperClaimedEventObject
>;

export type SuperClaimedEventFilter = TypedEventFilter<SuperClaimedEvent>;

export interface SuperPlanActivityChangedEventObject {
  superStakingPlanId: BigNumber;
  isActive: boolean;
}
export type SuperPlanActivityChangedEvent = TypedEvent<
  [BigNumber, boolean],
  SuperPlanActivityChangedEventObject
>;

export type SuperPlanActivityChangedEventFilter =
  TypedEventFilter<SuperPlanActivityChangedEvent>;

export interface SuperStakingPlanCreatedEventObject {
  superStakingPlanId: BigNumber;
  apr: BigNumber;
}
export type SuperStakingPlanCreatedEvent = TypedEvent<
  [BigNumber, BigNumber],
  SuperStakingPlanCreatedEventObject
>;

export type SuperStakingPlanCreatedEventFilter =
  TypedEventFilter<SuperStakingPlanCreatedEvent>;

export interface SuperWithdrawnEventObject {
  user: string;
  superStakingPlanId: BigNumber;
  amount: BigNumber;
  timestamp: BigNumber;
}
export type SuperWithdrawnEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  SuperWithdrawnEventObject
>;

export type SuperWithdrawnEventFilter = TypedEventFilter<SuperWithdrawnEvent>;

export interface IStaking extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IStakingInterface;

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
    claimSuperPlan(
      superPlanId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    deposit(
      planId: BigNumberish,
      depositAmount: BigNumberish,
      isSAVRToken: boolean,
      referrer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    depositSuperPlan(
      superPlanId: BigNumberish,
      depositAmount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    getAvailableStakeReward(
      planId: BigNumberish,
      userAddress: string,
      stakeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getAvailableSuperStakeReward(
      superPlanId: BigNumberish,
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getUserPlanInfo(
      planId: BigNumberish,
      userAddress: string,
      overrides?: CallOverrides
    ): Promise<[IStaking.UserStakingInfoStructOutput]>;

    getUserStakes(
      planId: BigNumberish,
      userAddress: string,
      overrides?: CallOverrides
    ): Promise<
      [IStaking.StakeStructOutput[]] & { stakes: IStaking.StakeStructOutput[] }
    >;

    hasAnySubscription(
      user: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    hasSubscription(
      planId: BigNumberish,
      user: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    renewPowerSubscriptionB(
      user: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    subscribe(
      planId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    withdraw(
      planId: BigNumberish,
      stakeId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    withdrawSuperPlan(
      superPlanId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  claimSuperPlan(
    superPlanId: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  deposit(
    planId: BigNumberish,
    depositAmount: BigNumberish,
    isSAVRToken: boolean,
    referrer: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  depositSuperPlan(
    superPlanId: BigNumberish,
    depositAmount: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  getAvailableStakeReward(
    planId: BigNumberish,
    userAddress: string,
    stakeId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getAvailableSuperStakeReward(
    superPlanId: BigNumberish,
    user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUserPlanInfo(
    planId: BigNumberish,
    userAddress: string,
    overrides?: CallOverrides
  ): Promise<IStaking.UserStakingInfoStructOutput>;

  getUserStakes(
    planId: BigNumberish,
    userAddress: string,
    overrides?: CallOverrides
  ): Promise<IStaking.StakeStructOutput[]>;

  hasAnySubscription(user: string, overrides?: CallOverrides): Promise<boolean>;

  hasSubscription(
    planId: BigNumberish,
    user: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  renewPowerSubscriptionB(
    user: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  subscribe(
    planId: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  withdraw(
    planId: BigNumberish,
    stakeId: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  withdrawSuperPlan(
    superPlanId: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    claimSuperPlan(
      superPlanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    deposit(
      planId: BigNumberish,
      depositAmount: BigNumberish,
      isSAVRToken: boolean,
      referrer: string,
      overrides?: CallOverrides
    ): Promise<void>;

    depositSuperPlan(
      superPlanId: BigNumberish,
      depositAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getAvailableStakeReward(
      planId: BigNumberish,
      userAddress: string,
      stakeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAvailableSuperStakeReward(
      superPlanId: BigNumberish,
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserPlanInfo(
      planId: BigNumberish,
      userAddress: string,
      overrides?: CallOverrides
    ): Promise<IStaking.UserStakingInfoStructOutput>;

    getUserStakes(
      planId: BigNumberish,
      userAddress: string,
      overrides?: CallOverrides
    ): Promise<IStaking.StakeStructOutput[]>;

    hasAnySubscription(
      user: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    hasSubscription(
      planId: BigNumberish,
      user: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    renewPowerSubscriptionB(
      user: string,
      overrides?: CallOverrides
    ): Promise<void>;

    subscribe(planId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    withdraw(
      planId: BigNumberish,
      stakeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawSuperPlan(
      superPlanId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ActivityChanged(uint256,bool)"(
      stakingPlanId?: BigNumberish | null,
      isActive?: null
    ): ActivityChangedEventFilter;
    ActivityChanged(
      stakingPlanId?: BigNumberish | null,
      isActive?: null
    ): ActivityChangedEventFilter;

    "Claimed(address,uint256,uint256,uint256,bool,uint256)"(
      user?: string | null,
      stakingPlanId?: BigNumberish | null,
      stakeIndex?: BigNumberish | null,
      amount?: null,
      isSAVRToken?: null,
      timestamp?: null
    ): ClaimedEventFilter;
    Claimed(
      user?: string | null,
      stakingPlanId?: BigNumberish | null,
      stakeIndex?: BigNumberish | null,
      amount?: null,
      isSAVRToken?: null,
      timestamp?: null
    ): ClaimedEventFilter;

    "Staked(address,uint256,uint256,uint256,uint256,bool,uint256)"(
      user?: string | null,
      stakingPlanId?: BigNumberish | null,
      stakeIndex?: BigNumberish | null,
      amount?: null,
      profit?: null,
      isSAVRToken?: null,
      timestamp?: null
    ): StakedEventFilter;
    Staked(
      user?: string | null,
      stakingPlanId?: BigNumberish | null,
      stakeIndex?: BigNumberish | null,
      amount?: null,
      profit?: null,
      isSAVRToken?: null,
      timestamp?: null
    ): StakedEventFilter;

    "StakedSuperPlan(address,uint256,uint256,uint256)"(
      user?: string | null,
      superStakingPlanId?: BigNumberish | null,
      amount?: null,
      timestamp?: null
    ): StakedSuperPlanEventFilter;
    StakedSuperPlan(
      user?: string | null,
      superStakingPlanId?: BigNumberish | null,
      amount?: null,
      timestamp?: null
    ): StakedSuperPlanEventFilter;

    "StakingPlanCreated(uint256,uint256,uint256)"(
      stakingPlanId?: BigNumberish | null,
      duration?: null,
      apr?: null
    ): StakingPlanCreatedEventFilter;
    StakingPlanCreated(
      stakingPlanId?: BigNumberish | null,
      duration?: null,
      apr?: null
    ): StakingPlanCreatedEventFilter;

    "Subscribed(address,uint256)"(
      user?: string | null,
      stakingPlanId?: BigNumberish | null
    ): SubscribedEventFilter;
    Subscribed(
      user?: string | null,
      stakingPlanId?: BigNumberish | null
    ): SubscribedEventFilter;

    "SuperAprUpdated(uint256,uint256,uint256)"(
      superPlanId?: BigNumberish | null,
      newApr?: null,
      timestamp?: null
    ): SuperAprUpdatedEventFilter;
    SuperAprUpdated(
      superPlanId?: BigNumberish | null,
      newApr?: null,
      timestamp?: null
    ): SuperAprUpdatedEventFilter;

    "SuperClaimed(address,uint256,uint256,uint256)"(
      user?: string | null,
      superStakingPlanId?: BigNumberish | null,
      profit?: null,
      timestamp?: null
    ): SuperClaimedEventFilter;
    SuperClaimed(
      user?: string | null,
      superStakingPlanId?: BigNumberish | null,
      profit?: null,
      timestamp?: null
    ): SuperClaimedEventFilter;

    "SuperPlanActivityChanged(uint256,bool)"(
      superStakingPlanId?: BigNumberish | null,
      isActive?: null
    ): SuperPlanActivityChangedEventFilter;
    SuperPlanActivityChanged(
      superStakingPlanId?: BigNumberish | null,
      isActive?: null
    ): SuperPlanActivityChangedEventFilter;

    "SuperStakingPlanCreated(uint256,uint256)"(
      superStakingPlanId?: BigNumberish | null,
      apr?: null
    ): SuperStakingPlanCreatedEventFilter;
    SuperStakingPlanCreated(
      superStakingPlanId?: BigNumberish | null,
      apr?: null
    ): SuperStakingPlanCreatedEventFilter;

    "SuperWithdrawn(address,uint256,uint256,uint256)"(
      user?: string | null,
      superStakingPlanId?: BigNumberish | null,
      amount?: null,
      timestamp?: null
    ): SuperWithdrawnEventFilter;
    SuperWithdrawn(
      user?: string | null,
      superStakingPlanId?: BigNumberish | null,
      amount?: null,
      timestamp?: null
    ): SuperWithdrawnEventFilter;
  };

  estimateGas: {
    claimSuperPlan(
      superPlanId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    deposit(
      planId: BigNumberish,
      depositAmount: BigNumberish,
      isSAVRToken: boolean,
      referrer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    depositSuperPlan(
      superPlanId: BigNumberish,
      depositAmount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    getAvailableStakeReward(
      planId: BigNumberish,
      userAddress: string,
      stakeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAvailableSuperStakeReward(
      superPlanId: BigNumberish,
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserPlanInfo(
      planId: BigNumberish,
      userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserStakes(
      planId: BigNumberish,
      userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hasAnySubscription(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hasSubscription(
      planId: BigNumberish,
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renewPowerSubscriptionB(
      user: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    subscribe(
      planId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    withdraw(
      planId: BigNumberish,
      stakeId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    withdrawSuperPlan(
      superPlanId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    claimSuperPlan(
      superPlanId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    deposit(
      planId: BigNumberish,
      depositAmount: BigNumberish,
      isSAVRToken: boolean,
      referrer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    depositSuperPlan(
      superPlanId: BigNumberish,
      depositAmount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    getAvailableStakeReward(
      planId: BigNumberish,
      userAddress: string,
      stakeId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAvailableSuperStakeReward(
      superPlanId: BigNumberish,
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserPlanInfo(
      planId: BigNumberish,
      userAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserStakes(
      planId: BigNumberish,
      userAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hasAnySubscription(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hasSubscription(
      planId: BigNumberish,
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renewPowerSubscriptionB(
      user: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    subscribe(
      planId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    withdraw(
      planId: BigNumberish,
      stakeId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    withdrawSuperPlan(
      superPlanId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
