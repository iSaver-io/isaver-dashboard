/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Momento, MomentoInterface } from "../../contracts/Momento";

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
    name: "TICKET_ID",
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
    name: "getPrize",
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
        name: "contractManagerAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "ticketId",
        type: "uint256",
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
    inputs: [],
    name: "requestPrize",
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
  "0x60a06040523060805234801561001457600080fd5b5061001d610022565b6100e1565b600054610100900460ff161561008e5760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff908116146100df576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b608051611704610118600039600081816105a7015281816105e701528181610687015281816106c7015261075601526117046000f3fe6080604052600436106100e85760003560e01c806352d1902d1161008a578063cd6dc68711610059578063cd6dc68714610249578063d547741f14610269578063e44ddc2214610289578063f72c0d8b146102a057600080fd5b806352d1902d146101ea57806391d14854146101ff578063a217fddf1461021f578063c34f6b0d1461023457600080fd5b80632f2ff15d116100c65780632f2ff15d1461017757806336568abe146101975780633659cfe6146101b75780634f1ef286146101d757600080fd5b806301ffc9a7146100ed5780630f0048e714610122578063248a9ca314610139575b600080fd5b3480156100f957600080fd5b5061010d610108366004611259565b6102d4565b60405190151581526020015b60405180910390f35b34801561012e57600080fd5b5061013761030b565b005b34801561014557600080fd5b50610169610154366004611283565b60009081526097602052604090206001015490565b604051908152602001610119565b34801561018357600080fd5b506101376101923660046112b1565b6104ef565b3480156101a357600080fd5b506101376101b23660046112b1565b610519565b3480156101c357600080fd5b506101376101d23660046112e1565b61059c565b6101376101e5366004611314565b61067c565b3480156101f657600080fd5b50610169610749565b34801561020b57600080fd5b5061010d61021a3660046112b1565b6107fc565b34801561022b57600080fd5b50610169600081565b34801561024057600080fd5b50610137610827565b34801561025557600080fd5b506101376102643660046113d8565b6108fd565b34801561027557600080fd5b506101376102843660046112b1565b610a76565b34801561029557600080fd5b5061016961012d5481565b3480156102ac57600080fd5b506101697f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e381565b60006001600160e01b03198216637965db0b60e01b148061030557506301ffc9a760e01b6001600160e01b03198316145b92915050565b610313610a9b565b61012e546040805163ad55c4b560e01b815290516000926001600160a01b03169163ad55c4b59160048083019260209291908290030181865afa15801561035e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103829190611404565b90506001600160a01b03811663f5298aca3361012d546040516001600160e01b031960e085901b1681526001600160a01b039092166004830152602482015260016044820152606401600060405180830381600087803b1580156103e557600080fd5b505af11580156103f9573d6000803e3d6000fd5b50505050600061012e60009054906101000a90046001600160a01b03166001600160a01b031663703044e56040518163ffffffff1660e01b8152600401602060405180830381865afa158015610453573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104779190611404565b90506001600160a01b0381166371d92bf7336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401600060405180830381600087803b1580156104ca57600080fd5b505af11580156104de573d6000803e3d6000fd5b5050505050506104ed60018055565b565b60008281526097602052604090206001015461050a81610afb565b6105148383610b05565b505050565b6001600160a01b038116331461058e5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6105988282610b8b565b5050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156105e55760405162461bcd60e51b815260040161058590611421565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661062e600080516020611688833981519152546001600160a01b031690565b6001600160a01b0316146106545760405162461bcd60e51b81526004016105859061146d565b61065d81610bf2565b6040805160008082526020820190925261067991839190610c1c565b50565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156106c55760405162461bcd60e51b815260040161058590611421565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661070e600080516020611688833981519152546001600160a01b031690565b6001600160a01b0316146107345760405162461bcd60e51b81526004016105859061146d565b61073d82610bf2565b61059882826001610c1c565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146107e95760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c00000000000000006064820152608401610585565b5060008051602061168883398151915290565b60009182526097602090815260408084206001600160a01b0393909316845291905290205460ff1690565b61082f610a9b565b61012e546040805163703044e560e01b815290516000926001600160a01b03169163703044e59160048083019260209291908290030181865afa15801561087a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061089e9190611404565b9050806001600160a01b0316638fdb62386040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156108db57600080fd5b505af11580156108ef573d6000803e3d6000fd5b50505050506104ed60018055565b600054610100900460ff161580801561091d5750600054600160ff909116105b806109375750303b158015610937575060005460ff166001145b61099a5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610585565b6000805460ff1916600117905580156109bd576000805461ff0019166101001790555b6109c5610d87565b6109cd610dae565b6109d5610d87565b61012e80546001600160a01b0319166001600160a01b03851617905561012d829055610a02600033610b05565b610a2c7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e333610b05565b8015610514576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a1505050565b600082815260976020526040902060010154610a9181610afb565b6105148383610b8b565b60026001541415610aee5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610585565b6002600155565b60018055565b6106798133610ddd565b610b0f82826107fc565b6105985760008281526097602090815260408083206001600160a01b03851684529091529020805460ff19166001179055610b473390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b610b9582826107fc565b156105985760008281526097602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e361059881610afb565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff1615610c4f5761051483610e36565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610ca9575060408051601f3d908101601f19168201909252610ca6918101906114b9565b60015b610d0c5760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b6064820152608401610585565b6000805160206116888339815191528114610d7b5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b6064820152608401610585565b50610514838383610ed2565b600054610100900460ff166104ed5760405162461bcd60e51b8152600401610585906114d2565b600054610100900460ff16610dd55760405162461bcd60e51b8152600401610585906114d2565b6104ed610efd565b610de782826107fc565b61059857610df481610f24565b610dff836020610f36565b604051602001610e10929190611549565b60408051601f198184030181529082905262461bcd60e51b8252610585916004016115be565b6001600160a01b0381163b610ea35760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610585565b60008051602061168883398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b610edb836110d9565b600082511180610ee85750805b1561051457610ef78383611119565b50505050565b600054610100900460ff16610af55760405162461bcd60e51b8152600401610585906114d2565b60606103056001600160a01b03831660145b60606000610f45836002611607565b610f50906002611626565b67ffffffffffffffff811115610f6857610f686112fe565b6040519080825280601f01601f191660200182016040528015610f92576020820181803683370190505b509050600360fc1b81600081518110610fad57610fad61163e565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610fdc57610fdc61163e565b60200101906001600160f81b031916908160001a9053506000611000846002611607565b61100b906001611626565b90505b6001811115611083576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061103f5761103f61163e565b1a60f81b8282815181106110555761105561163e565b60200101906001600160f81b031916908160001a90535060049490941c9361107c81611654565b905061100e565b5083156110d25760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610585565b9392505050565b6110e281610e36565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606110d283836040518060600160405280602781526020016116a8602791396060600080856001600160a01b031685604051611156919061166b565b600060405180830381855af49150503d8060008114611191576040519150601f19603f3d011682016040523d82523d6000602084013e611196565b606091505b50915091506111a7868383876111b1565b9695505050505050565b6060831561121d578251611216576001600160a01b0385163b6112165760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610585565b5081611227565b611227838361122f565b949350505050565b81511561123f5781518083602001fd5b8060405162461bcd60e51b815260040161058591906115be565b60006020828403121561126b57600080fd5b81356001600160e01b0319811681146110d257600080fd5b60006020828403121561129557600080fd5b5035919050565b6001600160a01b038116811461067957600080fd5b600080604083850312156112c457600080fd5b8235915060208301356112d68161129c565b809150509250929050565b6000602082840312156112f357600080fd5b81356110d28161129c565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561132757600080fd5b82356113328161129c565b9150602083013567ffffffffffffffff8082111561134f57600080fd5b818501915085601f83011261136357600080fd5b813581811115611375576113756112fe565b604051601f8201601f19908116603f0116810190838211818310171561139d5761139d6112fe565b816040528281528860208487010111156113b657600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b600080604083850312156113eb57600080fd5b82356113f68161129c565b946020939093013593505050565b60006020828403121561141657600080fd5b81516110d28161129c565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6000602082840312156114cb57600080fd5b5051919050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b60005b83811015611538578181015183820152602001611520565b83811115610ef75750506000910152565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161158181601785016020880161151d565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516115b281602884016020880161151d565b01602801949350505050565b60208152600082518060208401526115dd81604085016020870161151d565b601f01601f19169190910160400192915050565b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615611621576116216115f1565b500290565b60008219821115611639576116396115f1565b500190565b634e487b7160e01b600052603260045260246000fd5b600081611663576116636115f1565b506000190190565b6000825161167d81846020870161151d565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a264697066735822122075aa3d7399eaf09fe5a7f1bac46b9d163ff5c50df66082a1c279ab34fc07622364736f6c634300080b0033";

type MomentoConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MomentoConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Momento__factory extends ContractFactory {
  constructor(...args: MomentoConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(overrides?: Overrides & { from?: string }): Promise<Momento> {
    return super.deploy(overrides || {}) as Promise<Momento>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Momento {
    return super.attach(address) as Momento;
  }
  override connect(signer: Signer): Momento__factory {
    return super.connect(signer) as Momento__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MomentoInterface {
    return new utils.Interface(_abi) as MomentoInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Momento {
    return new Contract(address, _abi, signerOrProvider) as Momento;
  }
}