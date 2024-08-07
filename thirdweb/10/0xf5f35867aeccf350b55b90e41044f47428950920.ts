import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from "thirdweb";

/**
* Contract events
*/

/**
 * Represents the filters for the "BaseFeePaid" event.
 */
export type BaseFeePaidEventFilters = Partial<{
  poolId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"poolId","type":"uint256"}>
}>;

/**
 * Creates an event object for the BaseFeePaid event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { baseFeePaidEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  baseFeePaidEvent({
 *  poolId: ...,
 * })
 * ],
 * });
 * ```
 */ 
export function baseFeePaidEvent(filters: BaseFeePaidEventFilters = {}) {
  return prepareEvent({
    signature: "event BaseFeePaid(uint256 indexed poolId, uint256 amount)",
    filters,
  });
};
  



/**
 * Creates an event object for the BaseFeeUpdated event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { baseFeeUpdatedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  baseFeeUpdatedEvent()
 * ],
 * });
 * ```
 */ 
export function baseFeeUpdatedEvent() {
  return prepareEvent({
    signature: "event BaseFeeUpdated(uint256 baseFee)",
  });
};
  



/**
 * Creates an event object for the Initialized event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { initializedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  initializedEvent()
 * ],
 * });
 * ```
 */ 
export function initializedEvent() {
  return prepareEvent({
    signature: "event Initialized(uint8 version)",
  });
};
  

/**
 * Represents the filters for the "OwnershipHandoverCanceled" event.
 */
export type OwnershipHandoverCanceledEventFilters = Partial<{
  pendingOwner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"pendingOwner","type":"address"}>
}>;

/**
 * Creates an event object for the OwnershipHandoverCanceled event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { ownershipHandoverCanceledEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownershipHandoverCanceledEvent({
 *  pendingOwner: ...,
 * })
 * ],
 * });
 * ```
 */ 
export function ownershipHandoverCanceledEvent(filters: OwnershipHandoverCanceledEventFilters = {}) {
  return prepareEvent({
    signature: "event OwnershipHandoverCanceled(address indexed pendingOwner)",
    filters,
  });
};
  

/**
 * Represents the filters for the "OwnershipHandoverRequested" event.
 */
export type OwnershipHandoverRequestedEventFilters = Partial<{
  pendingOwner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"pendingOwner","type":"address"}>
}>;

/**
 * Creates an event object for the OwnershipHandoverRequested event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { ownershipHandoverRequestedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownershipHandoverRequestedEvent({
 *  pendingOwner: ...,
 * })
 * ],
 * });
 * ```
 */ 
export function ownershipHandoverRequestedEvent(filters: OwnershipHandoverRequestedEventFilters = {}) {
  return prepareEvent({
    signature: "event OwnershipHandoverRequested(address indexed pendingOwner)",
    filters,
  });
};
  

/**
 * Represents the filters for the "OwnershipTransferred" event.
 */
export type OwnershipTransferredEventFilters = Partial<{
  oldOwner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"oldOwner","type":"address"}>
newOwner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}>
}>;

/**
 * Creates an event object for the OwnershipTransferred event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { ownershipTransferredEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownershipTransferredEvent({
 *  oldOwner: ...,
 *  newOwner: ...,
 * })
 * ],
 * });
 * ```
 */ 
export function ownershipTransferredEvent(filters: OwnershipTransferredEventFilters = {}) {
  return prepareEvent({
    signature: "event OwnershipTransferred(address indexed oldOwner, address indexed newOwner)",
    filters,
  });
};
  



/**
 * Creates an event object for the PercentFeeUpdated event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { percentFeeUpdatedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  percentFeeUpdatedEvent()
 * ],
 * });
 * ```
 */ 
export function percentFeeUpdatedEvent() {
  return prepareEvent({
    signature: "event PercentFeeUpdated(uint256 percentFee)",
  });
};
  

/**
 * Represents the filters for the "PoolCreated" event.
 */
export type PoolCreatedEventFilters = Partial<{
  poolId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"poolId","type":"uint256"}>
profileId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"profileId","type":"bytes32"}>
}>;

/**
 * Creates an event object for the PoolCreated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { poolCreatedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  poolCreatedEvent({
 *  poolId: ...,
 *  profileId: ...,
 * })
 * ],
 * });
 * ```
 */ 
export function poolCreatedEvent(filters: PoolCreatedEventFilters = {}) {
  return prepareEvent({
    signature: "event PoolCreated(uint256 indexed poolId, bytes32 indexed profileId, address strategy, address token, uint256 amount, (uint256 protocol, string pointer) metadata)",
    filters,
  });
};
  

/**
 * Represents the filters for the "PoolFunded" event.
 */
export type PoolFundedEventFilters = Partial<{
  poolId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"poolId","type":"uint256"}>
}>;

/**
 * Creates an event object for the PoolFunded event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { poolFundedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  poolFundedEvent({
 *  poolId: ...,
 * })
 * ],
 * });
 * ```
 */ 
export function poolFundedEvent(filters: PoolFundedEventFilters = {}) {
  return prepareEvent({
    signature: "event PoolFunded(uint256 indexed poolId, uint256 amount, uint256 fee)",
    filters,
  });
};
  

