/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ContractManager,
  ContractManagerInterface,
} from "../../contracts/ContractManager";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPGRADER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRafflesAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReferralManagerAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSavTokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSavrTokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStakingAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTeamsAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTicketAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_raffles",
        type: "address",
      },
    ],
    name: "updateRaffles",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_referralManager",
        type: "address",
      },
    ],
    name: "updateReferralManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_savToken",
        type: "address",
      },
    ],
    name: "updateSavToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_savrToken",
        type: "address",
      },
    ],
    name: "updateSavrToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_staking",
        type: "address",
      },
    ],
    name: "updateStaking",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_teams",
        type: "address",
      },
    ],
    name: "updateTeams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_ticket",
        type: "address",
      },
    ],
    name: "updateTicket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a06040523060805234801561001457600080fd5b5061001d610022565b6100e1565b600054610100900460ff161561008e5760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff908116146100df576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b60805161167261011860003960008181610606015281816106460152818161074301528181610783015261081201526116726000f3fe6080604052600436106101815760003560e01c80637a286a03116100d1578063a345f38d1161008a578063ad55c4b511610064578063ad55c4b514610457578063d547741f14610475578063e47514c114610495578063f72c0d8b146104b557600080fd5b8063a345f38d146103fb578063a736cd481461041b578063aa42a7601461043957600080fd5b80637a286a03146103535780637c67b339146103725780638129fc1c1461039257806391d14854146103a7578063976edfd9146103c7578063a217fddf146103e657600080fd5b806336568abe1161013e578063464d21b111610118578063464d21b1146102eb5780634f1ef2861461030b57806352d1902d1461031e5780636b360a3f1461033357600080fd5b806336568abe1461028b5780633659cfe6146102ab578063402870c7146102cb57600080fd5b806301ffc9a71461018657806306e34c2c146101bb5780630e9ed68b146101dd578063248a9ca31461020f5780632f2ff15d1461024d57806330c21c721461026d575b600080fd5b34801561019257600080fd5b506101a66101a136600461125c565b6104e9565b60405190151581526020015b60405180910390f35b3480156101c757600080fd5b506101db6101d63660046112a2565b610520565b005b3480156101e957600080fd5b5060fe546001600160a01b03165b6040516001600160a01b0390911681526020016101b2565b34801561021b57600080fd5b5061023f61022a3660046112bd565b60009081526065602052604090206001015490565b6040519081526020016101b2565b34801561025957600080fd5b506101db6102683660046112d6565b61054e565b34801561027957600080fd5b5060fb546001600160a01b03166101f7565b34801561029757600080fd5b506101db6102a63660046112d6565b610578565b3480156102b757600080fd5b506101db6102c63660046112a2565b6105fb565b3480156102d757600080fd5b506101db6102e63660046112a2565b6106db565b3480156102f757600080fd5b506101db6103063660046112a2565b61070a565b6101db610319366004611318565b610738565b34801561032a57600080fd5b5061023f610805565b34801561033f57600080fd5b506101db61034e3660046112a2565b6108b8565b34801561035f57600080fd5b50610100546001600160a01b03166101f7565b34801561037e57600080fd5b506101db61038d3660046112a2565b6108e6565b34801561039e57600080fd5b506101db610914565b3480156103b357600080fd5b506101a66103c23660046112d6565b610a61565b3480156103d357600080fd5b50610101546001600160a01b03166101f7565b3480156103f257600080fd5b5061023f600081565b34801561040757600080fd5b506101db6104163660046112a2565b610a8c565b34801561042757600080fd5b5060fc546001600160a01b03166101f7565b34801561044557600080fd5b5060ff546001600160a01b03166101f7565b34801561046357600080fd5b5060fd546001600160a01b03166101f7565b34801561048157600080fd5b506101db6104903660046112d6565b610aba565b3480156104a157600080fd5b506101db6104b03660046112a2565b610adf565b3480156104c157600080fd5b5061023f7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e381565b60006001600160e01b03198216637965db0b60e01b148061051a57506301ffc9a760e01b6001600160e01b03198316145b92915050565b600061052b81610b0e565b5060fc80546001600160a01b0319166001600160a01b0392909216919091179055565b60008281526065602052604090206001015461056981610b0e565b6105738383610b18565b505050565b6001600160a01b03811633146105ed5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6105f78282610b9e565b5050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156106445760405162461bcd60e51b81526004016105e4906113da565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661068d6000805160206115f6833981519152546001600160a01b031690565b6001600160a01b0316146106b35760405162461bcd60e51b81526004016105e490611426565b6106bc81610c05565b604080516000808252602082019092526106d891839190610c2f565b50565b60006106e681610b0e565b5061010180546001600160a01b0319166001600160a01b0392909216919091179055565b600061071581610b0e565b5060fd80546001600160a01b0319166001600160a01b0392909216919091179055565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156107815760405162461bcd60e51b81526004016105e4906113da565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166107ca6000805160206115f6833981519152546001600160a01b031690565b6001600160a01b0316146107f05760405162461bcd60e51b81526004016105e490611426565b6107f982610c05565b6105f782826001610c2f565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146108a55760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c000000000000000060648201526084016105e4565b506000805160206115f683398151915290565b60006108c381610b0e565b5060fb80546001600160a01b0319166001600160a01b0392909216919091179055565b60006108f181610b0e565b5060ff80546001600160a01b0319166001600160a01b0392909216919091179055565b600054610100900460ff16158080156109345750600054600160ff909116105b8061094e5750303b15801561094e575060005460ff166001145b6109b15760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016105e4565b6000805460ff1916600117905580156109d4576000805461ff0019166101001790555b6109dc610d9a565b6109e4610d9a565b6109ef600033610b18565b610a197f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e333610b18565b80156106d8576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a150565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6000610a9781610b0e565b5060fe80546001600160a01b0319166001600160a01b0392909216919091179055565b600082815260656020526040902060010154610ad581610b0e565b6105738383610b9e565b6000610aea81610b0e565b5061010080546001600160a01b0319166001600160a01b0392909216919091179055565b6106d88133610e07565b610b228282610a61565b6105f75760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055610b5a3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b610ba88282610a61565b156105f75760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e36105f781610b0e565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff1615610c625761057383610e60565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610cbc575060408051601f3d908101601f19168201909252610cb991810190611472565b60015b610d1f5760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b60648201526084016105e4565b6000805160206115f68339815191528114610d8e5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b60648201526084016105e4565b50610573838383610efc565b600054610100900460ff16610e055760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b60648201526084016105e4565b565b610e118282610a61565b6105f757610e1e81610f27565b610e29836020610f39565b604051602001610e3a9291906114b7565b60408051601f198184030181529082905262461bcd60e51b82526105e49160040161152c565b6001600160a01b0381163b610ecd5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b60648201526084016105e4565b6000805160206115f683398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b610f05836110dc565b600082511180610f125750805b1561057357610f21838361111c565b50505050565b606061051a6001600160a01b03831660145b60606000610f48836002611575565b610f53906002611594565b67ffffffffffffffff811115610f6b57610f6b611302565b6040519080825280601f01601f191660200182016040528015610f95576020820181803683370190505b509050600360fc1b81600081518110610fb057610fb06115ac565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610fdf57610fdf6115ac565b60200101906001600160f81b031916908160001a9053506000611003846002611575565b61100e906001611594565b90505b6001811115611086576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110611042576110426115ac565b1a60f81b828281518110611058576110586115ac565b60200101906001600160f81b031916908160001a90535060049490941c9361107f816115c2565b9050611011565b5083156110d55760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016105e4565b9392505050565b6110e581610e60565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606110d58383604051806060016040528060278152602001611616602791396060600080856001600160a01b03168560405161115991906115d9565b600060405180830381855af49150503d8060008114611194576040519150601f19603f3d011682016040523d82523d6000602084013e611199565b606091505b50915091506111aa868383876111b4565b9695505050505050565b60608315611220578251611219576001600160a01b0385163b6112195760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016105e4565b508161122a565b61122a8383611232565b949350505050565b8151156112425781518083602001fd5b8060405162461bcd60e51b81526004016105e4919061152c565b60006020828403121561126e57600080fd5b81356001600160e01b0319811681146110d557600080fd5b80356001600160a01b038116811461129d57600080fd5b919050565b6000602082840312156112b457600080fd5b6110d582611286565b6000602082840312156112cf57600080fd5b5035919050565b600080604083850312156112e957600080fd5b823591506112f960208401611286565b90509250929050565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561132b57600080fd5b61133483611286565b9150602083013567ffffffffffffffff8082111561135157600080fd5b818501915085601f83011261136557600080fd5b81358181111561137757611377611302565b604051601f8201601f19908116603f0116810190838211818310171561139f5761139f611302565b816040528281528860208487010111156113b857600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b60006020828403121561148457600080fd5b5051919050565b60005b838110156114a657818101518382015260200161148e565b83811115610f215750506000910152565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516114ef81601785016020880161148b565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161152081602884016020880161148b565b01602801949350505050565b602081526000825180602084015261154b81604085016020870161148b565b601f01601f19169190910160400192915050565b634e487b7160e01b600052601160045260246000fd5b600081600019048311821515161561158f5761158f61155f565b500290565b600082198211156115a7576115a761155f565b500190565b634e487b7160e01b600052603260045260246000fd5b6000816115d1576115d161155f565b506000190190565b600082516115eb81846020870161148b565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212205c6654fdd3c36dd8d37cd89baf2b703b06d4556c887e703b40e37aa12fdeef3c64736f6c634300080b0033";

type ContractManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ContractManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ContractManager__factory extends ContractFactory {
  constructor(...args: ContractManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractManager> {
    return super.deploy(overrides || {}) as Promise<ContractManager>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ContractManager {
    return super.attach(address) as ContractManager;
  }
  override connect(signer: Signer): ContractManager__factory {
    return super.connect(signer) as ContractManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ContractManagerInterface {
    return new utils.Interface(_abi) as ContractManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ContractManager {
    return new Contract(address, _abi, signerOrProvider) as ContractManager;
  }
}