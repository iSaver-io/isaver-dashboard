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
import type { NonPayableOverrides } from "../../../../../common";
import type {
  ERC1155Upgradeable,
  ERC1155UpgradeableInterface,
} from "../../../../../@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
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
        internalType: "address",
        name: "operator",
        type: "address",
      },
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
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
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
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
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
        name: "id",
        type: "uint256",
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
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
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
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
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
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
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
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50611396806100206000396000f3fe608060405234801561001057600080fd5b50600436106100875760003560e01c80634e1273f41161005b5780634e1273f41461010a578063a22cb4651461012a578063e985e9c51461013d578063f242432a1461017957600080fd5b8062fdd58e1461008c57806301ffc9a7146100b25780630e89341c146100d55780632eb2c2d6146100f5575b600080fd5b61009f61009a366004610b4a565b61018c565b6040519081526020015b60405180910390f35b6100c56100c0366004610b8d565b610224565b60405190151581526020016100a9565b6100e86100e3366004610bb1565b610276565b6040516100a99190610c17565b610108610103366004610d76565b61030a565b005b61011d610118366004610e20565b610356565b6040516100a99190610f26565b610108610138366004610f39565b610480565b6100c561014b366004610f75565b6001600160a01b03918216600090815260666020908152604080832093909416825291909152205460ff1690565b610108610187366004610fa8565b61048f565b60006001600160a01b0383166101fc5760405162461bcd60e51b815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201526930b634b21037bbb732b960b11b60648201526084015b60405180910390fd5b5060009081526065602090815260408083206001600160a01b03949094168352929052205490565b60006001600160e01b03198216636cdb3d1360e11b148061025557506001600160e01b031982166303a24d0760e21b145b8061027057506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060606780546102859061100d565b80601f01602080910402602001604051908101604052809291908181526020018280546102b19061100d565b80156102fe5780601f106102d3576101008083540402835291602001916102fe565b820191906000526020600020905b8154815290600101906020018083116102e157829003601f168201915b50505050509050919050565b6001600160a01b0385163314806103265750610326853361014b565b6103425760405162461bcd60e51b81526004016101f390611048565b61034f85858585856104d4565b5050505050565b606081518351146103bb5760405162461bcd60e51b815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b60648201526084016101f3565b6000835167ffffffffffffffff8111156103d7576103d7610c2a565b604051908082528060200260200182016040528015610400578160200160208202803683370190505b50905060005b84518110156104785761044b85828151811061042457610424611096565b602002602001015185838151811061043e5761043e611096565b602002602001015161018c565b82828151811061045d5761045d611096565b6020908102919091010152610471816110c2565b9050610406565b509392505050565b61048b3383836106b4565b5050565b6001600160a01b0385163314806104ab57506104ab853361014b565b6104c75760405162461bcd60e51b81526004016101f390611048565b61034f8585858585610795565b81518351146105365760405162461bcd60e51b815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206044820152670dad2e6dac2e8c6d60c31b60648201526084016101f3565b6001600160a01b03841661055c5760405162461bcd60e51b81526004016101f3906110dd565b3360005b845181101561064657600085828151811061057d5761057d611096565b60200260200101519050600085838151811061059b5761059b611096565b60209081029190910181015160008481526065835260408082206001600160a01b038e1683529093529190912054909150818110156105ec5760405162461bcd60e51b81526004016101f390611122565b60008381526065602090815260408083206001600160a01b038e8116855292528083208585039055908b1682528120805484929061062b90849061116c565b925050819055505050508061063f906110c2565b9050610560565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610696929190611184565b60405180910390a46106ac8187878787876108c3565b505050505050565b816001600160a01b0316836001600160a01b031614156107285760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c20737461747573604482015268103337b91039b2b63360b91b60648201526084016101f3565b6001600160a01b03838116600081815260666020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0384166107bb5760405162461bcd60e51b81526004016101f3906110dd565b3360006107c785610a28565b905060006107d485610a28565b905060008681526065602090815260408083206001600160a01b038c168452909152902054858110156108195760405162461bcd60e51b81526004016101f390611122565b60008781526065602090815260408083206001600160a01b038d8116855292528083208985039055908a1682528120805488929061085890849061116c565b909155505060408051888152602081018890526001600160a01b03808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a46108b8848a8a8a8a8a610a73565b505050505050505050565b6001600160a01b0384163b156106ac5760405163bc197c8160e01b81526001600160a01b0385169063bc197c819061090790899089908890889088906004016111b2565b6020604051808303816000875af1925050508015610942575060408051601f3d908101601f1916820190925261093f91810190611210565b60015b6109ef5761094e61122d565b806308c379a014156109885750610963611249565b8061096e575061098a565b8060405162461bcd60e51b81526004016101f39190610c17565b505b60405162461bcd60e51b815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e2d455243313135356044820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b60648201526084016101f3565b6001600160e01b0319811663bc197c8160e01b14610a1f5760405162461bcd60e51b81526004016101f3906112d3565b50505050505050565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110610a6257610a62611096565b602090810291909101015292915050565b6001600160a01b0384163b156106ac5760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e6190610ab7908990899088908890889060040161131b565b6020604051808303816000875af1925050508015610af2575060408051601f3d908101601f19168201909252610aef91810190611210565b60015b610afe5761094e61122d565b6001600160e01b0319811663f23a6e6160e01b14610a1f5760405162461bcd60e51b81526004016101f3906112d3565b80356001600160a01b0381168114610b4557600080fd5b919050565b60008060408385031215610b5d57600080fd5b610b6683610b2e565b946020939093013593505050565b6001600160e01b031981168114610b8a57600080fd5b50565b600060208284031215610b9f57600080fd5b8135610baa81610b74565b9392505050565b600060208284031215610bc357600080fd5b5035919050565b6000815180845260005b81811015610bf057602081850181015186830182015201610bd4565b81811115610c02576000602083870101525b50601f01601f19169290920160200192915050565b602081526000610baa6020830184610bca565b634e487b7160e01b600052604160045260246000fd5b601f8201601f1916810167ffffffffffffffff81118282101715610c6657610c66610c2a565b6040525050565b600067ffffffffffffffff821115610c8757610c87610c2a565b5060051b60200190565b600082601f830112610ca257600080fd5b81356020610caf82610c6d565b604051610cbc8282610c40565b83815260059390931b8501820192828101915086841115610cdc57600080fd5b8286015b84811015610cf75780358352918301918301610ce0565b509695505050505050565b600082601f830112610d1357600080fd5b813567ffffffffffffffff811115610d2d57610d2d610c2a565b604051610d44601f8301601f191660200182610c40565b818152846020838601011115610d5957600080fd5b816020850160208301376000918101602001919091529392505050565b600080600080600060a08688031215610d8e57600080fd5b610d9786610b2e565b9450610da560208701610b2e565b9350604086013567ffffffffffffffff80821115610dc257600080fd5b610dce89838a01610c91565b94506060880135915080821115610de457600080fd5b610df089838a01610c91565b93506080880135915080821115610e0657600080fd5b50610e1388828901610d02565b9150509295509295909350565b60008060408385031215610e3357600080fd5b823567ffffffffffffffff80821115610e4b57600080fd5b818501915085601f830112610e5f57600080fd5b81356020610e6c82610c6d565b604051610e798282610c40565b83815260059390931b8501820192828101915089841115610e9957600080fd5b948201945b83861015610ebe57610eaf86610b2e565b82529482019490820190610e9e565b96505086013592505080821115610ed457600080fd5b50610ee185828601610c91565b9150509250929050565b600081518084526020808501945080840160005b83811015610f1b57815187529582019590820190600101610eff565b509495945050505050565b602081526000610baa6020830184610eeb565b60008060408385031215610f4c57600080fd5b610f5583610b2e565b915060208301358015158114610f6a57600080fd5b809150509250929050565b60008060408385031215610f8857600080fd5b610f9183610b2e565b9150610f9f60208401610b2e565b90509250929050565b600080600080600060a08688031215610fc057600080fd5b610fc986610b2e565b9450610fd760208701610b2e565b93506040860135925060608601359150608086013567ffffffffffffffff81111561100157600080fd5b610e1388828901610d02565b600181811c9082168061102157607f821691505b6020821081141561104257634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602e908201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60408201526d195c881bdc88185c1c1c9bdd995960921b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60006000198214156110d6576110d66110ac565b5060010190565b60208082526025908201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604082015264647265737360d81b606082015260800190565b6020808252602a908201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60408201526939103a3930b739b332b960b11b606082015260800190565b6000821982111561117f5761117f6110ac565b500190565b6040815260006111976040830185610eeb565b82810360208401526111a98185610eeb565b95945050505050565b6001600160a01b0386811682528516602082015260a0604082018190526000906111de90830186610eeb565b82810360608401526111f08186610eeb565b905082810360808401526112048185610bca565b98975050505050505050565b60006020828403121561122257600080fd5b8151610baa81610b74565b600060033d11156112465760046000803e5060005160e01c5b90565b600060443d10156112575790565b6040516003193d81016004833e81513d67ffffffffffffffff816024840111818411171561128757505050505090565b828501915081518181111561129f5750505050505090565b843d87010160208285010111156112b95750505050505090565b6112c860208286010187610c40565b509095945050505050565b60208082526028908201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b606082015260800190565b6001600160a01b03868116825285166020820152604081018490526060810183905260a06080820181905260009061135590830184610bca565b97965050505050505056fea26469706673582212209663c8f4911f3468f4b78166dc0c2dae9c8fa979eb61337ecfec009cf168788564736f6c634300080b0033";

type ERC1155UpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1155UpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1155Upgradeable__factory extends ContractFactory {
  constructor(...args: ERC1155UpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      ERC1155Upgradeable & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ERC1155Upgradeable__factory {
    return super.connect(runner) as ERC1155Upgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1155UpgradeableInterface {
    return new Interface(_abi) as ERC1155UpgradeableInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ERC1155Upgradeable {
    return new Contract(address, _abi, runner) as unknown as ERC1155Upgradeable;
  }
}