/**
 * Represents the filters for the "PoolMetadataUpdated" event.
 */
export type PoolMetadataUpdatedEventFilters = Partial<{
  poolId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"poolId","type":"uint256"}>
}>;

/**
 * Creates an event object for the PoolMetadataUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { poolMetadataUpdatedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  poolMetadataUpdatedEvent({
 *  poolId: ...,
 * })
 * ],
 * });
 * ```
 */ 
export function poolMetadataUpdatedEvent(filters: PoolMetadataUpdatedEventFilters = {}) {
  return prepareEvent({
    signature: "event PoolMetadataUpdated(uint256 indexed poolId, (uint256 protocol, string pointer) metadata)",
    filters,
  });
};
  



/**
 * Creates an event object for the RegistryUpdated event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { registryUpdatedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  registryUpdatedEvent()
 * ],
 * });
 * ```
 */ 
export function registryUpdatedEvent() {
  return prepareEvent({
    signature: "event RegistryUpdated(address registry)",
  });
};
  

/**
 * Represents the filters for the "RoleAdminChanged" event.
 */
export type RoleAdminChangedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"}>
previousAdminRole: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"}>
newAdminRole: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}>
}>;

/**
 * Creates an event object for the RoleAdminChanged event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleAdminChangedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleAdminChangedEvent({
 *  role: ...,
 *  previousAdminRole: ...,
 *  newAdminRole: ...,
 * })
 * ],
 * });
 * ```
 */ 
export function roleAdminChangedEvent(filters: RoleAdminChangedEventFilters = {}) {
  return prepareEvent({
    signature: "event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)",
    filters,
  });
};
  

/**
 * Represents the filters for the "RoleGranted" event.
 */
export type RoleGrantedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"account","type":"address"}>
sender: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"sender","type":"address"}>
}>;

/**
 * Creates an event object for the RoleGranted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleGrantedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleGrantedEvent({
 *  role: ...,
 *  account: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */ 
export function roleGrantedEvent(filters: RoleGrantedEventFilters = {}) {
  return prepareEvent({
    signature: "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
    filters,
  });
};
  

/**
 * Represents the filters for the "RoleRevoked" event.
 */
export type RoleRevokedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"account","type":"address"}>
sender: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"sender","type":"address"}>
}>;

/**
 * Creates an event object for the RoleRevoked event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleRevokedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleRevokedEvent({
 *  role: ...,
 *  account: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */ 
export function roleRevokedEvent(filters: RoleRevokedEventFilters = {}) {
  return prepareEvent({
    signature: "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
    filters,
  });
};
  



/**
 * Creates an event object for the StrategyApproved event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { strategyApprovedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  strategyApprovedEvent()
 * ],
 * });
 * ```
 */ 
export function strategyApprovedEvent() {
  return prepareEvent({
    signature: "event StrategyApproved(address strategy)",
  });
};
  



/**
 * Creates an event object for the StrategyRemoved event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { strategyRemovedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  strategyRemovedEvent()
 * ],
 * });
 * ```
 */ 
export function strategyRemovedEvent() {
  return prepareEvent({
    signature: "event StrategyRemoved(address strategy)",
  });
};
  



/**
 * Creates an event object for the TreasuryUpdated event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { treasuryUpdatedEvent } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  treasuryUpdatedEvent()
 * ],
 * });
 * ```
 */ 
export function treasuryUpdatedEvent() {
  return prepareEvent({
    signature: "event TreasuryUpdated(address treasury)",
  });
};
  

/**
* Contract read functions
*/



/**
 * Calls the "DEFAULT_ADMIN_ROLE" function on the contract.
 * @param options - The options for the DEFAULT_ADMIN_ROLE function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { DEFAULT_ADMIN_ROLE } from "TODO";
 * 
 * const result = await DEFAULT_ADMIN_ROLE();
 * 
 * ```
 */
export async function DEFAULT_ADMIN_ROLE(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xa217fddf",
  [],
  [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "NATIVE" function on the contract.
 * @param options - The options for the NATIVE function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { NATIVE } from "TODO";
 * 
 * const result = await NATIVE();
 * 
 * ```
 */
export async function NATIVE(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xa0cf0aea",
  [],
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "getBaseFee" function on the contract.
 * @param options - The options for the getBaseFee function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getBaseFee } from "TODO";
 * 
 * const result = await getBaseFee();
 * 
 * ```
 */
export async function getBaseFee(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x15e812ad",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "getFeeDenominator" function on the contract.
 * @param options - The options for the getFeeDenominator function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getFeeDenominator } from "TODO";
 * 
 * const result = await getFeeDenominator();
 * 
 * ```
 */
export async function getFeeDenominator(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xf4e1fc41",
  [],
  [
    {
      "internalType": "uint256",
      "name": "FEE_DENOMINATOR",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "getPercentFee" function on the contract.
 * @param options - The options for the getPercentFee function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getPercentFee } from "TODO";
 * 
 * const result = await getPercentFee();
 * 
 * ```
 */
export async function getPercentFee(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x4edbaadc",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "getPool" function.
 */
export type GetPoolParams = {
  poolId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_poolId","type":"uint256"}>
};

/**
 * Calls the "getPool" function on the contract.
 * @param options - The options for the getPool function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getPool } from "TODO";
 * 
 * const result = await getPool({
 *  poolId: ...,
 * });
 * 
 * ```
 */
export async function getPool(
  options: BaseTransactionOptions<GetPoolParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x068bcd8d",
  [
    {
      "internalType": "uint256",
      "name": "_poolId",
      "type": "uint256"
    }
  ],
  [
    {
      "components": [
        {
          "internalType": "bytes32",
          "name": "profileId",
          "type": "bytes32"
        },
        {
          "internalType": "contract IStrategy",
          "name": "strategy",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "protocol",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "pointer",
              "type": "string"
            }
          ],
          "internalType": "struct Metadata",
          "name": "metadata",
          "type": "tuple"
        },
        {
          "internalType": "bytes32",
          "name": "managerRole",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "adminRole",
          "type": "bytes32"
        }
      ],
      "internalType": "struct IAllo.Pool",
      "name": "",
      "type": "tuple"
    }
  ]
],
    params: [options.poolId]
  });
};




