/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Helper, HelperInterface } from "../../contracts/Helper";

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
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "getRafflesRoundWinnersWithTickets",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "level",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "winnerAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "enteredTickets",
            type: "uint256",
          },
        ],
        internalType: "struct Helper.RafflesWinnersWithTickets[]",
        name: "",
        type: "tuple[]",
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
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "level",
        type: "uint256",
      },
    ],
    name: "getUserReferralsFullInfoByLevel",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "referralAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "level",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "activationDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "savTokenBalance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "savrTokenBalance",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isReferralSubscriptionActive",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isStakingSubscriptionActive",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isTeamSubscriptionActive",
            type: "bool",
          },
        ],
        internalType: "struct Helper.ReferralFullInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "teamPlanId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "subscriptionCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reward",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakingThreshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "teamSize",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakingPlanId",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        internalType: "struct ITeams.TeamPlan",
        name: "plan",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserTeamInfo",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "subscription",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "teamsFilled",
                type: "uint256",
              },
            ],
            internalType: "struct ITeams.Team",
            name: "teamStatus",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "teamPlanId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "subscriptionCost",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "reward",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stakingThreshold",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "teamSize",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stakingPlanId",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "isActive",
                type: "bool",
              },
            ],
            internalType: "struct ITeams.TeamPlan",
            name: "plan",
            type: "tuple",
          },
          {
            internalType: "address[]",
            name: "members",
            type: "address[]",
          },
          {
            internalType: "bool",
            name: "userHasSufficientStaking",
            type: "bool",
          },
        ],
        internalType: "struct Helper.UserTeamInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserTeamsInfo",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "subscription",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "teamsFilled",
                type: "uint256",
              },
            ],
            internalType: "struct ITeams.Team",
            name: "teamStatus",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "teamPlanId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "subscriptionCost",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "reward",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stakingThreshold",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "teamSize",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stakingPlanId",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "isActive",
                type: "bool",
              },
            ],
            internalType: "struct ITeams.TeamPlan",
            name: "plan",
            type: "tuple",
          },
          {
            internalType: "address[]",
            name: "members",
            type: "address[]",
          },
          {
            internalType: "bool",
            name: "userHasSufficientStaking",
            type: "bool",
          },
        ],
        internalType: "struct Helper.UserTeamInfo[]",
        name: "",
        type: "tuple[]",
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
    inputs: [
      {
        internalType: "address",
        name: "contractManagerAddress",
        type: "address",
      },
    ],
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
  "0x60a0604052306080523480156200001557600080fd5b506200002062000026565b620000e7565b600054610100900460ff1615620000935760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff90811614620000e5576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b608051612b976200011f6000396000818161044101528181610481015281816108f00152818161093001526109bf0152612b976000f3fe6080604052600436106100f35760003560e01c806391d148541161008a578063d547741f11610059578063d547741f146102a4578063d9450875146102c4578063f72c0d8b146102f1578063ff2703521461032557600080fd5b806391d1485414610222578063a217fddf14610242578063c4d66de814610257578063cefaefb61461027757600080fd5b80633659cfe6116100c65780633659cfe6146101ad57806337274477146101cd5780634f1ef286146101fa57806352d1902d1461020d57600080fd5b806301ffc9a7146100f8578063248a9ca31461012d5780632f2ff15d1461016b57806336568abe1461018d575b600080fd5b34801561010457600080fd5b50610118610113366004611e52565b610352565b60405190151581526020015b60405180910390f35b34801561013957600080fd5b5061015d610148366004611e7c565b60009081526065602052604090206001015490565b604051908152602001610124565b34801561017757600080fd5b5061018b610186366004611eba565b610389565b005b34801561019957600080fd5b5061018b6101a8366004611eba565b6103b3565b3480156101b957600080fd5b5061018b6101c8366004611eea565b610436565b3480156101d957600080fd5b506101ed6101e8366004611e7c565b610516565b6040516101249190611f07565b61018b61020836600461201c565b6108e5565b34801561021957600080fd5b5061015d6109b2565b34801561022e57600080fd5b5061011861023d366004611eba565b610a65565b34801561024e57600080fd5b5061015d600081565b34801561026357600080fd5b5061018b610272366004611eea565b610a90565b34801561028357600080fd5b506102976102923660046120c3565b610c60565b60405161012491906120ef565b3480156102b057600080fd5b5061018b6102bf366004611eba565b6112ac565b3480156102d057600080fd5b506102e46102df36600461218c565b6112d1565b60405161012491906122f5565b3480156102fd57600080fd5b5061015d7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e381565b34801561033157600080fd5b50610345610340366004611eea565b6114e6565b6040516101249190612308565b60006001600160e01b03198216637965db0b60e01b148061038357506301ffc9a760e01b6001600160e01b03198316145b92915050565b6000828152606560205260409020600101546103a48161168c565b6103ae8383611696565b505050565b6001600160a01b03811633146104285760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b610432828261171c565b5050565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016141561047f5760405162461bcd60e51b815260040161041f9061236a565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166104c8600080516020612b1b833981519152546001600160a01b031690565b6001600160a01b0316146104ee5760405162461bcd60e51b815260040161041f906123b6565b6104f781611783565b60408051600080825260208201909252610513918391906117ad565b50565b6060600060fb60009054906101000a90046001600160a01b03166001600160a01b031663976edfd96040518163ffffffff1660e01b8152600401602060405180830381865afa15801561056d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105919190612402565b60405163023c4c9f60e61b8152600481018590529091506000906001600160a01b03831690638f1327c090602401600060405180830381865afa1580156105dc573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610604919081019061259b565b90506000805b826101e00151518110156106c65760005b836101e00151828151811061063257610632612713565b6020026020010151518110156106b35760006001600160a01b0316846101e00151838151811061066457610664612713565b6020026020010151828151811061067d5761067d612713565b60200260200101516001600160a01b0316146106a1578261069d8161273f565b9350505b806106ab8161273f565b91505061061b565b50806106be8161273f565b91505061060a565b506000816001600160401b038111156106e1576106e1611f69565b60405190808252806020026020018201604052801561073f57816020015b61072c60405180606001604052806000815260200160006001600160a01b03168152602001600081525090565b8152602001906001900390816106ff5790505b5090506000805b846101e00151518110156108d95760005b856101e00151828151811061076e5761076e612713565b6020026020010151518110156108c6576000866101e00151838151811061079757610797612713565b602002602001015182815181106107b0576107b0612713565b6020026020010151905060006001600160a01b0316816001600160a01b0316146108b357604051632035fed160e01b81526001600160a01b038281166004830152602482018c9052600091908a1690632035fed190604401602060405180830381865afa158015610825573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610849919061275a565b90506040518060600160405280858152602001836001600160a01b031681526020018281525086868151811061088157610881612713565b602002602001018190525084806108979061273f565b955050868514156108b15750939998505050505050505050565b505b50806108be8161273f565b915050610757565b50806108d18161273f565b915050610746565b50909695505050505050565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016141561092e5760405162461bcd60e51b815260040161041f9061236a565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610977600080516020612b1b833981519152546001600160a01b031690565b6001600160a01b03161461099d5760405162461bcd60e51b815260040161041f906123b6565b6109a682611783565b610432828260016117ad565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610a525760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c0000000000000000606482015260840161041f565b50600080516020612b1b83398151915290565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600054610100900460ff1615808015610ab05750600054600160ff909116105b80610aca5750303b158015610aca575060005460ff166001145b610b2d5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161041f565b6000805460ff191660011790558015610b50576000805461ff0019166101001790555b6001600160a01b038216610bb75760405162461bcd60e51b815260206004820152602860248201527f436f6e74726163744d616e616765722061646472657373206d757374206265206044820152676e6f6e2d7a65726f60c01b606482015260840161041f565b610bbf611918565b610bc7611918565b610bd2600033611696565b610bfc7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e333611696565b60fb80546001600160a01b0319166001600160a01b0384161790558015610432576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15050565b6060600060fb60009054906101000a90046001600160a01b03166001600160a01b031663aa42a7606040518163ffffffff1660e01b8152600401602060405180830381865afa158015610cb7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cdb9190612402565b9050600060fb60009054906101000a90046001600160a01b03166001600160a01b0316630e9ed68b6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610d32573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d569190612402565b9050600060fb60009054906101000a90046001600160a01b03166001600160a01b0316637a286a036040518163ffffffff1660e01b8152600401602060405180830381865afa158015610dad573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dd19190612402565b9050600060fb60009054906101000a90046001600160a01b03166001600160a01b03166330c21c726040518163ffffffff1660e01b8152600401602060405180830381865afa158015610e28573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e4c9190612402565b9050600060fb60009054906101000a90046001600160a01b03166001600160a01b031663a736cd486040518163ffffffff1660e01b8152600401602060405180830381865afa158015610ea3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ec79190612402565b60405163b09b334f60e01b81526001600160a01b038a81166004830152602482018a905291925060009187169063b09b334f90604401600060405180830381865afa158015610f1a573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610f429190810190612773565b9050600081516001600160401b03811115610f5f57610f5f611f69565b604051908082528060200260200182016040528015610fce57816020015b604080516101008101825260008082526020808301829052928201819052606082018190526080820181905260a0820181905260c0820181905260e08201528252600019909201910181610f7d5790505b50905060005b825181101561129e576000838281518110610ff157610ff1612713565b6020026020010151600001519050604051806101000160405280826001600160a01b0316815260200185848151811061102c5761102c612713565b602002602001015160200151815260200185848151811061104f5761104f612713565b6020026020010151604001518152602001876001600160a01b03166370a08231846040518263ffffffff1660e01b815260040161109b91906001600160a01b0391909116815260200190565b602060405180830381865afa1580156110b8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110dc919061275a565b81526040516370a0823160e01b81526001600160a01b0384811660048301526020909201918816906370a0823190602401602060405180830381865afa15801561112a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061114e919061275a565b815260200185848151811061116557611165612713565b60200260200101516060015115158152602001896001600160a01b031663ad6299bc846040518263ffffffff1660e01b81526004016111b391906001600160a01b0391909116815260200190565b602060405180830381865afa1580156111d0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111f4919061284f565b15158152604051632b58a66f60e21b81526001600160a01b0384811660048301526020909201918a169063ad6299bc90602401602060405180830381865afa158015611244573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611268919061284f565b151581525083838151811061127f5761127f612713565b60200260200101819052505080806112969061273f565b915050610fd4565b509998505050505050505050565b6000828152606560205260409020600101546112c78161168c565b6103ae838361171c565b6112d9611dd9565b60fb5460408051637a286a0360e01b815290516000926001600160a01b031691637a286a039160048083019260209291908290030181865afa158015611323573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113479190612402565b845160405163cc5d19c160e01b81526001600160a01b03868116600483015260248201929092529192506000919083169063cc5d19c1906044016040805180830381865afa15801561139d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113c1919061286c565b85516040516393371e0f60e01b81526001600160a01b0387811660048301526024820192909252919250600091908416906393371e0f90604401600060405180830381865afa158015611418573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261144091908101906128ba565b8651604051634c96e16d60e11b81526001600160a01b03888116600483015260248201929092529192506000919085169063992dc2da90604401602060405180830381865afa158015611497573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114bb919061284f565b6040805160808101825294855260208501899052840192909252501515606082015291505092915050565b6060600060fb60009054906101000a90046001600160a01b03166001600160a01b0316637a286a036040518163ffffffff1660e01b8152600401602060405180830381865afa15801561153d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115619190612402565b90506000816001600160a01b03166343fe832c6040518163ffffffff1660e01b8152600401600060405180830381865afa1580156115a3573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526115cb91908101906128ee565b9050600081516001600160401b038111156115e8576115e8611f69565b60405190808252806020026020018201604052801561162157816020015b61160e611dd9565b8152602001906001900390816116065790505b50905060005b82518110156116835761165383828151811061164557611645612713565b6020026020010151876112d1565b82828151811061166557611665612713565b6020026020010181905250808061167b9061273f565b915050611627565b50949350505050565b6105138133611985565b6116a08282610a65565b6104325760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556116d83390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6117268282610a65565b156104325760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e36104328161168c565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff16156117e0576103ae836119de565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa92505050801561183a575060408051601f3d908101601f191682019092526118379181019061275a565b60015b61189d5760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b606482015260840161041f565b600080516020612b1b833981519152811461190c5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b606482015260840161041f565b506103ae838383611a7a565b600054610100900460ff166119835760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b606482015260840161041f565b565b61198f8282610a65565b6104325761199c81611aa5565b6119a7836020611ab7565b6040516020016119b8929190612a08565b60408051601f198184030181529082905262461bcd60e51b825261041f91600401612a7d565b6001600160a01b0381163b611a4b5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b606482015260840161041f565b600080516020612b1b83398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b611a8383611c59565b600082511180611a905750805b156103ae57611a9f8383611c99565b50505050565b60606103836001600160a01b03831660145b60606000611ac6836002612ab0565b611ad1906002612acf565b6001600160401b03811115611ae857611ae8611f69565b6040519080825280601f01601f191660200182016040528015611b12576020820181803683370190505b509050600360fc1b81600081518110611b2d57611b2d612713565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110611b5c57611b5c612713565b60200101906001600160f81b031916908160001a9053506000611b80846002612ab0565b611b8b906001612acf565b90505b6001811115611c03576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110611bbf57611bbf612713565b1a60f81b828281518110611bd557611bd5612713565b60200101906001600160f81b031916908160001a90535060049490941c93611bfc81612ae7565b9050611b8e565b508315611c525760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161041f565b9392505050565b611c62816119de565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6060611c528383604051806060016040528060278152602001612b3b602791396060600080856001600160a01b031685604051611cd69190612afe565b600060405180830381855af49150503d8060008114611d11576040519150601f19603f3d011682016040523d82523d6000602084013e611d16565b606091505b5091509150611d2786838387611d31565b9695505050505050565b60608315611d9d578251611d96576001600160a01b0385163b611d965760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161041f565b5081611da7565b611da78383611daf565b949350505050565b815115611dbf5781518083602001fd5b8060405162461bcd60e51b815260040161041f9190612a7d565b6040805160c0810190915260006080820181815260a083019190915281908152602001611e3e6040518060e001604052806000815260200160008152602001600081526020016000815260200160008152602001600081526020016000151581525090565b815260606020820152600060409091015290565b600060208284031215611e6457600080fd5b81356001600160e01b031981168114611c5257600080fd5b600060208284031215611e8e57600080fd5b5035919050565b6001600160a01b038116811461051357600080fd5b8035611eb581611e95565b919050565b60008060408385031215611ecd57600080fd5b823591506020830135611edf81611e95565b809150509250929050565b600060208284031215611efc57600080fd5b8135611c5281611e95565b602080825282518282018190526000919060409081850190868401855b82811015611f5c57815180518552868101516001600160a01b0316878601528501518585015260609093019290850190600101611f24565b5091979650505050505050565b634e487b7160e01b600052604160045260246000fd5b60405160e081016001600160401b0381118282101715611fa157611fa1611f69565b60405290565b60405161020081016001600160401b0381118282101715611fa157611fa1611f69565b604051608081016001600160401b0381118282101715611fa157611fa1611f69565b604051601f8201601f191681016001600160401b038111828210171561201457612014611f69565b604052919050565b6000806040838503121561202f57600080fd5b823561203a81611e95565b91506020838101356001600160401b038082111561205757600080fd5b818601915086601f83011261206b57600080fd5b81358181111561207d5761207d611f69565b61208f601f8201601f19168501611fec565b915080825287848285010111156120a557600080fd5b80848401858401376000848284010152508093505050509250929050565b600080604083850312156120d657600080fd5b82356120e181611e95565b946020939093013593505050565b602080825282518282018190526000919060409081850190868401855b82811015611f5c57815180516001600160a01b0316855286810151878601528581015186860152606080820151908601526080808201519086015260a08082015115159086015260c08082015115159086015260e090810151151590850152610100909301929085019060010161210c565b801515811461051357600080fd5b6000808284036101008112156121a157600080fd5b60e08112156121af57600080fd5b506121b8611f7f565b833581526020840135602082015260408401356040820152606084013560608201526080840135608082015260a084013560a082015260c08401356121fc8161217e565b60c0820152915061220f60e08401611eaa565b90509250929050565b600081518084526020808501945080840160005b838110156122515781516001600160a01b03168752958201959082019060010161222c565b509495945050505050565b600061016082518051855260208101516020860152506020830151805160408601526020810151606086015260408101516080860152606081015160a0860152608081015160c086015260a081015160e086015260c08101511515610100860152506040830151816101208601526122d682860182612218565b91505060608301516122ed61014086018215159052565b509392505050565b602081526000611c52602083018461225c565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b8281101561235d57603f1988860301845261234b85835161225c565b9450928501929085019060010161232f565b5092979650505050505050565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b60006020828403121561241457600080fd5b8151611c5281611e95565b8051611eb58161217e565b60006001600160401b0382111561244357612443611f69565b5060051b60200190565b600082601f83011261245e57600080fd5b8151602061247361246e8361242a565b611fec565b82815260059290921b8401810191818101908684111561249257600080fd5b8286015b848110156124ad5780518352918301918301612496565b509695505050505050565b600082601f8301126124c957600080fd5b815160206124d961246e8361242a565b82815260059290921b840181019181810190868411156124f857600080fd5b8286015b848110156124ad57805161250f81611e95565b83529183019183016124fc565b600082601f83011261252d57600080fd5b8151602061253d61246e8361242a565b82815260059290921b8401810191818101908684111561255c57600080fd5b8286015b848110156124ad5780516001600160401b0381111561257f5760008081fd5b61258d8986838b01016124b8565b845250918301918301612560565b6000602082840312156125ad57600080fd5b81516001600160401b03808211156125c457600080fd5b9083019061020082860312156125d957600080fd5b6125e1611fa7565b8251815260208301516020820152604083015160408201526126056060840161241f565b60608201526126166080840161241f565b608082015261262760a0840161241f565b60a082015260c083015160c082015260e083015160e0820152610100808401518183015250610120808401518183015250610140808401518381111561266c57600080fd5b6126788882870161244d565b828401525050610160808401518381111561269257600080fd5b61269e8882870161244d565b8284015250506101808084015181830152506101a080840151838111156126c457600080fd5b6126d0888287016124b8565b8284015250506101c08084015181830152506101e080840151838111156126f657600080fd5b6127028882870161251c565b918301919091525095945050505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060001982141561275357612753612729565b5060010190565b60006020828403121561276c57600080fd5b5051919050565b6000602080838503121561278657600080fd5b82516001600160401b0381111561279c57600080fd5b8301601f810185136127ad57600080fd5b80516127bb61246e8261242a565b81815260079190911b820183019083810190878311156127da57600080fd5b928401925b8284101561284457608084890312156127f85760008081fd5b612800611fca565b845161280b81611e95565b815284860151868201526040808601519082015260608086015161282e8161217e565b90820152825260809390930192908401906127df565b979650505050505050565b60006020828403121561286157600080fd5b8151611c528161217e565b60006040828403121561287e57600080fd5b604051604081018181106001600160401b03821117156128a0576128a0611f69565b604052825181526020928301519281019290925250919050565b6000602082840312156128cc57600080fd5b81516001600160401b038111156128e257600080fd5b611da7848285016124b8565b6000602080838503121561290157600080fd5b82516001600160401b0381111561291757600080fd5b8301601f8101851361292857600080fd5b805161293661246e8261242a565b81815260e0918202830184019184820191908884111561295557600080fd5b938501935b838510156129d05780858a0312156129725760008081fd5b61297a611f7f565b85518152868601518782015260408087015190820152606080870151908201526080808701519082015260a0808701519082015260c0808701516129bd8161217e565b908201528352938401939185019161295a565b50979650505050505050565b60005b838110156129f75781810151838201526020016129df565b83811115611a9f5750506000910152565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351612a408160178501602088016129dc565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351612a718160288401602088016129dc565b01602801949350505050565b6020815260008251806020840152612a9c8160408501602087016129dc565b601f01601f19169190910160400192915050565b6000816000190483118215151615612aca57612aca612729565b500290565b60008219821115612ae257612ae2612729565b500190565b600081612af657612af6612729565b506000190190565b60008251612b108184602087016129dc565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220fb35c2bce5e6bc911dced73dce8f7a9b2471fb31a0ac3dd0aa632bbe0e6f791764736f6c634300080b0033";

type HelperConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HelperConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Helper__factory extends ContractFactory {
  constructor(...args: HelperConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(overrides?: Overrides & { from?: string }): Promise<Helper> {
    return super.deploy(overrides || {}) as Promise<Helper>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Helper {
    return super.attach(address) as Helper;
  }
  override connect(signer: Signer): Helper__factory {
    return super.connect(signer) as Helper__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HelperInterface {
    return new utils.Interface(_abi) as HelperInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Helper {
    return new Contract(address, _abi, signerOrProvider) as Helper;
  }
}
