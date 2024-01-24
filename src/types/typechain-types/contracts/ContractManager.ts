/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface ContractManagerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "DEFAULT_ADMIN_ROLE"
      | "UPGRADER_ROLE"
      | "getAvatarsAddress"
      | "getBirthdayPrizesPool"
      | "getPowersAddress"
      | "getRafflesAddress"
      | "getReferralManagerAddress"
      | "getRoleAdmin"
      | "getSavTokenAddress"
      | "getSavrTokenAddress"
      | "getStakingAddress"
      | "getTeamsAddress"
      | "getTicketAddress"
      | "grantRole"
      | "hasRole"
      | "initialize"
      | "proxiableUUID"
      | "renounceRole"
      | "revokeRole"
      | "supportsInterface"
      | "updateAvatars"
      | "updateBirthdayPrizesPool"
      | "updatePowers"
      | "updateRaffles"
      | "updateReferralManager"
      | "updateSavToken"
      | "updateSavrToken"
      | "updateStaking"
      | "updateTeams"
      | "updateTicket"
      | "upgradeTo"
      | "upgradeToAndCall"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AdminChanged"
      | "BeaconUpgraded"
      | "Initialized"
      | "RoleAdminChanged"
      | "RoleGranted"
      | "RoleRevoked"
      | "Upgraded"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "UPGRADER_ROLE",
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
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
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
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateAvatars",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateBirthdayPrizesPool",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePowers",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateRaffles",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateReferralManager",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateSavToken",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateSavrToken",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateStaking",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateTeams",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateTicket",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeTo",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [AddressLike, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "UPGRADER_ROLE",
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
    functionFragment: "getRoleAdmin",
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
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateAvatars",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateBirthdayPrizesPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updatePowers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateRaffles",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateReferralManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateSavToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateSavrToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateStaking",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateTeams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateTicket",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;
}