/**
 * Calls the "getRegistry" function on the contract.
 * @param options - The options for the getRegistry function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRegistry } from "TODO";
 * 
 * const result = await getRegistry();
 * 
 * ```
 */
export async function getRegistry(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x5ab1bd53",
  [],
  [
    {
      "internalType": "contract IRegistry",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "getRoleAdmin" function.
 */
export type GetRoleAdminParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
};

/**
 * Calls the "getRoleAdmin" function on the contract.
 * @param options - The options for the getRoleAdmin function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRoleAdmin } from "TODO";
 * 
 * const result = await getRoleAdmin({
 *  role: ...,
 * });
 * 
 * ```
 */
export async function getRoleAdmin(
  options: BaseTransactionOptions<GetRoleAdminParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x248a9ca3",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    }
  ],
  [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ]
],
    params: [options.role]
  });
};


/**
 * Represents the parameters for the "getStrategy" function.
 */
export type GetStrategyParams = {
  poolId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_poolId","type":"uint256"}>
};

/**
 * Calls the "getStrategy" function on the contract.
 * @param options - The options for the getStrategy function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getStrategy } from "TODO";
 * 
 * const result = await getStrategy({
 *  poolId: ...,
 * });
 * 
 * ```
 */
export async function getStrategy(
  options: BaseTransactionOptions<GetStrategyParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xcfc0cc34",
  [
    {
      "internalType": "uint256",
      "name": "_poolId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ]
],
    params: [options.poolId]
  });
};




/**
 * Calls the "getTreasury" function on the contract.
 * @param options - The options for the getTreasury function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getTreasury } from "TODO";
 * 
 * const result = await getTreasury();
 * 
 * ```
 */
export async function getTreasury(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x3b19e84a",
  [],
  [
    {
      "internalType": "address payable",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "hasRole" function.
 */
export type HasRoleParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "hasRole" function on the contract.
 * @param options - The options for the hasRole function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { hasRole } from "TODO";
 * 
 * const result = await hasRole({
 *  role: ...,
 *  account: ...,
 * });
 * 
 * ```
 */
export async function hasRole(
  options: BaseTransactionOptions<HasRoleParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x91d14854",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.role, options.account]
  });
};


/**
 * Represents the parameters for the "isCloneableStrategy" function.
 */
export type IsCloneableStrategyParams = {
  strategy: AbiParameterToPrimitiveType<{"internalType":"address","name":"_strategy","type":"address"}>
};

/**
 * Calls the "isCloneableStrategy" function on the contract.
 * @param options - The options for the isCloneableStrategy function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isCloneableStrategy } from "TODO";
 * 
 * const result = await isCloneableStrategy({
 *  strategy: ...,
 * });
 * 
 * ```
 */
export async function isCloneableStrategy(
  options: BaseTransactionOptions<IsCloneableStrategyParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xab2ec589",
  [
    {
      "internalType": "address",
      "name": "_strategy",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.strategy]
  });
};


/**
 * Represents the parameters for the "isPoolAdmin" function.
 */
export type IsPoolAdminParams = {
  poolId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_poolId","type":"uint256"}>
address: AbiParameterToPrimitiveType<{"internalType":"address","name":"_address","type":"address"}>
};

/**
 * Calls the "isPoolAdmin" function on the contract.
 * @param options - The options for the isPoolAdmin function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isPoolAdmin } from "TODO";
 * 
 * const result = await isPoolAdmin({
 *  poolId: ...,
 *  address: ...,
 * });
 * 
 * ```
 */
export async function isPoolAdmin(
  options: BaseTransactionOptions<IsPoolAdminParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xab3febc6",
  [
    {
      "internalType": "uint256",
      "name": "_poolId",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "_address",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.poolId, options.address]
  });
};


/**
 * Represents the parameters for the "isPoolManager" function.
 */
export type IsPoolManagerParams = {
  poolId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_poolId","type":"uint256"}>
address: AbiParameterToPrimitiveType<{"internalType":"address","name":"_address","type":"address"}>
};

/**
 * Calls the "isPoolManager" function on the contract.
 * @param options - The options for the isPoolManager function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isPoolManager } from "TODO";
 * 
 * const result = await isPoolManager({
 *  poolId: ...,
 *  address: ...,
 * });
 * 
 * ```
 */
export async function isPoolManager(
  options: BaseTransactionOptions<IsPoolManagerParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x29e40d4b",
  [
    {
      "internalType": "uint256",
      "name": "_poolId",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "_address",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.poolId, options.address]
  });
};




