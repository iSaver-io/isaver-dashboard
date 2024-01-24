/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  BasicToken,
  BasicTokenInterface,
} from "../../../contracts/tokens/BasicToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "BlackListAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "BlackListRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
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
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "Snapshot",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
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
    name: "PAUSER_ROLE",
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
    name: "SNAPSHOT_ROLE",
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
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
    ],
    name: "addToBlackList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "snapshotId",
        type: "uint256",
      },
    ],
    name: "balanceOfAt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "isAddressInBlackList",
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
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
    ],
    name: "removeFromBlackList",
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
    inputs: [],
    name: "snapshot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "snapshotCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalBurn",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalMinted",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "snapshotId",
        type: "uint256",
      },
    ],
    name: "totalSupplyAt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002068380380620020688339810160408190526200003491620002f5565b8151829082906200004d90600390602085019062000182565b5080516200006390600490602084019062000182565b5050600b805460ff19169055506200007d600033620000dd565b620000a97f5fdbd35e8da83ee755d5e62a539e5ed7f47126abede0b8b10f9ea43dc6eed07f33620000dd565b620000d57f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33620000dd565b50506200039c565b6000828152600a602090815260408083206001600160a01b038516845290915290205460ff166200017e576000828152600a602090815260408083206001600160a01b03851684529091529020805460ff191660011790556200013d3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b82805462000190906200035f565b90600052602060002090601f016020900481019282620001b45760008555620001ff565b82601f10620001cf57805160ff1916838001178555620001ff565b82800160010185558215620001ff579182015b82811115620001ff578251825591602001919060010190620001e2565b506200020d92915062000211565b5090565b5b808211156200020d576000815560010162000212565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200025057600080fd5b81516001600160401b03808211156200026d576200026d62000228565b604051601f8301601f19908116603f0116810190828211818310171562000298576200029862000228565b81604052838152602092508683858801011115620002b557600080fd5b600091505b83821015620002d95785820183015181830184015290820190620002ba565b83821115620002eb5760008385830101525b9695505050505050565b600080604083850312156200030957600080fd5b82516001600160401b03808211156200032157600080fd5b6200032f868387016200023e565b935060208501519150808211156200034657600080fd5b5062000355858286016200023e565b9150509250929050565b600181811c908216806200037457607f821691505b602082108114156200039657634e487b7160e01b600052602260045260246000fd5b50919050565b611cbc80620003ac6000396000f3fe608060405234801561001057600080fd5b50600436106102065760003560e01c80635c975abb1161011a578063981b24d0116100ad578063a9059cbb1161007c578063a9059cbb1461043d578063d547741f14610450578063dd62ed3e14610463578063e63ab1e914610476578063ff8975701461049d57600080fd5b8063981b24d014610407578063a217fddf1461041a578063a2309ff814610422578063a457c2d71461042a57600080fd5b80638456cb59116100e95780638456cb59146103dc57806391d14854146103e457806395d89b41146103f75780639711715a146103ff57600080fd5b80635c975abb1461036e5780637028e2cd1461037957806370a08231146103a057806379cc6790146103c957600080fd5b80632926e2271161019d578063395093511161016c57806339509351146103255780633c9f861d146103385780633f4ba83a1461034057806342966c68146103485780634ee2cd7e1461035b57600080fd5b80632926e227146102db5780632f2ff15d146102f0578063313ce5671461030357806336568abe1461031257600080fd5b806318160ddd116101d957806318160ddd146102715780631fd7469e1461027957806323b872dd146102a5578063248a9ca3146102b857600080fd5b806301ffc9a71461020b57806306fdde0314610233578063095ea7b314610248578063098ab6a11461025b575b600080fd5b61021e61021936600461186a565b6104b0565b60405190151581526020015b60405180910390f35b61023b6104e7565b60405161022a91906118c0565b61021e61025636600461190a565b610579565b610263610591565b60405190815260200161022a565b600254610263565b61021e610287366004611934565b6001600160a01b031660009081526009602052604090205460ff1690565b61021e6102b336600461194f565b6105cb565b6102636102c636600461198b565b6000908152600a602052604090206001015490565b6102ee6102e93660046119a4565b6105ef565b005b6102ee6102fe366004611a19565b61063b565b6040516012815260200161022a565b6102ee610320366004611a19565b610660565b61021e61033336600461190a565b6106e3565b610263610705565b6102ee610722565b6102ee61035636600461198b565b610757565b61026361036936600461190a565b610761565b600b5460ff1661021e565b6102637f5fdbd35e8da83ee755d5e62a539e5ed7f47126abede0b8b10f9ea43dc6eed07f81565b6102636103ae366004611934565b6001600160a01b031660009081526020819052604090205490565b6102ee6103d736600461190a565b6107ba565b6102ee6107cf565b61021e6103f2366004611a19565b610801565b61023b61082c565b6102ee61083b565b61026361041536600461198b565b61086d565b610263600081565b600c54610263565b61021e61043836600461190a565b610898565b61021e61044b36600461190a565b610913565b6102ee61045e366004611a19565b610921565b610263610471366004611a45565b610946565b6102637f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b6102ee6104ab3660046119a4565b610971565b60006001600160e01b03198216637965db0b60e01b14806104e157506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060600380546104f690611a6f565b80601f016020809104026020016040519081016040528092919081815260200182805461052290611a6f565b801561056f5780601f106105445761010080835404028352916020019161056f565b820191906000526020600020905b81548152906001019060200180831161055257829003601f168201915b5050505050905090565b6000336105878185856109b8565b5060019392505050565b60007f5fdbd35e8da83ee755d5e62a539e5ed7f47126abede0b8b10f9ea43dc6eed07f6105bd81610adc565b6105c5610ae6565b91505090565b6000336105d9858285610af1565b6105e4858585610b6b565b506001949350505050565b60006105fa81610adc565b610636838380806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250610d1a92505050565b505050565b6000828152600a602052604090206001015461065681610adc565b6106368383610dc0565b6001600160a01b03811633146106d55760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6106df8282610e46565b5050565b6000336105878185856106f68383610946565b6107009190611ac0565b6109b8565b600061071060025490565b600c5461071d9190611ad8565b905090565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a61074c81610adc565b610754610ead565b50565b6107543382610eff565b6001600160a01b03821660009081526005602052604081208190819061078890859061103d565b91509150816107af576001600160a01b0385166000908152602081905260409020546107b1565b805b95945050505050565b6107c5823383610af1565b6106df8282610eff565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a6107f981610adc565b610754611134565b6000918252600a602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6060600480546104f690611a6f565b7f5fdbd35e8da83ee755d5e62a539e5ed7f47126abede0b8b10f9ea43dc6eed07f61086581610adc565b6106df611171565b600080600061087d84600661103d565b915091508161088e57600254610890565b805b949350505050565b600033816108a68286610946565b9050838110156109065760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016106cc565b6105e482868684036109b8565b600033610587818585610b6b565b6000828152600a602052604090206001015461093c81610adc565b6106368383610e46565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b600061097c81610adc565b6106368383808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506111cb92505050565b6001600160a01b038316610a1a5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016106cc565b6001600160a01b038216610a7b5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016106cc565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b610754813361125c565b600061071d60085490565b6000610afd8484610946565b90506000198114610b655781811015610b585760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016106cc565b610b6584848484036109b8565b50505050565b6001600160a01b038316610bcf5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016106cc565b6001600160a01b038216610c315760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016106cc565b610c3c8383836112e3565b6001600160a01b03831660009081526020819052604090205481811015610cb45760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016106cc565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610b65565b60005b8151811015610d8257600060096000848481518110610d3e57610d3e611aef565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff191691151591909117905580610d7a81611b05565b915050610d1d565b507f2d46a49d90b21763841885c8cc2e1f42fd409d4581a54f460b8e71d3f182b7a481335b604051610db5929190611b20565b60405180910390a150565b610dca8282610801565b6106df576000828152600a602090815260408083206001600160a01b03851684529091529020805460ff19166001179055610e023390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b610e508282610801565b156106df576000828152600a602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b610eb56112f6565b600b805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b038216610f5f5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016106cc565b610f6b826000836112e3565b6001600160a01b03821660009081526020819052604090205481811015610fdf5760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016106cc565b6001600160a01b0383166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3505050565b600080600084116110895760405162461bcd60e51b815260206004820152601660248201527504552433230536e617073686f743a20696420697320360541b60448201526064016106cc565b611091610ae6565b8411156110e05760405162461bcd60e51b815260206004820152601d60248201527f4552433230536e617073686f743a206e6f6e6578697374656e7420696400000060448201526064016106cc565b60006110ec8486611341565b845490915081141561110557600080925092505061112d565b600184600101828154811061111c5761111c611aef565b906000526020600020015492509250505b9250929050565b61113c6113ec565b600b805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610ee23390565b6000611181600880546001019055565b600061118b610ae6565b90507f8030e83b04d87bef53480e26263266d6ca66863aa8506aca6f2559d18aa1cb67816040516111be91815260200190565b60405180910390a1919050565b60005b8151811015611233576001600960008484815181106111ef576111ef611aef565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff19169115159190911790558061122b81611b05565b9150506111ce565b507f4e111519f3bcc0d51efe33b33e2007a5ff922eb706dc30c34565325a62610ba38133610da7565b6112668282610801565b15801561127b5750611279600082610801565b155b156106df57611294816001600160a01b03166014611432565b61129f836020611432565b6112ab60006020611432565b6040516020016112bd93929190611b7d565b60408051601f198184030181529082905262461bcd60e51b82526106cc916004016118c0565b6112eb6113ec565b6106368383836115d5565b600b5460ff1661133f5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b60448201526064016106cc565b565b8154600090611352575060006104e1565b82546000905b8082101561139f57600061136c8383611739565b6000878152602090209091508590820154111561138b57809150611399565b611396816001611ac0565b92505b50611358565b6000821180156113cb5750836113c8866113ba600186611ad8565b600091825260209091200190565b54145b156113e4576113db600183611ad8565b925050506104e1565b5090506104e1565b600b5460ff161561133f5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016106cc565b60606000611441836002611c18565b61144c906002611ac0565b67ffffffffffffffff81111561146457611464611c37565b6040519080825280601f01601f19166020018201604052801561148e576020820181803683370190505b509050600360fc1b816000815181106114a9576114a9611aef565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106114d8576114d8611aef565b60200101906001600160f81b031916908160001a90535060006114fc846002611c18565b611507906001611ac0565b90505b600181111561157f576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061153b5761153b611aef565b1a60f81b82828151811061155157611551611aef565b60200101906001600160f81b031916908160001a90535060049490941c9361157881611c4d565b905061150a565b5083156115ce5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016106cc565b9392505050565b6001600160a01b03831660009081526009602052604090205460ff16156116485760405162461bcd60e51b815260206004820152602160248201527f426c61636b4c6973743a2073656e64657220697320696e20626c61636b4c69736044820152601d60fa1b60648201526084016106cc565b6001600160a01b03821660009081526009602052604090205460ff16156116bd5760405162461bcd60e51b815260206004820152602360248201527f426c61636b4c6973743a20726563656976657220697320696e20626c61636b4c6044820152621a5cdd60ea1b60648201526084016106cc565b6001600160a01b038316331461172e576116d633610287565b1561172e5760405162461bcd60e51b815260206004820152602260248201527f426c61636b4c6973743a207370656e64657220697320696e20626c61636b4c696044820152611cdd60f21b60648201526084016106cc565b610636838383611754565b60006117486002848418611c64565b6115ce90848416611ac0565b6001600160a01b0383166117735761176b82611798565b6106366117ca565b6001600160a01b03821661178a5761176b83611798565b61179383611798565b610636825b6001600160a01b0381166000908152600560209081526040808320918390529091205461075491906117d8565b6117d8565b61133f60066117c560025490565b60006117e2610ae6565b9050806117ee84611822565b1015610636578254600180820185556000858152602080822090930193909355938401805494850181558252902090910155565b805460009061183357506000919050565b8154829061184390600190611ad8565b8154811061185357611853611aef565b90600052602060002001549050919050565b919050565b60006020828403121561187c57600080fd5b81356001600160e01b0319811681146115ce57600080fd5b60005b838110156118af578181015183820152602001611897565b83811115610b655750506000910152565b60208152600082518060208401526118df816040850160208701611894565b601f01601f19169190910160400192915050565b80356001600160a01b038116811461186557600080fd5b6000806040838503121561191d57600080fd5b611926836118f3565b946020939093013593505050565b60006020828403121561194657600080fd5b6115ce826118f3565b60008060006060848603121561196457600080fd5b61196d846118f3565b925061197b602085016118f3565b9150604084013590509250925092565b60006020828403121561199d57600080fd5b5035919050565b600080602083850312156119b757600080fd5b823567ffffffffffffffff808211156119cf57600080fd5b818501915085601f8301126119e357600080fd5b8135818111156119f257600080fd5b8660208260051b8501011115611a0757600080fd5b60209290920196919550909350505050565b60008060408385031215611a2c57600080fd5b82359150611a3c602084016118f3565b90509250929050565b60008060408385031215611a5857600080fd5b611a61836118f3565b9150611a3c602084016118f3565b600181811c90821680611a8357607f821691505b60208210811415611aa457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b60008219821115611ad357611ad3611aaa565b500190565b600082821015611aea57611aea611aaa565b500390565b634e487b7160e01b600052603260045260246000fd5b6000600019821415611b1957611b19611aaa565b5060010190565b604080825283519082018190526000906020906060840190828701845b82811015611b625781516001600160a01b031684529284019290840190600101611b3d565b5050506001600160a01b039490941692019190915250919050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008451611bb5816017850160208901611894565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528451611be6816028840160208901611894565b6301037b9160e51b602892909101918201528351611c0b81602c840160208801611894565b01602c0195945050505050565b6000816000190483118215151615611c3257611c32611aaa565b500290565b634e487b7160e01b600052604160045260246000fd5b600081611c5c57611c5c611aaa565b506000190190565b600082611c8157634e487b7160e01b600052601260045260246000fd5b50049056fea264697066735822122045d0dd35f69af6186c3dd843b4a46a6f10f17ef16cbc6ffdd589c944606b0a2f64736f6c634300080b0033";

type BasicTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BasicTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BasicToken__factory extends ContractFactory {
  constructor(...args: BasicTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    name_: string,
    symbol_: string,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(name_, symbol_, overrides || {});
  }
  override deploy(
    name_: string,
    symbol_: string,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(name_, symbol_, overrides || {}) as Promise<
      BasicToken & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): BasicToken__factory {
    return super.connect(runner) as BasicToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BasicTokenInterface {
    return new Interface(_abi) as BasicTokenInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): BasicToken {
    return new Contract(address, _abi, runner) as unknown as BasicToken;
  }
}
