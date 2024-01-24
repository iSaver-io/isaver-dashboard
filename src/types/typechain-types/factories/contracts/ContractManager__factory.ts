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
    name: "getAvatarsAddress",
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
    name: "getBirthdayPrizesPool",
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
    name: "getPowersAddress",
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
        name: "_avatars",
        type: "address",
      },
    ],
    name: "updateAvatars",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_birthdayPrizesPool",
        type: "address",
      },
    ],
    name: "updateBirthdayPrizesPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_powers",
        type: "address",
      },
    ],
    name: "updatePowers",
    outputs: [],
    stateMutability: "nonpayable",
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
  "0x60a06040523060805234801561001457600080fd5b5061001d610022565b6100e1565b600054610100900460ff161561008e5760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff908116146100df576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b60805161181e610118600039600081816107250152818161076501528181610890015281816108d0015261098d015261181e6000f3fe6080604052600436106101e35760003560e01c806352d1902d11610102578063a217fddf11610095578063ad55c4b511610064578063ad55c4b514610576578063d547741f14610594578063e47514c1146105b4578063f72c0d8b146105d457600080fd5b8063a217fddf14610504578063a345f38d14610519578063a736cd4814610539578063aa42a7601461055757600080fd5b80638129fc1c116100d15780638129fc1c1461049057806391d14854146104a557806394975751146104c5578063976edfd9146104e557600080fd5b806352d1902d1461041c5780636b360a3f146104315780637a286a03146104515780637c67b3391461047057600080fd5b80633659cfe61161017a57806345fcc61d1161014957806345fcc61d146103ab578063464d21b1146103c95780634f1ef286146103e9578063507ad401146103fc57600080fd5b80633659cfe61461032d5780633eb012a11461034d5780633f3ec92b1461036b578063402870c71461038b57600080fd5b8063248a9ca3116101b6578063248a9ca3146102915780632f2ff15d146102cf57806330c21c72146102ef57806336568abe1461030d57600080fd5b806301ffc9a7146101e857806306e34c2c1461021d5780630e9ed68b1461023f5780630f3936c414610272575b600080fd5b3480156101f457600080fd5b50610208610203366004611408565b610608565b60405190151581526020015b60405180910390f35b34801561022957600080fd5b5061023d61023836600461144e565b61063f565b005b34801561024b57600080fd5b50610100546001600160a01b03165b6040516001600160a01b039091168152602001610214565b34801561027e57600080fd5b50610104546001600160a01b031661025a565b34801561029d57600080fd5b506102c16102ac366004611469565b60009081526065602052604090206001015490565b604051908152602001610214565b3480156102db57600080fd5b5061023d6102ea366004611482565b61066d565b3480156102fb57600080fd5b5060fb546001600160a01b031661025a565b34801561031957600080fd5b5061023d610328366004611482565b610697565b34801561033957600080fd5b5061023d61034836600461144e565b61071a565b34801561035957600080fd5b5060fd546001600160a01b031661025a565b34801561037757600080fd5b5061023d61038636600461144e565b6107fa565b34801561039757600080fd5b5061023d6103a636600461144e565b610828565b3480156103b757600080fd5b5060fe546001600160a01b031661025a565b3480156103d557600080fd5b5061023d6103e436600461144e565b610857565b61023d6103f73660046114c4565b610885565b34801561040857600080fd5b5061023d61041736600461144e565b610952565b34801561042857600080fd5b506102c1610980565b34801561043d57600080fd5b5061023d61044c36600461144e565b610a33565b34801561045d57600080fd5b50610102546001600160a01b031661025a565b34801561047c57600080fd5b5061023d61048b36600461144e565b610a61565b34801561049c57600080fd5b5061023d610a90565b3480156104b157600080fd5b506102086104c0366004611482565b610bdd565b3480156104d157600080fd5b5061023d6104e036600461144e565b610c08565b3480156104f157600080fd5b50610103546001600160a01b031661025a565b34801561051057600080fd5b506102c1600081565b34801561052557600080fd5b5061023d61053436600461144e565b610c37565b34801561054557600080fd5b5060fc546001600160a01b031661025a565b34801561056357600080fd5b50610101546001600160a01b031661025a565b34801561058257600080fd5b5060ff546001600160a01b031661025a565b3480156105a057600080fd5b5061023d6105af366004611482565b610c66565b3480156105c057600080fd5b5061023d6105cf36600461144e565b610c8b565b3480156105e057600080fd5b506102c17f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e381565b60006001600160e01b03198216637965db0b60e01b148061063957506301ffc9a760e01b6001600160e01b03198316145b92915050565b600061064a81610cba565b5060fc80546001600160a01b0319166001600160a01b0392909216919091179055565b60008281526065602052604090206001015461068881610cba565b6106928383610cc4565b505050565b6001600160a01b038116331461070c5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6107168282610d4a565b5050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156107635760405162461bcd60e51b815260040161070390611586565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166107ac6000805160206117a2833981519152546001600160a01b031690565b6001600160a01b0316146107d25760405162461bcd60e51b8152600401610703906115d2565b6107db81610db1565b604080516000808252602082019092526107f791839190610ddb565b50565b600061080581610cba565b5060fd80546001600160a01b0319166001600160a01b0392909216919091179055565b600061083381610cba565b5061010380546001600160a01b0319166001600160a01b0392909216919091179055565b600061086281610cba565b5060ff80546001600160a01b0319166001600160a01b0392909216919091179055565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156108ce5760405162461bcd60e51b815260040161070390611586565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166109176000805160206117a2833981519152546001600160a01b031690565b6001600160a01b03161461093d5760405162461bcd60e51b8152600401610703906115d2565b61094682610db1565b61071682826001610ddb565b600061095d81610cba565b5060fe80546001600160a01b0319166001600160a01b0392909216919091179055565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610a205760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c00000000000000006064820152608401610703565b506000805160206117a283398151915290565b6000610a3e81610cba565b5060fb80546001600160a01b0319166001600160a01b0392909216919091179055565b6000610a6c81610cba565b5061010180546001600160a01b0319166001600160a01b0392909216919091179055565b600054610100900460ff1615808015610ab05750600054600160ff909116105b80610aca5750303b158015610aca575060005460ff166001145b610b2d5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610703565b6000805460ff191660011790558015610b50576000805461ff0019166101001790555b610b58610f46565b610b60610f46565b610b6b600033610cc4565b610b957f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e333610cc4565b80156107f7576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a150565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6000610c1381610cba565b5061010480546001600160a01b0319166001600160a01b0392909216919091179055565b6000610c4281610cba565b5061010080546001600160a01b0319166001600160a01b0392909216919091179055565b600082815260656020526040902060010154610c8181610cba565b6106928383610d4a565b6000610c9681610cba565b5061010280546001600160a01b0319166001600160a01b0392909216919091179055565b6107f78133610fb3565b610cce8282610bdd565b6107165760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055610d063390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b610d548282610bdd565b156107165760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e361071681610cba565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff1615610e0e576106928361100c565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610e68575060408051601f3d908101601f19168201909252610e659181019061161e565b60015b610ecb5760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b6064820152608401610703565b6000805160206117a28339815191528114610f3a5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b6064820152608401610703565b506106928383836110a8565b600054610100900460ff16610fb15760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610703565b565b610fbd8282610bdd565b61071657610fca816110d3565b610fd58360206110e5565b604051602001610fe6929190611663565b60408051601f198184030181529082905262461bcd60e51b8252610703916004016116d8565b6001600160a01b0381163b6110795760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610703565b6000805160206117a283398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6110b183611288565b6000825111806110be5750805b15610692576110cd83836112c8565b50505050565b60606106396001600160a01b03831660145b606060006110f4836002611721565b6110ff906002611740565b67ffffffffffffffff811115611117576111176114ae565b6040519080825280601f01601f191660200182016040528015611141576020820181803683370190505b509050600360fc1b8160008151811061115c5761115c611758565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061118b5761118b611758565b60200101906001600160f81b031916908160001a90535060006111af846002611721565b6111ba906001611740565b90505b6001811115611232576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106111ee576111ee611758565b1a60f81b82828151811061120457611204611758565b60200101906001600160f81b031916908160001a90535060049490941c9361122b8161176e565b90506111bd565b5083156112815760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610703565b9392505050565b6112918161100c565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b606061128183836040518060600160405280602781526020016117c2602791396060600080856001600160a01b0316856040516113059190611785565b600060405180830381855af49150503d8060008114611340576040519150601f19603f3d011682016040523d82523d6000602084013e611345565b606091505b509150915061135686838387611360565b9695505050505050565b606083156113cc5782516113c5576001600160a01b0385163b6113c55760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610703565b50816113d6565b6113d683836113de565b949350505050565b8151156113ee5781518083602001fd5b8060405162461bcd60e51b815260040161070391906116d8565b60006020828403121561141a57600080fd5b81356001600160e01b03198116811461128157600080fd5b80356001600160a01b038116811461144957600080fd5b919050565b60006020828403121561146057600080fd5b61128182611432565b60006020828403121561147b57600080fd5b5035919050565b6000806040838503121561149557600080fd5b823591506114a560208401611432565b90509250929050565b634e487b7160e01b600052604160045260246000fd5b600080604083850312156114d757600080fd5b6114e083611432565b9150602083013567ffffffffffffffff808211156114fd57600080fd5b818501915085601f83011261151157600080fd5b813581811115611523576115236114ae565b604051601f8201601f19908116603f0116810190838211818310171561154b5761154b6114ae565b8160405282815288602084870101111561156457600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b60006020828403121561163057600080fd5b5051919050565b60005b8381101561165257818101518382015260200161163a565b838111156110cd5750506000910152565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161169b816017850160208801611637565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516116cc816028840160208801611637565b01602801949350505050565b60208152600082518060208401526116f7816040850160208701611637565b601f01601f19169190910160400192915050565b634e487b7160e01b600052601160045260246000fd5b600081600019048311821515161561173b5761173b61170b565b500290565b600082198211156117535761175361170b565b500190565b634e487b7160e01b600052603260045260246000fd5b60008161177d5761177d61170b565b506000190190565b60008251611797818460208701611637565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220d8b43f711b48a1eec29b52bf7bd74c00d17e4309861ec2c4acefd9dd921c0da964736f6c634300080b0033";

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