/**
 * Calls the "owner" function on the contract.
 * @param options - The options for the owner function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { owner } from "TODO";
 * 
 * const result = await owner();
 * 
 * ```
 */
export async function owner(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x8da5cb5b",
  [],
  [
    {
      "internalType": "address",
      "name": "result",
      "type": "address"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "ownershipHandoverExpiresAt" function.
 */
export type OwnershipHandoverExpiresAtParams = {
  pendingOwner: AbiParameterToPrimitiveType<{"internalType":"address","name":"pendingOwner","type":"address"}>
};

/**
 * Calls the "ownershipHandoverExpiresAt" function on the contract.
 * @param options - The options for the ownershipHandoverExpiresAt function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { ownershipHandoverExpiresAt } from "TODO";
 * 
 * const result = await ownershipHandoverExpiresAt({
 *  pendingOwner: ...,
 * });
 * 
 * ```
 */
export async function ownershipHandoverExpiresAt(
  options: BaseTransactionOptions<OwnershipHandoverExpiresAtParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xfee81cf4",
  [
    {
      "internalType": "address",
      "name": "pendingOwner",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "result",
      "type": "uint256"
    }
  ]
],
    params: [options.pendingOwner]
  });
};


/**
 * Represents the parameters for the "supportsInterface" function.
 */
export type SupportsInterfaceParams = {
  interfaceId: AbiParameterToPrimitiveType<{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}>
};

/**
 * Calls the "supportsInterface" function on the contract.
 * @param options - The options for the supportsInterface function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { supportsInterface } from "TODO";
 * 
 * const result = await supportsInterface({
 *  interfaceId: ...,
 * });
 * 
 * ```
 */
export async function supportsInterface(
  options: BaseTransactionOptions<SupportsInterfaceParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x01ffc9a7",
  [
    {
      "internalType": "bytes4",
      "name": "interfaceId",
      "type": "bytes4"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.interfaceId]
  });
};


/**
* Contract write functions
*/

/**
 * Represents the parameters for the "addPoolManager" function.
 */
export type AddPoolManagerParams = {
  poolId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_poolId","type":"uint256"}>
manager: AbiParameterToPrimitiveType<{"internalType":"address","name":"_manager","type":"address"}>
};

/**
 * Calls the "addPoolManager" function on the contract.
 * @param options - The options for the "addPoolManager" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { addPoolManager } from "TODO";
 * 
 * const transaction = addPoolManager({
 *  poolId: ...,
 *  manager: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function addPoolManager(
  options: BaseTransactionOptions<AddPoolManagerParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x2cf682b0",
  [
    {
      "internalType": "uint256",
      "name": "_poolId",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "_manager",
      "type": "address"
    }
  ],
  []
],
    params: [options.poolId, options.manager]
  });
};


/**
 * Represents the parameters for the "addToCloneableStrategies" function.
 */
export type AddToCloneableStrategiesParams = {
  strategy: AbiParameterToPrimitiveType<{"internalType":"address","name":"_strategy","type":"address"}>
};

/**
 * Calls the "addToCloneableStrategies" function on the contract.
 * @param options - The options for the "addToCloneableStrategies" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { addToCloneableStrategies } from "TODO";
 * 
 * const transaction = addToCloneableStrategies({
 *  strategy: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function addToCloneableStrategies(
  options: BaseTransactionOptions<AddToCloneableStrategiesParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x41bba0b4",
  [
    {
      "internalType": "address",
      "name": "_strategy",
      "type": "address"
    }
  ],
  []
],
    params: [options.strategy]
  });
};


/**
 * Represents the parameters for the "allocate" function.
 */
export type AllocateParams = {
  poolId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_poolId","type":"uint256"}>
data: AbiParameterToPrimitiveType<{"internalType":"bytes","name":"_data","type":"bytes"}>
};

/**
 * Calls the "allocate" function on the contract.
 * @param options - The options for the "allocate" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { allocate } from "TODO";
 * 
 * const transaction = allocate({
 *  poolId: ...,
 *  data: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function allocate(
  options: BaseTransactionOptions<AllocateParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x2ec38188",
  [
    {
      "internalType": "uint256",
      "name": "_poolId",
      "type": "uint256"
    },
    {
      "internalType": "bytes",
      "name": "_data",
      "type": "bytes"
    }
  ],
  []
],
    params: [options.poolId, options.data]
  });
};


/**
 * Represents the parameters for the "batchAllocate" function.
 */