export namespace AdminChangedEvent {
  export type InputTuple = [previousAdmin: AddressLike, newAdmin: AddressLike];
  export type OutputTuple = [previousAdmin: string, newAdmin: string];
  export interface OutputObject {
    previousAdmin: string;
    newAdmin: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BeaconUpgradedEvent {
  export type InputTuple = [beacon: AddressLike];
  export type OutputTuple = [beacon: string];
  export interface OutputObject {
    beacon: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleAdminChangedEvent {
  export type InputTuple = [
    role: BytesLike,
    previousAdminRole: BytesLike,
    newAdminRole: BytesLike
  ];
  export type OutputTuple = [
    role: string,
    previousAdminRole: string,
    newAdminRole: string
  ];
  export interface OutputObject {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleGrantedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleRevokedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpgradedEvent {
  export type InputTuple = [implementation: AddressLike];
  export type OutputTuple = [implementation: string];
  export interface OutputObject {
    implementation: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface ContractManager extends BaseContract {
  connect(runner?: ContractRunner | null): ContractManager;
  waitForDeployment(): Promise<this>;

  interface: ContractManagerInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  DEFAULT_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  UPGRADER_ROLE: TypedContractMethod<[], [string], "view">;

  getAvatarsAddress: TypedContractMethod<[], [string], "view">;

  getBirthdayPrizesPool: TypedContractMethod<[], [string], "view">;

  getPowersAddress: TypedContractMethod<[], [string], "view">;

  getRafflesAddress: TypedContractMethod<[], [string], "view">;

  getReferralManagerAddress: TypedContractMethod<[], [string], "view">;

  getRoleAdmin: TypedContractMethod<[role: BytesLike], [string], "view">;

  getSavTokenAddress: TypedContractMethod<[], [string], "view">;

  getSavrTokenAddress: TypedContractMethod<[], [string], "view">;

  getStakingAddress: TypedContractMethod<[], [string], "view">;

  getTeamsAddress: TypedContractMethod<[], [string], "view">;

  getTicketAddress: TypedContractMethod<[], [string], "view">;

  grantRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  hasRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [boolean],
    "view"
  >;

  initialize: TypedContractMethod<[], [void], "nonpayable">;

  proxiableUUID: TypedContractMethod<[], [string], "view">;

  renounceRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  revokeRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  updateAvatars: TypedContractMethod<
    [_avatars: AddressLike],
    [void],
    "nonpayable"
  >;

  updateBirthdayPrizesPool: TypedContractMethod<
    [_birthdayPrizesPool: AddressLike],
    [void],
    "nonpayable"
  >;

  updatePowers: TypedContractMethod<
    [_powers: AddressLike],
    [void],
    "nonpayable"
  >;

  updateRaffles: TypedContractMethod<
    [_raffles: AddressLike],
    [void],
    "nonpayable"
  >;

  updateReferralManager: TypedContractMethod<
    [_referralManager: AddressLike],
    [void],
    "nonpayable"
  >;

  updateSavToken: TypedContractMethod<
    [_savToken: AddressLike],
    [void],
    "nonpayable"
  >;

  updateSavrToken: TypedContractMethod<
    [_savrToken: AddressLike],
    [void],
    "nonpayable"
  >;

  updateStaking: TypedContractMethod<
    [_staking: AddressLike],
    [void],
    "nonpayable"
  >;

  updateTeams: TypedContractMethod<[_teams: AddressLike], [void], "nonpayable">;

  updateTicket: TypedContractMethod<
    [_ticket: AddressLike],
    [void],
    "nonpayable"
  >;

  upgradeTo: TypedContractMethod<
    [newImplementation: AddressLike],
    [void],
    "nonpayable"
  >;

  upgradeToAndCall: TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "DEFAULT_ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "UPGRADER_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getAvatarsAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getBirthdayPrizesPool"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPowersAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getRafflesAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getReferralManagerAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getRoleAdmin"
  ): TypedContractMethod<[role: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getSavTokenAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getSavrTokenAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getStakingAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getTeamsAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getTicketAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "grantRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "hasRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "proxiableUUID"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "revokeRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "updateAvatars"
  ): TypedContractMethod<[_avatars: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateBirthdayPrizesPool"
  ): TypedContractMethod<
    [_birthdayPrizesPool: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "updatePowers"
  ): TypedContractMethod<[_powers: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateRaffles"
  ): TypedContractMethod<[_raffles: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateReferralManager"
  ): TypedContractMethod<[_referralManager: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateSavToken"
  ): TypedContractMethod<[_savToken: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateSavrToken"
  ): TypedContractMethod<[_savrToken: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateStaking"
  ): TypedContractMethod<[_staking: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateTeams"
  ): TypedContractMethod<[_teams: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateTicket"
  ): TypedContractMethod<[_ticket: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "upgradeTo"
  ): TypedContractMethod<
    [newImplementation: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "upgradeToAndCall"
  ): TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;

  getEvent(
    key: "AdminChanged"
  ): TypedContractEvent<
    AdminChangedEvent.InputTuple,
    AdminChangedEvent.OutputTuple,
    AdminChangedEvent.OutputObject
  >;
  getEvent(
    key: "BeaconUpgraded"
  ): TypedContractEvent<
    BeaconUpgradedEvent.InputTuple,
    BeaconUpgradedEvent.OutputTuple,
    BeaconUpgradedEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "RoleAdminChanged"
  ): TypedContractEvent<
    RoleAdminChangedEvent.InputTuple,
    RoleAdminChangedEvent.OutputTuple,
    RoleAdminChangedEvent.OutputObject
  >;
  getEvent(
    key: "RoleGranted"
  ): TypedContractEvent<
    RoleGrantedEvent.InputTuple,
    RoleGrantedEvent.OutputTuple,
    RoleGrantedEvent.OutputObject
  >;
  getEvent(
    key: "RoleRevoked"
  ): TypedContractEvent<
    RoleRevokedEvent.InputTuple,
    RoleRevokedEvent.OutputTuple,
    RoleRevokedEvent.OutputObject
  >;
  getEvent(
    key: "Upgraded"
  ): TypedContractEvent<
    UpgradedEvent.InputTuple,
    UpgradedEvent.OutputTuple,
    UpgradedEvent.OutputObject
  >;

  filters: {
    "AdminChanged(address,address)": TypedContractEvent<
      AdminChangedEvent.InputTuple,
      AdminChangedEvent.OutputTuple,
      AdminChangedEvent.OutputObject
    >;
    AdminChanged: TypedContractEvent<
      AdminChangedEvent.InputTuple,
      AdminChangedEvent.OutputTuple,
      AdminChangedEvent.OutputObject
    >;

    "BeaconUpgraded(address)": TypedContractEvent<
      BeaconUpgradedEvent.InputTuple,
      BeaconUpgradedEvent.OutputTuple,
      BeaconUpgradedEvent.OutputObject
    >;
    BeaconUpgraded: TypedContractEvent<
      BeaconUpgradedEvent.InputTuple,
      BeaconUpgradedEvent.OutputTuple,
      BeaconUpgradedEvent.OutputObject
    >;

    "Initialized(uint8)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "RoleAdminChanged(bytes32,bytes32,bytes32)": TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
    >;
    RoleAdminChanged: TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
    >;

    "RoleGranted(bytes32,address,address)": TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;
    RoleGranted: TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;

    "RoleRevoked(bytes32,address,address)": TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;
    RoleRevoked: TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;

    "Upgraded(address)": TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
    Upgraded: TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
  };
}
