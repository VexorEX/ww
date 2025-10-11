
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  userid: 'userid',
  country: 'country',
  countryName: 'countryName',
  level: 'level',
  rank: 'rank',
  government: 'government',
  religion: 'religion',
  crowd: 'crowd',
  capital: 'capital',
  dailyProfit: 'dailyProfit',
  satisfaction: 'satisfaction',
  security: 'security',
  lottery: 'lottery',
  oil: 'oil',
  iron: 'iron',
  gold: 'gold',
  uranium: 'uranium',
  goldMine: 'goldMine',
  uraniumMine: 'uraniumMine',
  ironMine: 'ironMine',
  refinery: 'refinery',
  soldier: 'soldier',
  tank: 'tank',
  heavyTank: 'heavyTank',
  su57: 'su57',
  f47: 'f47',
  f35: 'f35',
  j20: 'j20',
  f16: 'f16',
  f22: 'f22',
  am50: 'am50',
  b2: 'b2',
  tu16: 'tu16',
  espionageDrone: 'espionageDrone',
  suicideDrone: 'suicideDrone',
  crossDrone: 'crossDrone',
  witnessDrone: 'witnessDrone',
  simpleRocket: 'simpleRocket',
  crossRocket: 'crossRocket',
  dotTargetRocket: 'dotTargetRocket',
  continentalRocket: 'continentalRocket',
  ballisticRocket: 'ballisticRocket',
  chemicalRocket: 'chemicalRocket',
  hyperSonicRocket: 'hyperSonicRocket',
  clusterRocket: 'clusterRocket',
  battleship: 'battleship',
  marineShip: 'marineShip',
  breakerShip: 'breakerShip',
  nuclearSubmarine: 'nuclearSubmarine',
  antiRocket: 'antiRocket',
  ironDome: 'ironDome',
  s400: 's400',
  taad: 'taad',
  hq9: 'hq9',
  acash: 'acash'
};

exports.Prisma.ProductionLineScalarFieldEnum = {
  id: 'id',
  ownerId: 'ownerId',
  country: 'country',
  name: 'name',
  type: 'type',
  imageUrl: 'imageUrl',
  dailyLimit: 'dailyLimit',
  setupCost: 'setupCost',
  createdAt: 'createdAt',
  carName: 'carName'
};

exports.Prisma.PendingProductionLineScalarFieldEnum = {
  ownerId: 'ownerId',
  name: 'name',
  type: 'type',
  imageUrl: 'imageUrl',
  imageFileId: 'imageFileId',
  dailyLimit: 'dailyLimit',
  setupCost: 'setupCost',
  country: 'country'
};

exports.Prisma.CarScalarFieldEnum = {
  id: 'id',
  ownerId: 'ownerId',
  name: 'name',
  imageUrl: 'imageUrl',
  price: 'price',
  createdAt: 'createdAt'
};

exports.Prisma.PendingBuildingScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  carName: 'carName',
  imageUrl: 'imageUrl',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  ProductionLine: 'ProductionLine',
  PendingProductionLine: 'PendingProductionLine',
  Car: 'Car',
  PendingBuilding: 'PendingBuilding'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