export type BatchAllocateParams = {
  poolIds: AbiParameterToPrimitiveType<{"internalType":"uint256[]","name":"_poolIds","type":"uint256[]"}>
datas: AbiParameterToPrimitiveType<{"internalType":"bytes[]","name":"_datas","type":"bytes[]"}>
};

/**
 * Calls the "batchAllocate" function on the contract.
 * @param options - The options for the "batchAllocate" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { batchAllocate } from "TODO";
 * 
 * const transaction = batchAllocate({
 *  poolIds: ...,
 *  datas: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function batchAllocate(
  options: BaseTransactionOptions<BatchAllocateParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xc6dff1cf",
  [
    {
      "internalType": "uint256[]",
      "name": "_poolIds",
      "type": "uint256[]"
    },
    {
      "internalType": "bytes[]",
      "name": "_datas",
      "type": "bytes[]"
    }
  ],
  []
],
    params: [options.poolIds, options.datas]
  });
};


/**
 * Represents the parameters for the "batchRegisterRecipient" function.
 */
export type BatchRegisterRecipientParams = {
  poolIds: AbiParameterToPrimitiveType<{"internalType":"uint256[]","name":"_poolIds","type":"uint256[]"}>
data: AbiParameterToPrimitiveType<{"internalType":"bytes[]","name":"_data","type":"bytes[]"}>
};

/**
 * Calls the "batchRegisterRecipient" function on the contract.
 * @param options - The options for the "batchRegisterRecipient" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { batchRegisterRecipient } from "TODO";
 * 
 * const transaction = batchRegisterRecipient({
 *  poolIds: ...,
 *  data: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function batchRegisterRecipient(
  options: BaseTransactionOptions<BatchRegisterRecipientParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x1a20bd88",
  [
    {
      "internalType": "uint256[]",
      "name": "_poolIds",
      "type": "uint256[]"
    },
    {
      "internalType": "bytes[]",
      "name": "_data",
      "type": "bytes[]"
    }
  ],
  [
    {
      "internalType": "address[]",
      "name": "recipientIds",
      "type": "address[]"
    }
  ]
],
    params: [options.poolIds, options.data]
  });
};




/**
 * Calls the "cancelOwnershipHandover" function on the contract.
 * @param options - The options for the "cancelOwnershipHandover" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { cancelOwnershipHandover } from "TODO";
 * 
 * const transaction = cancelOwnershipHandover();
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function cancelOwnershipHandover(
  options: BaseTransactionOptions
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x54d1f13d",
  [],
  []
],
    params: []
  });
};


/**
 * Represents the parameters for the "completeOwnershipHandover" function.
 */
export type CompleteOwnershipHandoverParams = {
  pendingOwner: AbiParameterToPrimitiveType<{"internalType":"address","name":"pendingOwner","type":"address"}>
};

/**
 * Calls the "completeOwnershipHandover" function on the contract.
 * @param options - The options for the "completeOwnershipHandover" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { completeOwnershipHandover } from "TODO";
 * 
 * const transaction = completeOwnershipHandover({
 *  pendingOwner: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function completeOwnershipHandover(
  options: BaseTransactionOptions<CompleteOwnershipHandoverParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xf04e283e",
  [
    {
      "internalType": "address",
      "name": "pendingOwner",
      "type": "address"
    }
  ],
  []
],
    params: [options.pendingOwner]
  });
};


/**
 * Represents the parameters for the "createPool" function.
 */
export type CreatePoolParams = {
  profileId: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"_profileId","type":"bytes32"}>
strategy: AbiParameterToPrimitiveType<{"internalType":"address","name":"_strategy","type":"address"}>
initStrategyData: AbiParameterToPrimitiveType<{"internalType":"bytes","name":"_initStrategyData","type":"bytes"}>
token: AbiParameterToPrimitiveType<{"internalType":"address","name":"_token","type":"address"}>
amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_amount","type":"uint256"}>
metadata: AbiParameterToPrimitiveType<{"components":[{"internalType":"uint256","name":"protocol","type":"uint256"},{"internalType":"string","name":"pointer","type":"string"}],"internalType":"struct Metadata","name":"_metadata","type":"tuple"}>
managers: AbiParameterToPrimitiveType<{"internalType":"address[]","name":"_managers","type":"address[]"}>
};

/**
 * Calls the "createPool" function on the contract.
 * @param options - The options for the "createPool" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { createPool } from "TODO";
 * 
 * const transaction = createPool({
 *  profileId: ...,
 *  strategy: ...,
 *  initStrategyData: ...,
 *  token: ...,
 *  amount: ...,
 *  metadata: ...,
 *  managers: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function createPool(
  options: BaseTransactionOptions<CreatePoolParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x77da8caf",
  [
    {
      "internalType": "bytes32",
      "name": "_profileId",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "_strategy",
      "type": "address"
    },
    {
      "internalType": "bytes",
      "name": "_initStrategyData",
      "type": "bytes"
    },
    {
      "internalType": "address",
      "name": "_token",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    },
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "protocol",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "pointer",
          "type": "string"
        }
      ],
      "internalType": "struct Metadata",
      "name": "_metadata",
      "type": "tuple"
    },
    {
      "internalType": "address[]",
      "name": "_managers",
      "type": "address[]"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "poolId",
      "type": "uint256"
    }
  ]
],
    params: [options.profileId, options.strategy, options.initStrategyData, options.token, options.amount, options.metadata, options.managers]
  });
};


/**
 * Represents the parameters for the "createPoolWithCustomStrategy" function.
 */
