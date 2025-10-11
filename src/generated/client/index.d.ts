
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model ProductionLine
 * 
 */
export type ProductionLine = $Result.DefaultSelection<Prisma.$ProductionLinePayload>
/**
 * Model PendingProductionLine
 * 
 */
export type PendingProductionLine = $Result.DefaultSelection<Prisma.$PendingProductionLinePayload>
/**
 * Model Car
 * 
 */
export type Car = $Result.DefaultSelection<Prisma.$CarPayload>
/**
 * Model PendingBuilding
 * 
 */
export type PendingBuilding = $Result.DefaultSelection<Prisma.$PendingBuildingPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.productionLine`: Exposes CRUD operations for the **ProductionLine** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductionLines
    * const productionLines = await prisma.productionLine.findMany()
    * ```
    */
  get productionLine(): Prisma.ProductionLineDelegate<ExtArgs>;

  /**
   * `prisma.pendingProductionLine`: Exposes CRUD operations for the **PendingProductionLine** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PendingProductionLines
    * const pendingProductionLines = await prisma.pendingProductionLine.findMany()
    * ```
    */
  get pendingProductionLine(): Prisma.PendingProductionLineDelegate<ExtArgs>;

  /**
   * `prisma.car`: Exposes CRUD operations for the **Car** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cars
    * const cars = await prisma.car.findMany()
    * ```
    */
  get car(): Prisma.CarDelegate<ExtArgs>;

  /**
   * `prisma.pendingBuilding`: Exposes CRUD operations for the **PendingBuilding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PendingBuildings
    * const pendingBuildings = await prisma.pendingBuilding.findMany()
    * ```
    */
  get pendingBuilding(): Prisma.PendingBuildingDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    ProductionLine: 'ProductionLine',
    PendingProductionLine: 'PendingProductionLine',
    Car: 'Car',
    PendingBuilding: 'PendingBuilding'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "productionLine" | "pendingProductionLine" | "car" | "pendingBuilding"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      ProductionLine: {
        payload: Prisma.$ProductionLinePayload<ExtArgs>
        fields: Prisma.ProductionLineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductionLineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductionLineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLinePayload>
          }
          findFirst: {
            args: Prisma.ProductionLineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductionLineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLinePayload>
          }
          findMany: {
            args: Prisma.ProductionLineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLinePayload>[]
          }
          create: {
            args: Prisma.ProductionLineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLinePayload>
          }
          createMany: {
            args: Prisma.ProductionLineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductionLineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLinePayload>[]
          }
          delete: {
            args: Prisma.ProductionLineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLinePayload>
          }
          update: {
            args: Prisma.ProductionLineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLinePayload>
          }
          deleteMany: {
            args: Prisma.ProductionLineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductionLineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductionLineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionLinePayload>
          }
          aggregate: {
            args: Prisma.ProductionLineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductionLine>
          }
          groupBy: {
            args: Prisma.ProductionLineGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductionLineGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductionLineCountArgs<ExtArgs>
            result: $Utils.Optional<ProductionLineCountAggregateOutputType> | number
          }
        }
      }
      PendingProductionLine: {
        payload: Prisma.$PendingProductionLinePayload<ExtArgs>
        fields: Prisma.PendingProductionLineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PendingProductionLineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductionLinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PendingProductionLineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductionLinePayload>
          }
          findFirst: {
            args: Prisma.PendingProductionLineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductionLinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PendingProductionLineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductionLinePayload>
          }
          findMany: {
            args: Prisma.PendingProductionLineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductionLinePayload>[]
          }
          create: {
            args: Prisma.PendingProductionLineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductionLinePayload>
          }
          createMany: {
            args: Prisma.PendingProductionLineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PendingProductionLineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductionLinePayload>[]
          }
          delete: {
            args: Prisma.PendingProductionLineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductionLinePayload>
          }
          update: {
            args: Prisma.PendingProductionLineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductionLinePayload>
          }
          deleteMany: {
            args: Prisma.PendingProductionLineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PendingProductionLineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PendingProductionLineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductionLinePayload>
          }
          aggregate: {
            args: Prisma.PendingProductionLineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePendingProductionLine>
          }
          groupBy: {
            args: Prisma.PendingProductionLineGroupByArgs<ExtArgs>
            result: $Utils.Optional<PendingProductionLineGroupByOutputType>[]
          }
          count: {
            args: Prisma.PendingProductionLineCountArgs<ExtArgs>
            result: $Utils.Optional<PendingProductionLineCountAggregateOutputType> | number
          }
        }
      }
      Car: {
        payload: Prisma.$CarPayload<ExtArgs>
        fields: Prisma.CarFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CarFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CarFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarPayload>
          }
          findFirst: {
            args: Prisma.CarFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CarFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarPayload>
          }
          findMany: {
            args: Prisma.CarFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarPayload>[]
          }
          create: {
            args: Prisma.CarCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarPayload>
          }
          createMany: {
            args: Prisma.CarCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CarCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarPayload>[]
          }
          delete: {
            args: Prisma.CarDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarPayload>
          }
          update: {
            args: Prisma.CarUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarPayload>
          }
          deleteMany: {
            args: Prisma.CarDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CarUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CarUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CarPayload>
          }
          aggregate: {
            args: Prisma.CarAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCar>
          }
          groupBy: {
            args: Prisma.CarGroupByArgs<ExtArgs>
            result: $Utils.Optional<CarGroupByOutputType>[]
          }
          count: {
            args: Prisma.CarCountArgs<ExtArgs>
            result: $Utils.Optional<CarCountAggregateOutputType> | number
          }
        }
      }
      PendingBuilding: {
        payload: Prisma.$PendingBuildingPayload<ExtArgs>
        fields: Prisma.PendingBuildingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PendingBuildingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingBuildingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PendingBuildingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingBuildingPayload>
          }
          findFirst: {
            args: Prisma.PendingBuildingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingBuildingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PendingBuildingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingBuildingPayload>
          }
          findMany: {
            args: Prisma.PendingBuildingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingBuildingPayload>[]
          }
          create: {
            args: Prisma.PendingBuildingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingBuildingPayload>
          }
          createMany: {
            args: Prisma.PendingBuildingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PendingBuildingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingBuildingPayload>[]
          }
          delete: {
            args: Prisma.PendingBuildingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingBuildingPayload>
          }
          update: {
            args: Prisma.PendingBuildingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingBuildingPayload>
          }
          deleteMany: {
            args: Prisma.PendingBuildingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PendingBuildingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PendingBuildingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingBuildingPayload>
          }
          aggregate: {
            args: Prisma.PendingBuildingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePendingBuilding>
          }
          groupBy: {
            args: Prisma.PendingBuildingGroupByArgs<ExtArgs>
            result: $Utils.Optional<PendingBuildingGroupByOutputType>[]
          }
          count: {
            args: Prisma.PendingBuildingCountArgs<ExtArgs>
            result: $Utils.Optional<PendingBuildingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    userid: number | null
    level: number | null
    rank: number | null
    crowd: number | null
    capital: number | null
    dailyProfit: number | null
    satisfaction: number | null
    security: number | null
    lottery: number | null
    oil: number | null
    iron: number | null
    gold: number | null
    uranium: number | null
    goldMine: number | null
    uraniumMine: number | null
    ironMine: number | null
    refinery: number | null
    soldier: number | null
    tank: number | null
    heavyTank: number | null
    su57: number | null
    f47: number | null
    f35: number | null
    j20: number | null
    f16: number | null
    f22: number | null
    am50: number | null
    b2: number | null
    tu16: number | null
    espionageDrone: number | null
    suicideDrone: number | null
    crossDrone: number | null
    witnessDrone: number | null
    simpleRocket: number | null
    crossRocket: number | null
    dotTargetRocket: number | null
    continentalRocket: number | null
    ballisticRocket: number | null
    chemicalRocket: number | null
    hyperSonicRocket: number | null
    clusterRocket: number | null
    battleship: number | null
    marineShip: number | null
    breakerShip: number | null
    nuclearSubmarine: number | null
    antiRocket: number | null
    ironDome: number | null
    s400: number | null
    taad: number | null
    hq9: number | null
    acash: number | null
  }

  export type UserSumAggregateOutputType = {
    userid: bigint | null
    level: number | null
    rank: number | null
    crowd: bigint | null
    capital: bigint | null
    dailyProfit: bigint | null
    satisfaction: number | null
    security: number | null
    lottery: number | null
    oil: number | null
    iron: number | null
    gold: number | null
    uranium: number | null
    goldMine: number | null
    uraniumMine: number | null
    ironMine: number | null
    refinery: number | null
    soldier: number | null
    tank: number | null
    heavyTank: number | null
    su57: number | null
    f47: number | null
    f35: number | null
    j20: number | null
    f16: number | null
    f22: number | null
    am50: number | null
    b2: number | null
    tu16: number | null
    espionageDrone: number | null
    suicideDrone: number | null
    crossDrone: number | null
    witnessDrone: number | null
    simpleRocket: number | null
    crossRocket: number | null
    dotTargetRocket: number | null
    continentalRocket: number | null
    ballisticRocket: number | null
    chemicalRocket: number | null
    hyperSonicRocket: number | null
    clusterRocket: number | null
    battleship: number | null
    marineShip: number | null
    breakerShip: number | null
    nuclearSubmarine: number | null
    antiRocket: number | null
    ironDome: number | null
    s400: number | null
    taad: number | null
    hq9: number | null
    acash: number | null
  }

  export type UserMinAggregateOutputType = {
    userid: bigint | null
    country: string | null
    countryName: string | null
    level: number | null
    rank: number | null
    government: string | null
    religion: string | null
    crowd: bigint | null
    capital: bigint | null
    dailyProfit: bigint | null
    satisfaction: number | null
    security: number | null
    lottery: number | null
    oil: number | null
    iron: number | null
    gold: number | null
    uranium: number | null
    goldMine: number | null
    uraniumMine: number | null
    ironMine: number | null
    refinery: number | null
    soldier: number | null
    tank: number | null
    heavyTank: number | null
    su57: number | null
    f47: number | null
    f35: number | null
    j20: number | null
    f16: number | null
    f22: number | null
    am50: number | null
    b2: number | null
    tu16: number | null
    espionageDrone: number | null
    suicideDrone: number | null
    crossDrone: number | null
    witnessDrone: number | null
    simpleRocket: number | null
    crossRocket: number | null
    dotTargetRocket: number | null
    continentalRocket: number | null
    ballisticRocket: number | null
    chemicalRocket: number | null
    hyperSonicRocket: number | null
    clusterRocket: number | null
    battleship: number | null
    marineShip: number | null
    breakerShip: number | null
    nuclearSubmarine: number | null
    antiRocket: number | null
    ironDome: number | null
    s400: number | null
    taad: number | null
    hq9: number | null
    acash: number | null
  }

  export type UserMaxAggregateOutputType = {
    userid: bigint | null
    country: string | null
    countryName: string | null
    level: number | null
    rank: number | null
    government: string | null
    religion: string | null
    crowd: bigint | null
    capital: bigint | null
    dailyProfit: bigint | null
    satisfaction: number | null
    security: number | null
    lottery: number | null
    oil: number | null
    iron: number | null
    gold: number | null
    uranium: number | null
    goldMine: number | null
    uraniumMine: number | null
    ironMine: number | null
    refinery: number | null
    soldier: number | null
    tank: number | null
    heavyTank: number | null
    su57: number | null
    f47: number | null
    f35: number | null
    j20: number | null
    f16: number | null
    f22: number | null
    am50: number | null
    b2: number | null
    tu16: number | null
    espionageDrone: number | null
    suicideDrone: number | null
    crossDrone: number | null
    witnessDrone: number | null
    simpleRocket: number | null
    crossRocket: number | null
    dotTargetRocket: number | null
    continentalRocket: number | null
    ballisticRocket: number | null
    chemicalRocket: number | null
    hyperSonicRocket: number | null
    clusterRocket: number | null
    battleship: number | null
    marineShip: number | null
    breakerShip: number | null
    nuclearSubmarine: number | null
    antiRocket: number | null
    ironDome: number | null
    s400: number | null
    taad: number | null
    hq9: number | null
    acash: number | null
  }

  export type UserCountAggregateOutputType = {
    userid: number
    country: number
    countryName: number
    level: number
    rank: number
    government: number
    religion: number
    crowd: number
    capital: number
    dailyProfit: number
    satisfaction: number
    security: number
    lottery: number
    oil: number
    iron: number
    gold: number
    uranium: number
    goldMine: number
    uraniumMine: number
    ironMine: number
    refinery: number
    soldier: number
    tank: number
    heavyTank: number
    su57: number
    f47: number
    f35: number
    j20: number
    f16: number
    f22: number
    am50: number
    b2: number
    tu16: number
    espionageDrone: number
    suicideDrone: number
    crossDrone: number
    witnessDrone: number
    simpleRocket: number
    crossRocket: number
    dotTargetRocket: number
    continentalRocket: number
    ballisticRocket: number
    chemicalRocket: number
    hyperSonicRocket: number
    clusterRocket: number
    battleship: number
    marineShip: number
    breakerShip: number
    nuclearSubmarine: number
    antiRocket: number
    ironDome: number
    s400: number
    taad: number
    hq9: number
    acash: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    userid?: true
    level?: true
    rank?: true
    crowd?: true
    capital?: true
    dailyProfit?: true
    satisfaction?: true
    security?: true
    lottery?: true
    oil?: true
    iron?: true
    gold?: true
    uranium?: true
    goldMine?: true
    uraniumMine?: true
    ironMine?: true
    refinery?: true
    soldier?: true
    tank?: true
    heavyTank?: true
    su57?: true
    f47?: true
    f35?: true
    j20?: true
    f16?: true
    f22?: true
    am50?: true
    b2?: true
    tu16?: true
    espionageDrone?: true
    suicideDrone?: true
    crossDrone?: true
    witnessDrone?: true
    simpleRocket?: true
    crossRocket?: true
    dotTargetRocket?: true
    continentalRocket?: true
    ballisticRocket?: true
    chemicalRocket?: true
    hyperSonicRocket?: true
    clusterRocket?: true
    battleship?: true
    marineShip?: true
    breakerShip?: true
    nuclearSubmarine?: true
    antiRocket?: true
    ironDome?: true
    s400?: true
    taad?: true
    hq9?: true
    acash?: true
  }

  export type UserSumAggregateInputType = {
    userid?: true
    level?: true
    rank?: true
    crowd?: true
    capital?: true
    dailyProfit?: true
    satisfaction?: true
    security?: true
    lottery?: true
    oil?: true
    iron?: true
    gold?: true
    uranium?: true
    goldMine?: true
    uraniumMine?: true
    ironMine?: true
    refinery?: true
    soldier?: true
    tank?: true
    heavyTank?: true
    su57?: true
    f47?: true
    f35?: true
    j20?: true
    f16?: true
    f22?: true
    am50?: true
    b2?: true
    tu16?: true
    espionageDrone?: true
    suicideDrone?: true
    crossDrone?: true
    witnessDrone?: true
    simpleRocket?: true
    crossRocket?: true
    dotTargetRocket?: true
    continentalRocket?: true
    ballisticRocket?: true
    chemicalRocket?: true
    hyperSonicRocket?: true
    clusterRocket?: true
    battleship?: true
    marineShip?: true
    breakerShip?: true
    nuclearSubmarine?: true
    antiRocket?: true
    ironDome?: true
    s400?: true
    taad?: true
    hq9?: true
    acash?: true
  }

  export type UserMinAggregateInputType = {
    userid?: true
    country?: true
    countryName?: true
    level?: true
    rank?: true
    government?: true
    religion?: true
    crowd?: true
    capital?: true
    dailyProfit?: true
    satisfaction?: true
    security?: true
    lottery?: true
    oil?: true
    iron?: true
    gold?: true
    uranium?: true
    goldMine?: true
    uraniumMine?: true
    ironMine?: true
    refinery?: true
    soldier?: true
    tank?: true
    heavyTank?: true
    su57?: true
    f47?: true
    f35?: true
    j20?: true
    f16?: true
    f22?: true
    am50?: true
    b2?: true
    tu16?: true
    espionageDrone?: true
    suicideDrone?: true
    crossDrone?: true
    witnessDrone?: true
    simpleRocket?: true
    crossRocket?: true
    dotTargetRocket?: true
    continentalRocket?: true
    ballisticRocket?: true
    chemicalRocket?: true
    hyperSonicRocket?: true
    clusterRocket?: true
    battleship?: true
    marineShip?: true
    breakerShip?: true
    nuclearSubmarine?: true
    antiRocket?: true
    ironDome?: true
    s400?: true
    taad?: true
    hq9?: true
    acash?: true
  }

  export type UserMaxAggregateInputType = {
    userid?: true
    country?: true
    countryName?: true
    level?: true
    rank?: true
    government?: true
    religion?: true
    crowd?: true
    capital?: true
    dailyProfit?: true
    satisfaction?: true
    security?: true
    lottery?: true
    oil?: true
    iron?: true
    gold?: true
    uranium?: true
    goldMine?: true
    uraniumMine?: true
    ironMine?: true
    refinery?: true
    soldier?: true
    tank?: true
    heavyTank?: true
    su57?: true
    f47?: true
    f35?: true
    j20?: true
    f16?: true
    f22?: true
    am50?: true
    b2?: true
    tu16?: true
    espionageDrone?: true
    suicideDrone?: true
    crossDrone?: true
    witnessDrone?: true
    simpleRocket?: true
    crossRocket?: true
    dotTargetRocket?: true
    continentalRocket?: true
    ballisticRocket?: true
    chemicalRocket?: true
    hyperSonicRocket?: true
    clusterRocket?: true
    battleship?: true
    marineShip?: true
    breakerShip?: true
    nuclearSubmarine?: true
    antiRocket?: true
    ironDome?: true
    s400?: true
    taad?: true
    hq9?: true
    acash?: true
  }

  export type UserCountAggregateInputType = {
    userid?: true
    country?: true
    countryName?: true
    level?: true
    rank?: true
    government?: true
    religion?: true
    crowd?: true
    capital?: true
    dailyProfit?: true
    satisfaction?: true
    security?: true
    lottery?: true
    oil?: true
    iron?: true
    gold?: true
    uranium?: true
    goldMine?: true
    uraniumMine?: true
    ironMine?: true
    refinery?: true
    soldier?: true
    tank?: true
    heavyTank?: true
    su57?: true
    f47?: true
    f35?: true
    j20?: true
    f16?: true
    f22?: true
    am50?: true
    b2?: true
    tu16?: true
    espionageDrone?: true
    suicideDrone?: true
    crossDrone?: true
    witnessDrone?: true
    simpleRocket?: true
    crossRocket?: true
    dotTargetRocket?: true
    continentalRocket?: true
    ballisticRocket?: true
    chemicalRocket?: true
    hyperSonicRocket?: true
    clusterRocket?: true
    battleship?: true
    marineShip?: true
    breakerShip?: true
    nuclearSubmarine?: true
    antiRocket?: true
    ironDome?: true
    s400?: true
    taad?: true
    hq9?: true
    acash?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    userid: bigint
    country: string
    countryName: string
    level: number
    rank: number
    government: string
    religion: string
    crowd: bigint
    capital: bigint
    dailyProfit: bigint
    satisfaction: number
    security: number
    lottery: number
    oil: number
    iron: number
    gold: number
    uranium: number
    goldMine: number
    uraniumMine: number
    ironMine: number
    refinery: number
    soldier: number
    tank: number
    heavyTank: number
    su57: number
    f47: number
    f35: number
    j20: number
    f16: number
    f22: number
    am50: number
    b2: number
    tu16: number
    espionageDrone: number
    suicideDrone: number
    crossDrone: number
    witnessDrone: number
    simpleRocket: number
    crossRocket: number
    dotTargetRocket: number
    continentalRocket: number
    ballisticRocket: number
    chemicalRocket: number
    hyperSonicRocket: number
    clusterRocket: number
    battleship: number
    marineShip: number
    breakerShip: number
    nuclearSubmarine: number
    antiRocket: number
    ironDome: number
    s400: number
    taad: number
    hq9: number
    acash: number
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userid?: boolean
    country?: boolean
    countryName?: boolean
    level?: boolean
    rank?: boolean
    government?: boolean
    religion?: boolean
    crowd?: boolean
    capital?: boolean
    dailyProfit?: boolean
    satisfaction?: boolean
    security?: boolean
    lottery?: boolean
    oil?: boolean
    iron?: boolean
    gold?: boolean
    uranium?: boolean
    goldMine?: boolean
    uraniumMine?: boolean
    ironMine?: boolean
    refinery?: boolean
    soldier?: boolean
    tank?: boolean
    heavyTank?: boolean
    su57?: boolean
    f47?: boolean
    f35?: boolean
    j20?: boolean
    f16?: boolean
    f22?: boolean
    am50?: boolean
    b2?: boolean
    tu16?: boolean
    espionageDrone?: boolean
    suicideDrone?: boolean
    crossDrone?: boolean
    witnessDrone?: boolean
    simpleRocket?: boolean
    crossRocket?: boolean
    dotTargetRocket?: boolean
    continentalRocket?: boolean
    ballisticRocket?: boolean
    chemicalRocket?: boolean
    hyperSonicRocket?: boolean
    clusterRocket?: boolean
    battleship?: boolean
    marineShip?: boolean
    breakerShip?: boolean
    nuclearSubmarine?: boolean
    antiRocket?: boolean
    ironDome?: boolean
    s400?: boolean
    taad?: boolean
    hq9?: boolean
    acash?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userid?: boolean
    country?: boolean
    countryName?: boolean
    level?: boolean
    rank?: boolean
    government?: boolean
    religion?: boolean
    crowd?: boolean
    capital?: boolean
    dailyProfit?: boolean
    satisfaction?: boolean
    security?: boolean
    lottery?: boolean
    oil?: boolean
    iron?: boolean
    gold?: boolean
    uranium?: boolean
    goldMine?: boolean
    uraniumMine?: boolean
    ironMine?: boolean
    refinery?: boolean
    soldier?: boolean
    tank?: boolean
    heavyTank?: boolean
    su57?: boolean
    f47?: boolean
    f35?: boolean
    j20?: boolean
    f16?: boolean
    f22?: boolean
    am50?: boolean
    b2?: boolean
    tu16?: boolean
    espionageDrone?: boolean
    suicideDrone?: boolean
    crossDrone?: boolean
    witnessDrone?: boolean
    simpleRocket?: boolean
    crossRocket?: boolean
    dotTargetRocket?: boolean
    continentalRocket?: boolean
    ballisticRocket?: boolean
    chemicalRocket?: boolean
    hyperSonicRocket?: boolean
    clusterRocket?: boolean
    battleship?: boolean
    marineShip?: boolean
    breakerShip?: boolean
    nuclearSubmarine?: boolean
    antiRocket?: boolean
    ironDome?: boolean
    s400?: boolean
    taad?: boolean
    hq9?: boolean
    acash?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    userid?: boolean
    country?: boolean
    countryName?: boolean
    level?: boolean
    rank?: boolean
    government?: boolean
    religion?: boolean
    crowd?: boolean
    capital?: boolean
    dailyProfit?: boolean
    satisfaction?: boolean
    security?: boolean
    lottery?: boolean
    oil?: boolean
    iron?: boolean
    gold?: boolean
    uranium?: boolean
    goldMine?: boolean
    uraniumMine?: boolean
    ironMine?: boolean
    refinery?: boolean
    soldier?: boolean
    tank?: boolean
    heavyTank?: boolean
    su57?: boolean
    f47?: boolean
    f35?: boolean
    j20?: boolean
    f16?: boolean
    f22?: boolean
    am50?: boolean
    b2?: boolean
    tu16?: boolean
    espionageDrone?: boolean
    suicideDrone?: boolean
    crossDrone?: boolean
    witnessDrone?: boolean
    simpleRocket?: boolean
    crossRocket?: boolean
    dotTargetRocket?: boolean
    continentalRocket?: boolean
    ballisticRocket?: boolean
    chemicalRocket?: boolean
    hyperSonicRocket?: boolean
    clusterRocket?: boolean
    battleship?: boolean
    marineShip?: boolean
    breakerShip?: boolean
    nuclearSubmarine?: boolean
    antiRocket?: boolean
    ironDome?: boolean
    s400?: boolean
    taad?: boolean
    hq9?: boolean
    acash?: boolean
  }


  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      userid: bigint
      country: string
      countryName: string
      level: number
      rank: number
      government: string
      religion: string
      crowd: bigint
      capital: bigint
      dailyProfit: bigint
      satisfaction: number
      security: number
      lottery: number
      oil: number
      iron: number
      gold: number
      uranium: number
      goldMine: number
      uraniumMine: number
      ironMine: number
      refinery: number
      soldier: number
      tank: number
      heavyTank: number
      su57: number
      f47: number
      f35: number
      j20: number
      f16: number
      f22: number
      am50: number
      b2: number
      tu16: number
      espionageDrone: number
      suicideDrone: number
      crossDrone: number
      witnessDrone: number
      simpleRocket: number
      crossRocket: number
      dotTargetRocket: number
      continentalRocket: number
      ballisticRocket: number
      chemicalRocket: number
      hyperSonicRocket: number
      clusterRocket: number
      battleship: number
      marineShip: number
      breakerShip: number
      nuclearSubmarine: number
      antiRocket: number
      ironDome: number
      s400: number
      taad: number
      hq9: number
      acash: number
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `userid`
     * const userWithUseridOnly = await prisma.user.findMany({ select: { userid: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `userid`
     * const userWithUseridOnly = await prisma.user.createManyAndReturn({ 
     *   select: { userid: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly userid: FieldRef<"User", 'BigInt'>
    readonly country: FieldRef<"User", 'String'>
    readonly countryName: FieldRef<"User", 'String'>
    readonly level: FieldRef<"User", 'Int'>
    readonly rank: FieldRef<"User", 'Int'>
    readonly government: FieldRef<"User", 'String'>
    readonly religion: FieldRef<"User", 'String'>
    readonly crowd: FieldRef<"User", 'BigInt'>
    readonly capital: FieldRef<"User", 'BigInt'>
    readonly dailyProfit: FieldRef<"User", 'BigInt'>
    readonly satisfaction: FieldRef<"User", 'Int'>
    readonly security: FieldRef<"User", 'Int'>
    readonly lottery: FieldRef<"User", 'Int'>
    readonly oil: FieldRef<"User", 'Int'>
    readonly iron: FieldRef<"User", 'Int'>
    readonly gold: FieldRef<"User", 'Int'>
    readonly uranium: FieldRef<"User", 'Int'>
    readonly goldMine: FieldRef<"User", 'Int'>
    readonly uraniumMine: FieldRef<"User", 'Int'>
    readonly ironMine: FieldRef<"User", 'Int'>
    readonly refinery: FieldRef<"User", 'Int'>
    readonly soldier: FieldRef<"User", 'Int'>
    readonly tank: FieldRef<"User", 'Int'>
    readonly heavyTank: FieldRef<"User", 'Int'>
    readonly su57: FieldRef<"User", 'Int'>
    readonly f47: FieldRef<"User", 'Int'>
    readonly f35: FieldRef<"User", 'Int'>
    readonly j20: FieldRef<"User", 'Int'>
    readonly f16: FieldRef<"User", 'Int'>
    readonly f22: FieldRef<"User", 'Int'>
    readonly am50: FieldRef<"User", 'Int'>
    readonly b2: FieldRef<"User", 'Int'>
    readonly tu16: FieldRef<"User", 'Int'>
    readonly espionageDrone: FieldRef<"User", 'Int'>
    readonly suicideDrone: FieldRef<"User", 'Int'>
    readonly crossDrone: FieldRef<"User", 'Int'>
    readonly witnessDrone: FieldRef<"User", 'Int'>
    readonly simpleRocket: FieldRef<"User", 'Int'>
    readonly crossRocket: FieldRef<"User", 'Int'>
    readonly dotTargetRocket: FieldRef<"User", 'Int'>
    readonly continentalRocket: FieldRef<"User", 'Int'>
    readonly ballisticRocket: FieldRef<"User", 'Int'>
    readonly chemicalRocket: FieldRef<"User", 'Int'>
    readonly hyperSonicRocket: FieldRef<"User", 'Int'>
    readonly clusterRocket: FieldRef<"User", 'Int'>
    readonly battleship: FieldRef<"User", 'Int'>
    readonly marineShip: FieldRef<"User", 'Int'>
    readonly breakerShip: FieldRef<"User", 'Int'>
    readonly nuclearSubmarine: FieldRef<"User", 'Int'>
    readonly antiRocket: FieldRef<"User", 'Int'>
    readonly ironDome: FieldRef<"User", 'Int'>
    readonly s400: FieldRef<"User", 'Int'>
    readonly taad: FieldRef<"User", 'Int'>
    readonly hq9: FieldRef<"User", 'Int'>
    readonly acash: FieldRef<"User", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
  }


  /**
   * Model ProductionLine
   */

  export type AggregateProductionLine = {
    _count: ProductionLineCountAggregateOutputType | null
    _avg: ProductionLineAvgAggregateOutputType | null
    _sum: ProductionLineSumAggregateOutputType | null
    _min: ProductionLineMinAggregateOutputType | null
    _max: ProductionLineMaxAggregateOutputType | null
  }

  export type ProductionLineAvgAggregateOutputType = {
    id: number | null
    ownerId: number | null
    dailyLimit: number | null
    setupCost: number | null
  }

  export type ProductionLineSumAggregateOutputType = {
    id: number | null
    ownerId: bigint | null
    dailyLimit: number | null
    setupCost: bigint | null
  }

  export type ProductionLineMinAggregateOutputType = {
    id: number | null
    ownerId: bigint | null
    country: string | null
    name: string | null
    type: string | null
    imageUrl: string | null
    dailyLimit: number | null
    setupCost: bigint | null
    createdAt: Date | null
    carName: string | null
  }

  export type ProductionLineMaxAggregateOutputType = {
    id: number | null
    ownerId: bigint | null
    country: string | null
    name: string | null
    type: string | null
    imageUrl: string | null
    dailyLimit: number | null
    setupCost: bigint | null
    createdAt: Date | null
    carName: string | null
  }

  export type ProductionLineCountAggregateOutputType = {
    id: number
    ownerId: number
    country: number
    name: number
    type: number
    imageUrl: number
    dailyLimit: number
    setupCost: number
    createdAt: number
    carName: number
    _all: number
  }


  export type ProductionLineAvgAggregateInputType = {
    id?: true
    ownerId?: true
    dailyLimit?: true
    setupCost?: true
  }

  export type ProductionLineSumAggregateInputType = {
    id?: true
    ownerId?: true
    dailyLimit?: true
    setupCost?: true
  }

  export type ProductionLineMinAggregateInputType = {
    id?: true
    ownerId?: true
    country?: true
    name?: true
    type?: true
    imageUrl?: true
    dailyLimit?: true
    setupCost?: true
    createdAt?: true
    carName?: true
  }

  export type ProductionLineMaxAggregateInputType = {
    id?: true
    ownerId?: true
    country?: true
    name?: true
    type?: true
    imageUrl?: true
    dailyLimit?: true
    setupCost?: true
    createdAt?: true
    carName?: true
  }

  export type ProductionLineCountAggregateInputType = {
    id?: true
    ownerId?: true
    country?: true
    name?: true
    type?: true
    imageUrl?: true
    dailyLimit?: true
    setupCost?: true
    createdAt?: true
    carName?: true
    _all?: true
  }

  export type ProductionLineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductionLine to aggregate.
     */
    where?: ProductionLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductionLines to fetch.
     */
    orderBy?: ProductionLineOrderByWithRelationInput | ProductionLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductionLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductionLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductionLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductionLines
    **/
    _count?: true | ProductionLineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductionLineAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductionLineSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductionLineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductionLineMaxAggregateInputType
  }

  export type GetProductionLineAggregateType<T extends ProductionLineAggregateArgs> = {
        [P in keyof T & keyof AggregateProductionLine]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductionLine[P]>
      : GetScalarType<T[P], AggregateProductionLine[P]>
  }




  export type ProductionLineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductionLineWhereInput
    orderBy?: ProductionLineOrderByWithAggregationInput | ProductionLineOrderByWithAggregationInput[]
    by: ProductionLineScalarFieldEnum[] | ProductionLineScalarFieldEnum
    having?: ProductionLineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductionLineCountAggregateInputType | true
    _avg?: ProductionLineAvgAggregateInputType
    _sum?: ProductionLineSumAggregateInputType
    _min?: ProductionLineMinAggregateInputType
    _max?: ProductionLineMaxAggregateInputType
  }

  export type ProductionLineGroupByOutputType = {
    id: number
    ownerId: bigint
    country: string
    name: string
    type: string
    imageUrl: string
    dailyLimit: number
    setupCost: bigint
    createdAt: Date
    carName: string | null
    _count: ProductionLineCountAggregateOutputType | null
    _avg: ProductionLineAvgAggregateOutputType | null
    _sum: ProductionLineSumAggregateOutputType | null
    _min: ProductionLineMinAggregateOutputType | null
    _max: ProductionLineMaxAggregateOutputType | null
  }

  type GetProductionLineGroupByPayload<T extends ProductionLineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductionLineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductionLineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductionLineGroupByOutputType[P]>
            : GetScalarType<T[P], ProductionLineGroupByOutputType[P]>
        }
      >
    >


  export type ProductionLineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    country?: boolean
    name?: boolean
    type?: boolean
    imageUrl?: boolean
    dailyLimit?: boolean
    setupCost?: boolean
    createdAt?: boolean
    carName?: boolean
  }, ExtArgs["result"]["productionLine"]>

  export type ProductionLineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    country?: boolean
    name?: boolean
    type?: boolean
    imageUrl?: boolean
    dailyLimit?: boolean
    setupCost?: boolean
    createdAt?: boolean
    carName?: boolean
  }, ExtArgs["result"]["productionLine"]>

  export type ProductionLineSelectScalar = {
    id?: boolean
    ownerId?: boolean
    country?: boolean
    name?: boolean
    type?: boolean
    imageUrl?: boolean
    dailyLimit?: boolean
    setupCost?: boolean
    createdAt?: boolean
    carName?: boolean
  }


  export type $ProductionLinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductionLine"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      ownerId: bigint
      country: string
      name: string
      type: string
      imageUrl: string
      dailyLimit: number
      setupCost: bigint
      createdAt: Date
      carName: string | null
    }, ExtArgs["result"]["productionLine"]>
    composites: {}
  }

  type ProductionLineGetPayload<S extends boolean | null | undefined | ProductionLineDefaultArgs> = $Result.GetResult<Prisma.$ProductionLinePayload, S>

  type ProductionLineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProductionLineFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProductionLineCountAggregateInputType | true
    }

  export interface ProductionLineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductionLine'], meta: { name: 'ProductionLine' } }
    /**
     * Find zero or one ProductionLine that matches the filter.
     * @param {ProductionLineFindUniqueArgs} args - Arguments to find a ProductionLine
     * @example
     * // Get one ProductionLine
     * const productionLine = await prisma.productionLine.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductionLineFindUniqueArgs>(args: SelectSubset<T, ProductionLineFindUniqueArgs<ExtArgs>>): Prisma__ProductionLineClient<$Result.GetResult<Prisma.$ProductionLinePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProductionLine that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProductionLineFindUniqueOrThrowArgs} args - Arguments to find a ProductionLine
     * @example
     * // Get one ProductionLine
     * const productionLine = await prisma.productionLine.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductionLineFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductionLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductionLineClient<$Result.GetResult<Prisma.$ProductionLinePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProductionLine that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLineFindFirstArgs} args - Arguments to find a ProductionLine
     * @example
     * // Get one ProductionLine
     * const productionLine = await prisma.productionLine.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductionLineFindFirstArgs>(args?: SelectSubset<T, ProductionLineFindFirstArgs<ExtArgs>>): Prisma__ProductionLineClient<$Result.GetResult<Prisma.$ProductionLinePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProductionLine that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLineFindFirstOrThrowArgs} args - Arguments to find a ProductionLine
     * @example
     * // Get one ProductionLine
     * const productionLine = await prisma.productionLine.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductionLineFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductionLineFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductionLineClient<$Result.GetResult<Prisma.$ProductionLinePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProductionLines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductionLines
     * const productionLines = await prisma.productionLine.findMany()
     * 
     * // Get first 10 ProductionLines
     * const productionLines = await prisma.productionLine.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productionLineWithIdOnly = await prisma.productionLine.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductionLineFindManyArgs>(args?: SelectSubset<T, ProductionLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionLinePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProductionLine.
     * @param {ProductionLineCreateArgs} args - Arguments to create a ProductionLine.
     * @example
     * // Create one ProductionLine
     * const ProductionLine = await prisma.productionLine.create({
     *   data: {
     *     // ... data to create a ProductionLine
     *   }
     * })
     * 
     */
    create<T extends ProductionLineCreateArgs>(args: SelectSubset<T, ProductionLineCreateArgs<ExtArgs>>): Prisma__ProductionLineClient<$Result.GetResult<Prisma.$ProductionLinePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProductionLines.
     * @param {ProductionLineCreateManyArgs} args - Arguments to create many ProductionLines.
     * @example
     * // Create many ProductionLines
     * const productionLine = await prisma.productionLine.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductionLineCreateManyArgs>(args?: SelectSubset<T, ProductionLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductionLines and returns the data saved in the database.
     * @param {ProductionLineCreateManyAndReturnArgs} args - Arguments to create many ProductionLines.
     * @example
     * // Create many ProductionLines
     * const productionLine = await prisma.productionLine.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductionLines and only return the `id`
     * const productionLineWithIdOnly = await prisma.productionLine.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductionLineCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductionLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionLinePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProductionLine.
     * @param {ProductionLineDeleteArgs} args - Arguments to delete one ProductionLine.
     * @example
     * // Delete one ProductionLine
     * const ProductionLine = await prisma.productionLine.delete({
     *   where: {
     *     // ... filter to delete one ProductionLine
     *   }
     * })
     * 
     */
    delete<T extends ProductionLineDeleteArgs>(args: SelectSubset<T, ProductionLineDeleteArgs<ExtArgs>>): Prisma__ProductionLineClient<$Result.GetResult<Prisma.$ProductionLinePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProductionLine.
     * @param {ProductionLineUpdateArgs} args - Arguments to update one ProductionLine.
     * @example
     * // Update one ProductionLine
     * const productionLine = await prisma.productionLine.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductionLineUpdateArgs>(args: SelectSubset<T, ProductionLineUpdateArgs<ExtArgs>>): Prisma__ProductionLineClient<$Result.GetResult<Prisma.$ProductionLinePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProductionLines.
     * @param {ProductionLineDeleteManyArgs} args - Arguments to filter ProductionLines to delete.
     * @example
     * // Delete a few ProductionLines
     * const { count } = await prisma.productionLine.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductionLineDeleteManyArgs>(args?: SelectSubset<T, ProductionLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductionLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductionLines
     * const productionLine = await prisma.productionLine.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductionLineUpdateManyArgs>(args: SelectSubset<T, ProductionLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProductionLine.
     * @param {ProductionLineUpsertArgs} args - Arguments to update or create a ProductionLine.
     * @example
     * // Update or create a ProductionLine
     * const productionLine = await prisma.productionLine.upsert({
     *   create: {
     *     // ... data to create a ProductionLine
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductionLine we want to update
     *   }
     * })
     */
    upsert<T extends ProductionLineUpsertArgs>(args: SelectSubset<T, ProductionLineUpsertArgs<ExtArgs>>): Prisma__ProductionLineClient<$Result.GetResult<Prisma.$ProductionLinePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProductionLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLineCountArgs} args - Arguments to filter ProductionLines to count.
     * @example
     * // Count the number of ProductionLines
     * const count = await prisma.productionLine.count({
     *   where: {
     *     // ... the filter for the ProductionLines we want to count
     *   }
     * })
    **/
    count<T extends ProductionLineCountArgs>(
      args?: Subset<T, ProductionLineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductionLineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductionLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductionLineAggregateArgs>(args: Subset<T, ProductionLineAggregateArgs>): Prisma.PrismaPromise<GetProductionLineAggregateType<T>>

    /**
     * Group by ProductionLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionLineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductionLineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductionLineGroupByArgs['orderBy'] }
        : { orderBy?: ProductionLineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductionLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductionLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductionLine model
   */
  readonly fields: ProductionLineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductionLine.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductionLineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductionLine model
   */ 
  interface ProductionLineFieldRefs {
    readonly id: FieldRef<"ProductionLine", 'Int'>
    readonly ownerId: FieldRef<"ProductionLine", 'BigInt'>
    readonly country: FieldRef<"ProductionLine", 'String'>
    readonly name: FieldRef<"ProductionLine", 'String'>
    readonly type: FieldRef<"ProductionLine", 'String'>
    readonly imageUrl: FieldRef<"ProductionLine", 'String'>
    readonly dailyLimit: FieldRef<"ProductionLine", 'Int'>
    readonly setupCost: FieldRef<"ProductionLine", 'BigInt'>
    readonly createdAt: FieldRef<"ProductionLine", 'DateTime'>
    readonly carName: FieldRef<"ProductionLine", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ProductionLine findUnique
   */
  export type ProductionLineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLine
     */
    select?: ProductionLineSelect<ExtArgs> | null
    /**
     * Filter, which ProductionLine to fetch.
     */
    where: ProductionLineWhereUniqueInput
  }

  /**
   * ProductionLine findUniqueOrThrow
   */
  export type ProductionLineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLine
     */
    select?: ProductionLineSelect<ExtArgs> | null
    /**
     * Filter, which ProductionLine to fetch.
     */
    where: ProductionLineWhereUniqueInput
  }

  /**
   * ProductionLine findFirst
   */
  export type ProductionLineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLine
     */
    select?: ProductionLineSelect<ExtArgs> | null
    /**
     * Filter, which ProductionLine to fetch.
     */
    where?: ProductionLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductionLines to fetch.
     */
    orderBy?: ProductionLineOrderByWithRelationInput | ProductionLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductionLines.
     */
    cursor?: ProductionLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductionLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductionLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductionLines.
     */
    distinct?: ProductionLineScalarFieldEnum | ProductionLineScalarFieldEnum[]
  }

  /**
   * ProductionLine findFirstOrThrow
   */
  export type ProductionLineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLine
     */
    select?: ProductionLineSelect<ExtArgs> | null
    /**
     * Filter, which ProductionLine to fetch.
     */
    where?: ProductionLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductionLines to fetch.
     */
    orderBy?: ProductionLineOrderByWithRelationInput | ProductionLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductionLines.
     */
    cursor?: ProductionLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductionLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductionLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductionLines.
     */
    distinct?: ProductionLineScalarFieldEnum | ProductionLineScalarFieldEnum[]
  }

  /**
   * ProductionLine findMany
   */
  export type ProductionLineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLine
     */
    select?: ProductionLineSelect<ExtArgs> | null
    /**
     * Filter, which ProductionLines to fetch.
     */
    where?: ProductionLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductionLines to fetch.
     */
    orderBy?: ProductionLineOrderByWithRelationInput | ProductionLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductionLines.
     */
    cursor?: ProductionLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductionLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductionLines.
     */
    skip?: number
    distinct?: ProductionLineScalarFieldEnum | ProductionLineScalarFieldEnum[]
  }

  /**
   * ProductionLine create
   */
  export type ProductionLineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLine
     */
    select?: ProductionLineSelect<ExtArgs> | null
    /**
     * The data needed to create a ProductionLine.
     */
    data: XOR<ProductionLineCreateInput, ProductionLineUncheckedCreateInput>
  }

  /**
   * ProductionLine createMany
   */
  export type ProductionLineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductionLines.
     */
    data: ProductionLineCreateManyInput | ProductionLineCreateManyInput[]
  }

  /**
   * ProductionLine createManyAndReturn
   */
  export type ProductionLineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLine
     */
    select?: ProductionLineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProductionLines.
     */
    data: ProductionLineCreateManyInput | ProductionLineCreateManyInput[]
  }

  /**
   * ProductionLine update
   */
  export type ProductionLineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLine
     */
    select?: ProductionLineSelect<ExtArgs> | null
    /**
     * The data needed to update a ProductionLine.
     */
    data: XOR<ProductionLineUpdateInput, ProductionLineUncheckedUpdateInput>
    /**
     * Choose, which ProductionLine to update.
     */
    where: ProductionLineWhereUniqueInput
  }

  /**
   * ProductionLine updateMany
   */
  export type ProductionLineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductionLines.
     */
    data: XOR<ProductionLineUpdateManyMutationInput, ProductionLineUncheckedUpdateManyInput>
    /**
     * Filter which ProductionLines to update
     */
    where?: ProductionLineWhereInput
  }

  /**
   * ProductionLine upsert
   */
  export type ProductionLineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLine
     */
    select?: ProductionLineSelect<ExtArgs> | null
    /**
     * The filter to search for the ProductionLine to update in case it exists.
     */
    where: ProductionLineWhereUniqueInput
    /**
     * In case the ProductionLine found by the `where` argument doesn't exist, create a new ProductionLine with this data.
     */
    create: XOR<ProductionLineCreateInput, ProductionLineUncheckedCreateInput>
    /**
     * In case the ProductionLine was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductionLineUpdateInput, ProductionLineUncheckedUpdateInput>
  }

  /**
   * ProductionLine delete
   */
  export type ProductionLineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLine
     */
    select?: ProductionLineSelect<ExtArgs> | null
    /**
     * Filter which ProductionLine to delete.
     */
    where: ProductionLineWhereUniqueInput
  }

  /**
   * ProductionLine deleteMany
   */
  export type ProductionLineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductionLines to delete
     */
    where?: ProductionLineWhereInput
  }

  /**
   * ProductionLine without action
   */
  export type ProductionLineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionLine
     */
    select?: ProductionLineSelect<ExtArgs> | null
  }


  /**
   * Model PendingProductionLine
   */

  export type AggregatePendingProductionLine = {
    _count: PendingProductionLineCountAggregateOutputType | null
    _avg: PendingProductionLineAvgAggregateOutputType | null
    _sum: PendingProductionLineSumAggregateOutputType | null
    _min: PendingProductionLineMinAggregateOutputType | null
    _max: PendingProductionLineMaxAggregateOutputType | null
  }

  export type PendingProductionLineAvgAggregateOutputType = {
    ownerId: number | null
    dailyLimit: number | null
    setupCost: number | null
  }

  export type PendingProductionLineSumAggregateOutputType = {
    ownerId: bigint | null
    dailyLimit: number | null
    setupCost: bigint | null
  }

  export type PendingProductionLineMinAggregateOutputType = {
    ownerId: bigint | null
    name: string | null
    type: string | null
    imageUrl: string | null
    imageFileId: string | null
    dailyLimit: number | null
    setupCost: bigint | null
    country: string | null
  }

  export type PendingProductionLineMaxAggregateOutputType = {
    ownerId: bigint | null
    name: string | null
    type: string | null
    imageUrl: string | null
    imageFileId: string | null
    dailyLimit: number | null
    setupCost: bigint | null
    country: string | null
  }

  export type PendingProductionLineCountAggregateOutputType = {
    ownerId: number
    name: number
    type: number
    imageUrl: number
    imageFileId: number
    dailyLimit: number
    setupCost: number
    country: number
    _all: number
  }


  export type PendingProductionLineAvgAggregateInputType = {
    ownerId?: true
    dailyLimit?: true
    setupCost?: true
  }

  export type PendingProductionLineSumAggregateInputType = {
    ownerId?: true
    dailyLimit?: true
    setupCost?: true
  }

  export type PendingProductionLineMinAggregateInputType = {
    ownerId?: true
    name?: true
    type?: true
    imageUrl?: true
    imageFileId?: true
    dailyLimit?: true
    setupCost?: true
    country?: true
  }

  export type PendingProductionLineMaxAggregateInputType = {
    ownerId?: true
    name?: true
    type?: true
    imageUrl?: true
    imageFileId?: true
    dailyLimit?: true
    setupCost?: true
    country?: true
  }

  export type PendingProductionLineCountAggregateInputType = {
    ownerId?: true
    name?: true
    type?: true
    imageUrl?: true
    imageFileId?: true
    dailyLimit?: true
    setupCost?: true
    country?: true
    _all?: true
  }

  export type PendingProductionLineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingProductionLine to aggregate.
     */
    where?: PendingProductionLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingProductionLines to fetch.
     */
    orderBy?: PendingProductionLineOrderByWithRelationInput | PendingProductionLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PendingProductionLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingProductionLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingProductionLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PendingProductionLines
    **/
    _count?: true | PendingProductionLineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PendingProductionLineAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PendingProductionLineSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PendingProductionLineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PendingProductionLineMaxAggregateInputType
  }

  export type GetPendingProductionLineAggregateType<T extends PendingProductionLineAggregateArgs> = {
        [P in keyof T & keyof AggregatePendingProductionLine]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePendingProductionLine[P]>
      : GetScalarType<T[P], AggregatePendingProductionLine[P]>
  }




  export type PendingProductionLineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PendingProductionLineWhereInput
    orderBy?: PendingProductionLineOrderByWithAggregationInput | PendingProductionLineOrderByWithAggregationInput[]
    by: PendingProductionLineScalarFieldEnum[] | PendingProductionLineScalarFieldEnum
    having?: PendingProductionLineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PendingProductionLineCountAggregateInputType | true
    _avg?: PendingProductionLineAvgAggregateInputType
    _sum?: PendingProductionLineSumAggregateInputType
    _min?: PendingProductionLineMinAggregateInputType
    _max?: PendingProductionLineMaxAggregateInputType
  }

  export type PendingProductionLineGroupByOutputType = {
    ownerId: bigint
    name: string
    type: string
    imageUrl: string
    imageFileId: string
    dailyLimit: number
    setupCost: bigint
    country: string
    _count: PendingProductionLineCountAggregateOutputType | null
    _avg: PendingProductionLineAvgAggregateOutputType | null
    _sum: PendingProductionLineSumAggregateOutputType | null
    _min: PendingProductionLineMinAggregateOutputType | null
    _max: PendingProductionLineMaxAggregateOutputType | null
  }

  type GetPendingProductionLineGroupByPayload<T extends PendingProductionLineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PendingProductionLineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PendingProductionLineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PendingProductionLineGroupByOutputType[P]>
            : GetScalarType<T[P], PendingProductionLineGroupByOutputType[P]>
        }
      >
    >


  export type PendingProductionLineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    ownerId?: boolean
    name?: boolean
    type?: boolean
    imageUrl?: boolean
    imageFileId?: boolean
    dailyLimit?: boolean
    setupCost?: boolean
    country?: boolean
  }, ExtArgs["result"]["pendingProductionLine"]>

  export type PendingProductionLineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    ownerId?: boolean
    name?: boolean
    type?: boolean
    imageUrl?: boolean
    imageFileId?: boolean
    dailyLimit?: boolean
    setupCost?: boolean
    country?: boolean
  }, ExtArgs["result"]["pendingProductionLine"]>

  export type PendingProductionLineSelectScalar = {
    ownerId?: boolean
    name?: boolean
    type?: boolean
    imageUrl?: boolean
    imageFileId?: boolean
    dailyLimit?: boolean
    setupCost?: boolean
    country?: boolean
  }


  export type $PendingProductionLinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PendingProductionLine"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      ownerId: bigint
      name: string
      type: string
      imageUrl: string
      imageFileId: string
      dailyLimit: number
      setupCost: bigint
      country: string
    }, ExtArgs["result"]["pendingProductionLine"]>
    composites: {}
  }

  type PendingProductionLineGetPayload<S extends boolean | null | undefined | PendingProductionLineDefaultArgs> = $Result.GetResult<Prisma.$PendingProductionLinePayload, S>

  type PendingProductionLineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PendingProductionLineFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PendingProductionLineCountAggregateInputType | true
    }

  export interface PendingProductionLineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PendingProductionLine'], meta: { name: 'PendingProductionLine' } }
    /**
     * Find zero or one PendingProductionLine that matches the filter.
     * @param {PendingProductionLineFindUniqueArgs} args - Arguments to find a PendingProductionLine
     * @example
     * // Get one PendingProductionLine
     * const pendingProductionLine = await prisma.pendingProductionLine.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PendingProductionLineFindUniqueArgs>(args: SelectSubset<T, PendingProductionLineFindUniqueArgs<ExtArgs>>): Prisma__PendingProductionLineClient<$Result.GetResult<Prisma.$PendingProductionLinePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PendingProductionLine that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PendingProductionLineFindUniqueOrThrowArgs} args - Arguments to find a PendingProductionLine
     * @example
     * // Get one PendingProductionLine
     * const pendingProductionLine = await prisma.pendingProductionLine.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PendingProductionLineFindUniqueOrThrowArgs>(args: SelectSubset<T, PendingProductionLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PendingProductionLineClient<$Result.GetResult<Prisma.$PendingProductionLinePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PendingProductionLine that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductionLineFindFirstArgs} args - Arguments to find a PendingProductionLine
     * @example
     * // Get one PendingProductionLine
     * const pendingProductionLine = await prisma.pendingProductionLine.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PendingProductionLineFindFirstArgs>(args?: SelectSubset<T, PendingProductionLineFindFirstArgs<ExtArgs>>): Prisma__PendingProductionLineClient<$Result.GetResult<Prisma.$PendingProductionLinePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PendingProductionLine that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductionLineFindFirstOrThrowArgs} args - Arguments to find a PendingProductionLine
     * @example
     * // Get one PendingProductionLine
     * const pendingProductionLine = await prisma.pendingProductionLine.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PendingProductionLineFindFirstOrThrowArgs>(args?: SelectSubset<T, PendingProductionLineFindFirstOrThrowArgs<ExtArgs>>): Prisma__PendingProductionLineClient<$Result.GetResult<Prisma.$PendingProductionLinePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PendingProductionLines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductionLineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PendingProductionLines
     * const pendingProductionLines = await prisma.pendingProductionLine.findMany()
     * 
     * // Get first 10 PendingProductionLines
     * const pendingProductionLines = await prisma.pendingProductionLine.findMany({ take: 10 })
     * 
     * // Only select the `ownerId`
     * const pendingProductionLineWithOwnerIdOnly = await prisma.pendingProductionLine.findMany({ select: { ownerId: true } })
     * 
     */
    findMany<T extends PendingProductionLineFindManyArgs>(args?: SelectSubset<T, PendingProductionLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingProductionLinePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PendingProductionLine.
     * @param {PendingProductionLineCreateArgs} args - Arguments to create a PendingProductionLine.
     * @example
     * // Create one PendingProductionLine
     * const PendingProductionLine = await prisma.pendingProductionLine.create({
     *   data: {
     *     // ... data to create a PendingProductionLine
     *   }
     * })
     * 
     */
    create<T extends PendingProductionLineCreateArgs>(args: SelectSubset<T, PendingProductionLineCreateArgs<ExtArgs>>): Prisma__PendingProductionLineClient<$Result.GetResult<Prisma.$PendingProductionLinePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PendingProductionLines.
     * @param {PendingProductionLineCreateManyArgs} args - Arguments to create many PendingProductionLines.
     * @example
     * // Create many PendingProductionLines
     * const pendingProductionLine = await prisma.pendingProductionLine.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PendingProductionLineCreateManyArgs>(args?: SelectSubset<T, PendingProductionLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PendingProductionLines and returns the data saved in the database.
     * @param {PendingProductionLineCreateManyAndReturnArgs} args - Arguments to create many PendingProductionLines.
     * @example
     * // Create many PendingProductionLines
     * const pendingProductionLine = await prisma.pendingProductionLine.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PendingProductionLines and only return the `ownerId`
     * const pendingProductionLineWithOwnerIdOnly = await prisma.pendingProductionLine.createManyAndReturn({ 
     *   select: { ownerId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PendingProductionLineCreateManyAndReturnArgs>(args?: SelectSubset<T, PendingProductionLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingProductionLinePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PendingProductionLine.
     * @param {PendingProductionLineDeleteArgs} args - Arguments to delete one PendingProductionLine.
     * @example
     * // Delete one PendingProductionLine
     * const PendingProductionLine = await prisma.pendingProductionLine.delete({
     *   where: {
     *     // ... filter to delete one PendingProductionLine
     *   }
     * })
     * 
     */
    delete<T extends PendingProductionLineDeleteArgs>(args: SelectSubset<T, PendingProductionLineDeleteArgs<ExtArgs>>): Prisma__PendingProductionLineClient<$Result.GetResult<Prisma.$PendingProductionLinePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PendingProductionLine.
     * @param {PendingProductionLineUpdateArgs} args - Arguments to update one PendingProductionLine.
     * @example
     * // Update one PendingProductionLine
     * const pendingProductionLine = await prisma.pendingProductionLine.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PendingProductionLineUpdateArgs>(args: SelectSubset<T, PendingProductionLineUpdateArgs<ExtArgs>>): Prisma__PendingProductionLineClient<$Result.GetResult<Prisma.$PendingProductionLinePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PendingProductionLines.
     * @param {PendingProductionLineDeleteManyArgs} args - Arguments to filter PendingProductionLines to delete.
     * @example
     * // Delete a few PendingProductionLines
     * const { count } = await prisma.pendingProductionLine.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PendingProductionLineDeleteManyArgs>(args?: SelectSubset<T, PendingProductionLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PendingProductionLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductionLineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PendingProductionLines
     * const pendingProductionLine = await prisma.pendingProductionLine.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PendingProductionLineUpdateManyArgs>(args: SelectSubset<T, PendingProductionLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PendingProductionLine.
     * @param {PendingProductionLineUpsertArgs} args - Arguments to update or create a PendingProductionLine.
     * @example
     * // Update or create a PendingProductionLine
     * const pendingProductionLine = await prisma.pendingProductionLine.upsert({
     *   create: {
     *     // ... data to create a PendingProductionLine
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PendingProductionLine we want to update
     *   }
     * })
     */
    upsert<T extends PendingProductionLineUpsertArgs>(args: SelectSubset<T, PendingProductionLineUpsertArgs<ExtArgs>>): Prisma__PendingProductionLineClient<$Result.GetResult<Prisma.$PendingProductionLinePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PendingProductionLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductionLineCountArgs} args - Arguments to filter PendingProductionLines to count.
     * @example
     * // Count the number of PendingProductionLines
     * const count = await prisma.pendingProductionLine.count({
     *   where: {
     *     // ... the filter for the PendingProductionLines we want to count
     *   }
     * })
    **/
    count<T extends PendingProductionLineCountArgs>(
      args?: Subset<T, PendingProductionLineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PendingProductionLineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PendingProductionLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductionLineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PendingProductionLineAggregateArgs>(args: Subset<T, PendingProductionLineAggregateArgs>): Prisma.PrismaPromise<GetPendingProductionLineAggregateType<T>>

    /**
     * Group by PendingProductionLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductionLineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PendingProductionLineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PendingProductionLineGroupByArgs['orderBy'] }
        : { orderBy?: PendingProductionLineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PendingProductionLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPendingProductionLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PendingProductionLine model
   */
  readonly fields: PendingProductionLineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PendingProductionLine.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PendingProductionLineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PendingProductionLine model
   */ 
  interface PendingProductionLineFieldRefs {
    readonly ownerId: FieldRef<"PendingProductionLine", 'BigInt'>
    readonly name: FieldRef<"PendingProductionLine", 'String'>
    readonly type: FieldRef<"PendingProductionLine", 'String'>
    readonly imageUrl: FieldRef<"PendingProductionLine", 'String'>
    readonly imageFileId: FieldRef<"PendingProductionLine", 'String'>
    readonly dailyLimit: FieldRef<"PendingProductionLine", 'Int'>
    readonly setupCost: FieldRef<"PendingProductionLine", 'BigInt'>
    readonly country: FieldRef<"PendingProductionLine", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PendingProductionLine findUnique
   */
  export type PendingProductionLineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductionLine
     */
    select?: PendingProductionLineSelect<ExtArgs> | null
    /**
     * Filter, which PendingProductionLine to fetch.
     */
    where: PendingProductionLineWhereUniqueInput
  }

  /**
   * PendingProductionLine findUniqueOrThrow
   */
  export type PendingProductionLineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductionLine
     */
    select?: PendingProductionLineSelect<ExtArgs> | null
    /**
     * Filter, which PendingProductionLine to fetch.
     */
    where: PendingProductionLineWhereUniqueInput
  }

  /**
   * PendingProductionLine findFirst
   */
  export type PendingProductionLineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductionLine
     */
    select?: PendingProductionLineSelect<ExtArgs> | null
    /**
     * Filter, which PendingProductionLine to fetch.
     */
    where?: PendingProductionLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingProductionLines to fetch.
     */
    orderBy?: PendingProductionLineOrderByWithRelationInput | PendingProductionLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingProductionLines.
     */
    cursor?: PendingProductionLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingProductionLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingProductionLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingProductionLines.
     */
    distinct?: PendingProductionLineScalarFieldEnum | PendingProductionLineScalarFieldEnum[]
  }

  /**
   * PendingProductionLine findFirstOrThrow
   */
  export type PendingProductionLineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductionLine
     */
    select?: PendingProductionLineSelect<ExtArgs> | null
    /**
     * Filter, which PendingProductionLine to fetch.
     */
    where?: PendingProductionLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingProductionLines to fetch.
     */
    orderBy?: PendingProductionLineOrderByWithRelationInput | PendingProductionLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingProductionLines.
     */
    cursor?: PendingProductionLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingProductionLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingProductionLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingProductionLines.
     */
    distinct?: PendingProductionLineScalarFieldEnum | PendingProductionLineScalarFieldEnum[]
  }

  /**
   * PendingProductionLine findMany
   */
  export type PendingProductionLineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductionLine
     */
    select?: PendingProductionLineSelect<ExtArgs> | null
    /**
     * Filter, which PendingProductionLines to fetch.
     */
    where?: PendingProductionLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingProductionLines to fetch.
     */
    orderBy?: PendingProductionLineOrderByWithRelationInput | PendingProductionLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PendingProductionLines.
     */
    cursor?: PendingProductionLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingProductionLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingProductionLines.
     */
    skip?: number
    distinct?: PendingProductionLineScalarFieldEnum | PendingProductionLineScalarFieldEnum[]
  }

  /**
   * PendingProductionLine create
   */
  export type PendingProductionLineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductionLine
     */
    select?: PendingProductionLineSelect<ExtArgs> | null
    /**
     * The data needed to create a PendingProductionLine.
     */
    data: XOR<PendingProductionLineCreateInput, PendingProductionLineUncheckedCreateInput>
  }

  /**
   * PendingProductionLine createMany
   */
  export type PendingProductionLineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PendingProductionLines.
     */
    data: PendingProductionLineCreateManyInput | PendingProductionLineCreateManyInput[]
  }

  /**
   * PendingProductionLine createManyAndReturn
   */
  export type PendingProductionLineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductionLine
     */
    select?: PendingProductionLineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PendingProductionLines.
     */
    data: PendingProductionLineCreateManyInput | PendingProductionLineCreateManyInput[]
  }

  /**
   * PendingProductionLine update
   */
  export type PendingProductionLineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductionLine
     */
    select?: PendingProductionLineSelect<ExtArgs> | null
    /**
     * The data needed to update a PendingProductionLine.
     */
    data: XOR<PendingProductionLineUpdateInput, PendingProductionLineUncheckedUpdateInput>
    /**
     * Choose, which PendingProductionLine to update.
     */
    where: PendingProductionLineWhereUniqueInput
  }

  /**
   * PendingProductionLine updateMany
   */
  export type PendingProductionLineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PendingProductionLines.
     */
    data: XOR<PendingProductionLineUpdateManyMutationInput, PendingProductionLineUncheckedUpdateManyInput>
    /**
     * Filter which PendingProductionLines to update
     */
    where?: PendingProductionLineWhereInput
  }

  /**
   * PendingProductionLine upsert
   */
  export type PendingProductionLineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductionLine
     */
    select?: PendingProductionLineSelect<ExtArgs> | null
    /**
     * The filter to search for the PendingProductionLine to update in case it exists.
     */
    where: PendingProductionLineWhereUniqueInput
    /**
     * In case the PendingProductionLine found by the `where` argument doesn't exist, create a new PendingProductionLine with this data.
     */
    create: XOR<PendingProductionLineCreateInput, PendingProductionLineUncheckedCreateInput>
    /**
     * In case the PendingProductionLine was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PendingProductionLineUpdateInput, PendingProductionLineUncheckedUpdateInput>
  }

  /**
   * PendingProductionLine delete
   */
  export type PendingProductionLineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductionLine
     */
    select?: PendingProductionLineSelect<ExtArgs> | null
    /**
     * Filter which PendingProductionLine to delete.
     */
    where: PendingProductionLineWhereUniqueInput
  }

  /**
   * PendingProductionLine deleteMany
   */
  export type PendingProductionLineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingProductionLines to delete
     */
    where?: PendingProductionLineWhereInput
  }

  /**
   * PendingProductionLine without action
   */
  export type PendingProductionLineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductionLine
     */
    select?: PendingProductionLineSelect<ExtArgs> | null
  }


  /**
   * Model Car
   */

  export type AggregateCar = {
    _count: CarCountAggregateOutputType | null
    _avg: CarAvgAggregateOutputType | null
    _sum: CarSumAggregateOutputType | null
    _min: CarMinAggregateOutputType | null
    _max: CarMaxAggregateOutputType | null
  }

  export type CarAvgAggregateOutputType = {
    id: number | null
    ownerId: number | null
    price: number | null
  }

  export type CarSumAggregateOutputType = {
    id: number | null
    ownerId: bigint | null
    price: number | null
  }

  export type CarMinAggregateOutputType = {
    id: number | null
    ownerId: bigint | null
    name: string | null
    imageUrl: string | null
    price: number | null
    createdAt: Date | null
  }

  export type CarMaxAggregateOutputType = {
    id: number | null
    ownerId: bigint | null
    name: string | null
    imageUrl: string | null
    price: number | null
    createdAt: Date | null
  }

  export type CarCountAggregateOutputType = {
    id: number
    ownerId: number
    name: number
    imageUrl: number
    price: number
    createdAt: number
    _all: number
  }


  export type CarAvgAggregateInputType = {
    id?: true
    ownerId?: true
    price?: true
  }

  export type CarSumAggregateInputType = {
    id?: true
    ownerId?: true
    price?: true
  }

  export type CarMinAggregateInputType = {
    id?: true
    ownerId?: true
    name?: true
    imageUrl?: true
    price?: true
    createdAt?: true
  }

  export type CarMaxAggregateInputType = {
    id?: true
    ownerId?: true
    name?: true
    imageUrl?: true
    price?: true
    createdAt?: true
  }

  export type CarCountAggregateInputType = {
    id?: true
    ownerId?: true
    name?: true
    imageUrl?: true
    price?: true
    createdAt?: true
    _all?: true
  }

  export type CarAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Car to aggregate.
     */
    where?: CarWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cars to fetch.
     */
    orderBy?: CarOrderByWithRelationInput | CarOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CarWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cars.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cars
    **/
    _count?: true | CarCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CarAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CarSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CarMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CarMaxAggregateInputType
  }

  export type GetCarAggregateType<T extends CarAggregateArgs> = {
        [P in keyof T & keyof AggregateCar]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCar[P]>
      : GetScalarType<T[P], AggregateCar[P]>
  }




  export type CarGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CarWhereInput
    orderBy?: CarOrderByWithAggregationInput | CarOrderByWithAggregationInput[]
    by: CarScalarFieldEnum[] | CarScalarFieldEnum
    having?: CarScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CarCountAggregateInputType | true
    _avg?: CarAvgAggregateInputType
    _sum?: CarSumAggregateInputType
    _min?: CarMinAggregateInputType
    _max?: CarMaxAggregateInputType
  }

  export type CarGroupByOutputType = {
    id: number
    ownerId: bigint
    name: string
    imageUrl: string
    price: number
    createdAt: Date
    _count: CarCountAggregateOutputType | null
    _avg: CarAvgAggregateOutputType | null
    _sum: CarSumAggregateOutputType | null
    _min: CarMinAggregateOutputType | null
    _max: CarMaxAggregateOutputType | null
  }

  type GetCarGroupByPayload<T extends CarGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CarGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CarGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CarGroupByOutputType[P]>
            : GetScalarType<T[P], CarGroupByOutputType[P]>
        }
      >
    >


  export type CarSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    name?: boolean
    imageUrl?: boolean
    price?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["car"]>

  export type CarSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    name?: boolean
    imageUrl?: boolean
    price?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["car"]>

  export type CarSelectScalar = {
    id?: boolean
    ownerId?: boolean
    name?: boolean
    imageUrl?: boolean
    price?: boolean
    createdAt?: boolean
  }


  export type $CarPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Car"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      ownerId: bigint
      name: string
      imageUrl: string
      price: number
      createdAt: Date
    }, ExtArgs["result"]["car"]>
    composites: {}
  }

  type CarGetPayload<S extends boolean | null | undefined | CarDefaultArgs> = $Result.GetResult<Prisma.$CarPayload, S>

  type CarCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CarFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CarCountAggregateInputType | true
    }

  export interface CarDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Car'], meta: { name: 'Car' } }
    /**
     * Find zero or one Car that matches the filter.
     * @param {CarFindUniqueArgs} args - Arguments to find a Car
     * @example
     * // Get one Car
     * const car = await prisma.car.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CarFindUniqueArgs>(args: SelectSubset<T, CarFindUniqueArgs<ExtArgs>>): Prisma__CarClient<$Result.GetResult<Prisma.$CarPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Car that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CarFindUniqueOrThrowArgs} args - Arguments to find a Car
     * @example
     * // Get one Car
     * const car = await prisma.car.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CarFindUniqueOrThrowArgs>(args: SelectSubset<T, CarFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CarClient<$Result.GetResult<Prisma.$CarPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Car that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarFindFirstArgs} args - Arguments to find a Car
     * @example
     * // Get one Car
     * const car = await prisma.car.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CarFindFirstArgs>(args?: SelectSubset<T, CarFindFirstArgs<ExtArgs>>): Prisma__CarClient<$Result.GetResult<Prisma.$CarPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Car that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarFindFirstOrThrowArgs} args - Arguments to find a Car
     * @example
     * // Get one Car
     * const car = await prisma.car.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CarFindFirstOrThrowArgs>(args?: SelectSubset<T, CarFindFirstOrThrowArgs<ExtArgs>>): Prisma__CarClient<$Result.GetResult<Prisma.$CarPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Cars that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cars
     * const cars = await prisma.car.findMany()
     * 
     * // Get first 10 Cars
     * const cars = await prisma.car.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const carWithIdOnly = await prisma.car.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CarFindManyArgs>(args?: SelectSubset<T, CarFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CarPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Car.
     * @param {CarCreateArgs} args - Arguments to create a Car.
     * @example
     * // Create one Car
     * const Car = await prisma.car.create({
     *   data: {
     *     // ... data to create a Car
     *   }
     * })
     * 
     */
    create<T extends CarCreateArgs>(args: SelectSubset<T, CarCreateArgs<ExtArgs>>): Prisma__CarClient<$Result.GetResult<Prisma.$CarPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Cars.
     * @param {CarCreateManyArgs} args - Arguments to create many Cars.
     * @example
     * // Create many Cars
     * const car = await prisma.car.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CarCreateManyArgs>(args?: SelectSubset<T, CarCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cars and returns the data saved in the database.
     * @param {CarCreateManyAndReturnArgs} args - Arguments to create many Cars.
     * @example
     * // Create many Cars
     * const car = await prisma.car.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cars and only return the `id`
     * const carWithIdOnly = await prisma.car.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CarCreateManyAndReturnArgs>(args?: SelectSubset<T, CarCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CarPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Car.
     * @param {CarDeleteArgs} args - Arguments to delete one Car.
     * @example
     * // Delete one Car
     * const Car = await prisma.car.delete({
     *   where: {
     *     // ... filter to delete one Car
     *   }
     * })
     * 
     */
    delete<T extends CarDeleteArgs>(args: SelectSubset<T, CarDeleteArgs<ExtArgs>>): Prisma__CarClient<$Result.GetResult<Prisma.$CarPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Car.
     * @param {CarUpdateArgs} args - Arguments to update one Car.
     * @example
     * // Update one Car
     * const car = await prisma.car.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CarUpdateArgs>(args: SelectSubset<T, CarUpdateArgs<ExtArgs>>): Prisma__CarClient<$Result.GetResult<Prisma.$CarPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Cars.
     * @param {CarDeleteManyArgs} args - Arguments to filter Cars to delete.
     * @example
     * // Delete a few Cars
     * const { count } = await prisma.car.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CarDeleteManyArgs>(args?: SelectSubset<T, CarDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cars.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cars
     * const car = await prisma.car.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CarUpdateManyArgs>(args: SelectSubset<T, CarUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Car.
     * @param {CarUpsertArgs} args - Arguments to update or create a Car.
     * @example
     * // Update or create a Car
     * const car = await prisma.car.upsert({
     *   create: {
     *     // ... data to create a Car
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Car we want to update
     *   }
     * })
     */
    upsert<T extends CarUpsertArgs>(args: SelectSubset<T, CarUpsertArgs<ExtArgs>>): Prisma__CarClient<$Result.GetResult<Prisma.$CarPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Cars.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarCountArgs} args - Arguments to filter Cars to count.
     * @example
     * // Count the number of Cars
     * const count = await prisma.car.count({
     *   where: {
     *     // ... the filter for the Cars we want to count
     *   }
     * })
    **/
    count<T extends CarCountArgs>(
      args?: Subset<T, CarCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CarCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Car.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CarAggregateArgs>(args: Subset<T, CarAggregateArgs>): Prisma.PrismaPromise<GetCarAggregateType<T>>

    /**
     * Group by Car.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CarGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CarGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CarGroupByArgs['orderBy'] }
        : { orderBy?: CarGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CarGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCarGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Car model
   */
  readonly fields: CarFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Car.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CarClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Car model
   */ 
  interface CarFieldRefs {
    readonly id: FieldRef<"Car", 'Int'>
    readonly ownerId: FieldRef<"Car", 'BigInt'>
    readonly name: FieldRef<"Car", 'String'>
    readonly imageUrl: FieldRef<"Car", 'String'>
    readonly price: FieldRef<"Car", 'Int'>
    readonly createdAt: FieldRef<"Car", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Car findUnique
   */
  export type CarFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Car
     */
    select?: CarSelect<ExtArgs> | null
    /**
     * Filter, which Car to fetch.
     */
    where: CarWhereUniqueInput
  }

  /**
   * Car findUniqueOrThrow
   */
  export type CarFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Car
     */
    select?: CarSelect<ExtArgs> | null
    /**
     * Filter, which Car to fetch.
     */
    where: CarWhereUniqueInput
  }

  /**
   * Car findFirst
   */
  export type CarFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Car
     */
    select?: CarSelect<ExtArgs> | null
    /**
     * Filter, which Car to fetch.
     */
    where?: CarWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cars to fetch.
     */
    orderBy?: CarOrderByWithRelationInput | CarOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cars.
     */
    cursor?: CarWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cars.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cars.
     */
    distinct?: CarScalarFieldEnum | CarScalarFieldEnum[]
  }

  /**
   * Car findFirstOrThrow
   */
  export type CarFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Car
     */
    select?: CarSelect<ExtArgs> | null
    /**
     * Filter, which Car to fetch.
     */
    where?: CarWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cars to fetch.
     */
    orderBy?: CarOrderByWithRelationInput | CarOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cars.
     */
    cursor?: CarWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cars.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cars.
     */
    distinct?: CarScalarFieldEnum | CarScalarFieldEnum[]
  }

  /**
   * Car findMany
   */
  export type CarFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Car
     */
    select?: CarSelect<ExtArgs> | null
    /**
     * Filter, which Cars to fetch.
     */
    where?: CarWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cars to fetch.
     */
    orderBy?: CarOrderByWithRelationInput | CarOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cars.
     */
    cursor?: CarWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cars.
     */
    skip?: number
    distinct?: CarScalarFieldEnum | CarScalarFieldEnum[]
  }

  /**
   * Car create
   */
  export type CarCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Car
     */
    select?: CarSelect<ExtArgs> | null
    /**
     * The data needed to create a Car.
     */
    data: XOR<CarCreateInput, CarUncheckedCreateInput>
  }

  /**
   * Car createMany
   */
  export type CarCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cars.
     */
    data: CarCreateManyInput | CarCreateManyInput[]
  }

  /**
   * Car createManyAndReturn
   */
  export type CarCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Car
     */
    select?: CarSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Cars.
     */
    data: CarCreateManyInput | CarCreateManyInput[]
  }

  /**
   * Car update
   */
  export type CarUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Car
     */
    select?: CarSelect<ExtArgs> | null
    /**
     * The data needed to update a Car.
     */
    data: XOR<CarUpdateInput, CarUncheckedUpdateInput>
    /**
     * Choose, which Car to update.
     */
    where: CarWhereUniqueInput
  }

  /**
   * Car updateMany
   */
  export type CarUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cars.
     */
    data: XOR<CarUpdateManyMutationInput, CarUncheckedUpdateManyInput>
    /**
     * Filter which Cars to update
     */
    where?: CarWhereInput
  }

  /**
   * Car upsert
   */
  export type CarUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Car
     */
    select?: CarSelect<ExtArgs> | null
    /**
     * The filter to search for the Car to update in case it exists.
     */
    where: CarWhereUniqueInput
    /**
     * In case the Car found by the `where` argument doesn't exist, create a new Car with this data.
     */
    create: XOR<CarCreateInput, CarUncheckedCreateInput>
    /**
     * In case the Car was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CarUpdateInput, CarUncheckedUpdateInput>
  }

  /**
   * Car delete
   */
  export type CarDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Car
     */
    select?: CarSelect<ExtArgs> | null
    /**
     * Filter which Car to delete.
     */
    where: CarWhereUniqueInput
  }

  /**
   * Car deleteMany
   */
  export type CarDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cars to delete
     */
    where?: CarWhereInput
  }

  /**
   * Car without action
   */
  export type CarDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Car
     */
    select?: CarSelect<ExtArgs> | null
  }


  /**
   * Model PendingBuilding
   */

  export type AggregatePendingBuilding = {
    _count: PendingBuildingCountAggregateOutputType | null
    _avg: PendingBuildingAvgAggregateOutputType | null
    _sum: PendingBuildingSumAggregateOutputType | null
    _min: PendingBuildingMinAggregateOutputType | null
    _max: PendingBuildingMaxAggregateOutputType | null
  }

  export type PendingBuildingAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type PendingBuildingSumAggregateOutputType = {
    id: number | null
    userId: bigint | null
  }

  export type PendingBuildingMinAggregateOutputType = {
    id: number | null
    userId: bigint | null
    carName: string | null
    imageUrl: string | null
    createdAt: Date | null
  }

  export type PendingBuildingMaxAggregateOutputType = {
    id: number | null
    userId: bigint | null
    carName: string | null
    imageUrl: string | null
    createdAt: Date | null
  }

  export type PendingBuildingCountAggregateOutputType = {
    id: number
    userId: number
    carName: number
    imageUrl: number
    createdAt: number
    _all: number
  }


  export type PendingBuildingAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type PendingBuildingSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type PendingBuildingMinAggregateInputType = {
    id?: true
    userId?: true
    carName?: true
    imageUrl?: true
    createdAt?: true
  }

  export type PendingBuildingMaxAggregateInputType = {
    id?: true
    userId?: true
    carName?: true
    imageUrl?: true
    createdAt?: true
  }

  export type PendingBuildingCountAggregateInputType = {
    id?: true
    userId?: true
    carName?: true
    imageUrl?: true
    createdAt?: true
    _all?: true
  }

  export type PendingBuildingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingBuilding to aggregate.
     */
    where?: PendingBuildingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingBuildings to fetch.
     */
    orderBy?: PendingBuildingOrderByWithRelationInput | PendingBuildingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PendingBuildingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingBuildings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingBuildings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PendingBuildings
    **/
    _count?: true | PendingBuildingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PendingBuildingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PendingBuildingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PendingBuildingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PendingBuildingMaxAggregateInputType
  }

  export type GetPendingBuildingAggregateType<T extends PendingBuildingAggregateArgs> = {
        [P in keyof T & keyof AggregatePendingBuilding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePendingBuilding[P]>
      : GetScalarType<T[P], AggregatePendingBuilding[P]>
  }




  export type PendingBuildingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PendingBuildingWhereInput
    orderBy?: PendingBuildingOrderByWithAggregationInput | PendingBuildingOrderByWithAggregationInput[]
    by: PendingBuildingScalarFieldEnum[] | PendingBuildingScalarFieldEnum
    having?: PendingBuildingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PendingBuildingCountAggregateInputType | true
    _avg?: PendingBuildingAvgAggregateInputType
    _sum?: PendingBuildingSumAggregateInputType
    _min?: PendingBuildingMinAggregateInputType
    _max?: PendingBuildingMaxAggregateInputType
  }

  export type PendingBuildingGroupByOutputType = {
    id: number
    userId: bigint
    carName: string
    imageUrl: string
    createdAt: Date
    _count: PendingBuildingCountAggregateOutputType | null
    _avg: PendingBuildingAvgAggregateOutputType | null
    _sum: PendingBuildingSumAggregateOutputType | null
    _min: PendingBuildingMinAggregateOutputType | null
    _max: PendingBuildingMaxAggregateOutputType | null
  }

  type GetPendingBuildingGroupByPayload<T extends PendingBuildingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PendingBuildingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PendingBuildingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PendingBuildingGroupByOutputType[P]>
            : GetScalarType<T[P], PendingBuildingGroupByOutputType[P]>
        }
      >
    >


  export type PendingBuildingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    carName?: boolean
    imageUrl?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["pendingBuilding"]>

  export type PendingBuildingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    carName?: boolean
    imageUrl?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["pendingBuilding"]>

  export type PendingBuildingSelectScalar = {
    id?: boolean
    userId?: boolean
    carName?: boolean
    imageUrl?: boolean
    createdAt?: boolean
  }


  export type $PendingBuildingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PendingBuilding"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: bigint
      carName: string
      imageUrl: string
      createdAt: Date
    }, ExtArgs["result"]["pendingBuilding"]>
    composites: {}
  }

  type PendingBuildingGetPayload<S extends boolean | null | undefined | PendingBuildingDefaultArgs> = $Result.GetResult<Prisma.$PendingBuildingPayload, S>

  type PendingBuildingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PendingBuildingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PendingBuildingCountAggregateInputType | true
    }

  export interface PendingBuildingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PendingBuilding'], meta: { name: 'PendingBuilding' } }
    /**
     * Find zero or one PendingBuilding that matches the filter.
     * @param {PendingBuildingFindUniqueArgs} args - Arguments to find a PendingBuilding
     * @example
     * // Get one PendingBuilding
     * const pendingBuilding = await prisma.pendingBuilding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PendingBuildingFindUniqueArgs>(args: SelectSubset<T, PendingBuildingFindUniqueArgs<ExtArgs>>): Prisma__PendingBuildingClient<$Result.GetResult<Prisma.$PendingBuildingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PendingBuilding that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PendingBuildingFindUniqueOrThrowArgs} args - Arguments to find a PendingBuilding
     * @example
     * // Get one PendingBuilding
     * const pendingBuilding = await prisma.pendingBuilding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PendingBuildingFindUniqueOrThrowArgs>(args: SelectSubset<T, PendingBuildingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PendingBuildingClient<$Result.GetResult<Prisma.$PendingBuildingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PendingBuilding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingBuildingFindFirstArgs} args - Arguments to find a PendingBuilding
     * @example
     * // Get one PendingBuilding
     * const pendingBuilding = await prisma.pendingBuilding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PendingBuildingFindFirstArgs>(args?: SelectSubset<T, PendingBuildingFindFirstArgs<ExtArgs>>): Prisma__PendingBuildingClient<$Result.GetResult<Prisma.$PendingBuildingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PendingBuilding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingBuildingFindFirstOrThrowArgs} args - Arguments to find a PendingBuilding
     * @example
     * // Get one PendingBuilding
     * const pendingBuilding = await prisma.pendingBuilding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PendingBuildingFindFirstOrThrowArgs>(args?: SelectSubset<T, PendingBuildingFindFirstOrThrowArgs<ExtArgs>>): Prisma__PendingBuildingClient<$Result.GetResult<Prisma.$PendingBuildingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PendingBuildings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingBuildingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PendingBuildings
     * const pendingBuildings = await prisma.pendingBuilding.findMany()
     * 
     * // Get first 10 PendingBuildings
     * const pendingBuildings = await prisma.pendingBuilding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pendingBuildingWithIdOnly = await prisma.pendingBuilding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PendingBuildingFindManyArgs>(args?: SelectSubset<T, PendingBuildingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingBuildingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PendingBuilding.
     * @param {PendingBuildingCreateArgs} args - Arguments to create a PendingBuilding.
     * @example
     * // Create one PendingBuilding
     * const PendingBuilding = await prisma.pendingBuilding.create({
     *   data: {
     *     // ... data to create a PendingBuilding
     *   }
     * })
     * 
     */
    create<T extends PendingBuildingCreateArgs>(args: SelectSubset<T, PendingBuildingCreateArgs<ExtArgs>>): Prisma__PendingBuildingClient<$Result.GetResult<Prisma.$PendingBuildingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PendingBuildings.
     * @param {PendingBuildingCreateManyArgs} args - Arguments to create many PendingBuildings.
     * @example
     * // Create many PendingBuildings
     * const pendingBuilding = await prisma.pendingBuilding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PendingBuildingCreateManyArgs>(args?: SelectSubset<T, PendingBuildingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PendingBuildings and returns the data saved in the database.
     * @param {PendingBuildingCreateManyAndReturnArgs} args - Arguments to create many PendingBuildings.
     * @example
     * // Create many PendingBuildings
     * const pendingBuilding = await prisma.pendingBuilding.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PendingBuildings and only return the `id`
     * const pendingBuildingWithIdOnly = await prisma.pendingBuilding.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PendingBuildingCreateManyAndReturnArgs>(args?: SelectSubset<T, PendingBuildingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingBuildingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PendingBuilding.
     * @param {PendingBuildingDeleteArgs} args - Arguments to delete one PendingBuilding.
     * @example
     * // Delete one PendingBuilding
     * const PendingBuilding = await prisma.pendingBuilding.delete({
     *   where: {
     *     // ... filter to delete one PendingBuilding
     *   }
     * })
     * 
     */
    delete<T extends PendingBuildingDeleteArgs>(args: SelectSubset<T, PendingBuildingDeleteArgs<ExtArgs>>): Prisma__PendingBuildingClient<$Result.GetResult<Prisma.$PendingBuildingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PendingBuilding.
     * @param {PendingBuildingUpdateArgs} args - Arguments to update one PendingBuilding.
     * @example
     * // Update one PendingBuilding
     * const pendingBuilding = await prisma.pendingBuilding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PendingBuildingUpdateArgs>(args: SelectSubset<T, PendingBuildingUpdateArgs<ExtArgs>>): Prisma__PendingBuildingClient<$Result.GetResult<Prisma.$PendingBuildingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PendingBuildings.
     * @param {PendingBuildingDeleteManyArgs} args - Arguments to filter PendingBuildings to delete.
     * @example
     * // Delete a few PendingBuildings
     * const { count } = await prisma.pendingBuilding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PendingBuildingDeleteManyArgs>(args?: SelectSubset<T, PendingBuildingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PendingBuildings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingBuildingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PendingBuildings
     * const pendingBuilding = await prisma.pendingBuilding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PendingBuildingUpdateManyArgs>(args: SelectSubset<T, PendingBuildingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PendingBuilding.
     * @param {PendingBuildingUpsertArgs} args - Arguments to update or create a PendingBuilding.
     * @example
     * // Update or create a PendingBuilding
     * const pendingBuilding = await prisma.pendingBuilding.upsert({
     *   create: {
     *     // ... data to create a PendingBuilding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PendingBuilding we want to update
     *   }
     * })
     */
    upsert<T extends PendingBuildingUpsertArgs>(args: SelectSubset<T, PendingBuildingUpsertArgs<ExtArgs>>): Prisma__PendingBuildingClient<$Result.GetResult<Prisma.$PendingBuildingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PendingBuildings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingBuildingCountArgs} args - Arguments to filter PendingBuildings to count.
     * @example
     * // Count the number of PendingBuildings
     * const count = await prisma.pendingBuilding.count({
     *   where: {
     *     // ... the filter for the PendingBuildings we want to count
     *   }
     * })
    **/
    count<T extends PendingBuildingCountArgs>(
      args?: Subset<T, PendingBuildingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PendingBuildingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PendingBuilding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingBuildingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PendingBuildingAggregateArgs>(args: Subset<T, PendingBuildingAggregateArgs>): Prisma.PrismaPromise<GetPendingBuildingAggregateType<T>>

    /**
     * Group by PendingBuilding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingBuildingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PendingBuildingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PendingBuildingGroupByArgs['orderBy'] }
        : { orderBy?: PendingBuildingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PendingBuildingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPendingBuildingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PendingBuilding model
   */
  readonly fields: PendingBuildingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PendingBuilding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PendingBuildingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PendingBuilding model
   */ 
  interface PendingBuildingFieldRefs {
    readonly id: FieldRef<"PendingBuilding", 'Int'>
    readonly userId: FieldRef<"PendingBuilding", 'BigInt'>
    readonly carName: FieldRef<"PendingBuilding", 'String'>
    readonly imageUrl: FieldRef<"PendingBuilding", 'String'>
    readonly createdAt: FieldRef<"PendingBuilding", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PendingBuilding findUnique
   */
  export type PendingBuildingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingBuilding
     */
    select?: PendingBuildingSelect<ExtArgs> | null
    /**
     * Filter, which PendingBuilding to fetch.
     */
    where: PendingBuildingWhereUniqueInput
  }

  /**
   * PendingBuilding findUniqueOrThrow
   */
  export type PendingBuildingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingBuilding
     */
    select?: PendingBuildingSelect<ExtArgs> | null
    /**
     * Filter, which PendingBuilding to fetch.
     */
    where: PendingBuildingWhereUniqueInput
  }

  /**
   * PendingBuilding findFirst
   */
  export type PendingBuildingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingBuilding
     */
    select?: PendingBuildingSelect<ExtArgs> | null
    /**
     * Filter, which PendingBuilding to fetch.
     */
    where?: PendingBuildingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingBuildings to fetch.
     */
    orderBy?: PendingBuildingOrderByWithRelationInput | PendingBuildingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingBuildings.
     */
    cursor?: PendingBuildingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingBuildings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingBuildings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingBuildings.
     */
    distinct?: PendingBuildingScalarFieldEnum | PendingBuildingScalarFieldEnum[]
  }

  /**
   * PendingBuilding findFirstOrThrow
   */
  export type PendingBuildingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingBuilding
     */
    select?: PendingBuildingSelect<ExtArgs> | null
    /**
     * Filter, which PendingBuilding to fetch.
     */
    where?: PendingBuildingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingBuildings to fetch.
     */
    orderBy?: PendingBuildingOrderByWithRelationInput | PendingBuildingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingBuildings.
     */
    cursor?: PendingBuildingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingBuildings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingBuildings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingBuildings.
     */
    distinct?: PendingBuildingScalarFieldEnum | PendingBuildingScalarFieldEnum[]
  }

  /**
   * PendingBuilding findMany
   */
  export type PendingBuildingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingBuilding
     */
    select?: PendingBuildingSelect<ExtArgs> | null
    /**
     * Filter, which PendingBuildings to fetch.
     */
    where?: PendingBuildingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingBuildings to fetch.
     */
    orderBy?: PendingBuildingOrderByWithRelationInput | PendingBuildingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PendingBuildings.
     */
    cursor?: PendingBuildingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingBuildings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingBuildings.
     */
    skip?: number
    distinct?: PendingBuildingScalarFieldEnum | PendingBuildingScalarFieldEnum[]
  }

  /**
   * PendingBuilding create
   */
  export type PendingBuildingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingBuilding
     */
    select?: PendingBuildingSelect<ExtArgs> | null
    /**
     * The data needed to create a PendingBuilding.
     */
    data: XOR<PendingBuildingCreateInput, PendingBuildingUncheckedCreateInput>
  }

  /**
   * PendingBuilding createMany
   */
  export type PendingBuildingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PendingBuildings.
     */
    data: PendingBuildingCreateManyInput | PendingBuildingCreateManyInput[]
  }

  /**
   * PendingBuilding createManyAndReturn
   */
  export type PendingBuildingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingBuilding
     */
    select?: PendingBuildingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PendingBuildings.
     */
    data: PendingBuildingCreateManyInput | PendingBuildingCreateManyInput[]
  }

  /**
   * PendingBuilding update
   */
  export type PendingBuildingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingBuilding
     */
    select?: PendingBuildingSelect<ExtArgs> | null
    /**
     * The data needed to update a PendingBuilding.
     */
    data: XOR<PendingBuildingUpdateInput, PendingBuildingUncheckedUpdateInput>
    /**
     * Choose, which PendingBuilding to update.
     */
    where: PendingBuildingWhereUniqueInput
  }

  /**
   * PendingBuilding updateMany
   */
  export type PendingBuildingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PendingBuildings.
     */
    data: XOR<PendingBuildingUpdateManyMutationInput, PendingBuildingUncheckedUpdateManyInput>
    /**
     * Filter which PendingBuildings to update
     */
    where?: PendingBuildingWhereInput
  }

  /**
   * PendingBuilding upsert
   */
  export type PendingBuildingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingBuilding
     */
    select?: PendingBuildingSelect<ExtArgs> | null
    /**
     * The filter to search for the PendingBuilding to update in case it exists.
     */
    where: PendingBuildingWhereUniqueInput
    /**
     * In case the PendingBuilding found by the `where` argument doesn't exist, create a new PendingBuilding with this data.
     */
    create: XOR<PendingBuildingCreateInput, PendingBuildingUncheckedCreateInput>
    /**
     * In case the PendingBuilding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PendingBuildingUpdateInput, PendingBuildingUncheckedUpdateInput>
  }

  /**
   * PendingBuilding delete
   */
  export type PendingBuildingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingBuilding
     */
    select?: PendingBuildingSelect<ExtArgs> | null
    /**
     * Filter which PendingBuilding to delete.
     */
    where: PendingBuildingWhereUniqueInput
  }

  /**
   * PendingBuilding deleteMany
   */
  export type PendingBuildingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingBuildings to delete
     */
    where?: PendingBuildingWhereInput
  }

  /**
   * PendingBuilding without action
   */
  export type PendingBuildingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingBuilding
     */
    select?: PendingBuildingSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
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

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ProductionLineScalarFieldEnum: {
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

  export type ProductionLineScalarFieldEnum = (typeof ProductionLineScalarFieldEnum)[keyof typeof ProductionLineScalarFieldEnum]


  export const PendingProductionLineScalarFieldEnum: {
    ownerId: 'ownerId',
    name: 'name',
    type: 'type',
    imageUrl: 'imageUrl',
    imageFileId: 'imageFileId',
    dailyLimit: 'dailyLimit',
    setupCost: 'setupCost',
    country: 'country'
  };

  export type PendingProductionLineScalarFieldEnum = (typeof PendingProductionLineScalarFieldEnum)[keyof typeof PendingProductionLineScalarFieldEnum]


  export const CarScalarFieldEnum: {
    id: 'id',
    ownerId: 'ownerId',
    name: 'name',
    imageUrl: 'imageUrl',
    price: 'price',
    createdAt: 'createdAt'
  };

  export type CarScalarFieldEnum = (typeof CarScalarFieldEnum)[keyof typeof CarScalarFieldEnum]


  export const PendingBuildingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    carName: 'carName',
    imageUrl: 'imageUrl',
    createdAt: 'createdAt'
  };

  export type PendingBuildingScalarFieldEnum = (typeof PendingBuildingScalarFieldEnum)[keyof typeof PendingBuildingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    userid?: BigIntFilter<"User"> | bigint | number
    country?: StringFilter<"User"> | string
    countryName?: StringFilter<"User"> | string
    level?: IntFilter<"User"> | number
    rank?: IntFilter<"User"> | number
    government?: StringFilter<"User"> | string
    religion?: StringFilter<"User"> | string
    crowd?: BigIntFilter<"User"> | bigint | number
    capital?: BigIntFilter<"User"> | bigint | number
    dailyProfit?: BigIntFilter<"User"> | bigint | number
    satisfaction?: IntFilter<"User"> | number
    security?: IntFilter<"User"> | number
    lottery?: IntFilter<"User"> | number
    oil?: IntFilter<"User"> | number
    iron?: IntFilter<"User"> | number
    gold?: IntFilter<"User"> | number
    uranium?: IntFilter<"User"> | number
    goldMine?: IntFilter<"User"> | number
    uraniumMine?: IntFilter<"User"> | number
    ironMine?: IntFilter<"User"> | number
    refinery?: IntFilter<"User"> | number
    soldier?: IntFilter<"User"> | number
    tank?: IntFilter<"User"> | number
    heavyTank?: IntFilter<"User"> | number
    su57?: IntFilter<"User"> | number
    f47?: IntFilter<"User"> | number
    f35?: IntFilter<"User"> | number
    j20?: IntFilter<"User"> | number
    f16?: IntFilter<"User"> | number
    f22?: IntFilter<"User"> | number
    am50?: IntFilter<"User"> | number
    b2?: IntFilter<"User"> | number
    tu16?: IntFilter<"User"> | number
    espionageDrone?: IntFilter<"User"> | number
    suicideDrone?: IntFilter<"User"> | number
    crossDrone?: IntFilter<"User"> | number
    witnessDrone?: IntFilter<"User"> | number
    simpleRocket?: IntFilter<"User"> | number
    crossRocket?: IntFilter<"User"> | number
    dotTargetRocket?: IntFilter<"User"> | number
    continentalRocket?: IntFilter<"User"> | number
    ballisticRocket?: IntFilter<"User"> | number
    chemicalRocket?: IntFilter<"User"> | number
    hyperSonicRocket?: IntFilter<"User"> | number
    clusterRocket?: IntFilter<"User"> | number
    battleship?: IntFilter<"User"> | number
    marineShip?: IntFilter<"User"> | number
    breakerShip?: IntFilter<"User"> | number
    nuclearSubmarine?: IntFilter<"User"> | number
    antiRocket?: IntFilter<"User"> | number
    ironDome?: IntFilter<"User"> | number
    s400?: IntFilter<"User"> | number
    taad?: IntFilter<"User"> | number
    hq9?: IntFilter<"User"> | number
    acash?: IntFilter<"User"> | number
  }

  export type UserOrderByWithRelationInput = {
    userid?: SortOrder
    country?: SortOrder
    countryName?: SortOrder
    level?: SortOrder
    rank?: SortOrder
    government?: SortOrder
    religion?: SortOrder
    crowd?: SortOrder
    capital?: SortOrder
    dailyProfit?: SortOrder
    satisfaction?: SortOrder
    security?: SortOrder
    lottery?: SortOrder
    oil?: SortOrder
    iron?: SortOrder
    gold?: SortOrder
    uranium?: SortOrder
    goldMine?: SortOrder
    uraniumMine?: SortOrder
    ironMine?: SortOrder
    refinery?: SortOrder
    soldier?: SortOrder
    tank?: SortOrder
    heavyTank?: SortOrder
    su57?: SortOrder
    f47?: SortOrder
    f35?: SortOrder
    j20?: SortOrder
    f16?: SortOrder
    f22?: SortOrder
    am50?: SortOrder
    b2?: SortOrder
    tu16?: SortOrder
    espionageDrone?: SortOrder
    suicideDrone?: SortOrder
    crossDrone?: SortOrder
    witnessDrone?: SortOrder
    simpleRocket?: SortOrder
    crossRocket?: SortOrder
    dotTargetRocket?: SortOrder
    continentalRocket?: SortOrder
    ballisticRocket?: SortOrder
    chemicalRocket?: SortOrder
    hyperSonicRocket?: SortOrder
    clusterRocket?: SortOrder
    battleship?: SortOrder
    marineShip?: SortOrder
    breakerShip?: SortOrder
    nuclearSubmarine?: SortOrder
    antiRocket?: SortOrder
    ironDome?: SortOrder
    s400?: SortOrder
    taad?: SortOrder
    hq9?: SortOrder
    acash?: SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    userid?: bigint | number
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    country?: StringFilter<"User"> | string
    countryName?: StringFilter<"User"> | string
    level?: IntFilter<"User"> | number
    rank?: IntFilter<"User"> | number
    government?: StringFilter<"User"> | string
    religion?: StringFilter<"User"> | string
    crowd?: BigIntFilter<"User"> | bigint | number
    capital?: BigIntFilter<"User"> | bigint | number
    dailyProfit?: BigIntFilter<"User"> | bigint | number
    satisfaction?: IntFilter<"User"> | number
    security?: IntFilter<"User"> | number
    lottery?: IntFilter<"User"> | number
    oil?: IntFilter<"User"> | number
    iron?: IntFilter<"User"> | number
    gold?: IntFilter<"User"> | number
    uranium?: IntFilter<"User"> | number
    goldMine?: IntFilter<"User"> | number
    uraniumMine?: IntFilter<"User"> | number
    ironMine?: IntFilter<"User"> | number
    refinery?: IntFilter<"User"> | number
    soldier?: IntFilter<"User"> | number
    tank?: IntFilter<"User"> | number
    heavyTank?: IntFilter<"User"> | number
    su57?: IntFilter<"User"> | number
    f47?: IntFilter<"User"> | number
    f35?: IntFilter<"User"> | number
    j20?: IntFilter<"User"> | number
    f16?: IntFilter<"User"> | number
    f22?: IntFilter<"User"> | number
    am50?: IntFilter<"User"> | number
    b2?: IntFilter<"User"> | number
    tu16?: IntFilter<"User"> | number
    espionageDrone?: IntFilter<"User"> | number
    suicideDrone?: IntFilter<"User"> | number
    crossDrone?: IntFilter<"User"> | number
    witnessDrone?: IntFilter<"User"> | number
    simpleRocket?: IntFilter<"User"> | number
    crossRocket?: IntFilter<"User"> | number
    dotTargetRocket?: IntFilter<"User"> | number
    continentalRocket?: IntFilter<"User"> | number
    ballisticRocket?: IntFilter<"User"> | number
    chemicalRocket?: IntFilter<"User"> | number
    hyperSonicRocket?: IntFilter<"User"> | number
    clusterRocket?: IntFilter<"User"> | number
    battleship?: IntFilter<"User"> | number
    marineShip?: IntFilter<"User"> | number
    breakerShip?: IntFilter<"User"> | number
    nuclearSubmarine?: IntFilter<"User"> | number
    antiRocket?: IntFilter<"User"> | number
    ironDome?: IntFilter<"User"> | number
    s400?: IntFilter<"User"> | number
    taad?: IntFilter<"User"> | number
    hq9?: IntFilter<"User"> | number
    acash?: IntFilter<"User"> | number
  }, "userid">

  export type UserOrderByWithAggregationInput = {
    userid?: SortOrder
    country?: SortOrder
    countryName?: SortOrder
    level?: SortOrder
    rank?: SortOrder
    government?: SortOrder
    religion?: SortOrder
    crowd?: SortOrder
    capital?: SortOrder
    dailyProfit?: SortOrder
    satisfaction?: SortOrder
    security?: SortOrder
    lottery?: SortOrder
    oil?: SortOrder
    iron?: SortOrder
    gold?: SortOrder
    uranium?: SortOrder
    goldMine?: SortOrder
    uraniumMine?: SortOrder
    ironMine?: SortOrder
    refinery?: SortOrder
    soldier?: SortOrder
    tank?: SortOrder
    heavyTank?: SortOrder
    su57?: SortOrder
    f47?: SortOrder
    f35?: SortOrder
    j20?: SortOrder
    f16?: SortOrder
    f22?: SortOrder
    am50?: SortOrder
    b2?: SortOrder
    tu16?: SortOrder
    espionageDrone?: SortOrder
    suicideDrone?: SortOrder
    crossDrone?: SortOrder
    witnessDrone?: SortOrder
    simpleRocket?: SortOrder
    crossRocket?: SortOrder
    dotTargetRocket?: SortOrder
    continentalRocket?: SortOrder
    ballisticRocket?: SortOrder
    chemicalRocket?: SortOrder
    hyperSonicRocket?: SortOrder
    clusterRocket?: SortOrder
    battleship?: SortOrder
    marineShip?: SortOrder
    breakerShip?: SortOrder
    nuclearSubmarine?: SortOrder
    antiRocket?: SortOrder
    ironDome?: SortOrder
    s400?: SortOrder
    taad?: SortOrder
    hq9?: SortOrder
    acash?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    userid?: BigIntWithAggregatesFilter<"User"> | bigint | number
    country?: StringWithAggregatesFilter<"User"> | string
    countryName?: StringWithAggregatesFilter<"User"> | string
    level?: IntWithAggregatesFilter<"User"> | number
    rank?: IntWithAggregatesFilter<"User"> | number
    government?: StringWithAggregatesFilter<"User"> | string
    religion?: StringWithAggregatesFilter<"User"> | string
    crowd?: BigIntWithAggregatesFilter<"User"> | bigint | number
    capital?: BigIntWithAggregatesFilter<"User"> | bigint | number
    dailyProfit?: BigIntWithAggregatesFilter<"User"> | bigint | number
    satisfaction?: IntWithAggregatesFilter<"User"> | number
    security?: IntWithAggregatesFilter<"User"> | number
    lottery?: IntWithAggregatesFilter<"User"> | number
    oil?: IntWithAggregatesFilter<"User"> | number
    iron?: IntWithAggregatesFilter<"User"> | number
    gold?: IntWithAggregatesFilter<"User"> | number
    uranium?: IntWithAggregatesFilter<"User"> | number
    goldMine?: IntWithAggregatesFilter<"User"> | number
    uraniumMine?: IntWithAggregatesFilter<"User"> | number
    ironMine?: IntWithAggregatesFilter<"User"> | number
    refinery?: IntWithAggregatesFilter<"User"> | number
    soldier?: IntWithAggregatesFilter<"User"> | number
    tank?: IntWithAggregatesFilter<"User"> | number
    heavyTank?: IntWithAggregatesFilter<"User"> | number
    su57?: IntWithAggregatesFilter<"User"> | number
    f47?: IntWithAggregatesFilter<"User"> | number
    f35?: IntWithAggregatesFilter<"User"> | number
    j20?: IntWithAggregatesFilter<"User"> | number
    f16?: IntWithAggregatesFilter<"User"> | number
    f22?: IntWithAggregatesFilter<"User"> | number
    am50?: IntWithAggregatesFilter<"User"> | number
    b2?: IntWithAggregatesFilter<"User"> | number
    tu16?: IntWithAggregatesFilter<"User"> | number
    espionageDrone?: IntWithAggregatesFilter<"User"> | number
    suicideDrone?: IntWithAggregatesFilter<"User"> | number
    crossDrone?: IntWithAggregatesFilter<"User"> | number
    witnessDrone?: IntWithAggregatesFilter<"User"> | number
    simpleRocket?: IntWithAggregatesFilter<"User"> | number
    crossRocket?: IntWithAggregatesFilter<"User"> | number
    dotTargetRocket?: IntWithAggregatesFilter<"User"> | number
    continentalRocket?: IntWithAggregatesFilter<"User"> | number
    ballisticRocket?: IntWithAggregatesFilter<"User"> | number
    chemicalRocket?: IntWithAggregatesFilter<"User"> | number
    hyperSonicRocket?: IntWithAggregatesFilter<"User"> | number
    clusterRocket?: IntWithAggregatesFilter<"User"> | number
    battleship?: IntWithAggregatesFilter<"User"> | number
    marineShip?: IntWithAggregatesFilter<"User"> | number
    breakerShip?: IntWithAggregatesFilter<"User"> | number
    nuclearSubmarine?: IntWithAggregatesFilter<"User"> | number
    antiRocket?: IntWithAggregatesFilter<"User"> | number
    ironDome?: IntWithAggregatesFilter<"User"> | number
    s400?: IntWithAggregatesFilter<"User"> | number
    taad?: IntWithAggregatesFilter<"User"> | number
    hq9?: IntWithAggregatesFilter<"User"> | number
    acash?: IntWithAggregatesFilter<"User"> | number
  }

  export type ProductionLineWhereInput = {
    AND?: ProductionLineWhereInput | ProductionLineWhereInput[]
    OR?: ProductionLineWhereInput[]
    NOT?: ProductionLineWhereInput | ProductionLineWhereInput[]
    id?: IntFilter<"ProductionLine"> | number
    ownerId?: BigIntFilter<"ProductionLine"> | bigint | number
    country?: StringFilter<"ProductionLine"> | string
    name?: StringFilter<"ProductionLine"> | string
    type?: StringFilter<"ProductionLine"> | string
    imageUrl?: StringFilter<"ProductionLine"> | string
    dailyLimit?: IntFilter<"ProductionLine"> | number
    setupCost?: BigIntFilter<"ProductionLine"> | bigint | number
    createdAt?: DateTimeFilter<"ProductionLine"> | Date | string
    carName?: StringNullableFilter<"ProductionLine"> | string | null
  }

  export type ProductionLineOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    country?: SortOrder
    name?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
    createdAt?: SortOrder
    carName?: SortOrderInput | SortOrder
  }

  export type ProductionLineWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ProductionLineWhereInput | ProductionLineWhereInput[]
    OR?: ProductionLineWhereInput[]
    NOT?: ProductionLineWhereInput | ProductionLineWhereInput[]
    ownerId?: BigIntFilter<"ProductionLine"> | bigint | number
    country?: StringFilter<"ProductionLine"> | string
    name?: StringFilter<"ProductionLine"> | string
    type?: StringFilter<"ProductionLine"> | string
    imageUrl?: StringFilter<"ProductionLine"> | string
    dailyLimit?: IntFilter<"ProductionLine"> | number
    setupCost?: BigIntFilter<"ProductionLine"> | bigint | number
    createdAt?: DateTimeFilter<"ProductionLine"> | Date | string
    carName?: StringNullableFilter<"ProductionLine"> | string | null
  }, "id">

  export type ProductionLineOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    country?: SortOrder
    name?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
    createdAt?: SortOrder
    carName?: SortOrderInput | SortOrder
    _count?: ProductionLineCountOrderByAggregateInput
    _avg?: ProductionLineAvgOrderByAggregateInput
    _max?: ProductionLineMaxOrderByAggregateInput
    _min?: ProductionLineMinOrderByAggregateInput
    _sum?: ProductionLineSumOrderByAggregateInput
  }

  export type ProductionLineScalarWhereWithAggregatesInput = {
    AND?: ProductionLineScalarWhereWithAggregatesInput | ProductionLineScalarWhereWithAggregatesInput[]
    OR?: ProductionLineScalarWhereWithAggregatesInput[]
    NOT?: ProductionLineScalarWhereWithAggregatesInput | ProductionLineScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ProductionLine"> | number
    ownerId?: BigIntWithAggregatesFilter<"ProductionLine"> | bigint | number
    country?: StringWithAggregatesFilter<"ProductionLine"> | string
    name?: StringWithAggregatesFilter<"ProductionLine"> | string
    type?: StringWithAggregatesFilter<"ProductionLine"> | string
    imageUrl?: StringWithAggregatesFilter<"ProductionLine"> | string
    dailyLimit?: IntWithAggregatesFilter<"ProductionLine"> | number
    setupCost?: BigIntWithAggregatesFilter<"ProductionLine"> | bigint | number
    createdAt?: DateTimeWithAggregatesFilter<"ProductionLine"> | Date | string
    carName?: StringNullableWithAggregatesFilter<"ProductionLine"> | string | null
  }

  export type PendingProductionLineWhereInput = {
    AND?: PendingProductionLineWhereInput | PendingProductionLineWhereInput[]
    OR?: PendingProductionLineWhereInput[]
    NOT?: PendingProductionLineWhereInput | PendingProductionLineWhereInput[]
    ownerId?: BigIntFilter<"PendingProductionLine"> | bigint | number
    name?: StringFilter<"PendingProductionLine"> | string
    type?: StringFilter<"PendingProductionLine"> | string
    imageUrl?: StringFilter<"PendingProductionLine"> | string
    imageFileId?: StringFilter<"PendingProductionLine"> | string
    dailyLimit?: IntFilter<"PendingProductionLine"> | number
    setupCost?: BigIntFilter<"PendingProductionLine"> | bigint | number
    country?: StringFilter<"PendingProductionLine"> | string
  }

  export type PendingProductionLineOrderByWithRelationInput = {
    ownerId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    imageFileId?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
    country?: SortOrder
  }

  export type PendingProductionLineWhereUniqueInput = Prisma.AtLeast<{
    ownerId?: bigint | number
    AND?: PendingProductionLineWhereInput | PendingProductionLineWhereInput[]
    OR?: PendingProductionLineWhereInput[]
    NOT?: PendingProductionLineWhereInput | PendingProductionLineWhereInput[]
    name?: StringFilter<"PendingProductionLine"> | string
    type?: StringFilter<"PendingProductionLine"> | string
    imageUrl?: StringFilter<"PendingProductionLine"> | string
    imageFileId?: StringFilter<"PendingProductionLine"> | string
    dailyLimit?: IntFilter<"PendingProductionLine"> | number
    setupCost?: BigIntFilter<"PendingProductionLine"> | bigint | number
    country?: StringFilter<"PendingProductionLine"> | string
  }, "ownerId">

  export type PendingProductionLineOrderByWithAggregationInput = {
    ownerId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    imageFileId?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
    country?: SortOrder
    _count?: PendingProductionLineCountOrderByAggregateInput
    _avg?: PendingProductionLineAvgOrderByAggregateInput
    _max?: PendingProductionLineMaxOrderByAggregateInput
    _min?: PendingProductionLineMinOrderByAggregateInput
    _sum?: PendingProductionLineSumOrderByAggregateInput
  }

  export type PendingProductionLineScalarWhereWithAggregatesInput = {
    AND?: PendingProductionLineScalarWhereWithAggregatesInput | PendingProductionLineScalarWhereWithAggregatesInput[]
    OR?: PendingProductionLineScalarWhereWithAggregatesInput[]
    NOT?: PendingProductionLineScalarWhereWithAggregatesInput | PendingProductionLineScalarWhereWithAggregatesInput[]
    ownerId?: BigIntWithAggregatesFilter<"PendingProductionLine"> | bigint | number
    name?: StringWithAggregatesFilter<"PendingProductionLine"> | string
    type?: StringWithAggregatesFilter<"PendingProductionLine"> | string
    imageUrl?: StringWithAggregatesFilter<"PendingProductionLine"> | string
    imageFileId?: StringWithAggregatesFilter<"PendingProductionLine"> | string
    dailyLimit?: IntWithAggregatesFilter<"PendingProductionLine"> | number
    setupCost?: BigIntWithAggregatesFilter<"PendingProductionLine"> | bigint | number
    country?: StringWithAggregatesFilter<"PendingProductionLine"> | string
  }

  export type CarWhereInput = {
    AND?: CarWhereInput | CarWhereInput[]
    OR?: CarWhereInput[]
    NOT?: CarWhereInput | CarWhereInput[]
    id?: IntFilter<"Car"> | number
    ownerId?: BigIntFilter<"Car"> | bigint | number
    name?: StringFilter<"Car"> | string
    imageUrl?: StringFilter<"Car"> | string
    price?: IntFilter<"Car"> | number
    createdAt?: DateTimeFilter<"Car"> | Date | string
  }

  export type CarOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type CarWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CarWhereInput | CarWhereInput[]
    OR?: CarWhereInput[]
    NOT?: CarWhereInput | CarWhereInput[]
    ownerId?: BigIntFilter<"Car"> | bigint | number
    name?: StringFilter<"Car"> | string
    imageUrl?: StringFilter<"Car"> | string
    price?: IntFilter<"Car"> | number
    createdAt?: DateTimeFilter<"Car"> | Date | string
  }, "id">

  export type CarOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    _count?: CarCountOrderByAggregateInput
    _avg?: CarAvgOrderByAggregateInput
    _max?: CarMaxOrderByAggregateInput
    _min?: CarMinOrderByAggregateInput
    _sum?: CarSumOrderByAggregateInput
  }

  export type CarScalarWhereWithAggregatesInput = {
    AND?: CarScalarWhereWithAggregatesInput | CarScalarWhereWithAggregatesInput[]
    OR?: CarScalarWhereWithAggregatesInput[]
    NOT?: CarScalarWhereWithAggregatesInput | CarScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Car"> | number
    ownerId?: BigIntWithAggregatesFilter<"Car"> | bigint | number
    name?: StringWithAggregatesFilter<"Car"> | string
    imageUrl?: StringWithAggregatesFilter<"Car"> | string
    price?: IntWithAggregatesFilter<"Car"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Car"> | Date | string
  }

  export type PendingBuildingWhereInput = {
    AND?: PendingBuildingWhereInput | PendingBuildingWhereInput[]
    OR?: PendingBuildingWhereInput[]
    NOT?: PendingBuildingWhereInput | PendingBuildingWhereInput[]
    id?: IntFilter<"PendingBuilding"> | number
    userId?: BigIntFilter<"PendingBuilding"> | bigint | number
    carName?: StringFilter<"PendingBuilding"> | string
    imageUrl?: StringFilter<"PendingBuilding"> | string
    createdAt?: DateTimeFilter<"PendingBuilding"> | Date | string
  }

  export type PendingBuildingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    carName?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingBuildingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PendingBuildingWhereInput | PendingBuildingWhereInput[]
    OR?: PendingBuildingWhereInput[]
    NOT?: PendingBuildingWhereInput | PendingBuildingWhereInput[]
    userId?: BigIntFilter<"PendingBuilding"> | bigint | number
    carName?: StringFilter<"PendingBuilding"> | string
    imageUrl?: StringFilter<"PendingBuilding"> | string
    createdAt?: DateTimeFilter<"PendingBuilding"> | Date | string
  }, "id">

  export type PendingBuildingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    carName?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    _count?: PendingBuildingCountOrderByAggregateInput
    _avg?: PendingBuildingAvgOrderByAggregateInput
    _max?: PendingBuildingMaxOrderByAggregateInput
    _min?: PendingBuildingMinOrderByAggregateInput
    _sum?: PendingBuildingSumOrderByAggregateInput
  }

  export type PendingBuildingScalarWhereWithAggregatesInput = {
    AND?: PendingBuildingScalarWhereWithAggregatesInput | PendingBuildingScalarWhereWithAggregatesInput[]
    OR?: PendingBuildingScalarWhereWithAggregatesInput[]
    NOT?: PendingBuildingScalarWhereWithAggregatesInput | PendingBuildingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PendingBuilding"> | number
    userId?: BigIntWithAggregatesFilter<"PendingBuilding"> | bigint | number
    carName?: StringWithAggregatesFilter<"PendingBuilding"> | string
    imageUrl?: StringWithAggregatesFilter<"PendingBuilding"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PendingBuilding"> | Date | string
  }

  export type UserCreateInput = {
    userid: bigint | number
    country: string
    countryName: string
    level?: number
    rank?: number
    government: string
    religion?: string
    crowd?: bigint | number
    capital?: bigint | number
    dailyProfit?: bigint | number
    satisfaction?: number
    security?: number
    lottery?: number
    oil?: number
    iron?: number
    gold?: number
    uranium?: number
    goldMine?: number
    uraniumMine?: number
    ironMine?: number
    refinery?: number
    soldier?: number
    tank?: number
    heavyTank?: number
    su57?: number
    f47?: number
    f35?: number
    j20?: number
    f16?: number
    f22?: number
    am50?: number
    b2?: number
    tu16?: number
    espionageDrone?: number
    suicideDrone?: number
    crossDrone?: number
    witnessDrone?: number
    simpleRocket?: number
    crossRocket?: number
    dotTargetRocket?: number
    continentalRocket?: number
    ballisticRocket?: number
    chemicalRocket?: number
    hyperSonicRocket?: number
    clusterRocket?: number
    battleship?: number
    marineShip?: number
    breakerShip?: number
    nuclearSubmarine?: number
    antiRocket?: number
    ironDome?: number
    s400?: number
    taad?: number
    hq9?: number
    acash?: number
  }

  export type UserUncheckedCreateInput = {
    userid: bigint | number
    country: string
    countryName: string
    level?: number
    rank?: number
    government: string
    religion?: string
    crowd?: bigint | number
    capital?: bigint | number
    dailyProfit?: bigint | number
    satisfaction?: number
    security?: number
    lottery?: number
    oil?: number
    iron?: number
    gold?: number
    uranium?: number
    goldMine?: number
    uraniumMine?: number
    ironMine?: number
    refinery?: number
    soldier?: number
    tank?: number
    heavyTank?: number
    su57?: number
    f47?: number
    f35?: number
    j20?: number
    f16?: number
    f22?: number
    am50?: number
    b2?: number
    tu16?: number
    espionageDrone?: number
    suicideDrone?: number
    crossDrone?: number
    witnessDrone?: number
    simpleRocket?: number
    crossRocket?: number
    dotTargetRocket?: number
    continentalRocket?: number
    ballisticRocket?: number
    chemicalRocket?: number
    hyperSonicRocket?: number
    clusterRocket?: number
    battleship?: number
    marineShip?: number
    breakerShip?: number
    nuclearSubmarine?: number
    antiRocket?: number
    ironDome?: number
    s400?: number
    taad?: number
    hq9?: number
    acash?: number
  }

  export type UserUpdateInput = {
    userid?: BigIntFieldUpdateOperationsInput | bigint | number
    country?: StringFieldUpdateOperationsInput | string
    countryName?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    rank?: IntFieldUpdateOperationsInput | number
    government?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    crowd?: BigIntFieldUpdateOperationsInput | bigint | number
    capital?: BigIntFieldUpdateOperationsInput | bigint | number
    dailyProfit?: BigIntFieldUpdateOperationsInput | bigint | number
    satisfaction?: IntFieldUpdateOperationsInput | number
    security?: IntFieldUpdateOperationsInput | number
    lottery?: IntFieldUpdateOperationsInput | number
    oil?: IntFieldUpdateOperationsInput | number
    iron?: IntFieldUpdateOperationsInput | number
    gold?: IntFieldUpdateOperationsInput | number
    uranium?: IntFieldUpdateOperationsInput | number
    goldMine?: IntFieldUpdateOperationsInput | number
    uraniumMine?: IntFieldUpdateOperationsInput | number
    ironMine?: IntFieldUpdateOperationsInput | number
    refinery?: IntFieldUpdateOperationsInput | number
    soldier?: IntFieldUpdateOperationsInput | number
    tank?: IntFieldUpdateOperationsInput | number
    heavyTank?: IntFieldUpdateOperationsInput | number
    su57?: IntFieldUpdateOperationsInput | number
    f47?: IntFieldUpdateOperationsInput | number
    f35?: IntFieldUpdateOperationsInput | number
    j20?: IntFieldUpdateOperationsInput | number
    f16?: IntFieldUpdateOperationsInput | number
    f22?: IntFieldUpdateOperationsInput | number
    am50?: IntFieldUpdateOperationsInput | number
    b2?: IntFieldUpdateOperationsInput | number
    tu16?: IntFieldUpdateOperationsInput | number
    espionageDrone?: IntFieldUpdateOperationsInput | number
    suicideDrone?: IntFieldUpdateOperationsInput | number
    crossDrone?: IntFieldUpdateOperationsInput | number
    witnessDrone?: IntFieldUpdateOperationsInput | number
    simpleRocket?: IntFieldUpdateOperationsInput | number
    crossRocket?: IntFieldUpdateOperationsInput | number
    dotTargetRocket?: IntFieldUpdateOperationsInput | number
    continentalRocket?: IntFieldUpdateOperationsInput | number
    ballisticRocket?: IntFieldUpdateOperationsInput | number
    chemicalRocket?: IntFieldUpdateOperationsInput | number
    hyperSonicRocket?: IntFieldUpdateOperationsInput | number
    clusterRocket?: IntFieldUpdateOperationsInput | number
    battleship?: IntFieldUpdateOperationsInput | number
    marineShip?: IntFieldUpdateOperationsInput | number
    breakerShip?: IntFieldUpdateOperationsInput | number
    nuclearSubmarine?: IntFieldUpdateOperationsInput | number
    antiRocket?: IntFieldUpdateOperationsInput | number
    ironDome?: IntFieldUpdateOperationsInput | number
    s400?: IntFieldUpdateOperationsInput | number
    taad?: IntFieldUpdateOperationsInput | number
    hq9?: IntFieldUpdateOperationsInput | number
    acash?: IntFieldUpdateOperationsInput | number
  }

  export type UserUncheckedUpdateInput = {
    userid?: BigIntFieldUpdateOperationsInput | bigint | number
    country?: StringFieldUpdateOperationsInput | string
    countryName?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    rank?: IntFieldUpdateOperationsInput | number
    government?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    crowd?: BigIntFieldUpdateOperationsInput | bigint | number
    capital?: BigIntFieldUpdateOperationsInput | bigint | number
    dailyProfit?: BigIntFieldUpdateOperationsInput | bigint | number
    satisfaction?: IntFieldUpdateOperationsInput | number
    security?: IntFieldUpdateOperationsInput | number
    lottery?: IntFieldUpdateOperationsInput | number
    oil?: IntFieldUpdateOperationsInput | number
    iron?: IntFieldUpdateOperationsInput | number
    gold?: IntFieldUpdateOperationsInput | number
    uranium?: IntFieldUpdateOperationsInput | number
    goldMine?: IntFieldUpdateOperationsInput | number
    uraniumMine?: IntFieldUpdateOperationsInput | number
    ironMine?: IntFieldUpdateOperationsInput | number
    refinery?: IntFieldUpdateOperationsInput | number
    soldier?: IntFieldUpdateOperationsInput | number
    tank?: IntFieldUpdateOperationsInput | number
    heavyTank?: IntFieldUpdateOperationsInput | number
    su57?: IntFieldUpdateOperationsInput | number
    f47?: IntFieldUpdateOperationsInput | number
    f35?: IntFieldUpdateOperationsInput | number
    j20?: IntFieldUpdateOperationsInput | number
    f16?: IntFieldUpdateOperationsInput | number
    f22?: IntFieldUpdateOperationsInput | number
    am50?: IntFieldUpdateOperationsInput | number
    b2?: IntFieldUpdateOperationsInput | number
    tu16?: IntFieldUpdateOperationsInput | number
    espionageDrone?: IntFieldUpdateOperationsInput | number
    suicideDrone?: IntFieldUpdateOperationsInput | number
    crossDrone?: IntFieldUpdateOperationsInput | number
    witnessDrone?: IntFieldUpdateOperationsInput | number
    simpleRocket?: IntFieldUpdateOperationsInput | number
    crossRocket?: IntFieldUpdateOperationsInput | number
    dotTargetRocket?: IntFieldUpdateOperationsInput | number
    continentalRocket?: IntFieldUpdateOperationsInput | number
    ballisticRocket?: IntFieldUpdateOperationsInput | number
    chemicalRocket?: IntFieldUpdateOperationsInput | number
    hyperSonicRocket?: IntFieldUpdateOperationsInput | number
    clusterRocket?: IntFieldUpdateOperationsInput | number
    battleship?: IntFieldUpdateOperationsInput | number
    marineShip?: IntFieldUpdateOperationsInput | number
    breakerShip?: IntFieldUpdateOperationsInput | number
    nuclearSubmarine?: IntFieldUpdateOperationsInput | number
    antiRocket?: IntFieldUpdateOperationsInput | number
    ironDome?: IntFieldUpdateOperationsInput | number
    s400?: IntFieldUpdateOperationsInput | number
    taad?: IntFieldUpdateOperationsInput | number
    hq9?: IntFieldUpdateOperationsInput | number
    acash?: IntFieldUpdateOperationsInput | number
  }

  export type UserCreateManyInput = {
    userid: bigint | number
    country: string
    countryName: string
    level?: number
    rank?: number
    government: string
    religion?: string
    crowd?: bigint | number
    capital?: bigint | number
    dailyProfit?: bigint | number
    satisfaction?: number
    security?: number
    lottery?: number
    oil?: number
    iron?: number
    gold?: number
    uranium?: number
    goldMine?: number
    uraniumMine?: number
    ironMine?: number
    refinery?: number
    soldier?: number
    tank?: number
    heavyTank?: number
    su57?: number
    f47?: number
    f35?: number
    j20?: number
    f16?: number
    f22?: number
    am50?: number
    b2?: number
    tu16?: number
    espionageDrone?: number
    suicideDrone?: number
    crossDrone?: number
    witnessDrone?: number
    simpleRocket?: number
    crossRocket?: number
    dotTargetRocket?: number
    continentalRocket?: number
    ballisticRocket?: number
    chemicalRocket?: number
    hyperSonicRocket?: number
    clusterRocket?: number
    battleship?: number
    marineShip?: number
    breakerShip?: number
    nuclearSubmarine?: number
    antiRocket?: number
    ironDome?: number
    s400?: number
    taad?: number
    hq9?: number
    acash?: number
  }

  export type UserUpdateManyMutationInput = {
    userid?: BigIntFieldUpdateOperationsInput | bigint | number
    country?: StringFieldUpdateOperationsInput | string
    countryName?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    rank?: IntFieldUpdateOperationsInput | number
    government?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    crowd?: BigIntFieldUpdateOperationsInput | bigint | number
    capital?: BigIntFieldUpdateOperationsInput | bigint | number
    dailyProfit?: BigIntFieldUpdateOperationsInput | bigint | number
    satisfaction?: IntFieldUpdateOperationsInput | number
    security?: IntFieldUpdateOperationsInput | number
    lottery?: IntFieldUpdateOperationsInput | number
    oil?: IntFieldUpdateOperationsInput | number
    iron?: IntFieldUpdateOperationsInput | number
    gold?: IntFieldUpdateOperationsInput | number
    uranium?: IntFieldUpdateOperationsInput | number
    goldMine?: IntFieldUpdateOperationsInput | number
    uraniumMine?: IntFieldUpdateOperationsInput | number
    ironMine?: IntFieldUpdateOperationsInput | number
    refinery?: IntFieldUpdateOperationsInput | number
    soldier?: IntFieldUpdateOperationsInput | number
    tank?: IntFieldUpdateOperationsInput | number
    heavyTank?: IntFieldUpdateOperationsInput | number
    su57?: IntFieldUpdateOperationsInput | number
    f47?: IntFieldUpdateOperationsInput | number
    f35?: IntFieldUpdateOperationsInput | number
    j20?: IntFieldUpdateOperationsInput | number
    f16?: IntFieldUpdateOperationsInput | number
    f22?: IntFieldUpdateOperationsInput | number
    am50?: IntFieldUpdateOperationsInput | number
    b2?: IntFieldUpdateOperationsInput | number
    tu16?: IntFieldUpdateOperationsInput | number
    espionageDrone?: IntFieldUpdateOperationsInput | number
    suicideDrone?: IntFieldUpdateOperationsInput | number
    crossDrone?: IntFieldUpdateOperationsInput | number
    witnessDrone?: IntFieldUpdateOperationsInput | number
    simpleRocket?: IntFieldUpdateOperationsInput | number
    crossRocket?: IntFieldUpdateOperationsInput | number
    dotTargetRocket?: IntFieldUpdateOperationsInput | number
    continentalRocket?: IntFieldUpdateOperationsInput | number
    ballisticRocket?: IntFieldUpdateOperationsInput | number
    chemicalRocket?: IntFieldUpdateOperationsInput | number
    hyperSonicRocket?: IntFieldUpdateOperationsInput | number
    clusterRocket?: IntFieldUpdateOperationsInput | number
    battleship?: IntFieldUpdateOperationsInput | number
    marineShip?: IntFieldUpdateOperationsInput | number
    breakerShip?: IntFieldUpdateOperationsInput | number
    nuclearSubmarine?: IntFieldUpdateOperationsInput | number
    antiRocket?: IntFieldUpdateOperationsInput | number
    ironDome?: IntFieldUpdateOperationsInput | number
    s400?: IntFieldUpdateOperationsInput | number
    taad?: IntFieldUpdateOperationsInput | number
    hq9?: IntFieldUpdateOperationsInput | number
    acash?: IntFieldUpdateOperationsInput | number
  }

  export type UserUncheckedUpdateManyInput = {
    userid?: BigIntFieldUpdateOperationsInput | bigint | number
    country?: StringFieldUpdateOperationsInput | string
    countryName?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    rank?: IntFieldUpdateOperationsInput | number
    government?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    crowd?: BigIntFieldUpdateOperationsInput | bigint | number
    capital?: BigIntFieldUpdateOperationsInput | bigint | number
    dailyProfit?: BigIntFieldUpdateOperationsInput | bigint | number
    satisfaction?: IntFieldUpdateOperationsInput | number
    security?: IntFieldUpdateOperationsInput | number
    lottery?: IntFieldUpdateOperationsInput | number
    oil?: IntFieldUpdateOperationsInput | number
    iron?: IntFieldUpdateOperationsInput | number
    gold?: IntFieldUpdateOperationsInput | number
    uranium?: IntFieldUpdateOperationsInput | number
    goldMine?: IntFieldUpdateOperationsInput | number
    uraniumMine?: IntFieldUpdateOperationsInput | number
    ironMine?: IntFieldUpdateOperationsInput | number
    refinery?: IntFieldUpdateOperationsInput | number
    soldier?: IntFieldUpdateOperationsInput | number
    tank?: IntFieldUpdateOperationsInput | number
    heavyTank?: IntFieldUpdateOperationsInput | number
    su57?: IntFieldUpdateOperationsInput | number
    f47?: IntFieldUpdateOperationsInput | number
    f35?: IntFieldUpdateOperationsInput | number
    j20?: IntFieldUpdateOperationsInput | number
    f16?: IntFieldUpdateOperationsInput | number
    f22?: IntFieldUpdateOperationsInput | number
    am50?: IntFieldUpdateOperationsInput | number
    b2?: IntFieldUpdateOperationsInput | number
    tu16?: IntFieldUpdateOperationsInput | number
    espionageDrone?: IntFieldUpdateOperationsInput | number
    suicideDrone?: IntFieldUpdateOperationsInput | number
    crossDrone?: IntFieldUpdateOperationsInput | number
    witnessDrone?: IntFieldUpdateOperationsInput | number
    simpleRocket?: IntFieldUpdateOperationsInput | number
    crossRocket?: IntFieldUpdateOperationsInput | number
    dotTargetRocket?: IntFieldUpdateOperationsInput | number
    continentalRocket?: IntFieldUpdateOperationsInput | number
    ballisticRocket?: IntFieldUpdateOperationsInput | number
    chemicalRocket?: IntFieldUpdateOperationsInput | number
    hyperSonicRocket?: IntFieldUpdateOperationsInput | number
    clusterRocket?: IntFieldUpdateOperationsInput | number
    battleship?: IntFieldUpdateOperationsInput | number
    marineShip?: IntFieldUpdateOperationsInput | number
    breakerShip?: IntFieldUpdateOperationsInput | number
    nuclearSubmarine?: IntFieldUpdateOperationsInput | number
    antiRocket?: IntFieldUpdateOperationsInput | number
    ironDome?: IntFieldUpdateOperationsInput | number
    s400?: IntFieldUpdateOperationsInput | number
    taad?: IntFieldUpdateOperationsInput | number
    hq9?: IntFieldUpdateOperationsInput | number
    acash?: IntFieldUpdateOperationsInput | number
  }

  export type ProductionLineCreateInput = {
    ownerId: bigint | number
    country: string
    name: string
    type: string
    imageUrl: string
    dailyLimit: number
    setupCost: bigint | number
    createdAt?: Date | string
    carName?: string | null
  }

  export type ProductionLineUncheckedCreateInput = {
    id?: number
    ownerId: bigint | number
    country: string
    name: string
    type: string
    imageUrl: string
    dailyLimit: number
    setupCost: bigint | number
    createdAt?: Date | string
    carName?: string | null
  }

  export type ProductionLineUpdateInput = {
    ownerId?: BigIntFieldUpdateOperationsInput | bigint | number
    country?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    dailyLimit?: IntFieldUpdateOperationsInput | number
    setupCost?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProductionLineUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    ownerId?: BigIntFieldUpdateOperationsInput | bigint | number
    country?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    dailyLimit?: IntFieldUpdateOperationsInput | number
    setupCost?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProductionLineCreateManyInput = {
    id?: number
    ownerId: bigint | number
    country: string
    name: string
    type: string
    imageUrl: string
    dailyLimit: number
    setupCost: bigint | number
    createdAt?: Date | string
    carName?: string | null
  }

  export type ProductionLineUpdateManyMutationInput = {
    ownerId?: BigIntFieldUpdateOperationsInput | bigint | number
    country?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    dailyLimit?: IntFieldUpdateOperationsInput | number
    setupCost?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProductionLineUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    ownerId?: BigIntFieldUpdateOperationsInput | bigint | number
    country?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    dailyLimit?: IntFieldUpdateOperationsInput | number
    setupCost?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PendingProductionLineCreateInput = {
    ownerId: bigint | number
    name: string
    type: string
    imageUrl: string
    imageFileId: string
    dailyLimit: number
    setupCost: bigint | number
    country: string
  }

  export type PendingProductionLineUncheckedCreateInput = {
    ownerId: bigint | number
    name: string
    type: string
    imageUrl: string
    imageFileId: string
    dailyLimit: number
    setupCost: bigint | number
    country: string
  }

  export type PendingProductionLineUpdateInput = {
    ownerId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    imageFileId?: StringFieldUpdateOperationsInput | string
    dailyLimit?: IntFieldUpdateOperationsInput | number
    setupCost?: BigIntFieldUpdateOperationsInput | bigint | number
    country?: StringFieldUpdateOperationsInput | string
  }

  export type PendingProductionLineUncheckedUpdateInput = {
    ownerId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    imageFileId?: StringFieldUpdateOperationsInput | string
    dailyLimit?: IntFieldUpdateOperationsInput | number
    setupCost?: BigIntFieldUpdateOperationsInput | bigint | number
    country?: StringFieldUpdateOperationsInput | string
  }

  export type PendingProductionLineCreateManyInput = {
    ownerId: bigint | number
    name: string
    type: string
    imageUrl: string
    imageFileId: string
    dailyLimit: number
    setupCost: bigint | number
    country: string
  }

  export type PendingProductionLineUpdateManyMutationInput = {
    ownerId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    imageFileId?: StringFieldUpdateOperationsInput | string
    dailyLimit?: IntFieldUpdateOperationsInput | number
    setupCost?: BigIntFieldUpdateOperationsInput | bigint | number
    country?: StringFieldUpdateOperationsInput | string
  }

  export type PendingProductionLineUncheckedUpdateManyInput = {
    ownerId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    imageFileId?: StringFieldUpdateOperationsInput | string
    dailyLimit?: IntFieldUpdateOperationsInput | number
    setupCost?: BigIntFieldUpdateOperationsInput | bigint | number
    country?: StringFieldUpdateOperationsInput | string
  }

  export type CarCreateInput = {
    ownerId: bigint | number
    name: string
    imageUrl: string
    price: number
    createdAt?: Date | string
  }

  export type CarUncheckedCreateInput = {
    id?: number
    ownerId: bigint | number
    name: string
    imageUrl: string
    price: number
    createdAt?: Date | string
  }

  export type CarUpdateInput = {
    ownerId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CarUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    ownerId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CarCreateManyInput = {
    id?: number
    ownerId: bigint | number
    name: string
    imageUrl: string
    price: number
    createdAt?: Date | string
  }

  export type CarUpdateManyMutationInput = {
    ownerId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CarUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    ownerId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingBuildingCreateInput = {
    userId: bigint | number
    carName: string
    imageUrl: string
    createdAt?: Date | string
  }

  export type PendingBuildingUncheckedCreateInput = {
    id?: number
    userId: bigint | number
    carName: string
    imageUrl: string
    createdAt?: Date | string
  }

  export type PendingBuildingUpdateInput = {
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    carName?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingBuildingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    carName?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingBuildingCreateManyInput = {
    id?: number
    userId: bigint | number
    carName: string
    imageUrl: string
    createdAt?: Date | string
  }

  export type PendingBuildingUpdateManyMutationInput = {
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    carName?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingBuildingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    carName?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserCountOrderByAggregateInput = {
    userid?: SortOrder
    country?: SortOrder
    countryName?: SortOrder
    level?: SortOrder
    rank?: SortOrder
    government?: SortOrder
    religion?: SortOrder
    crowd?: SortOrder
    capital?: SortOrder
    dailyProfit?: SortOrder
    satisfaction?: SortOrder
    security?: SortOrder
    lottery?: SortOrder
    oil?: SortOrder
    iron?: SortOrder
    gold?: SortOrder
    uranium?: SortOrder
    goldMine?: SortOrder
    uraniumMine?: SortOrder
    ironMine?: SortOrder
    refinery?: SortOrder
    soldier?: SortOrder
    tank?: SortOrder
    heavyTank?: SortOrder
    su57?: SortOrder
    f47?: SortOrder
    f35?: SortOrder
    j20?: SortOrder
    f16?: SortOrder
    f22?: SortOrder
    am50?: SortOrder
    b2?: SortOrder
    tu16?: SortOrder
    espionageDrone?: SortOrder
    suicideDrone?: SortOrder
    crossDrone?: SortOrder
    witnessDrone?: SortOrder
    simpleRocket?: SortOrder
    crossRocket?: SortOrder
    dotTargetRocket?: SortOrder
    continentalRocket?: SortOrder
    ballisticRocket?: SortOrder
    chemicalRocket?: SortOrder
    hyperSonicRocket?: SortOrder
    clusterRocket?: SortOrder
    battleship?: SortOrder
    marineShip?: SortOrder
    breakerShip?: SortOrder
    nuclearSubmarine?: SortOrder
    antiRocket?: SortOrder
    ironDome?: SortOrder
    s400?: SortOrder
    taad?: SortOrder
    hq9?: SortOrder
    acash?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    userid?: SortOrder
    level?: SortOrder
    rank?: SortOrder
    crowd?: SortOrder
    capital?: SortOrder
    dailyProfit?: SortOrder
    satisfaction?: SortOrder
    security?: SortOrder
    lottery?: SortOrder
    oil?: SortOrder
    iron?: SortOrder
    gold?: SortOrder
    uranium?: SortOrder
    goldMine?: SortOrder
    uraniumMine?: SortOrder
    ironMine?: SortOrder
    refinery?: SortOrder
    soldier?: SortOrder
    tank?: SortOrder
    heavyTank?: SortOrder
    su57?: SortOrder
    f47?: SortOrder
    f35?: SortOrder
    j20?: SortOrder
    f16?: SortOrder
    f22?: SortOrder
    am50?: SortOrder
    b2?: SortOrder
    tu16?: SortOrder
    espionageDrone?: SortOrder
    suicideDrone?: SortOrder
    crossDrone?: SortOrder
    witnessDrone?: SortOrder
    simpleRocket?: SortOrder
    crossRocket?: SortOrder
    dotTargetRocket?: SortOrder
    continentalRocket?: SortOrder
    ballisticRocket?: SortOrder
    chemicalRocket?: SortOrder
    hyperSonicRocket?: SortOrder
    clusterRocket?: SortOrder
    battleship?: SortOrder
    marineShip?: SortOrder
    breakerShip?: SortOrder
    nuclearSubmarine?: SortOrder
    antiRocket?: SortOrder
    ironDome?: SortOrder
    s400?: SortOrder
    taad?: SortOrder
    hq9?: SortOrder
    acash?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    userid?: SortOrder
    country?: SortOrder
    countryName?: SortOrder
    level?: SortOrder
    rank?: SortOrder
    government?: SortOrder
    religion?: SortOrder
    crowd?: SortOrder
    capital?: SortOrder
    dailyProfit?: SortOrder
    satisfaction?: SortOrder
    security?: SortOrder
    lottery?: SortOrder
    oil?: SortOrder
    iron?: SortOrder
    gold?: SortOrder
    uranium?: SortOrder
    goldMine?: SortOrder
    uraniumMine?: SortOrder
    ironMine?: SortOrder
    refinery?: SortOrder
    soldier?: SortOrder
    tank?: SortOrder
    heavyTank?: SortOrder
    su57?: SortOrder
    f47?: SortOrder
    f35?: SortOrder
    j20?: SortOrder
    f16?: SortOrder
    f22?: SortOrder
    am50?: SortOrder
    b2?: SortOrder
    tu16?: SortOrder
    espionageDrone?: SortOrder
    suicideDrone?: SortOrder
    crossDrone?: SortOrder
    witnessDrone?: SortOrder
    simpleRocket?: SortOrder
    crossRocket?: SortOrder
    dotTargetRocket?: SortOrder
    continentalRocket?: SortOrder
    ballisticRocket?: SortOrder
    chemicalRocket?: SortOrder
    hyperSonicRocket?: SortOrder
    clusterRocket?: SortOrder
    battleship?: SortOrder
    marineShip?: SortOrder
    breakerShip?: SortOrder
    nuclearSubmarine?: SortOrder
    antiRocket?: SortOrder
    ironDome?: SortOrder
    s400?: SortOrder
    taad?: SortOrder
    hq9?: SortOrder
    acash?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    userid?: SortOrder
    country?: SortOrder
    countryName?: SortOrder
    level?: SortOrder
    rank?: SortOrder
    government?: SortOrder
    religion?: SortOrder
    crowd?: SortOrder
    capital?: SortOrder
    dailyProfit?: SortOrder
    satisfaction?: SortOrder
    security?: SortOrder
    lottery?: SortOrder
    oil?: SortOrder
    iron?: SortOrder
    gold?: SortOrder
    uranium?: SortOrder
    goldMine?: SortOrder
    uraniumMine?: SortOrder
    ironMine?: SortOrder
    refinery?: SortOrder
    soldier?: SortOrder
    tank?: SortOrder
    heavyTank?: SortOrder
    su57?: SortOrder
    f47?: SortOrder
    f35?: SortOrder
    j20?: SortOrder
    f16?: SortOrder
    f22?: SortOrder
    am50?: SortOrder
    b2?: SortOrder
    tu16?: SortOrder
    espionageDrone?: SortOrder
    suicideDrone?: SortOrder
    crossDrone?: SortOrder
    witnessDrone?: SortOrder
    simpleRocket?: SortOrder
    crossRocket?: SortOrder
    dotTargetRocket?: SortOrder
    continentalRocket?: SortOrder
    ballisticRocket?: SortOrder
    chemicalRocket?: SortOrder
    hyperSonicRocket?: SortOrder
    clusterRocket?: SortOrder
    battleship?: SortOrder
    marineShip?: SortOrder
    breakerShip?: SortOrder
    nuclearSubmarine?: SortOrder
    antiRocket?: SortOrder
    ironDome?: SortOrder
    s400?: SortOrder
    taad?: SortOrder
    hq9?: SortOrder
    acash?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    userid?: SortOrder
    level?: SortOrder
    rank?: SortOrder
    crowd?: SortOrder
    capital?: SortOrder
    dailyProfit?: SortOrder
    satisfaction?: SortOrder
    security?: SortOrder
    lottery?: SortOrder
    oil?: SortOrder
    iron?: SortOrder
    gold?: SortOrder
    uranium?: SortOrder
    goldMine?: SortOrder
    uraniumMine?: SortOrder
    ironMine?: SortOrder
    refinery?: SortOrder
    soldier?: SortOrder
    tank?: SortOrder
    heavyTank?: SortOrder
    su57?: SortOrder
    f47?: SortOrder
    f35?: SortOrder
    j20?: SortOrder
    f16?: SortOrder
    f22?: SortOrder
    am50?: SortOrder
    b2?: SortOrder
    tu16?: SortOrder
    espionageDrone?: SortOrder
    suicideDrone?: SortOrder
    crossDrone?: SortOrder
    witnessDrone?: SortOrder
    simpleRocket?: SortOrder
    crossRocket?: SortOrder
    dotTargetRocket?: SortOrder
    continentalRocket?: SortOrder
    ballisticRocket?: SortOrder
    chemicalRocket?: SortOrder
    hyperSonicRocket?: SortOrder
    clusterRocket?: SortOrder
    battleship?: SortOrder
    marineShip?: SortOrder
    breakerShip?: SortOrder
    nuclearSubmarine?: SortOrder
    antiRocket?: SortOrder
    ironDome?: SortOrder
    s400?: SortOrder
    taad?: SortOrder
    hq9?: SortOrder
    acash?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProductionLineCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    country?: SortOrder
    name?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
    createdAt?: SortOrder
    carName?: SortOrder
  }

  export type ProductionLineAvgOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
  }

  export type ProductionLineMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    country?: SortOrder
    name?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
    createdAt?: SortOrder
    carName?: SortOrder
  }

  export type ProductionLineMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    country?: SortOrder
    name?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
    createdAt?: SortOrder
    carName?: SortOrder
  }

  export type ProductionLineSumOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type PendingProductionLineCountOrderByAggregateInput = {
    ownerId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    imageFileId?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
    country?: SortOrder
  }

  export type PendingProductionLineAvgOrderByAggregateInput = {
    ownerId?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
  }

  export type PendingProductionLineMaxOrderByAggregateInput = {
    ownerId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    imageFileId?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
    country?: SortOrder
  }

  export type PendingProductionLineMinOrderByAggregateInput = {
    ownerId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    imageFileId?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
    country?: SortOrder
  }

  export type PendingProductionLineSumOrderByAggregateInput = {
    ownerId?: SortOrder
    dailyLimit?: SortOrder
    setupCost?: SortOrder
  }

  export type CarCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type CarAvgOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    price?: SortOrder
  }

  export type CarMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type CarMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    name?: SortOrder
    imageUrl?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type CarSumOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    price?: SortOrder
  }

  export type PendingBuildingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    carName?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingBuildingAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type PendingBuildingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    carName?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingBuildingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    carName?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingBuildingSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductionLineDefaultArgs instead
     */
    export type ProductionLineArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductionLineDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PendingProductionLineDefaultArgs instead
     */
    export type PendingProductionLineArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PendingProductionLineDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CarDefaultArgs instead
     */
    export type CarArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CarDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PendingBuildingDefaultArgs instead
     */
    export type PendingBuildingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PendingBuildingDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}