export type CreatePoolWithCustomStrategyParams = {
  profileId: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"_profileId","type":"bytes32"}>
strategy: AbiParameterToPrimitiveType<{"internalType":"address","name":"_strategy","type":"address"}>
initStrategyData: AbiParameterToPrimitiveType<{"internalType":"bytes","name":"_initStrategyData","type":"bytes"}>
token: AbiParameterToPrimitiveType<{"internalType":"address","name":"_token","type":"address"}>
amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_amount","type":"uint256"}>
metadata: AbiParameterToPrimitiveType<{"components":[{"internalType":"uint256","name":"protocol","type":"uint256"},{"internalType":"string","name":"pointer","type":"string"}],"internalType":"struct Metadata","name":"_metadata","type":"tuple"}>
managers: AbiParameterToPrimitiveType<{"internalType":"address[]","name":"_managers","type":"address[]"}>
};

/**
 * Calls the "createPoolWithCustomStrategy" function on the contract.
 * @param options - The options for the "createPoolWithCustomStrategy" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { createPoolWithCustomStrategy } from "TODO";
 * 
 * const transaction = createPoolWithCustomStrategy({
 *  profileId: ...,
 *  strategy: ...,
 *  initStrategyData: ...,
 *  token: ...,
 *  amount: ...,
 *  metadata: ...,
 *  managers: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function createPoolWithCustomStrategy(
  options: BaseTransactionOptions<CreatePoolWithCustomStrategyParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xe1007d4a",
  [
    {
      "internalType": "bytes32",
      "name": "_profileId",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "_strategy",
      "type": "address"
    },
    {
      "internalType": "bytes",
      "name": "_initStrategyData",
      "type": "bytes"
    },
    {
      "internalType": "address",
      "name": "_token",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    },
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "protocol",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "pointer",
          "type": "string"
        }
      ],
      "internalType": "struct Metadata",
      "name": "_metadata",
      "type": "tuple"
    },
    {
      "internalType": "address[]",
      "name": "_managers",
      "type": "address[]"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "poolId",
      "type": "uint256"
    }
  ]
],
    params: [options.profileId, options.strategy, options.initStrategyData, options.token, options.amount, options.metadata, options.managers]
  });
};


/**
 * Represents the parameters for the "distribute" function.
 */
export type DistributeParams = {
  poolId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_poolId","type":"uint256"}>
recipientIds: AbiParameterToPrimitiveType<{"internalType":"address[]","name":"_recipientIds","type":"address[]"}>
data: AbiParameterToPrimitiveType<{"internalType":"bytes","name":"_data","type":"bytes"}>
};

/**
 * Calls the "distribute" function on the contract.
 * @param options - The options for the "distribute" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { distribute } from "TODO";
 * 
 * const transaction = distribute({
 *  poolId: ...,
 *  recipientIds: ...,
 *  data: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function distribute(
  options: BaseTransactionOptions<DistributeParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x3a5fbd92",
  [
    {
      "internalType": "uint256",
      "name": "_poolId",
      "type": "uint256"
    },
    {
      "internalType": "address[]",
      "name": "_recipientIds",
      "type": "address[]"
    },
    {
      "internalType": "bytes",
      "name": "_data",
      "type": "bytes"
    }
  ],
  []
],
    params: [options.poolId, options.recipientIds, options.data]
  });
};


/**
 * Represents the parameters for the "fundPool" function.
 */
export type FundPoolParams = {
  poolId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_poolId","type":"uint256"}>
amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_amount","type":"uint256"}>
};

/**
 * Calls the "fundPool" function on the contract.
 * @param options - The options for the "fundPool" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { fundPool } from "TODO";
 * 
 * const transaction = fundPool({
 *  poolId: ...,
 *  amount: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function fundPool(
  options: BaseTransactionOptions<FundPoolParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x5acd6fac",
  [
    {
      "internalType": "uint256",
      "name": "_poolId",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.poolId, options.amount]
  });
};


/**
 * Represents the parameters for the "grantRole" function.
 */
export type GrantRoleParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "grantRole" function on the contract.
 * @param options - The options for the "grantRole" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { grantRole } from "TODO";
 * 
 * const transaction = grantRole({
 *  role: ...,
 *  account: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function grantRole(
  options: BaseTransactionOptions<GrantRoleParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x2f2ff15d",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  []
],
    params: [options.role, options.account]
  });
};


/**
 * Represents the parameters for the "initialize" function.
 */
export type InitializeParams = {
  owner: AbiParameterToPrimitiveType<{"internalType":"address","name":"_owner","type":"address"}>
registry: AbiParameterToPrimitiveType<{"internalType":"address","name":"_registry","type":"address"}>
treasury: AbiParameterToPrimitiveType<{"internalType":"address payable","name":"_treasury","type":"address"}>
percentFee: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_percentFee","type":"uint256"}>
baseFee: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_baseFee","type":"uint256"}>
};

/**
 * Calls the "initialize" function on the contract.
 * @param options - The options for the "initialize" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { initialize } from "TODO";
 * 
 * const transaction = initialize({
 *  owner: ...,
 *  registry: ...,
 *  treasury: ...,
 *  percentFee: ...,
 *  baseFee: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function initialize(
  options: BaseTransactionOptions<InitializeParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xa6b63eb8",
  [
    {
      "internalType": "address",
      "name": "_owner",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "_registry",
      "type": "address"
    },
    {
      "internalType": "address payable",
      "name": "_treasury",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "_percentFee",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "_baseFee",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.owner, options.registry, options.treasury, options.percentFee, options.baseFee]
  });
};


/**
 * Represents the parameters for the "recoverFunds" function.
 */
export type RecoverFundsParams = {
  token: AbiParameterToPrimitiveType<{"internalType":"address","name":"_token","type":"address"}>
recipient: AbiParameterToPrimitiveType<{"internalType":"address","name":"_recipient","type":"address"}>
};

/**
 * Calls the "recoverFunds" function on the contract.
 * @param options - The options for the "recoverFunds" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { recoverFunds } from "TODO";
 * 
 * const transaction = recoverFunds({
 *  token: ...,
 *  recipient: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function recoverFunds(
  options: BaseTransactionOptions<RecoverFundsParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x24ae6a27",
  [
    {
      "internalType": "address",
      "name": "_token",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "_recipient",
      "type": "address"
    }
  ],
  []
],
    params: [options.token, options.recipient]
  });
};


/**
 * Represents the parameters for the "registerRecipient" function.
 */
export type RegisterRecipientParams = {
  poolId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_poolId","type":"uint256"}>
data: AbiParameterToPrimitiveType<{"internalType":"bytes","name":"_data","type":"bytes"}>
};

/**
 * Calls the "registerRecipient" function on the contract.
 * @param options - The options for the "registerRecipient" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { registerRecipient } from "TODO";
 * 
 * const transaction = registerRecipient({
 *  poolId: ...,
 *  data: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function registerRecipient(
  options: BaseTransactionOptions<RegisterRecipientParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x075c0e9c",
  [
    {
      "internalType": "uint256",
      "name": "_poolId",
      "type": "uint256"
    },
    {
      "internalType": "bytes",
      "name": "_data",
      "type": "bytes"
    }
  ],
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ]
],
    params: [options.poolId, options.data]
  });
};


/**
 * Represents the parameters for the "removeFromCloneableStrategies" function.
 */
export type RemoveFromCloneableStrategiesParams = {
  strategy: AbiParameterToPrimitiveType<{"internalType":"address","name":"_strategy","type":"address"}>
};

/**
 * Calls the "removeFromCloneableStrategies" function on the contract.
 * @param options - The options for the "removeFromCloneableStrategies" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { removeFromCloneableStrategies } from "TODO";
 * 
 * const transaction = removeFromCloneableStrategies({
 *  strategy: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function removeFromCloneableStrategies(
  options: BaseTransactionOptions<RemoveFromCloneableStrategiesParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x031e2fa1",
  [
    {
      "internalType": "address",
      "name": "_strategy",
      "type": "address"
    }
  ],
  []
],
    params: [options.strategy]
  });
};


/**
 * Represents the parameters for the "removePoolManager" function.
 */
export type RemovePoolManagerParams = {
  poolId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_poolId","type":"uint256"}>
manager: AbiParameterToPrimitiveType<{"internalType":"address","name":"_manager","type":"address"}>
};

/**
 * Calls the "removePoolManager" function on the contract.
 * @param options - The options for the "removePoolManager" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { removePoolManager } from "TODO";
 * 
 * const transaction = removePoolManager({
 *  poolId: ...,
 *  manager: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function removePoolManager(
  options: BaseTransactionOptions<RemovePoolManagerParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x7f5a70bd",
  [
    {
      "internalType": "uint256",
      "name": "_poolId",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "_manager",
      "type": "address"
    }
  ],
  []
],
    params: [options.poolId, options.manager]
  });
};




/**
 * Calls the "renounceOwnership" function on the contract.
 * @param options - The options for the "renounceOwnership" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { renounceOwnership } from "TODO";
 * 
 * const transaction = renounceOwnership();
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function renounceOwnership(
  options: BaseTransactionOptions
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x715018a6",
  [],
  []
],
    params: []
  });
};


/**
 * Represents the parameters for the "renounceRole" function.
 */
export type RenounceRoleParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "renounceRole" function on the contract.
 * @param options - The options for the "renounceRole" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { renounceRole } from "TODO";
 * 
 * const transaction = renounceRole({
 *  role: ...,
 *  account: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function renounceRole(
  options: BaseTransactionOptions<RenounceRoleParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x36568abe",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  []
],
    params: [options.role, options.account]
  });
};




/**
 * Calls the "requestOwnershipHandover" function on the contract.
 * @param options - The options for the "requestOwnershipHandover" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { requestOwnershipHandover } from "TODO";
 * 
 * const transaction = requestOwnershipHandover();
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function requestOwnershipHandover(
  options: BaseTransactionOptions
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x25692962",
  [],
  []
],
    params: []
  });
};


/**
 * Represents the parameters for the "revokeRole" function.
 */
export type RevokeRoleParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "revokeRole" function on the contract.
 * @param options - The options for the "revokeRole" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { revokeRole } from "TODO";
 * 
 * const transaction = revokeRole({
 *  role: ...,
 *  account: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function revokeRole(
  options: BaseTransactionOptions<RevokeRoleParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xd547741f",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  []
],
    params: [options.role, options.account]
  });
};


/**
 * Represents the parameters for the "transferOwnership" function.
 */
export type TransferOwnershipParams = {
  newOwner: AbiParameterToPrimitiveType<{"internalType":"address","name":"newOwner","type":"address"}>
};

/**
 * Calls the "transferOwnership" function on the contract.
 * @param options - The options for the "transferOwnership" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { transferOwnership } from "TODO";
 * 
 * const transaction = transferOwnership({
 *  newOwner: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function transferOwnership(
  options: BaseTransactionOptions<TransferOwnershipParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xf2fde38b",
  [
    {
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  []
],
    params: [options.newOwner]
  });
};


/**
 * Represents the parameters for the "updateBaseFee" function.
 */
export type UpdateBaseFeeParams = {
  baseFee: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_baseFee","type":"uint256"}>
};

/**
 * Calls the "updateBaseFee" function on the contract.
 * @param options - The options for the "updateBaseFee" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { updateBaseFee } from "TODO";
 * 
 * const transaction = updateBaseFee({
 *  baseFee: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function updateBaseFee(
  options: BaseTransactionOptions<UpdateBaseFeeParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x8e690186",
  [
    {
      "internalType": "uint256",
      "name": "_baseFee",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.baseFee]
  });
};


/**
 * Represents the parameters for the "updatePercentFee" function.
 */
export type UpdatePercentFeeParams = {
  percentFee: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_percentFee","type":"uint256"}>
};

/**
 * Calls the "updatePercentFee" function on the contract.
 * @param options - The options for the "updatePercentFee" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { updatePercentFee } from "TODO";
 * 
 * const transaction = updatePercentFee({
 *  percentFee: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function updatePercentFee(
  options: BaseTransactionOptions<UpdatePercentFeeParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xf54fc4a0",
  [
    {
      "internalType": "uint256",
      "name": "_percentFee",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.percentFee]
  });
};


/**
 * Represents the parameters for the "updatePoolMetadata" function.
 */
export type UpdatePoolMetadataParams = {
  poolId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_poolId","type":"uint256"}>
metadata: AbiParameterToPrimitiveType<{"components":[{"internalType":"uint256","name":"protocol","type":"uint256"},{"internalType":"string","name":"pointer","type":"string"}],"internalType":"struct Metadata","name":"_metadata","type":"tuple"}>
};

/**
 * Calls the "updatePoolMetadata" function on the contract.
 * @param options - The options for the "updatePoolMetadata" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { updatePoolMetadata } from "TODO";
 * 
 * const transaction = updatePoolMetadata({
 *  poolId: ...,
 *  metadata: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function updatePoolMetadata(
  options: BaseTransactionOptions<UpdatePoolMetadataParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x5f9ca138",
  [
    {
      "internalType": "uint256",
      "name": "_poolId",
      "type": "uint256"
    },
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "protocol",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "pointer",
          "type": "string"
        }
      ],
      "internalType": "struct Metadata",
      "name": "_metadata",
      "type": "tuple"
    }
  ],
  []
],
    params: [options.poolId, options.metadata]
  });
};


/**
 * Represents the parameters for the "updateRegistry" function.
 */
export type UpdateRegistryParams = {
  registry: AbiParameterToPrimitiveType<{"internalType":"address","name":"_registry","type":"address"}>
};

/**
 * Calls the "updateRegistry" function on the contract.
 * @param options - The options for the "updateRegistry" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { updateRegistry } from "TODO";
 * 
 * const transaction = updateRegistry({
 *  registry: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function updateRegistry(
  options: BaseTransactionOptions<UpdateRegistryParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x1a5da6c8",
  [
    {
      "internalType": "address",
      "name": "_registry",
      "type": "address"
    }
  ],
  []
],
    params: [options.registry]
  });
};


/**
 * Represents the parameters for the "updateTreasury" function.
 */
export type UpdateTreasuryParams = {
  treasury: AbiParameterToPrimitiveType<{"internalType":"address payable","name":"_treasury","type":"address"}>
};

/**
 * Calls the "updateTreasury" function on the contract.
 * @param options - The options for the "updateTreasury" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { updateTreasury } from "TODO";
 * 
 * const transaction = updateTreasury({
 *  treasury: ...,
 * });
 * 
 * // Send the transaction
 * ...
 * 
 * ```
 */
export function updateTreasury(
  options: BaseTransactionOptions<UpdateTreasuryParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x7f51bb1f",
  [
    {
      "internalType": "address payable",
      "name": "_treasury",
      "type": "address"
    }
  ],
  []
],
    params: [options.treasury]
  });
};


