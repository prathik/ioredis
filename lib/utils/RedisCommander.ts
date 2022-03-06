import { Callback } from "../types";

type RedisKey = string | Buffer;
type RedisValue = string | Buffer | number;

// Inspired by https://github.com/mmkal/handy-redis/blob/main/src/generated/interface.ts.
// Should be fixed with https://github.com/Microsoft/TypeScript/issues/1213
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ResultTypes<Result, Context> {
  default: Promise<Result>;
  pipeline: ChainableCommander;
}

export interface ChainableCommander
  extends RedisCommander<{ type: "pipeline" }> {}

export type ClientContext = { type: keyof ResultTypes<unknown, unknown> };
export type Result<T, Context extends ClientContext> =
  // prettier-break
  ResultTypes<T, Context>[Context["type"]];

interface RedisCommander<Context extends ClientContext = { type: "default" }> {
  /**
   * Call arbitrary commands.
   *
   * `redis.call('set', 'foo', 'bar')` is the same as `redis.set('foo', 'bar')`,
   * so the only case you need to use this method is when the command is not
   * supported by ioredis.
   *
   * ```ts
   * redis.call('set', 'foo', 'bar');
   * redis.call('get', 'foo', (err, value) => {
   *   // value === 'bar'
   * });
   * ```
   */
  call(command: string, callback?: Callback<unknown>): Result<unknown, Context>;
  call(
    command: string,
    args: (string | Buffer | number)[],
    callback?: Callback<unknown>
  ): Result<unknown, Context>;
  call(
    ...args: [
      command: string,
      ...args: (string | Buffer | number)[],
      callback: Callback<unknown>
    ]
  ): Result<unknown, Context>;
  call(
    ...args: [command: string, ...args: (string | Buffer | number)[]]
  ): Result<unknown, Context>;

  
  /**
   * List the ACL categories or the commands inside a category
   * - _group_: server
   * - _complexity_: O(1) since the categories and commands are a fixed set.
   * - _since_: 6.0.0
   */
  acl(subcommand: 'CAT', callback?: Callback<unknown>): Result<unknown, Context>;
  acl(subcommand: 'CAT', categoryname: string | Buffer, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 6.0.0
   */
  acl(subcommand: 'HELP', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Save the current ACL rules in the configured ACL file
   * - _group_: server
   * - _complexity_: O(N). Where N is the number of configured users.
   * - _since_: 6.0.0
   */
  acl(subcommand: 'SAVE', callback?: Callback<"OK">): Result<"OK", Context>;

  /**
   * List the current ACL rules in ACL config file format
   * - _group_: server
   * - _complexity_: O(N). Where N is the number of configured users.
   * - _since_: 6.0.0
   */
  acl(subcommand: 'LIST', callback?: Callback<string[]>): Result<string[], Context>;
  aclBuffer(subcommand: 'LIST', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Reload the ACLs from the configured ACL file
   * - _group_: server
   * - _complexity_: O(N). Where N is the number of configured users.
   * - _since_: 6.0.0
   */
  acl(subcommand: 'LOAD', callback?: Callback<"OK">): Result<"OK", Context>;

  /**
   * Modify or create the rules for a specific ACL user
   * - _group_: server
   * - _complexity_: O(N). Where N is the number of rules provided.
   * - _since_: 6.0.0
   */
  acl(subcommand: 'SETUSER', username: string | Buffer, callback?: Callback<"OK">): Result<"OK", Context>;
  acl(...args: [subcommand: 'SETUSER', username: string | Buffer, ...rules: (string | Buffer)[], callback: Callback<"OK">]): Result<"OK", Context>;
  acl(...args: [subcommand: 'SETUSER', username: string | Buffer, ...rules: (string | Buffer)[]]): Result<"OK", Context>;

  /**
   * Generate a pseudorandom secure password to use for ACL users
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 6.0.0
   */
  acl(subcommand: 'GENPASS', callback?: Callback<string>): Result<string, Context>;
  aclBuffer(subcommand: 'GENPASS', callback?: Callback<Buffer>): Result<Buffer, Context>;
  acl(subcommand: 'GENPASS', bits: number | string, callback?: Callback<string>): Result<string, Context>;
  aclBuffer(subcommand: 'GENPASS', bits: number | string, callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Returns whether the user can execute the given command without executing the command.
   * - _group_: server
   * - _complexity_: O(1).
   * - _since_: 7.0.0
   */
  acl(subcommand: 'DRYRUN', username: string | Buffer, command: string | Buffer, callback?: Callback<string>): Result<string, Context>;
  aclBuffer(subcommand: 'DRYRUN', username: string | Buffer, command: string | Buffer, callback?: Callback<Buffer>): Result<Buffer, Context>;
  acl(...args: [subcommand: 'DRYRUN', username: string | Buffer, command: string | Buffer, ...args: (string | Buffer | number)[], callback: Callback<string>]): Result<string, Context>;
  aclBuffer(...args: [subcommand: 'DRYRUN', username: string | Buffer, command: string | Buffer, ...args: (string | Buffer | number)[], callback: Callback<Buffer>]): Result<Buffer, Context>;
  acl(...args: [subcommand: 'DRYRUN', username: string | Buffer, command: string | Buffer, ...args: (string | Buffer | number)[]]): Result<string, Context>;
  aclBuffer(...args: [subcommand: 'DRYRUN', username: string | Buffer, command: string | Buffer, ...args: (string | Buffer | number)[]]): Result<Buffer, Context>;

  /**
   * Get the rules for a specific ACL user
   * - _group_: server
   * - _complexity_: O(N). Where N is the number of password, command and pattern rules that the user has.
   * - _since_: 6.0.0
   */
  acl(subcommand: 'GETUSER', username: string | Buffer, callback?: Callback<string[] | null>): Result<string[] | null, Context>;
  aclBuffer(subcommand: 'GETUSER', username: string | Buffer, callback?: Callback<Buffer[] | null>): Result<Buffer[] | null, Context>;

  /**
   * Return the name of the user associated to the current connection
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 6.0.0
   */
  acl(subcommand: 'WHOAMI', callback?: Callback<string>): Result<string, Context>;
  aclBuffer(subcommand: 'WHOAMI', callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * List the username of all the configured ACL rules
   * - _group_: server
   * - _complexity_: O(N). Where N is the number of configured users.
   * - _since_: 6.0.0
   */
  acl(subcommand: 'USERS', callback?: Callback<string[]>): Result<string[], Context>;
  aclBuffer(subcommand: 'USERS', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Remove the specified ACL users and the associated rules
   * - _group_: server
   * - _complexity_: O(1) amortized time considering the typical user.
   * - _since_: 6.0.0
   */
  acl(...args: [subcommand: 'DELUSER', ...usernames: (string | Buffer)[], callback: Callback<number>]): Result<number, Context>;
  acl(...args: [subcommand: 'DELUSER', ...usernames: (string | Buffer)[]]): Result<number, Context>;

  /**
   * List latest events denied because of ACLs in place
   * - _group_: server
   * - _complexity_: O(N) with N being the number of entries shown.
   * - _since_: 6.0.0
   */
  acl(subcommand: 'LOG', callback?: Callback<unknown>): Result<unknown, Context>;
  acl(subcommand: 'LOG', count: number, callback?: Callback<unknown>): Result<unknown, Context>;
  acl(subcommand: 'LOG', reset: 'RESET', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Append a value to a key
   * - _group_: string
   * - _complexity_: O(1). The amortized time complexity is O(1) assuming the appended value is small and the already present value is of any size, since the dynamic string library used by Redis will double the free space available on every reallocation.
   * - _since_: 2.0.0
   */
  append(key: RedisKey, value: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Sent by cluster clients after an -ASK redirect
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  asking(callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Authenticate to the server
   * - _group_: connection
   * - _complexity_: O(N) where N is the number of passwords defined for the user
   * - _since_: 1.0.0
   */
  auth(password: string | Buffer, callback?: Callback<'OK'>): Result<'OK', Context>;
  auth(username: string | Buffer, password: string | Buffer, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Asynchronously rewrite the append-only file
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  bgrewriteaof(callback?: Callback<string>): Result<string, Context>;
  bgrewriteaofBuffer(callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Asynchronously save the dataset to disk
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  bgsave(callback?: Callback<'OK'>): Result<'OK', Context>;
  bgsave(schedule: 'SCHEDULE', callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Count set bits in a string
   * - _group_: bitmap
   * - _complexity_: O(N)
   * - _since_: 2.6.0
   */
  bitcount(key: RedisKey, callback?: Callback<number>): Result<number, Context>;
  bitcount(key: RedisKey, start: number, end: number, callback?: Callback<number>): Result<number, Context>;
  bitcount(key: RedisKey, start: number, end: number, byte: 'BYTE', callback?: Callback<number>): Result<number, Context>;
  bitcount(key: RedisKey, start: number, end: number, bit: 'BIT', callback?: Callback<number>): Result<number, Context>;

  /**
   * Perform arbitrary bitfield integer operations on strings
   * - _group_: bitmap
   * - _complexity_: O(1) for each subcommand specified
   * - _since_: 3.2.0
   */
  bitfield(key: RedisKey, callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, overflow: 'OVERFLOW', wrap: 'WRAP', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, overflow: 'OVERFLOW', sat: 'SAT', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, overflow: 'OVERFLOW', fail: 'FAIL', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetIncrementToken: 'INCRBY', encoding: string | Buffer, offset: number | string, increment: number | string, callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetIncrementToken: 'INCRBY', encoding: string | Buffer, offset: number | string, increment: number | string, overflow: 'OVERFLOW', wrap: 'WRAP', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetIncrementToken: 'INCRBY', encoding: string | Buffer, offset: number | string, increment: number | string, overflow: 'OVERFLOW', sat: 'SAT', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetIncrementToken: 'INCRBY', encoding: string | Buffer, offset: number | string, increment: number | string, overflow: 'OVERFLOW', fail: 'FAIL', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetValueToken: 'SET', encoding: string | Buffer, offset: number | string, value: number | string, callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetValueToken: 'SET', encoding: string | Buffer, offset: number | string, value: number | string, overflow: 'OVERFLOW', wrap: 'WRAP', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetValueToken: 'SET', encoding: string | Buffer, offset: number | string, value: number | string, overflow: 'OVERFLOW', sat: 'SAT', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetValueToken: 'SET', encoding: string | Buffer, offset: number | string, value: number | string, overflow: 'OVERFLOW', fail: 'FAIL', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetValueToken: 'SET', encoding: string | Buffer, offset: number | string, value: number | string, encodingOffsetIncrementToken: 'INCRBY', encoding1: string | Buffer, offset1: number | string, increment: number | string, callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetValueToken: 'SET', encoding: string | Buffer, offset: number | string, value: number | string, encodingOffsetIncrementToken: 'INCRBY', encoding1: string | Buffer, offset1: number | string, increment: number | string, overflow: 'OVERFLOW', wrap: 'WRAP', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetValueToken: 'SET', encoding: string | Buffer, offset: number | string, value: number | string, encodingOffsetIncrementToken: 'INCRBY', encoding1: string | Buffer, offset1: number | string, increment: number | string, overflow: 'OVERFLOW', sat: 'SAT', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetValueToken: 'SET', encoding: string | Buffer, offset: number | string, value: number | string, encodingOffsetIncrementToken: 'INCRBY', encoding1: string | Buffer, offset1: number | string, increment: number | string, overflow: 'OVERFLOW', fail: 'FAIL', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, overflow: 'OVERFLOW', wrap: 'WRAP', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, overflow: 'OVERFLOW', sat: 'SAT', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, overflow: 'OVERFLOW', fail: 'FAIL', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, encodingOffsetIncrementToken: 'INCRBY', encoding1: string | Buffer, offset1: number | string, increment: number | string, callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, encodingOffsetIncrementToken: 'INCRBY', encoding1: string | Buffer, offset1: number | string, increment: number | string, overflow: 'OVERFLOW', wrap: 'WRAP', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, encodingOffsetIncrementToken: 'INCRBY', encoding1: string | Buffer, offset1: number | string, increment: number | string, overflow: 'OVERFLOW', sat: 'SAT', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, encodingOffsetIncrementToken: 'INCRBY', encoding1: string | Buffer, offset1: number | string, increment: number | string, overflow: 'OVERFLOW', fail: 'FAIL', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, encodingOffsetValueToken: 'SET', encoding1: string | Buffer, offset1: number | string, value: number | string, callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, encodingOffsetValueToken: 'SET', encoding1: string | Buffer, offset1: number | string, value: number | string, overflow: 'OVERFLOW', wrap: 'WRAP', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, encodingOffsetValueToken: 'SET', encoding1: string | Buffer, offset1: number | string, value: number | string, overflow: 'OVERFLOW', sat: 'SAT', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, encodingOffsetValueToken: 'SET', encoding1: string | Buffer, offset1: number | string, value: number | string, overflow: 'OVERFLOW', fail: 'FAIL', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, encodingOffsetValueToken: 'SET', encoding1: string | Buffer, offset1: number | string, value: number | string, encodingOffsetIncrementToken: 'INCRBY', encoding2: string | Buffer, offset2: number | string, increment: number | string, callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, encodingOffsetValueToken: 'SET', encoding1: string | Buffer, offset1: number | string, value: number | string, encodingOffsetIncrementToken: 'INCRBY', encoding2: string | Buffer, offset2: number | string, increment: number | string, overflow: 'OVERFLOW', wrap: 'WRAP', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, encodingOffsetValueToken: 'SET', encoding1: string | Buffer, offset1: number | string, value: number | string, encodingOffsetIncrementToken: 'INCRBY', encoding2: string | Buffer, offset2: number | string, increment: number | string, overflow: 'OVERFLOW', sat: 'SAT', callback?: Callback<unknown>): Result<unknown, Context>;
  bitfield(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, encodingOffsetValueToken: 'SET', encoding1: string | Buffer, offset1: number | string, value: number | string, encodingOffsetIncrementToken: 'INCRBY', encoding2: string | Buffer, offset2: number | string, increment: number | string, overflow: 'OVERFLOW', fail: 'FAIL', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Perform arbitrary bitfield integer operations on strings. Read-only variant of BITFIELD
   * - _group_: bitmap
   * - _complexity_: O(1) for each subcommand specified
   * - _since_: 6.2.0
   */
  bitfield_ro(key: RedisKey, encodingOffsetToken: 'GET', encoding: string | Buffer, offset: number | string, callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Perform bitwise operations between strings
   * - _group_: bitmap
   * - _complexity_: O(N)
   * - _since_: 2.6.0
   */
  bitop(...args: [operation: string | Buffer, destkey: RedisKey, ...keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  bitop(...args: [operation: string | Buffer, destkey: RedisKey, keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  bitop(...args: [operation: string | Buffer, destkey: RedisKey, ...keys: (RedisKey)[]]): Result<number, Context>;
  bitop(...args: [operation: string | Buffer, destkey: RedisKey, keys: (RedisKey)[]]): Result<number, Context>;

  /**
   * Find first bit set or clear in a string
   * - _group_: bitmap
   * - _complexity_: O(N)
   * - _since_: 2.8.7
   */
  bitpos(key: RedisKey, bit: number | string, callback?: Callback<number>): Result<number, Context>;
  bitpos(key: RedisKey, bit: number | string, start: number, callback?: Callback<number>): Result<number, Context>;
  bitpos(key: RedisKey, bit: number | string, start: number, end: number, callback?: Callback<number>): Result<number, Context>;
  bitpos(key: RedisKey, bit: number | string, start: number, end: number, byte: 'BYTE', callback?: Callback<number>): Result<number, Context>;
  bitpos(key: RedisKey, bit: number | string, start: number, end: number, bit1: 'BIT', callback?: Callback<number>): Result<number, Context>;

  /**
   * Pop an element from a list, push it to another list and return it; or block until one is available
   * - _group_: list
   * - _complexity_: O(1)
   * - _since_: 6.2.0
   */
  blmove(source: RedisKey, destination: RedisKey, left: 'LEFT', left1: 'LEFT', timeout: number | string, callback?: Callback<string | null>): Result<string | null, Context>;
  blmoveBuffer(source: RedisKey, destination: RedisKey, left: 'LEFT', left1: 'LEFT', timeout: number | string, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  blmove(source: RedisKey, destination: RedisKey, left: 'LEFT', right: 'RIGHT', timeout: number | string, callback?: Callback<string | null>): Result<string | null, Context>;
  blmoveBuffer(source: RedisKey, destination: RedisKey, left: 'LEFT', right: 'RIGHT', timeout: number | string, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  blmove(source: RedisKey, destination: RedisKey, right: 'RIGHT', left: 'LEFT', timeout: number | string, callback?: Callback<string | null>): Result<string | null, Context>;
  blmoveBuffer(source: RedisKey, destination: RedisKey, right: 'RIGHT', left: 'LEFT', timeout: number | string, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  blmove(source: RedisKey, destination: RedisKey, right: 'RIGHT', right1: 'RIGHT', timeout: number | string, callback?: Callback<string | null>): Result<string | null, Context>;
  blmoveBuffer(source: RedisKey, destination: RedisKey, right: 'RIGHT', right1: 'RIGHT', timeout: number | string, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Remove and get the first element in a list, or block until one is available
   * - _group_: list
   * - _complexity_: O(N) where N is the number of provided keys.
   * - _since_: 2.0.0
   */
  blpop(...args: [...keys: (RedisKey)[], timeout: number | string, callback: Callback<[string, string] | null>]): Result<[string, string] | null, Context>;
  blpopBuffer(...args: [...keys: (RedisKey)[], timeout: number | string, callback: Callback<[Buffer, Buffer] | null>]): Result<[Buffer, Buffer] | null, Context>;
  blpop(...args: [keys: (RedisKey)[], timeout: number | string, callback: Callback<[string, string] | null>]): Result<[string, string] | null, Context>;
  blpopBuffer(...args: [keys: (RedisKey)[], timeout: number | string, callback: Callback<[Buffer, Buffer] | null>]): Result<[Buffer, Buffer] | null, Context>;
  blpop(...args: [...keys: (RedisKey)[], timeout: number | string]): Result<[string, string] | null, Context>;
  blpopBuffer(...args: [...keys: (RedisKey)[], timeout: number | string]): Result<[Buffer, Buffer] | null, Context>;
  blpop(...args: [keys: (RedisKey)[], timeout: number | string]): Result<[string, string] | null, Context>;
  blpopBuffer(...args: [keys: (RedisKey)[], timeout: number | string]): Result<[Buffer, Buffer] | null, Context>;

  /**
   * Remove and get the last element in a list, or block until one is available
   * - _group_: list
   * - _complexity_: O(N) where N is the number of provided keys.
   * - _since_: 2.0.0
   */
  brpop(...args: [...keys: (RedisKey)[], timeout: number | string, callback: Callback<[string, string] | null>]): Result<[string, string] | null, Context>;
  brpopBuffer(...args: [...keys: (RedisKey)[], timeout: number | string, callback: Callback<[Buffer, Buffer] | null>]): Result<[Buffer, Buffer] | null, Context>;
  brpop(...args: [keys: (RedisKey)[], timeout: number | string, callback: Callback<[string, string] | null>]): Result<[string, string] | null, Context>;
  brpopBuffer(...args: [keys: (RedisKey)[], timeout: number | string, callback: Callback<[Buffer, Buffer] | null>]): Result<[Buffer, Buffer] | null, Context>;
  brpop(...args: [...keys: (RedisKey)[], timeout: number | string]): Result<[string, string] | null, Context>;
  brpopBuffer(...args: [...keys: (RedisKey)[], timeout: number | string]): Result<[Buffer, Buffer] | null, Context>;
  brpop(...args: [keys: (RedisKey)[], timeout: number | string]): Result<[string, string] | null, Context>;
  brpopBuffer(...args: [keys: (RedisKey)[], timeout: number | string]): Result<[Buffer, Buffer] | null, Context>;

  /**
   * Pop an element from a list, push it to another list and return it; or block until one is available
   * - _group_: list
   * - _complexity_: O(1)
   * - _since_: 2.2.0
   */
  brpoplpush(source: RedisKey, destination: RedisKey, timeout: number | string, callback?: Callback<string | null>): Result<string | null, Context>;
  brpoplpushBuffer(source: RedisKey, destination: RedisKey, timeout: number | string, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Remove and return the member with the highest score from one or more sorted sets, or block until one is available
   * - _group_: sorted-set
   * - _complexity_: O(log(N)) with N being the number of elements in the sorted set.
   * - _since_: 5.0.0
   */
  bzpopmax(...args: [...keys: (RedisKey)[], timeout: number | string, callback: Callback<unknown[] | null>]): Result<unknown[] | null, Context>;
  bzpopmax(...args: [keys: (RedisKey)[], timeout: number | string, callback: Callback<unknown[] | null>]): Result<unknown[] | null, Context>;
  bzpopmax(...args: [...keys: (RedisKey)[], timeout: number | string]): Result<unknown[] | null, Context>;
  bzpopmax(...args: [keys: (RedisKey)[], timeout: number | string]): Result<unknown[] | null, Context>;

  /**
   * Remove and return the member with the lowest score from one or more sorted sets, or block until one is available
   * - _group_: sorted-set
   * - _complexity_: O(log(N)) with N being the number of elements in the sorted set.
   * - _since_: 5.0.0
   */
  bzpopmin(...args: [...keys: (RedisKey)[], timeout: number | string, callback: Callback<unknown[] | null>]): Result<unknown[] | null, Context>;
  bzpopmin(...args: [keys: (RedisKey)[], timeout: number | string, callback: Callback<unknown[] | null>]): Result<unknown[] | null, Context>;
  bzpopmin(...args: [...keys: (RedisKey)[], timeout: number | string]): Result<unknown[] | null, Context>;
  bzpopmin(...args: [keys: (RedisKey)[], timeout: number | string]): Result<unknown[] | null, Context>;

  /**
   * Resume processing of clients that were paused
   * - _group_: connection
   * - _complexity_: O(N) Where N is the number of paused clients
   * - _since_: 6.2.0
   */
  client(subcommand: 'UNPAUSE', callback?: Callback<"OK">): Result<"OK", Context>;

  /**
   * Get the list of client connections
   * - _group_: connection
   * - _complexity_: O(N) where N is the number of client connections
   * - _since_: 2.4.0
   */
  client(subcommand: 'LIST', callback?: Callback<unknown>): Result<unknown, Context>;
  client(...args: [subcommand: 'LIST', idToken: 'ID', ...clientIds: (number | string)[], callback: Callback<unknown>]): Result<unknown, Context>;
  client(...args: [subcommand: 'LIST', idToken: 'ID', ...clientIds: (number | string)[]]): Result<unknown, Context>;
  client(subcommand: 'LIST', type: 'TYPE', normal: 'NORMAL', callback?: Callback<unknown>): Result<unknown, Context>;
  client(...args: [subcommand: 'LIST', type: 'TYPE', normal: 'NORMAL', idToken: 'ID', ...clientIds: (number | string)[], callback: Callback<unknown>]): Result<unknown, Context>;
  client(...args: [subcommand: 'LIST', type: 'TYPE', normal: 'NORMAL', idToken: 'ID', ...clientIds: (number | string)[]]): Result<unknown, Context>;
  client(subcommand: 'LIST', type: 'TYPE', master: 'MASTER', callback?: Callback<unknown>): Result<unknown, Context>;
  client(...args: [subcommand: 'LIST', type: 'TYPE', master: 'MASTER', idToken: 'ID', ...clientIds: (number | string)[], callback: Callback<unknown>]): Result<unknown, Context>;
  client(...args: [subcommand: 'LIST', type: 'TYPE', master: 'MASTER', idToken: 'ID', ...clientIds: (number | string)[]]): Result<unknown, Context>;
  client(subcommand: 'LIST', type: 'TYPE', replica: 'REPLICA', callback?: Callback<unknown>): Result<unknown, Context>;
  client(...args: [subcommand: 'LIST', type: 'TYPE', replica: 'REPLICA', idToken: 'ID', ...clientIds: (number | string)[], callback: Callback<unknown>]): Result<unknown, Context>;
  client(...args: [subcommand: 'LIST', type: 'TYPE', replica: 'REPLICA', idToken: 'ID', ...clientIds: (number | string)[]]): Result<unknown, Context>;
  client(subcommand: 'LIST', type: 'TYPE', pubsub: 'PUBSUB', callback?: Callback<unknown>): Result<unknown, Context>;
  client(...args: [subcommand: 'LIST', type: 'TYPE', pubsub: 'PUBSUB', idToken: 'ID', ...clientIds: (number | string)[], callback: Callback<unknown>]): Result<unknown, Context>;
  client(...args: [subcommand: 'LIST', type: 'TYPE', pubsub: 'PUBSUB', idToken: 'ID', ...clientIds: (number | string)[]]): Result<unknown, Context>;

  /**
   * Set client eviction mode for the current connection
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 7.0.0
   */
  client(subcommand: 'NO-EVICT', on: 'ON', callback?: Callback<unknown>): Result<unknown, Context>;
  client(subcommand: 'NO-EVICT', off: 'OFF', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Returns the client ID for the current connection
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  client(subcommand: 'ID', callback?: Callback<number>): Result<number, Context>;

  /**
   * Unblock a client blocked in a blocking command from a different connection
   * - _group_: connection
   * - _complexity_: O(log N) where N is the number of client connections
   * - _since_: 5.0.0
   */
  client(subcommand: 'UNBLOCK', clientId: number | string, callback?: Callback<unknown>): Result<unknown, Context>;
  client(subcommand: 'UNBLOCK', clientId: number | string, timeout: 'TIMEOUT', callback?: Callback<unknown>): Result<unknown, Context>;
  client(subcommand: 'UNBLOCK', clientId: number | string, error: 'ERROR', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Enable or disable server assisted client side caching support
   * - _group_: connection
   * - _complexity_: O(1). Some options may introduce additional complexity.
   * - _since_: 6.0.0
   */
  client(...args: [subcommand: 'TRACKING', ...args: (RedisValue)[], callback: Callback<unknown>]): Result<unknown, Context>;
  client(...args: [subcommand: 'TRACKING', ...args: (RedisValue)[]]): Result<unknown, Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  client(subcommand: 'HELP', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Set the current connection name
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 2.6.9
   */
  client(subcommand: 'SETNAME', connectionName: string | Buffer, callback?: Callback<"OK">): Result<"OK", Context>;

  /**
   * Stop processing commands from clients for some time
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 2.9.50
   */
  client(subcommand: 'PAUSE', timeout: number | string, callback?: Callback<"OK">): Result<"OK", Context>;
  client(subcommand: 'PAUSE', timeout: number | string, write: 'WRITE', callback?: Callback<"OK">): Result<"OK", Context>;
  client(subcommand: 'PAUSE', timeout: number | string, all: 'ALL', callback?: Callback<"OK">): Result<"OK", Context>;

  /**
   * Return information about server assisted client side caching for the current connection
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 6.2.0
   */
  client(subcommand: 'TRACKINGINFO', callback?: Callback<string>): Result<string, Context>;
  clientBuffer(subcommand: 'TRACKINGINFO', callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Returns information about the current client connection.
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 6.2.0
   */
  client(subcommand: 'INFO', callback?: Callback<string>): Result<string, Context>;
  clientBuffer(subcommand: 'INFO', callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Get tracking notifications redirection client ID if any
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 6.0.0
   */
  client(subcommand: 'GETREDIR', callback?: Callback<number>): Result<number, Context>;

  /**
   * Get the current connection name
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 2.6.9
   */
  client(subcommand: 'GETNAME', callback?: Callback<string | null>): Result<string | null, Context>;
  clientBuffer(subcommand: 'GETNAME', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Instruct the server about tracking or not keys in the next request
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 6.0.0
   */
  client(subcommand: 'CACHING', yes: 'YES', callback?: Callback<"OK">): Result<"OK", Context>;
  client(subcommand: 'CACHING', no: 'NO', callback?: Callback<"OK">): Result<"OK", Context>;

  /**
   * Instruct the server whether to reply to commands
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 3.2.0
   */
  client(subcommand: 'REPLY', on: 'ON', callback?: Callback<unknown>): Result<unknown, Context>;
  client(subcommand: 'REPLY', off: 'OFF', callback?: Callback<unknown>): Result<unknown, Context>;
  client(subcommand: 'REPLY', skip: 'SKIP', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Kill the connection of a client
   * - _group_: connection
   * - _complexity_: O(N) where N is the number of client connections
   * - _since_: 2.4.0
   */
  client(...args: [subcommand: 'KILL', ...args: (RedisValue)[], callback: Callback<unknown>]): Result<unknown, Context>;
  client(...args: [subcommand: 'KILL', ...args: (RedisValue)[]]): Result<unknown, Context>;

  /**
   * Forces a replica to perform a manual failover of its master.
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'FAILOVER', callback?: Callback<'OK'>): Result<'OK', Context>;
  cluster(subcommand: 'FAILOVER', force: 'FORCE', callback?: Callback<'OK'>): Result<'OK', Context>;
  cluster(subcommand: 'FAILOVER', takeover: 'TAKEOVER', callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Returns a list of all TCP links to and from peer nodes in cluster
   * - _group_: cluster
   * - _complexity_: O(N) where N is the total number of Cluster nodes
   * - _since_: 7.0.0
   */
  cluster(subcommand: 'LINKS', callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Assign new hash slots to receiving node
   * - _group_: cluster
   * - _complexity_: O(N) where N is the total number of hash slot arguments
   * - _since_: 3.0.0
   */
  cluster(...args: [subcommand: 'ADDSLOTS', ...slots: (number | string)[], callback: Callback<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][]>]): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;
  cluster(...args: [subcommand: 'ADDSLOTS', slots: (number | string)[], callback: Callback<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][]>]): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;
  cluster(...args: [subcommand: 'ADDSLOTS', ...slots: (number | string)[]]): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;
  cluster(...args: [subcommand: 'ADDSLOTS', slots: (number | string)[]]): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;

  /**
   * Get Cluster config for the node
   * - _group_: cluster
   * - _complexity_: O(N) where N is the total number of Cluster nodes
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'NODES', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  cluster(subcommand: 'HELP', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Return the number of local keys in the specified hash slot
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'COUNTKEYSINSLOT', slot: number | string, callback?: Callback<number>): Result<number, Context>;

  /**
   * Bind a hash slot to a specific node
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'SETSLOT', slot: number | string, nodeIdToken: 'IMPORTING', nodeId: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;
  cluster(subcommand: 'SETSLOT', slot: number | string, nodeIdToken: 'MIGRATING', nodeId: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;
  cluster(subcommand: 'SETSLOT', slot: number | string, nodeIdToken: 'NODE', nodeId: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;
  cluster(subcommand: 'SETSLOT', slot: number | string, stable: 'STABLE', callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Delete a node's own slots information
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'FLUSHSLOTS', callback?: Callback<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][]>): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;

  /**
   * Return the number of failure reports active for a given node
   * - _group_: cluster
   * - _complexity_: O(N) where N is the number of failure reports
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'COUNT-FAILURE-REPORTS', nodeId: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Forces the node to save cluster state on disk
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'SAVECONFIG', callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Get array of Cluster slot to node mappings
   * - _group_: cluster
   * - _complexity_: O(N) where N is the total number of Cluster nodes
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'SLOTS', callback?: Callback<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][]>): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;

  /**
   * Advance the cluster config epoch
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'BUMPEPOCH', callback?: Callback<'BUMPED' | 'STILL'>): Result<'BUMPED' | 'STILL', Context>;

  /**
   * Set hash slots as unbound in receiving node
   * - _group_: cluster
   * - _complexity_: O(N) where N is the total number of hash slot arguments
   * - _since_: 3.0.0
   */
  cluster(...args: [subcommand: 'DELSLOTS', ...slots: (number | string)[], callback: Callback<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][]>]): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;
  cluster(...args: [subcommand: 'DELSLOTS', slots: (number | string)[], callback: Callback<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][]>]): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;
  cluster(...args: [subcommand: 'DELSLOTS', ...slots: (number | string)[]]): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;
  cluster(...args: [subcommand: 'DELSLOTS', slots: (number | string)[]]): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;

  /**
   * Reset a Redis Cluster node
   * - _group_: cluster
   * - _complexity_: O(N) where N is the number of known nodes. The command may execute a FLUSHALL as a side effect.
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'RESET', callback?: Callback<'OK'>): Result<'OK', Context>;
  cluster(subcommand: 'RESET', hard: 'HARD', callback?: Callback<'OK'>): Result<'OK', Context>;
  cluster(subcommand: 'RESET', soft: 'SOFT', callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Reconfigure a node as a replica of the specified master node
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'REPLICATE', nodeId: string | Buffer | number, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Set the configuration epoch in a new node
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'SET-CONFIG-EPOCH', configEpoch: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Force a node cluster to handshake with another node
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'MEET', ip: string | Buffer, port: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Assign new hash slots to receiving node
   * - _group_: cluster
   * - _complexity_: O(N) where N is the total number of the slots between the start slot and end slot arguments.
   * - _since_: 7.0.0
   */
  cluster(...args: [subcommand: 'ADDSLOTSRANGE', ...startSlotEndSlots: (number)[], callback: Callback<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][]>]): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;
  cluster(...args: [subcommand: 'ADDSLOTSRANGE', ...startSlotEndSlots: (number)[]]): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;

  /**
   * Return the node id
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'MYID', callback?: Callback<string>): Result<string, Context>;

  /**
   * List replica nodes of the specified master node
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  cluster(subcommand: 'REPLICAS', nodeId: string | Buffer | number, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Remove a node from the nodes table
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'FORGET', nodeId: string | Buffer | number, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Set hash slots as unbound in receiving node
   * - _group_: cluster
   * - _complexity_: O(N) where N is the total number of the slots between the start slot and end slot arguments.
   * - _since_: 7.0.0
   */
  cluster(...args: [subcommand: 'DELSLOTSRANGE', ...startSlotEndSlots: (number)[], callback: Callback<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][]>]): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;
  cluster(...args: [subcommand: 'DELSLOTSRANGE', ...startSlotEndSlots: (number)[]]): Result<[startSlotRange: number, endSlotRange: number, ...nodes: [host: string, port: number, nodeId: string, info: unknown[]][]][], Context>;

  /**
   * Provides info about Redis Cluster node state
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'INFO', callback?: Callback<string>): Result<string, Context>;

  /**
   * Returns the hash slot of the specified key
   * - _group_: cluster
   * - _complexity_: O(N) where N is the number of bytes in the key
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'KEYSLOT', key: string | Buffer, callback?: Callback<number>): Result<number, Context>;

  /**
   * List replica nodes of the specified master node
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'SLAVES', nodeId: string | Buffer | number, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Return local key names in the specified hash slot
   * - _group_: cluster
   * - _complexity_: O(log(N)) where N is the number of requested keys
   * - _since_: 3.0.0
   */
  cluster(subcommand: 'GETKEYSINSLOT', slot: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;

  /**
   * Get an array of Redis command names
   * - _group_: server
   * - _complexity_: O(N) where N is the total number of Redis commands
   * - _since_: 7.0.0
   */
  command(subcommand: 'LIST', callback?: Callback<unknown[]>): Result<unknown[], Context>;
  command(subcommand: 'LIST', filterby: 'FILTERBY', moduleNameToken: 'MODULE', moduleName: string | Buffer, callback?: Callback<unknown[]>): Result<unknown[], Context>;
  command(subcommand: 'LIST', filterby: 'FILTERBY', categoryToken: 'ACLCAT', category: string | Buffer, callback?: Callback<unknown[]>): Result<unknown[], Context>;
  command(subcommand: 'LIST', filterby: 'FILTERBY', patternToken: 'PATTERN', pattern: string, callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Get array of specific Redis command documentation
   * - _group_: server
   * - _complexity_: O(N) where N is the number of commands to look up
   * - _since_: 7.0.0
   */
  command(subcommand: 'DOCS', callback?: Callback<unknown[]>): Result<unknown[], Context>;
  command(...args: [subcommand: 'DOCS', ...commandNames: (string | Buffer)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  command(...args: [subcommand: 'DOCS', ...commandNames: (string | Buffer)[]]): Result<unknown[], Context>;

  /**
   * Get array of specific Redis command details, or all when no argument is given.
   * - _group_: server
   * - _complexity_: O(N) where N is the number of commands to look up
   * - _since_: 2.8.13
   */
  command(subcommand: 'INFO', callback?: Callback<unknown[]>): Result<unknown[], Context>;
  command(...args: [subcommand: 'INFO', ...commandNames: (string | Buffer)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  command(...args: [subcommand: 'INFO', ...commandNames: (string | Buffer)[]]): Result<unknown[], Context>;

  /**
   * Get total number of Redis commands
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 2.8.13
   */
  command(subcommand: 'COUNT', callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Extract keys given a full Redis command
   * - _group_: server
   * - _complexity_: O(N) where N is the number of arguments to the command
   * - _since_: 2.8.13
   */
  command(subcommand: 'GETKEYS', callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  command(subcommand: 'HELP', callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Reset the stats returned by INFO
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 2.0.0
   */
  config(subcommand: 'RESETSTAT', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Rewrite the configuration file with the in memory configuration
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 2.8.0
   */
  config(subcommand: 'REWRITE', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  config(subcommand: 'HELP', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Get the values of configuration parameters
   * - _group_: server
   * - _complexity_: O(N) when N is the number of configuration parameters provided
   * - _since_: 2.0.0
   */
  config(...args: [subcommand: 'GET', ...parameters: (string | Buffer)[], callback: Callback<unknown>]): Result<unknown, Context>;
  config(...args: [subcommand: 'GET', ...parameters: (string | Buffer)[]]): Result<unknown, Context>;

  /**
   * Set configuration parameters to the given values
   * - _group_: server
   * - _complexity_: O(N) when N is the number of configuration parameters provided
   * - _since_: 2.0.0
   */
  config(...args: [subcommand: 'SET', ...parameterValues: (string | Buffer | number)[], callback: Callback<unknown>]): Result<unknown, Context>;
  config(...args: [subcommand: 'SET', ...parameterValues: (string | Buffer | number)[]]): Result<unknown, Context>;

  /**
   * Copy a key
   * - _group_: generic
   * - _complexity_: O(N) worst case for collections, where N is the number of nested items. O(1) for string values.
   * - _since_: 6.2.0
   */
  copy(source: RedisKey, destination: RedisKey, callback?: Callback<number>): Result<number, Context>;
  copy(source: RedisKey, destination: RedisKey, replace: 'REPLACE', callback?: Callback<number>): Result<number, Context>;
  copy(source: RedisKey, destination: RedisKey, destinationDbToken: 'DB', destinationDb: number | string, callback?: Callback<number>): Result<number, Context>;
  copy(source: RedisKey, destination: RedisKey, destinationDbToken: 'DB', destinationDb: number | string, replace: 'REPLACE', callback?: Callback<number>): Result<number, Context>;

  /**
   * Return the number of keys in the selected database
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  dbsize(callback?: Callback<number>): Result<number, Context>;

  /**
   * A container for debugging commands
   * - _group_: server
   * - _complexity_: Depends on subcommand.
   * - _since_: 1.0.0
   */
  debug(subcommand: string, callback?: Callback<unknown>): Result<unknown, Context>;
  debug(...args: [subcommand: string, ...args: (string | Buffer | number)[], callback: Callback<unknown>]): Result<unknown, Context>;
  debug(...args: [subcommand: string, ...args: (string | Buffer | number)[]]): Result<unknown, Context>;

  /**
   * Decrement the integer value of a key by one
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  decr(key: RedisKey, callback?: Callback<number>): Result<number, Context>;

  /**
   * Decrement the integer value of a key by the given number
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  decrby(key: RedisKey, decrement: number | string, callback?: Callback<number>): Result<number, Context>;

  /**
   * Delete a key
   * - _group_: generic
   * - _complexity_: O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash. Removing a single key that holds a string value is O(1).
   * - _since_: 1.0.0
   */
  del(...args: [...keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  del(...args: [keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  del(...args: [...keys: (RedisKey)[]]): Result<number, Context>;
  del(...args: [keys: (RedisKey)[]]): Result<number, Context>;

  /**
   * Discard all commands issued after MULTI
   * - _group_: transactions
   * - _complexity_: O(N), when N is the number of queued commands
   * - _since_: 2.0.0
   */
  discard(callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Return a serialized version of the value stored at the specified key.
   * - _group_: generic
   * - _complexity_: O(1) to access the key and additional O(N*M) to serialize it, where N is the number of Redis objects composing the value and M their average size. For small string values the time complexity is thus O(1)+O(1*M) where M is small, so simply O(1).
   * - _since_: 2.6.0
   */
  dump(key: RedisKey, callback?: Callback<string>): Result<string, Context>;
  dumpBuffer(key: RedisKey, callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Echo the given string
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  echo(message: string | Buffer, callback?: Callback<string>): Result<string, Context>;
  echoBuffer(message: string | Buffer, callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Execute a Lua script server side
   * - _group_: scripting
   * - _complexity_: Depends on the script that is executed.
   * - _since_: 2.6.0
   */
  eval(script: string | Buffer, numkeys: number | string, callback?: Callback<unknown>): Result<unknown, Context>;
  eval(...args: [script: string | Buffer, numkeys: number | string, ...args: (string | Buffer | number)[], callback: Callback<unknown>]): Result<unknown, Context>;
  eval(...args: [script: string | Buffer, numkeys: number | string, ...args: (string | Buffer | number)[]]): Result<unknown, Context>;
  eval(...args: [script: string | Buffer, numkeys: number | string, ...keys: (RedisKey)[], callback: Callback<unknown>]): Result<unknown, Context>;
  eval(...args: [script: string | Buffer, numkeys: number | string, keys: (RedisKey)[], callback: Callback<unknown>]): Result<unknown, Context>;
  eval(...args: [script: string | Buffer, numkeys: number | string, ...keys: (RedisKey)[]]): Result<unknown, Context>;
  eval(...args: [script: string | Buffer, numkeys: number | string, keys: (RedisKey)[]]): Result<unknown, Context>;
  eval(...args: [script: string | Buffer, numkeys: number | string, ...args: (RedisValue)[], callback: Callback<unknown>]): Result<unknown, Context>;
  eval(...args: [script: string | Buffer, numkeys: number | string, ...args: (RedisValue)[]]): Result<unknown, Context>;

  /**
   * Execute a Lua script server side
   * - _group_: scripting
   * - _complexity_: Depends on the script that is executed.
   * - _since_: 2.6.0
   */
  evalsha(sha1: string | Buffer, numkeys: number | string, callback?: Callback<unknown>): Result<unknown, Context>;
  evalsha(...args: [sha1: string | Buffer, numkeys: number | string, ...args: (string | Buffer | number)[], callback: Callback<unknown>]): Result<unknown, Context>;
  evalsha(...args: [sha1: string | Buffer, numkeys: number | string, ...args: (string | Buffer | number)[]]): Result<unknown, Context>;
  evalsha(...args: [sha1: string | Buffer, numkeys: number | string, ...keys: (RedisKey)[], callback: Callback<unknown>]): Result<unknown, Context>;
  evalsha(...args: [sha1: string | Buffer, numkeys: number | string, keys: (RedisKey)[], callback: Callback<unknown>]): Result<unknown, Context>;
  evalsha(...args: [sha1: string | Buffer, numkeys: number | string, ...keys: (RedisKey)[]]): Result<unknown, Context>;
  evalsha(...args: [sha1: string | Buffer, numkeys: number | string, keys: (RedisKey)[]]): Result<unknown, Context>;
  evalsha(...args: [sha1: string | Buffer, numkeys: number | string, ...args: (RedisValue)[], callback: Callback<unknown>]): Result<unknown, Context>;
  evalsha(...args: [sha1: string | Buffer, numkeys: number | string, ...args: (RedisValue)[]]): Result<unknown, Context>;

  /**
   * Execute all commands issued after MULTI
   * - _group_: transactions
   * - _complexity_: Depends on commands in the transaction
   * - _since_: 1.2.0
   */
  exec(callback?: Callback<[error: Error | null, result: unknown][] | null>): Promise<[error: Error | null, result: unknown][] | null>;

  /**
   * Determine if a key exists
   * - _group_: generic
   * - _complexity_: O(N) where N is the number of keys to check.
   * - _since_: 1.0.0
   */
  exists(...args: [...keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  exists(...args: [keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  exists(...args: [...keys: (RedisKey)[]]): Result<number, Context>;
  exists(...args: [keys: (RedisKey)[]]): Result<number, Context>;

  /**
   * Set a key's time to live in seconds
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  expire(key: RedisKey, seconds: number, callback?: Callback<number>): Result<number, Context>;
  expire(key: RedisKey, seconds: number, nx: 'NX', callback?: Callback<number>): Result<number, Context>;
  expire(key: RedisKey, seconds: number, xx: 'XX', callback?: Callback<number>): Result<number, Context>;
  expire(key: RedisKey, seconds: number, gt: 'GT', callback?: Callback<number>): Result<number, Context>;
  expire(key: RedisKey, seconds: number, lt: 'LT', callback?: Callback<number>): Result<number, Context>;

  /**
   * Set the expiration for a key as a UNIX timestamp
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 1.2.0
   */
  expireat(key: RedisKey, unixTimeSeconds: number, callback?: Callback<number>): Result<number, Context>;
  expireat(key: RedisKey, unixTimeSeconds: number, nx: 'NX', callback?: Callback<number>): Result<number, Context>;
  expireat(key: RedisKey, unixTimeSeconds: number, xx: 'XX', callback?: Callback<number>): Result<number, Context>;
  expireat(key: RedisKey, unixTimeSeconds: number, gt: 'GT', callback?: Callback<number>): Result<number, Context>;
  expireat(key: RedisKey, unixTimeSeconds: number, lt: 'LT', callback?: Callback<number>): Result<number, Context>;

  /**
   * Start a coordinated failover between this server and one of its replicas.
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 6.2.0
   */
  failover(callback?: Callback<'OK'>): Result<'OK', Context>;
  failover(millisecondsToken: 'TIMEOUT', milliseconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  failover(abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  failover(abort: 'ABORT', millisecondsToken: 'TIMEOUT', milliseconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  failover(targetToken: 'TO', host: string | Buffer, port: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;
  failover(targetToken: 'TO', host: string | Buffer, port: number | string, millisecondsToken: 'TIMEOUT', milliseconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  failover(targetToken: 'TO', host: string | Buffer, port: number | string, abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  failover(targetToken: 'TO', host: string | Buffer, port: number | string, abort: 'ABORT', millisecondsToken: 'TIMEOUT', milliseconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  failover(targetToken: 'TO', host: string | Buffer, port: number | string, force: 'FORCE', callback?: Callback<'OK'>): Result<'OK', Context>;
  failover(targetToken: 'TO', host: string | Buffer, port: number | string, force: 'FORCE', millisecondsToken: 'TIMEOUT', milliseconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  failover(targetToken: 'TO', host: string | Buffer, port: number | string, force: 'FORCE', abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  failover(targetToken: 'TO', host: string | Buffer, port: number | string, force: 'FORCE', abort: 'ABORT', millisecondsToken: 'TIMEOUT', milliseconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Remove all keys from all databases
   * - _group_: server
   * - _complexity_: O(N) where N is the total number of keys in all databases
   * - _since_: 1.0.0
   */
  flushall(callback?: Callback<'OK'>): Result<'OK', Context>;
  flushall(async: 'ASYNC', callback?: Callback<'OK'>): Result<'OK', Context>;
  flushall(sync: 'SYNC', callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Remove all keys from the current database
   * - _group_: server
   * - _complexity_: O(N) where N is the number of keys in the selected database
   * - _since_: 1.0.0
   */
  flushdb(callback?: Callback<'OK'>): Result<'OK', Context>;
  flushdb(async: 'ASYNC', callback?: Callback<'OK'>): Result<'OK', Context>;
  flushdb(sync: 'SYNC', callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Add one or more geospatial items in the geospatial index represented using a sorted set
   * - _group_: geo
   * - _complexity_: O(log(N)) for each item added, where N is the number of elements in the sorted set.
   * - _since_: 3.2.0
   */
  geoadd(...args: [key: RedisKey, ...longitudeLatitudeMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  geoadd(...args: [key: RedisKey, ...longitudeLatitudeMembers: (string | Buffer | number)[]]): Result<number, Context>;
  geoadd(...args: [key: RedisKey, ch: 'CH', ...longitudeLatitudeMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  geoadd(...args: [key: RedisKey, ch: 'CH', ...longitudeLatitudeMembers: (string | Buffer | number)[]]): Result<number, Context>;
  geoadd(...args: [key: RedisKey, nx: 'NX', ...longitudeLatitudeMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  geoadd(...args: [key: RedisKey, nx: 'NX', ...longitudeLatitudeMembers: (string | Buffer | number)[]]): Result<number, Context>;
  geoadd(...args: [key: RedisKey, nx: 'NX', ch: 'CH', ...longitudeLatitudeMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  geoadd(...args: [key: RedisKey, nx: 'NX', ch: 'CH', ...longitudeLatitudeMembers: (string | Buffer | number)[]]): Result<number, Context>;
  geoadd(...args: [key: RedisKey, xx: 'XX', ...longitudeLatitudeMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  geoadd(...args: [key: RedisKey, xx: 'XX', ...longitudeLatitudeMembers: (string | Buffer | number)[]]): Result<number, Context>;
  geoadd(...args: [key: RedisKey, xx: 'XX', ch: 'CH', ...longitudeLatitudeMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  geoadd(...args: [key: RedisKey, xx: 'XX', ch: 'CH', ...longitudeLatitudeMembers: (string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Returns the distance between two members of a geospatial index
   * - _group_: geo
   * - _complexity_: O(log(N))
   * - _since_: 3.2.0
   */
  geodist(key: RedisKey, member1: string | Buffer | number, member2: string | Buffer | number, callback?: Callback<string | null>): Result<string | null, Context>;
  geodistBuffer(key: RedisKey, member1: string | Buffer | number, member2: string | Buffer | number, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  geodist(key: RedisKey, member1: string | Buffer | number, member2: string | Buffer | number, m: 'M', callback?: Callback<string | null>): Result<string | null, Context>;
  geodistBuffer(key: RedisKey, member1: string | Buffer | number, member2: string | Buffer | number, m: 'M', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  geodist(key: RedisKey, member1: string | Buffer | number, member2: string | Buffer | number, km: 'KM', callback?: Callback<string | null>): Result<string | null, Context>;
  geodistBuffer(key: RedisKey, member1: string | Buffer | number, member2: string | Buffer | number, km: 'KM', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  geodist(key: RedisKey, member1: string | Buffer | number, member2: string | Buffer | number, ft: 'FT', callback?: Callback<string | null>): Result<string | null, Context>;
  geodistBuffer(key: RedisKey, member1: string | Buffer | number, member2: string | Buffer | number, ft: 'FT', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  geodist(key: RedisKey, member1: string | Buffer | number, member2: string | Buffer | number, mi: 'MI', callback?: Callback<string | null>): Result<string | null, Context>;
  geodistBuffer(key: RedisKey, member1: string | Buffer | number, member2: string | Buffer | number, mi: 'MI', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Returns members of a geospatial index as standard geohash strings
   * - _group_: geo
   * - _complexity_: O(log(N)) for each member requested, where N is the number of elements in the sorted set.
   * - _since_: 3.2.0
   */
  geohash(...args: [key: RedisKey, ...members: (string | Buffer | number)[], callback: Callback<string[]>]): Result<string[], Context>;
  geohashBuffer(...args: [key: RedisKey, ...members: (string | Buffer | number)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  geohash(...args: [key: RedisKey, members: (string | Buffer | number)[], callback: Callback<string[]>]): Result<string[], Context>;
  geohashBuffer(...args: [key: RedisKey, members: (string | Buffer | number)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  geohash(...args: [key: RedisKey, ...members: (string | Buffer | number)[]]): Result<string[], Context>;
  geohashBuffer(...args: [key: RedisKey, ...members: (string | Buffer | number)[]]): Result<Buffer[], Context>;
  geohash(...args: [key: RedisKey, members: (string | Buffer | number)[]]): Result<string[], Context>;
  geohashBuffer(...args: [key: RedisKey, members: (string | Buffer | number)[]]): Result<Buffer[], Context>;

  /**
   * Returns longitude and latitude of members of a geospatial index
   * - _group_: geo
   * - _complexity_: O(N) where N is the number of members requested.
   * - _since_: 3.2.0
   */
  geopos(...args: [key: RedisKey, ...members: (string | Buffer | number)[], callback: Callback<unknown[] | null>]): Result<unknown[] | null, Context>;
  geopos(...args: [key: RedisKey, members: (string | Buffer | number)[], callback: Callback<unknown[] | null>]): Result<unknown[] | null, Context>;
  geopos(...args: [key: RedisKey, ...members: (string | Buffer | number)[]]): Result<unknown[] | null, Context>;
  geopos(...args: [key: RedisKey, members: (string | Buffer | number)[]]): Result<unknown[] | null, Context>;

  /**
   * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point
   * - _group_: geo
   * - _complexity_: O(N+log(M)) where N is the number of elements inside the bounding box of the circular area delimited by center and radius and M is the number of items inside the index.
   * - _since_: 3.2.0
   */
  georadius(...args: [key: RedisKey, longitude: number | string, latitude: number | string, radius: number | string, ...args: (RedisValue)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  georadius(...args: [key: RedisKey, longitude: number | string, latitude: number | string, radius: number | string, ...args: (RedisValue)[]]): Result<unknown[], Context>;

  /**
   * A read-only variant for GEORADIUS
   * - _group_: geo
   * - _complexity_: O(N+log(M)) where N is the number of elements inside the bounding box of the circular area delimited by center and radius and M is the number of items inside the index.
   * - _since_: 3.2.10
   */
  georadius_ro(...args: [key: RedisKey, longitude: number | string, latitude: number | string, radius: number | string, ...args: (RedisValue)[], callback: Callback<unknown>]): Result<unknown, Context>;
  georadius_ro(...args: [key: RedisKey, longitude: number | string, latitude: number | string, radius: number | string, ...args: (RedisValue)[]]): Result<unknown, Context>;

  /**
   * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member
   * - _group_: geo
   * - _complexity_: O(N+log(M)) where N is the number of elements inside the bounding box of the circular area delimited by center and radius and M is the number of items inside the index.
   * - _since_: 3.2.0
   */
  georadiusbymember(...args: [key: RedisKey, member: string | Buffer | number, radius: number | string, ...args: (RedisValue)[], callback: Callback<unknown>]): Result<unknown, Context>;
  georadiusbymember(...args: [key: RedisKey, member: string | Buffer | number, radius: number | string, ...args: (RedisValue)[]]): Result<unknown, Context>;

  /**
   * A read-only variant for GEORADIUSBYMEMBER
   * - _group_: geo
   * - _complexity_: O(N+log(M)) where N is the number of elements inside the bounding box of the circular area delimited by center and radius and M is the number of items inside the index.
   * - _since_: 3.2.10
   */
  georadiusbymember_ro(...args: [key: RedisKey, member: string | Buffer | number, radius: number | string, ...args: (RedisValue)[], callback: Callback<unknown>]): Result<unknown, Context>;
  georadiusbymember_ro(...args: [key: RedisKey, member: string | Buffer | number, radius: number | string, ...args: (RedisValue)[]]): Result<unknown, Context>;

  /**
   * Query a sorted set representing a geospatial index to fetch members inside an area of a box or a circle.
   * - _group_: geo
   * - _complexity_: O(N+log(M)) where N is the number of elements in the grid-aligned bounding box area around the shape provided as the filter and M is the number of items inside the shape
   * - _since_: 6.2.0
   */
  geosearch(...args: [key: RedisKey, ...args: (RedisValue)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  geosearch(...args: [key: RedisKey, ...args: (RedisValue)[]]): Result<unknown[], Context>;

  /**
   * Query a sorted set representing a geospatial index to fetch members inside an area of a box or a circle, and store the result in another key.
   * - _group_: geo
   * - _complexity_: O(N+log(M)) where N is the number of elements in the grid-aligned bounding box area around the shape provided as the filter and M is the number of items inside the shape
   * - _since_: 6.2.0
   */
  geosearchstore(...args: [destination: RedisKey, source: RedisKey, ...args: (RedisValue)[], callback: Callback<number>]): Result<number, Context>;
  geosearchstore(...args: [destination: RedisKey, source: RedisKey, ...args: (RedisValue)[]]): Result<number, Context>;

  /**
   * Get the value of a key
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  get(key: RedisKey, callback?: Callback<string | null>): Result<string | null, Context>;
  getBuffer(key: RedisKey, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Returns the bit value at offset in the string value stored at key
   * - _group_: bitmap
   * - _complexity_: O(1)
   * - _since_: 2.2.0
   */
  getbit(key: RedisKey, offset: number | string, callback?: Callback<number>): Result<number, Context>;

  /**
   * Get the value of a key and delete the key
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 6.2.0
   */
  getdel(key: RedisKey, callback?: Callback<string | null>): Result<string | null, Context>;
  getdelBuffer(key: RedisKey, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Get the value of a key and optionally set its expiration
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 6.2.0
   */
  getex(key: RedisKey, callback?: Callback<string | null>): Result<string | null, Context>;
  getexBuffer(key: RedisKey, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  getex(key: RedisKey, secondsToken: 'EX', seconds: number, callback?: Callback<string | null>): Result<string | null, Context>;
  getexBuffer(key: RedisKey, secondsToken: 'EX', seconds: number, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  getex(key: RedisKey, millisecondsToken: 'PX', milliseconds: number, callback?: Callback<string | null>): Result<string | null, Context>;
  getexBuffer(key: RedisKey, millisecondsToken: 'PX', milliseconds: number, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  getex(key: RedisKey, unixTimeSecondsToken: 'EXAT', unixTimeSeconds: number, callback?: Callback<string | null>): Result<string | null, Context>;
  getexBuffer(key: RedisKey, unixTimeSecondsToken: 'EXAT', unixTimeSeconds: number, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  getex(key: RedisKey, unixTimeMillisecondsToken: 'PXAT', unixTimeMilliseconds: number, callback?: Callback<string | null>): Result<string | null, Context>;
  getexBuffer(key: RedisKey, unixTimeMillisecondsToken: 'PXAT', unixTimeMilliseconds: number, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  getex(key: RedisKey, persist: 'PERSIST', callback?: Callback<string | null>): Result<string | null, Context>;
  getexBuffer(key: RedisKey, persist: 'PERSIST', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Get a substring of the string stored at a key
   * - _group_: string
   * - _complexity_: O(N) where N is the length of the returned string. The complexity is ultimately determined by the returned length, but because creating a substring from an existing string is very cheap, it can be considered O(1) for small strings.
   * - _since_: 2.4.0
   */
  getrange(key: RedisKey, start: number, end: number, callback?: Callback<string>): Result<string, Context>;
  getrangeBuffer(key: RedisKey, start: number, end: number, callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Set the string value of a key and return its old value
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  getset(key: RedisKey, value: string | Buffer | number, callback?: Callback<string | null>): Result<string | null, Context>;
  getsetBuffer(key: RedisKey, value: string | Buffer | number, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Delete one or more hash fields
   * - _group_: hash
   * - _complexity_: O(N) where N is the number of fields to be removed.
   * - _since_: 2.0.0
   */
  hdel(...args: [key: RedisKey, ...fields: (string | Buffer)[], callback: Callback<number>]): Result<number, Context>;
  hdel(...args: [key: RedisKey, ...fields: (string | Buffer)[]]): Result<number, Context>;

  /**
   * Handshake with Redis
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 6.0.0
   */
  hello(callback?: Callback<unknown[]>): Result<unknown[], Context>;
  hello(protover: number | string, callback?: Callback<unknown[]>): Result<unknown[], Context>;
  hello(protover: number | string, clientnameToken: 'SETNAME', clientname: string | Buffer, callback?: Callback<unknown[]>): Result<unknown[], Context>;
  hello(protover: number | string, usernamePasswordToken: 'AUTH', username: string | Buffer, password: string | Buffer, callback?: Callback<unknown[]>): Result<unknown[], Context>;
  hello(protover: number | string, usernamePasswordToken: 'AUTH', username: string | Buffer, password: string | Buffer, clientnameToken: 'SETNAME', clientname: string | Buffer, callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Determine if a hash field exists
   * - _group_: hash
   * - _complexity_: O(1)
   * - _since_: 2.0.0
   */
  hexists(key: RedisKey, field: string | Buffer, callback?: Callback<number>): Result<number, Context>;

  /**
   * Get the value of a hash field
   * - _group_: hash
   * - _complexity_: O(1)
   * - _since_: 2.0.0
   */
  hget(key: RedisKey, field: string | Buffer, callback?: Callback<string | null>): Result<string | null, Context>;
  hgetBuffer(key: RedisKey, field: string | Buffer, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Get all the fields and values in a hash
   * - _group_: hash
   * - _complexity_: O(N) where N is the size of the hash.
   * - _since_: 2.0.0
   */
  hgetall(key: RedisKey, callback?: Callback<Record<string, string>>): Result<Record<string, string>, Context>
  hgetallBuffer(key: RedisKey, callback?: Callback<[field: Buffer, value: Buffer][]>): Result<[field: Buffer, value: Buffer][], Context>

  /**
   * Increment the integer value of a hash field by the given number
   * - _group_: hash
   * - _complexity_: O(1)
   * - _since_: 2.0.0
   */
  hincrby(key: RedisKey, field: string | Buffer, increment: number | string, callback?: Callback<number>): Result<number, Context>;

  /**
   * Increment the float value of a hash field by the given amount
   * - _group_: hash
   * - _complexity_: O(1)
   * - _since_: 2.6.0
   */
  hincrbyfloat(key: RedisKey, field: string | Buffer, increment: number | string, callback?: Callback<string>): Result<string, Context>;
  hincrbyfloatBuffer(key: RedisKey, field: string | Buffer, increment: number | string, callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Get all the fields in a hash
   * - _group_: hash
   * - _complexity_: O(N) where N is the size of the hash.
   * - _since_: 2.0.0
   */
  hkeys(key: RedisKey, callback?: Callback<string[]>): Result<string[], Context>;
  hkeysBuffer(key: RedisKey, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Get the number of fields in a hash
   * - _group_: hash
   * - _complexity_: O(1)
   * - _since_: 2.0.0
   */
  hlen(key: RedisKey, callback?: Callback<number>): Result<number, Context>;

  /**
   * Get the values of all the given hash fields
   * - _group_: hash
   * - _complexity_: O(N) where N is the number of fields being requested.
   * - _since_: 2.0.0
   */
  hmget(...args: [key: RedisKey, ...fields: (string | Buffer)[], callback: Callback<(string | null)[]>]): Result<(string | null)[], Context>;
  hmgetBuffer(...args: [key: RedisKey, ...fields: (string | Buffer)[], callback: Callback<(Buffer | null)[]>]): Result<(Buffer | null)[], Context>;
  hmget(...args: [key: RedisKey, ...fields: (string | Buffer)[]]): Result<(string | null)[], Context>;
  hmgetBuffer(...args: [key: RedisKey, ...fields: (string | Buffer)[]]): Result<(Buffer | null)[], Context>;

  /**
   * Set multiple hash fields to multiple values
   * - _group_: hash
   * - _complexity_: O(N) where N is the number of fields being set.
   * - _since_: 2.0.0
   */
  hmset(key: RedisKey, object: Record<string, string | Buffer | number>, callback?: Callback<'OK'>): Result<'OK', Context>
  hmset(key: RedisKey, map: Map<string | Buffer | number, string | Buffer | number>, callback?: Callback<'OK'>): Result<'OK', Context>
  hmset(...args: [key: RedisKey, ...fieldValues: (string | Buffer | number)[], callback: Callback<'OK'>]): Result<'OK', Context>;
  hmset(...args: [key: RedisKey, ...fieldValues: (string | Buffer | number)[]]): Result<'OK', Context>;

  /**
   * Get one or multiple random fields from a hash
   * - _group_: hash
   * - _complexity_: O(N) where N is the number of fields returned
   * - _since_: 6.2.0
   */
  hrandfield(key: RedisKey, callback?: Callback<string | unknown[] | null>): Result<string | unknown[] | null, Context>;
  hrandfieldBuffer(key: RedisKey, callback?: Callback<Buffer | unknown[] | null>): Result<Buffer | unknown[] | null, Context>;
  hrandfield(key: RedisKey, count: number, callback?: Callback<string | unknown[] | null>): Result<string | unknown[] | null, Context>;
  hrandfieldBuffer(key: RedisKey, count: number, callback?: Callback<Buffer | unknown[] | null>): Result<Buffer | unknown[] | null, Context>;
  hrandfield(key: RedisKey, count: number, withvalues: 'WITHVALUES', callback?: Callback<string | unknown[] | null>): Result<string | unknown[] | null, Context>;
  hrandfieldBuffer(key: RedisKey, count: number, withvalues: 'WITHVALUES', callback?: Callback<Buffer | unknown[] | null>): Result<Buffer | unknown[] | null, Context>;

  /**
   * Incrementally iterate hash fields and associated values
   * - _group_: hash
   * - _complexity_: O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection..
   * - _since_: 2.8.0
   */
  hscan(key: RedisKey, cursor: number | string, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  hscanBuffer(key: RedisKey, cursor: number | string, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  hscan(key: RedisKey, cursor: number | string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  hscanBuffer(key: RedisKey, cursor: number | string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  hscan(key: RedisKey, cursor: number | string, patternToken: 'MATCH', pattern: string, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  hscanBuffer(key: RedisKey, cursor: number | string, patternToken: 'MATCH', pattern: string, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  hscan(key: RedisKey, cursor: number | string, patternToken: 'MATCH', pattern: string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  hscanBuffer(key: RedisKey, cursor: number | string, patternToken: 'MATCH', pattern: string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;

  /**
   * Set the string value of a hash field
   * - _group_: hash
   * - _complexity_: O(1) for each field/value pair added, so O(N) to add N field/value pairs when the command is called with multiple field/value pairs.
   * - _since_: 2.0.0
   */
  hset(key: RedisKey, object: Record<string, string | Buffer | number>, callback?: Callback<number>): Result<number, Context>
  hset(key: RedisKey, map: Map<string | Buffer | number, string | Buffer | number>, callback?: Callback<number>): Result<number, Context>
  hset(...args: [key: RedisKey, ...fieldValues: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  hset(...args: [key: RedisKey, ...fieldValues: (string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Set the value of a hash field, only if the field does not exist
   * - _group_: hash
   * - _complexity_: O(1)
   * - _since_: 2.0.0
   */
  hsetnx(key: RedisKey, field: string | Buffer, value: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Get the length of the value of a hash field
   * - _group_: hash
   * - _complexity_: O(1)
   * - _since_: 3.2.0
   */
  hstrlen(key: RedisKey, field: string | Buffer, callback?: Callback<number>): Result<number, Context>;

  /**
   * Get all the values in a hash
   * - _group_: hash
   * - _complexity_: O(N) where N is the size of the hash.
   * - _since_: 2.0.0
   */
  hvals(key: RedisKey, callback?: Callback<string[]>): Result<string[], Context>;
  hvalsBuffer(key: RedisKey, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Increment the integer value of a key by one
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  incr(key: RedisKey, callback?: Callback<number>): Result<number, Context>;

  /**
   * Increment the integer value of a key by the given amount
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  incrby(key: RedisKey, increment: number | string, callback?: Callback<number>): Result<number, Context>;

  /**
   * Increment the float value of a key by the given amount
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 2.6.0
   */
  incrbyfloat(key: RedisKey, increment: number | string, callback?: Callback<string>): Result<string, Context>;

  /**
   * Get information and statistics about the server
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  info(callback?: Callback<string>): Result<string, Context>;
  info(section: string | Buffer, callback?: Callback<string>): Result<string, Context>;

  /**
   * Find all keys matching the given pattern
   * - _group_: generic
   * - _complexity_: O(N) with N being the number of keys in the database, under the assumption that the key names in the database and the given pattern have limited length.
   * - _since_: 1.0.0
   */
  keys(pattern: string, callback?: Callback<string[]>): Result<string[], Context>;
  keysBuffer(pattern: string, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Get the UNIX time stamp of the last successful save to disk
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  lastsave(callback?: Callback<number>): Result<number, Context>;

  /**
   * Show helpful text about the different subcommands.
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 2.8.13
   */
  latency(subcommand: 'HELP', callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Return a latency graph for the event.
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 2.8.13
   */
  latency(subcommand: 'GRAPH', event: string | Buffer, callback?: Callback<string>): Result<string, Context>;

  /**
   * Return a human readable latency analysis report.
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 2.8.13
   */
  latency(subcommand: 'DOCTOR', callback?: Callback<string>): Result<string, Context>;

  /**
   * Return the cumulative distribution of latencies of a subset of commands or all.
   * - _group_: server
   * - _complexity_: O(N) where N is the number of commands with latency information being retrieved.
   * - _since_: 7.0.0
   */
  latency(subcommand: 'HISTOGRAM', callback?: Callback<unknown>): Result<unknown, Context>;
  latency(...args: [subcommand: 'HISTOGRAM', ...commands: (string | Buffer)[], callback: Callback<unknown>]): Result<unknown, Context>;
  latency(...args: [subcommand: 'HISTOGRAM', ...commands: (string | Buffer)[]]): Result<unknown, Context>;

  /**
   * Return the latest latency samples for all events.
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 2.8.13
   */
  latency(subcommand: 'LATEST', callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Return timestamp-latency samples for the event.
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 2.8.13
   */
  latency(subcommand: 'HISTORY', event: string | Buffer, callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Reset latency data for one or more events.
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 2.8.13
   */
  latency(subcommand: 'RESET', callback?: Callback<number>): Result<number, Context>;
  latency(...args: [subcommand: 'RESET', ...events: (string | Buffer)[], callback: Callback<number>]): Result<number, Context>;
  latency(...args: [subcommand: 'RESET', ...events: (string | Buffer)[]]): Result<number, Context>;

  /**
   * Get an element from a list by its index
   * - _group_: list
   * - _complexity_: O(N) where N is the number of elements to traverse to get to the element at index. This makes asking for the first or the last element of the list O(1).
   * - _since_: 1.0.0
   */
  lindex(key: RedisKey, index: number, callback?: Callback<string | null>): Result<string | null, Context>;
  lindexBuffer(key: RedisKey, index: number, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Insert an element before or after another element in a list
   * - _group_: list
   * - _complexity_: O(N) where N is the number of elements to traverse before seeing the value pivot. This means that inserting somewhere on the left end on the list (head) can be considered O(1) and inserting somewhere on the right end (tail) is O(N).
   * - _since_: 2.2.0
   */
  linsert(key: RedisKey, before: 'BEFORE', pivot: string | Buffer | number, element: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;
  linsert(key: RedisKey, after: 'AFTER', pivot: string | Buffer | number, element: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Get the length of a list
   * - _group_: list
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  llen(key: RedisKey, callback?: Callback<number>): Result<number, Context>;

  /**
   * Pop an element from a list, push it to another list and return it
   * - _group_: list
   * - _complexity_: O(1)
   * - _since_: 6.2.0
   */
  lmove(source: RedisKey, destination: RedisKey, left: 'LEFT', left1: 'LEFT', callback?: Callback<string>): Result<string, Context>;
  lmoveBuffer(source: RedisKey, destination: RedisKey, left: 'LEFT', left1: 'LEFT', callback?: Callback<Buffer>): Result<Buffer, Context>;
  lmove(source: RedisKey, destination: RedisKey, left: 'LEFT', right: 'RIGHT', callback?: Callback<string>): Result<string, Context>;
  lmoveBuffer(source: RedisKey, destination: RedisKey, left: 'LEFT', right: 'RIGHT', callback?: Callback<Buffer>): Result<Buffer, Context>;
  lmove(source: RedisKey, destination: RedisKey, right: 'RIGHT', left: 'LEFT', callback?: Callback<string>): Result<string, Context>;
  lmoveBuffer(source: RedisKey, destination: RedisKey, right: 'RIGHT', left: 'LEFT', callback?: Callback<Buffer>): Result<Buffer, Context>;
  lmove(source: RedisKey, destination: RedisKey, right: 'RIGHT', right1: 'RIGHT', callback?: Callback<string>): Result<string, Context>;
  lmoveBuffer(source: RedisKey, destination: RedisKey, right: 'RIGHT', right1: 'RIGHT', callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Display some computer art and the Redis version
   * - _group_: server
   * - _complexity_: undefined
   * - _since_: 5.0.0
   */
  lolwut(callback?: Callback<string>): Result<string, Context>;
  lolwut(versionToken: 'VERSION', version: number | string, callback?: Callback<string>): Result<string, Context>;

  /**
   * Remove and get the first elements in a list
   * - _group_: list
   * - _complexity_: O(N) where N is the number of elements returned
   * - _since_: 1.0.0
   */
  lpop(key: RedisKey, callback?: Callback<string | null>): Result<string | null, Context>;
  lpopBuffer(key: RedisKey, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  lpop(key: RedisKey, count: number, callback?: Callback<string[] | null>): Result<string[] | null, Context>;
  lpopBuffer(key: RedisKey, count: number, callback?: Callback<Buffer[] | null>): Result<Buffer[] | null, Context>;

  /**
   * Return the index of matching elements on a list
   * - _group_: list
   * - _complexity_: O(N) where N is the number of elements in the list, for the average case. When searching for elements near the head or the tail of the list, or when the MAXLEN option is provided, the command may run in constant time.
   * - _since_: 6.0.6
   */
  lpos(key: RedisKey, element: string | Buffer | number, callback?: Callback<number | null>): Result<number | null, Context>;
  lpos(key: RedisKey, element: string | Buffer | number, lenToken: 'MAXLEN', len: number | string, callback?: Callback<number | null>): Result<number | null, Context>;
  lpos(key: RedisKey, element: string | Buffer | number, numMatchesToken: 'COUNT', numMatches: number | string, callback?: Callback<number[]>): Result<number[], Context>;
  lpos(key: RedisKey, element: string | Buffer | number, numMatchesToken: 'COUNT', numMatches: number | string, lenToken: 'MAXLEN', len: number | string, callback?: Callback<number[]>): Result<number[], Context>;
  lpos(key: RedisKey, element: string | Buffer | number, rankToken: 'RANK', rank: number | string, callback?: Callback<number | null>): Result<number | null, Context>;
  lpos(key: RedisKey, element: string | Buffer | number, rankToken: 'RANK', rank: number | string, lenToken: 'MAXLEN', len: number | string, callback?: Callback<number | null>): Result<number | null, Context>;
  lpos(key: RedisKey, element: string | Buffer | number, rankToken: 'RANK', rank: number | string, numMatchesToken: 'COUNT', numMatches: number | string, callback?: Callback<number[]>): Result<number[], Context>;
  lpos(key: RedisKey, element: string | Buffer | number, rankToken: 'RANK', rank: number | string, numMatchesToken: 'COUNT', numMatches: number | string, lenToken: 'MAXLEN', len: number | string, callback?: Callback<number[]>): Result<number[], Context>;

  /**
   * Prepend one or multiple elements to a list
   * - _group_: list
   * - _complexity_: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
   * - _since_: 1.0.0
   */
  lpush(...args: [key: RedisKey, ...elements: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  lpush(...args: [key: RedisKey, ...elements: (string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Prepend an element to a list, only if the list exists
   * - _group_: list
   * - _complexity_: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
   * - _since_: 2.2.0
   */
  lpushx(...args: [key: RedisKey, ...elements: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  lpushx(...args: [key: RedisKey, ...elements: (string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Get a range of elements from a list
   * - _group_: list
   * - _complexity_: O(S+N) where S is the distance of start offset from HEAD for small lists, from nearest end (HEAD or TAIL) for large lists; and N is the number of elements in the specified range.
   * - _since_: 1.0.0
   */
  lrange(key: RedisKey, start: number, stop: number, callback?: Callback<string[]>): Result<string[], Context>;
  lrangeBuffer(key: RedisKey, start: number, stop: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Remove elements from a list
   * - _group_: list
   * - _complexity_: O(N+M) where N is the length of the list and M is the number of elements removed.
   * - _since_: 1.0.0
   */
  lrem(key: RedisKey, count: number, element: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Set the value of an element in a list by its index
   * - _group_: list
   * - _complexity_: O(N) where N is the length of the list. Setting either the first or the last element of the list is O(1).
   * - _since_: 1.0.0
   */
  lset(key: RedisKey, index: number, element: string | Buffer | number, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Trim a list to the specified range
   * - _group_: list
   * - _complexity_: O(N) where N is the number of elements to be removed by the operation.
   * - _since_: 1.0.0
   */
  ltrim(key: RedisKey, start: number, stop: number, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Show allocator internal stats
   * - _group_: server
   * - _complexity_: Depends on how much memory is allocated, could be slow
   * - _since_: 4.0.0
   */
  memory(subcommand: 'MALLOC-STATS', callback?: Callback<string>): Result<string, Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 4.0.0
   */
  memory(subcommand: 'HELP', callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Estimate the memory usage of a key
   * - _group_: server
   * - _complexity_: O(N) where N is the number of samples.
   * - _since_: 4.0.0
   */
  memory(subcommand: 'USAGE', key: RedisKey, callback?: Callback<number | null>): Result<number | null, Context>;
  memory(subcommand: 'USAGE', key: RedisKey, countToken: 'SAMPLES', count: number, callback?: Callback<number | null>): Result<number | null, Context>;

  /**
   * Show memory usage details
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 4.0.0
   */
  memory(subcommand: 'STATS', callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Outputs memory problems report
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 4.0.0
   */
  memory(subcommand: 'DOCTOR', callback?: Callback<string>): Result<string, Context>;

  /**
   * Ask the allocator to release memory
   * - _group_: server
   * - _complexity_: Depends on how much memory is allocated, could be slow
   * - _since_: 4.0.0
   */
  memory(subcommand: 'PURGE', callback?: Callback<"OK">): Result<"OK", Context>;

  /**
   * Get the values of all the given keys
   * - _group_: string
   * - _complexity_: O(N) where N is the number of keys to retrieve.
   * - _since_: 1.0.0
   */
  mget(...args: [...keys: (RedisKey)[], callback: Callback<(string | null)[]>]): Result<(string | null)[], Context>;
  mgetBuffer(...args: [...keys: (RedisKey)[], callback: Callback<(Buffer | null)[]>]): Result<(Buffer | null)[], Context>;
  mget(...args: [keys: (RedisKey)[], callback: Callback<(string | null)[]>]): Result<(string | null)[], Context>;
  mgetBuffer(...args: [keys: (RedisKey)[], callback: Callback<(Buffer | null)[]>]): Result<(Buffer | null)[], Context>;
  mget(...args: [...keys: (RedisKey)[]]): Result<(string | null)[], Context>;
  mgetBuffer(...args: [...keys: (RedisKey)[]]): Result<(Buffer | null)[], Context>;
  mget(...args: [keys: (RedisKey)[]]): Result<(string | null)[], Context>;
  mgetBuffer(...args: [keys: (RedisKey)[]]): Result<(Buffer | null)[], Context>;

  /**
   * Atomically transfer a key from a Redis instance to another one.
   * - _group_: generic
   * - _complexity_: This command actually executes a DUMP+DEL in the source instance, and a RESTORE in the target instance. See the pages of these commands for time complexity. Also an O(N) data transfer between the two instances is performed.
   * - _since_: 2.6.0
   */
  migrate(...args: [host: string | Buffer, port: string | Buffer, ...args: (RedisValue)[], callback: Callback<'OK'>]): Result<'OK', Context>;
  migrate(...args: [host: string | Buffer, port: string | Buffer, ...args: (RedisValue)[]]): Result<'OK', Context>;

  /**
   * List all modules loaded by the server
   * - _group_: server
   * - _complexity_: O(N) where N is the number of loaded modules.
   * - _since_: 4.0.0
   */
  module(subcommand: 'LIST', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Unload a module
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 4.0.0
   */
  module(subcommand: 'UNLOAD', name: string | Buffer, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Load a module
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 4.0.0
   */
  module(subcommand: 'LOAD', path: string | Buffer, callback?: Callback<unknown>): Result<unknown, Context>;
  module(...args: [subcommand: 'LOAD', path: string | Buffer, ...args: (string | Buffer | number)[], callback: Callback<unknown>]): Result<unknown, Context>;
  module(...args: [subcommand: 'LOAD', path: string | Buffer, ...args: (string | Buffer | number)[]]): Result<unknown, Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  module(subcommand: 'HELP', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Move a key to another database
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  move(key: RedisKey, db: number | string, callback?: Callback<number>): Result<number, Context>;

  /**
   * Set multiple keys to multiple values
   * - _group_: string
   * - _complexity_: O(N) where N is the number of keys to set.
   * - _since_: 1.0.1
   */
  mset(object: Record<string, string | Buffer | number>, callback?: Callback<'OK'>): Result<'OK', Context>
  mset(map: Map<string | Buffer | number, string | Buffer | number>, callback?: Callback<'OK'>): Result<'OK', Context>
  mset(...args: [...keyValues: (RedisKey | string | Buffer | number)[], callback: Callback<'OK'>]): Result<'OK', Context>;
  mset(...args: [...keyValues: (RedisKey | string | Buffer | number)[]]): Result<'OK', Context>;

  /**
   * Set multiple keys to multiple values, only if none of the keys exist
   * - _group_: string
   * - _complexity_: O(N) where N is the number of keys to set.
   * - _since_: 1.0.1
   */
  msetnx(object: Record<string, string | Buffer | number>, callback?: Callback<'OK'>): Result<'OK', Context>
  msetnx(map: Map<string | Buffer | number, string | Buffer | number>, callback?: Callback<'OK'>): Result<'OK', Context>
  msetnx(...args: [...keyValues: (RedisKey | string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  msetnx(...args: [...keyValues: (RedisKey | string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Get the logarithmic access frequency counter of a Redis object
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 4.0.0
   */
  object(subcommand: 'FREQ', key: RedisKey, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Get the time since a Redis object was last accessed
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 2.2.3
   */
  object(subcommand: 'IDLETIME', key: RedisKey, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 6.2.0
   */
  object(subcommand: 'HELP', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Inspect the internal encoding of a Redis object
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 2.2.3
   */
  object(subcommand: 'ENCODING', key: RedisKey, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Get the number of references to the value of the key
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 2.2.3
   */
  object(subcommand: 'REFCOUNT', key: RedisKey, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Remove the expiration from a key
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 2.2.0
   */
  persist(key: RedisKey, callback?: Callback<number>): Result<number, Context>;

  /**
   * Set a key's time to live in milliseconds
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 2.6.0
   */
  pexpire(key: RedisKey, milliseconds: number, callback?: Callback<number>): Result<number, Context>;
  pexpire(key: RedisKey, milliseconds: number, nx: 'NX', callback?: Callback<number>): Result<number, Context>;
  pexpire(key: RedisKey, milliseconds: number, xx: 'XX', callback?: Callback<number>): Result<number, Context>;
  pexpire(key: RedisKey, milliseconds: number, gt: 'GT', callback?: Callback<number>): Result<number, Context>;
  pexpire(key: RedisKey, milliseconds: number, lt: 'LT', callback?: Callback<number>): Result<number, Context>;

  /**
   * Set the expiration for a key as a UNIX timestamp specified in milliseconds
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 2.6.0
   */
  pexpireat(key: RedisKey, unixTimeMilliseconds: number, callback?: Callback<number>): Result<number, Context>;
  pexpireat(key: RedisKey, unixTimeMilliseconds: number, nx: 'NX', callback?: Callback<number>): Result<number, Context>;
  pexpireat(key: RedisKey, unixTimeMilliseconds: number, xx: 'XX', callback?: Callback<number>): Result<number, Context>;
  pexpireat(key: RedisKey, unixTimeMilliseconds: number, gt: 'GT', callback?: Callback<number>): Result<number, Context>;
  pexpireat(key: RedisKey, unixTimeMilliseconds: number, lt: 'LT', callback?: Callback<number>): Result<number, Context>;

  /**
   * Adds the specified elements to the specified HyperLogLog.
   * - _group_: hyperloglog
   * - _complexity_: O(1) to add every element.
   * - _since_: 2.8.9
   */
  pfadd(key: RedisKey, callback?: Callback<number>): Result<number, Context>;
  pfadd(...args: [key: RedisKey, ...elements: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  pfadd(...args: [key: RedisKey, ...elements: (string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).
   * - _group_: hyperloglog
   * - _complexity_: O(1) with a very small average constant time when called with a single key. O(N) with N being the number of keys, and much bigger constant times, when called with multiple keys.
   * - _since_: 2.8.9
   */
  pfcount(...args: [...keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  pfcount(...args: [keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  pfcount(...args: [...keys: (RedisKey)[]]): Result<number, Context>;
  pfcount(...args: [keys: (RedisKey)[]]): Result<number, Context>;

  /**
   * Internal commands for debugging HyperLogLog values
   * - _group_: hyperloglog
   * - _complexity_: N/A
   * - _since_: 2.8.9
   */
  pfdebug(callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Merge N different HyperLogLogs into a single one.
   * - _group_: hyperloglog
   * - _complexity_: O(N) to merge N HyperLogLogs, but with high constant times.
   * - _since_: 2.8.9
   */
  pfmerge(...args: [destkey: RedisKey, ...sourcekeys: (RedisKey)[], callback: Callback<'OK'>]): Result<'OK', Context>;
  pfmerge(...args: [destkey: RedisKey, sourcekeys: (RedisKey)[], callback: Callback<'OK'>]): Result<'OK', Context>;
  pfmerge(...args: [destkey: RedisKey, ...sourcekeys: (RedisKey)[]]): Result<'OK', Context>;
  pfmerge(...args: [destkey: RedisKey, sourcekeys: (RedisKey)[]]): Result<'OK', Context>;

  /**
   * An internal command for testing HyperLogLog values
   * - _group_: hyperloglog
   * - _complexity_: N/A
   * - _since_: 2.8.9
   */
  pfselftest(callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Ping the server
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  ping(callback?: Callback<'PONG'>): Result<'PONG', Context>;
  ping(message: string | Buffer, callback?: Callback<string>): Result<string, Context>;
  pingBuffer(message: string | Buffer, callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Set the value and expiration in milliseconds of a key
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 2.6.0
   */
  psetex(key: RedisKey, milliseconds: number, value: string | Buffer | number, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Listen for messages published to channels matching the given patterns
   * - _group_: pubsub
   * - _complexity_: O(N) where N is the number of patterns the client is already subscribed to.
   * - _since_: 2.0.0
   */
  psubscribe(...args: [...patterns: (string)[], callback: Callback<unknown>]): Result<unknown, Context>;
  psubscribe(...args: [...patterns: (string)[]]): Result<unknown, Context>;

  /**
   * Internal command used for replication
   * - _group_: server
   * - _complexity_: undefined
   * - _since_: 2.8.0
   */
  psync(replicationid: number | string, offset: number | string, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Get the time to live for a key in milliseconds
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 2.6.0
   */
  pttl(key: RedisKey, callback?: Callback<number>): Result<number, Context>;

  /**
   * Post a message to a channel
   * - _group_: pubsub
   * - _complexity_: O(N+M) where N is the number of clients subscribed to the receiving channel and M is the total number of subscribed patterns (by any client).
   * - _since_: 2.0.0
   */
  publish(channel: string | Buffer, message: string | Buffer, callback?: Callback<number>): Result<number, Context>;

  /**
   * Get the count of subscribers for channels
   * - _group_: pubsub
   * - _complexity_: O(N) for the NUMSUB subcommand, where N is the number of requested channels
   * - _since_: 2.8.0
   */
  pubsub(subcommand: 'NUMSUB', callback?: Callback<unknown[]>): Result<unknown[], Context>;
  pubsub(...args: [subcommand: 'NUMSUB', ...channels: (string | Buffer)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  pubsub(...args: [subcommand: 'NUMSUB', ...channels: (string | Buffer)[]]): Result<unknown[], Context>;

  /**
   * Get the count of unique patterns pattern subscriptions
   * - _group_: pubsub
   * - _complexity_: O(1)
   * - _since_: 2.8.0
   */
  pubsub(subcommand: 'NUMPAT', callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: pubsub
   * - _complexity_: O(1)
   * - _since_: 6.2.0
   */
  pubsub(subcommand: 'HELP', callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Get the count of subscribers for shard channels
   * - _group_: pubsub
   * - _complexity_: O(N) for the SHARDNUMSUB subcommand, where N is the number of requested channels
   * - _since_: 7.0.0
   */
  pubsub(subcommand: 'SHARDNUMSUB', callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * List active channels
   * - _group_: pubsub
   * - _complexity_: O(N) where N is the number of active channels, and assuming constant time pattern matching (relatively short channels and patterns)
   * - _since_: 2.8.0
   */
  pubsub(subcommand: 'CHANNELS', callback?: Callback<unknown[]>): Result<unknown[], Context>;
  pubsub(subcommand: 'CHANNELS', pattern: string | Buffer, callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * List active shard channels
   * - _group_: pubsub
   * - _complexity_: O(N) where N is the number of active shard channels, and assuming constant time pattern matching (relatively short channels).
   * - _since_: 7.0.0
   */
  pubsub(subcommand: 'SHARDCHANNELS', callback?: Callback<unknown[]>): Result<unknown[], Context>;
  pubsub(subcommand: 'SHARDCHANNELS', pattern: string | Buffer, callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Stop listening for messages posted to channels matching the given patterns
   * - _group_: pubsub
   * - _complexity_: O(N+M) where N is the number of patterns the client is already subscribed and M is the number of total patterns subscribed in the system (by any client).
   * - _since_: 2.0.0
   */
  punsubscribe(callback?: Callback<unknown>): Result<unknown, Context>;
  punsubscribe(...args: [...patterns: (string)[], callback: Callback<unknown>]): Result<unknown, Context>;
  punsubscribe(...args: [...patterns: (string)[]]): Result<unknown, Context>;

  /**
   * Close the connection
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  quit(callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Return a random key from the keyspace
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  randomkey(callback?: Callback<string | null>): Result<string | null, Context>;
  randomkeyBuffer(callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Enables read queries for a connection to a cluster replica node
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  readonly(callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Disables read queries for a connection to a cluster replica node
   * - _group_: cluster
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  readwrite(callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Rename a key
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  rename(key: RedisKey, newkey: RedisKey, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Rename a key, only if the new key does not exist
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  renamenx(key: RedisKey, newkey: RedisKey, callback?: Callback<number>): Result<number, Context>;

  /**
   * An internal command for configuring the replication stream
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  replconf(callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Make the server a replica of another instance, or promote it as master.
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  replicaof(host: string | Buffer, port: string | Buffer, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Reset the connection
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 6.2.0
   */
  reset(callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Create a key using the provided serialized value, previously obtained using DUMP.
   * - _group_: generic
   * - _complexity_: O(1) to create the new key and additional O(N*M) to reconstruct the serialized value, where N is the number of Redis objects composing the value and M their average size. For small string values the time complexity is thus O(1)+O(1*M) where M is small, so simply O(1). However for sorted set values the complexity is O(N*M*log(N)) because inserting values into sorted sets is O(log(N)).
   * - _since_: 2.6.0
   */
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, frequencyToken: 'FREQ', frequency: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, secondsToken: 'IDLETIME', seconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, secondsToken: 'IDLETIME', seconds: number, frequencyToken: 'FREQ', frequency: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, absttl: 'ABSTTL', callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, absttl: 'ABSTTL', frequencyToken: 'FREQ', frequency: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, absttl: 'ABSTTL', secondsToken: 'IDLETIME', seconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, absttl: 'ABSTTL', secondsToken: 'IDLETIME', seconds: number, frequencyToken: 'FREQ', frequency: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, replace: 'REPLACE', callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, replace: 'REPLACE', frequencyToken: 'FREQ', frequency: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, replace: 'REPLACE', secondsToken: 'IDLETIME', seconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, replace: 'REPLACE', secondsToken: 'IDLETIME', seconds: number, frequencyToken: 'FREQ', frequency: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, replace: 'REPLACE', absttl: 'ABSTTL', callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, replace: 'REPLACE', absttl: 'ABSTTL', frequencyToken: 'FREQ', frequency: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, replace: 'REPLACE', absttl: 'ABSTTL', secondsToken: 'IDLETIME', seconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  restore(key: RedisKey, ttl: number | string, serializedValue: string | Buffer | number, replace: 'REPLACE', absttl: 'ABSTTL', secondsToken: 'IDLETIME', seconds: number, frequencyToken: 'FREQ', frequency: number | string, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * An internal command for migrating keys in a cluster
   * - _group_: server
   * - _complexity_: O(1) to create the new key and additional O(N*M) to reconstruct the serialized value, where N is the number of Redis objects composing the value and M their average size. For small string values the time complexity is thus O(1)+O(1*M) where M is small, so simply O(1). However for sorted set values the complexity is O(N*M*log(N)) because inserting values into sorted sets is O(log(N)).
   * - _since_: 3.0.0
   */
  ['restore-asking'](callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Return the role of the instance in the context of replication
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 2.8.12
   */
  role(callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Remove and get the last elements in a list
   * - _group_: list
   * - _complexity_: O(N) where N is the number of elements returned
   * - _since_: 1.0.0
   */
  rpop(key: RedisKey, callback?: Callback<string | null>): Result<string | null, Context>;
  rpopBuffer(key: RedisKey, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  rpop(key: RedisKey, count: number, callback?: Callback<string[] | null>): Result<string[] | null, Context>;
  rpopBuffer(key: RedisKey, count: number, callback?: Callback<Buffer[] | null>): Result<Buffer[] | null, Context>;

  /**
   * Remove the last element in a list, prepend it to another list and return it
   * - _group_: list
   * - _complexity_: O(1)
   * - _since_: 1.2.0
   */
  rpoplpush(source: RedisKey, destination: RedisKey, callback?: Callback<string>): Result<string, Context>;
  rpoplpushBuffer(source: RedisKey, destination: RedisKey, callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Append one or multiple elements to a list
   * - _group_: list
   * - _complexity_: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
   * - _since_: 1.0.0
   */
  rpush(...args: [key: RedisKey, ...elements: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  rpush(...args: [key: RedisKey, ...elements: (string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Append an element to a list, only if the list exists
   * - _group_: list
   * - _complexity_: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
   * - _since_: 2.2.0
   */
  rpushx(...args: [key: RedisKey, ...elements: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  rpushx(...args: [key: RedisKey, ...elements: (string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Add one or more members to a set
   * - _group_: set
   * - _complexity_: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
   * - _since_: 1.0.0
   */
  sadd(...args: [key: RedisKey, ...members: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  sadd(...args: [key: RedisKey, members: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  sadd(...args: [key: RedisKey, ...members: (string | Buffer | number)[]]): Result<number, Context>;
  sadd(...args: [key: RedisKey, members: (string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Synchronously save the dataset to disk
   * - _group_: server
   * - _complexity_: O(N) where N is the total number of keys in all databases
   * - _since_: 1.0.0
   */
  save(callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Incrementally iterate the keys space
   * - _group_: generic
   * - _complexity_: O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection.
   * - _since_: 2.8.0
   */
  scan(cursor: number | string, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  scanBuffer(cursor: number | string, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  scan(cursor: number | string, typeToken: 'TYPE', type: string | Buffer, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  scanBuffer(cursor: number | string, typeToken: 'TYPE', type: string | Buffer, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  scan(cursor: number | string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  scanBuffer(cursor: number | string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  scan(cursor: number | string, countToken: 'COUNT', count: number, typeToken: 'TYPE', type: string | Buffer, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  scanBuffer(cursor: number | string, countToken: 'COUNT', count: number, typeToken: 'TYPE', type: string | Buffer, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  scan(cursor: number | string, patternToken: 'MATCH', pattern: string, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  scanBuffer(cursor: number | string, patternToken: 'MATCH', pattern: string, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  scan(cursor: number | string, patternToken: 'MATCH', pattern: string, typeToken: 'TYPE', type: string | Buffer, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  scanBuffer(cursor: number | string, patternToken: 'MATCH', pattern: string, typeToken: 'TYPE', type: string | Buffer, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  scan(cursor: number | string, patternToken: 'MATCH', pattern: string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  scanBuffer(cursor: number | string, patternToken: 'MATCH', pattern: string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  scan(cursor: number | string, patternToken: 'MATCH', pattern: string, countToken: 'COUNT', count: number, typeToken: 'TYPE', type: string | Buffer, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  scanBuffer(cursor: number | string, patternToken: 'MATCH', pattern: string, countToken: 'COUNT', count: number, typeToken: 'TYPE', type: string | Buffer, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;

  /**
   * Get the number of members in a set
   * - _group_: set
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  scard(key: RedisKey, callback?: Callback<number>): Result<number, Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: scripting
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  script(subcommand: 'HELP', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Remove all the scripts from the script cache.
   * - _group_: scripting
   * - _complexity_: O(N) with N being the number of scripts in cache
   * - _since_: 2.6.0
   */
  script(subcommand: 'FLUSH', callback?: Callback<unknown>): Result<unknown, Context>;
  script(subcommand: 'FLUSH', async: 'ASYNC', callback?: Callback<unknown>): Result<unknown, Context>;
  script(subcommand: 'FLUSH', sync: 'SYNC', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Check existence of scripts in the script cache.
   * - _group_: scripting
   * - _complexity_: O(N) with N being the number of scripts to check (so checking a single script is an O(1) operation).
   * - _since_: 2.6.0
   */
  script(...args: [subcommand: 'EXISTS', ...sha1s: (string | Buffer)[], callback: Callback<unknown>]): Result<unknown, Context>;
  script(...args: [subcommand: 'EXISTS', ...sha1s: (string | Buffer)[]]): Result<unknown, Context>;

  /**
   * Set the debug mode for executed scripts.
   * - _group_: scripting
   * - _complexity_: O(1)
   * - _since_: 3.2.0
   */
  script(subcommand: 'DEBUG', yes: 'YES', callback?: Callback<unknown>): Result<unknown, Context>;
  script(subcommand: 'DEBUG', sync: 'SYNC', callback?: Callback<unknown>): Result<unknown, Context>;
  script(subcommand: 'DEBUG', no: 'NO', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Load the specified Lua script into the script cache.
   * - _group_: scripting
   * - _complexity_: O(N) with N being the length in bytes of the script body.
   * - _since_: 2.6.0
   */
  script(subcommand: 'LOAD', script: string | Buffer, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Kill the script currently in execution.
   * - _group_: scripting
   * - _complexity_: O(1)
   * - _since_: 2.6.0
   */
  script(subcommand: 'KILL', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Subtract multiple sets
   * - _group_: set
   * - _complexity_: O(N) where N is the total number of elements in all given sets.
   * - _since_: 1.0.0
   */
  sdiff(...args: [...keys: (RedisKey)[], callback: Callback<string[]>]): Result<string[], Context>;
  sdiffBuffer(...args: [...keys: (RedisKey)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  sdiff(...args: [keys: (RedisKey)[], callback: Callback<string[]>]): Result<string[], Context>;
  sdiffBuffer(...args: [keys: (RedisKey)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  sdiff(...args: [...keys: (RedisKey)[]]): Result<string[], Context>;
  sdiffBuffer(...args: [...keys: (RedisKey)[]]): Result<Buffer[], Context>;
  sdiff(...args: [keys: (RedisKey)[]]): Result<string[], Context>;
  sdiffBuffer(...args: [keys: (RedisKey)[]]): Result<Buffer[], Context>;

  /**
   * Subtract multiple sets and store the resulting set in a key
   * - _group_: set
   * - _complexity_: O(N) where N is the total number of elements in all given sets.
   * - _since_: 1.0.0
   */
  sdiffstore(...args: [destination: RedisKey, ...keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  sdiffstore(...args: [destination: RedisKey, keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  sdiffstore(...args: [destination: RedisKey, ...keys: (RedisKey)[]]): Result<number, Context>;
  sdiffstore(...args: [destination: RedisKey, keys: (RedisKey)[]]): Result<number, Context>;

  /**
   * Change the selected database for the current connection
   * - _group_: connection
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  select(index: number, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Set the string value of a key
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  set(key: RedisKey, value: string | Buffer | number, callback?: Callback<'OK'>): Result<'OK', Context>;
  set(key: RedisKey, value: string | Buffer | number, get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, nx: 'NX', callback?: Callback<'OK' | null>): Result<'OK' | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, nx: 'NX', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, nx: 'NX', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, xx: 'XX', callback?: Callback<'OK' | null>): Result<'OK' | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, xx: 'XX', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, xx: 'XX', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, secondsToken: 'EX', seconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  set(key: RedisKey, value: string | Buffer | number, secondsToken: 'EX', seconds: number, get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, secondsToken: 'EX', seconds: number, get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, secondsToken: 'EX', seconds: number, nx: 'NX', callback?: Callback<'OK' | null>): Result<'OK' | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, secondsToken: 'EX', seconds: number, nx: 'NX', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, secondsToken: 'EX', seconds: number, nx: 'NX', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, secondsToken: 'EX', seconds: number, xx: 'XX', callback?: Callback<'OK' | null>): Result<'OK' | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, secondsToken: 'EX', seconds: number, xx: 'XX', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, secondsToken: 'EX', seconds: number, xx: 'XX', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, millisecondsToken: 'PX', milliseconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  set(key: RedisKey, value: string | Buffer | number, millisecondsToken: 'PX', milliseconds: number, get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, millisecondsToken: 'PX', milliseconds: number, get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, millisecondsToken: 'PX', milliseconds: number, nx: 'NX', callback?: Callback<'OK' | null>): Result<'OK' | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, millisecondsToken: 'PX', milliseconds: number, nx: 'NX', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, millisecondsToken: 'PX', milliseconds: number, nx: 'NX', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, millisecondsToken: 'PX', milliseconds: number, xx: 'XX', callback?: Callback<'OK' | null>): Result<'OK' | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, millisecondsToken: 'PX', milliseconds: number, xx: 'XX', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, millisecondsToken: 'PX', milliseconds: number, xx: 'XX', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, unixTimeSecondsToken: 'EXAT', unixTimeSeconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  set(key: RedisKey, value: string | Buffer | number, unixTimeSecondsToken: 'EXAT', unixTimeSeconds: number, get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, unixTimeSecondsToken: 'EXAT', unixTimeSeconds: number, get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, unixTimeSecondsToken: 'EXAT', unixTimeSeconds: number, nx: 'NX', callback?: Callback<'OK' | null>): Result<'OK' | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, unixTimeSecondsToken: 'EXAT', unixTimeSeconds: number, nx: 'NX', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, unixTimeSecondsToken: 'EXAT', unixTimeSeconds: number, nx: 'NX', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, unixTimeSecondsToken: 'EXAT', unixTimeSeconds: number, xx: 'XX', callback?: Callback<'OK' | null>): Result<'OK' | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, unixTimeSecondsToken: 'EXAT', unixTimeSeconds: number, xx: 'XX', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, unixTimeSecondsToken: 'EXAT', unixTimeSeconds: number, xx: 'XX', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, unixTimeMillisecondsToken: 'PXAT', unixTimeMilliseconds: number, callback?: Callback<'OK'>): Result<'OK', Context>;
  set(key: RedisKey, value: string | Buffer | number, unixTimeMillisecondsToken: 'PXAT', unixTimeMilliseconds: number, get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, unixTimeMillisecondsToken: 'PXAT', unixTimeMilliseconds: number, get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, unixTimeMillisecondsToken: 'PXAT', unixTimeMilliseconds: number, nx: 'NX', callback?: Callback<'OK' | null>): Result<'OK' | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, unixTimeMillisecondsToken: 'PXAT', unixTimeMilliseconds: number, nx: 'NX', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, unixTimeMillisecondsToken: 'PXAT', unixTimeMilliseconds: number, nx: 'NX', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, unixTimeMillisecondsToken: 'PXAT', unixTimeMilliseconds: number, xx: 'XX', callback?: Callback<'OK' | null>): Result<'OK' | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, unixTimeMillisecondsToken: 'PXAT', unixTimeMilliseconds: number, xx: 'XX', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, unixTimeMillisecondsToken: 'PXAT', unixTimeMilliseconds: number, xx: 'XX', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, keepttl: 'KEEPTTL', callback?: Callback<'OK'>): Result<'OK', Context>;
  set(key: RedisKey, value: string | Buffer | number, keepttl: 'KEEPTTL', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, keepttl: 'KEEPTTL', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, keepttl: 'KEEPTTL', nx: 'NX', callback?: Callback<'OK' | null>): Result<'OK' | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, keepttl: 'KEEPTTL', nx: 'NX', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, keepttl: 'KEEPTTL', nx: 'NX', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, keepttl: 'KEEPTTL', xx: 'XX', callback?: Callback<'OK' | null>): Result<'OK' | null, Context>;
  set(key: RedisKey, value: string | Buffer | number, keepttl: 'KEEPTTL', xx: 'XX', get: 'GET', callback?: Callback<string | null>): Result<string | null, Context>;
  setBuffer(key: RedisKey, value: string | Buffer | number, keepttl: 'KEEPTTL', xx: 'XX', get: 'GET', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Sets or clears the bit at offset in the string value stored at key
   * - _group_: bitmap
   * - _complexity_: O(1)
   * - _since_: 2.2.0
   */
  setbit(key: RedisKey, offset: number | string, value: number | string, callback?: Callback<number>): Result<number, Context>;

  /**
   * Set the value and expiration of a key
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 2.0.0
   */
  setex(key: RedisKey, seconds: number, value: string | Buffer | number, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Set the value of a key, only if the key does not exist
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  setnx(key: RedisKey, value: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Overwrite part of a string at key starting at the specified offset
   * - _group_: string
   * - _complexity_: O(1), not counting the time taken to copy the new string in place. Usually, this string is very small so the amortized complexity is O(1). Otherwise, complexity is O(M) with M being the length of the value argument.
   * - _since_: 2.2.0
   */
  setrange(key: RedisKey, offset: number | string, value: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Synchronously save the dataset to disk and then shut down the server
   * - _group_: server
   * - _complexity_: O(N) when saving, where N is the total number of keys in all databases when saving data, otherwise O(1)
   * - _since_: 1.0.0
   */
  shutdown(callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(force: 'FORCE', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(force: 'FORCE', abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(now: 'NOW', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(now: 'NOW', abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(now: 'NOW', force: 'FORCE', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(now: 'NOW', force: 'FORCE', abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(nosave: 'NOSAVE', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(nosave: 'NOSAVE', abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(nosave: 'NOSAVE', force: 'FORCE', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(nosave: 'NOSAVE', force: 'FORCE', abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(nosave: 'NOSAVE', now: 'NOW', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(nosave: 'NOSAVE', now: 'NOW', abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(nosave: 'NOSAVE', now: 'NOW', force: 'FORCE', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(nosave: 'NOSAVE', now: 'NOW', force: 'FORCE', abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(save: 'SAVE', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(save: 'SAVE', abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(save: 'SAVE', force: 'FORCE', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(save: 'SAVE', force: 'FORCE', abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(save: 'SAVE', now: 'NOW', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(save: 'SAVE', now: 'NOW', abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(save: 'SAVE', now: 'NOW', force: 'FORCE', callback?: Callback<'OK'>): Result<'OK', Context>;
  shutdown(save: 'SAVE', now: 'NOW', force: 'FORCE', abort: 'ABORT', callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Intersect multiple sets
   * - _group_: set
   * - _complexity_: O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.
   * - _since_: 1.0.0
   */
  sinter(...args: [...keys: (RedisKey)[], callback: Callback<string[]>]): Result<string[], Context>;
  sinterBuffer(...args: [...keys: (RedisKey)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  sinter(...args: [keys: (RedisKey)[], callback: Callback<string[]>]): Result<string[], Context>;
  sinterBuffer(...args: [keys: (RedisKey)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  sinter(...args: [...keys: (RedisKey)[]]): Result<string[], Context>;
  sinterBuffer(...args: [...keys: (RedisKey)[]]): Result<Buffer[], Context>;
  sinter(...args: [keys: (RedisKey)[]]): Result<string[], Context>;
  sinterBuffer(...args: [keys: (RedisKey)[]]): Result<Buffer[], Context>;

  /**
   * Intersect multiple sets and store the resulting set in a key
   * - _group_: set
   * - _complexity_: O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.
   * - _since_: 1.0.0
   */
  sinterstore(...args: [destination: RedisKey, ...keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  sinterstore(...args: [destination: RedisKey, keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  sinterstore(...args: [destination: RedisKey, ...keys: (RedisKey)[]]): Result<number, Context>;
  sinterstore(...args: [destination: RedisKey, keys: (RedisKey)[]]): Result<number, Context>;

  /**
   * Determine if a given value is a member of a set
   * - _group_: set
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  sismember(key: RedisKey, member: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Make the server a replica of another instance, or promote it as master. Deprecated starting with Redis 5. Use REPLICAOF instead.
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  slaveof(host: string | Buffer, port: string | Buffer, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Get the slow log's length
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 2.2.12
   */
  slowlog(subcommand: 'LEN', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Clear all entries from the slow log
   * - _group_: server
   * - _complexity_: O(N) where N is the number of entries in the slowlog
   * - _since_: 2.2.12
   */
  slowlog(subcommand: 'RESET', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 6.2.0
   */
  slowlog(subcommand: 'HELP', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Get the slow log's entries
   * - _group_: server
   * - _complexity_: O(N) where N is the number of entries returned
   * - _since_: 2.2.12
   */
  slowlog(subcommand: 'GET', callback?: Callback<unknown>): Result<unknown, Context>;
  slowlog(subcommand: 'GET', count: number, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Get all the members in a set
   * - _group_: set
   * - _complexity_: O(N) where N is the set cardinality.
   * - _since_: 1.0.0
   */
  smembers(key: RedisKey, callback?: Callback<string[]>): Result<string[], Context>;
  smembersBuffer(key: RedisKey, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Returns the membership associated with the given elements for a set
   * - _group_: set
   * - _complexity_: O(N) where N is the number of elements being checked for membership
   * - _since_: 6.2.0
   */
  smismember(...args: [key: RedisKey, ...members: (string | Buffer | number)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  smismember(...args: [key: RedisKey, members: (string | Buffer | number)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  smismember(...args: [key: RedisKey, ...members: (string | Buffer | number)[]]): Result<unknown[], Context>;
  smismember(...args: [key: RedisKey, members: (string | Buffer | number)[]]): Result<unknown[], Context>;

  /**
   * Move a member from one set to another
   * - _group_: set
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  smove(source: RedisKey, destination: RedisKey, member: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Sort the elements in a list, set or sorted set
   * - _group_: generic
   * - _complexity_: O(N+M*log(M)) where N is the number of elements in the list or set to sort, and M the number of returned elements. When the elements are not sorted, complexity is O(N).
   * - _since_: 1.0.0
   */
  sort(...args: [key: RedisKey, ...args: (RedisValue)[], callback: Callback<unknown>]): Result<unknown, Context>;
  sort(...args: [key: RedisKey, ...args: (RedisValue)[]]): Result<unknown, Context>;

  /**
   * Remove and return one or multiple random members from a set
   * - _group_: set
   * - _complexity_: Without the count argument O(1), otherwise O(N) where N is the value of the passed count.
   * - _since_: 1.0.0
   */
  spop(key: RedisKey, callback?: Callback<string | null>): Result<string | null, Context>;
  spopBuffer(key: RedisKey, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  spop(key: RedisKey, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  spopBuffer(key: RedisKey, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Get one or multiple random members from a set
   * - _group_: set
   * - _complexity_: Without the count argument O(1), otherwise O(N) where N is the absolute value of the passed count.
   * - _since_: 1.0.0
   */
  srandmember(key: RedisKey, callback?: Callback<string | unknown[] | null>): Result<string | unknown[] | null, Context>;
  srandmemberBuffer(key: RedisKey, callback?: Callback<Buffer | unknown[] | null>): Result<Buffer | unknown[] | null, Context>;
  srandmember(key: RedisKey, count: number, callback?: Callback<string | unknown[] | null>): Result<string | unknown[] | null, Context>;
  srandmemberBuffer(key: RedisKey, count: number, callback?: Callback<Buffer | unknown[] | null>): Result<Buffer | unknown[] | null, Context>;

  /**
   * Remove one or more members from a set
   * - _group_: set
   * - _complexity_: O(N) where N is the number of members to be removed.
   * - _since_: 1.0.0
   */
  srem(...args: [key: RedisKey, ...members: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  srem(...args: [key: RedisKey, members: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  srem(...args: [key: RedisKey, ...members: (string | Buffer | number)[]]): Result<number, Context>;
  srem(...args: [key: RedisKey, members: (string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Incrementally iterate Set elements
   * - _group_: set
   * - _complexity_: O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection..
   * - _since_: 2.8.0
   */
  sscan(key: RedisKey, cursor: number | string, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  sscanBuffer(key: RedisKey, cursor: number | string, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  sscan(key: RedisKey, cursor: number | string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  sscanBuffer(key: RedisKey, cursor: number | string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  sscan(key: RedisKey, cursor: number | string, patternToken: 'MATCH', pattern: string, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  sscanBuffer(key: RedisKey, cursor: number | string, patternToken: 'MATCH', pattern: string, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  sscan(key: RedisKey, cursor: number | string, patternToken: 'MATCH', pattern: string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  sscanBuffer(key: RedisKey, cursor: number | string, patternToken: 'MATCH', pattern: string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;

  /**
   * Get the length of the value stored in a key
   * - _group_: string
   * - _complexity_: O(1)
   * - _since_: 2.2.0
   */
  strlen(key: RedisKey, callback?: Callback<number>): Result<number, Context>;

  /**
   * Listen for messages published to the given channels
   * - _group_: pubsub
   * - _complexity_: O(N) where N is the number of channels to subscribe to.
   * - _since_: 2.0.0
   */
  subscribe(...args: [...channels: (string | Buffer)[], callback: Callback<unknown>]): Result<unknown, Context>;
  subscribe(...args: [...channels: (string | Buffer)[]]): Result<unknown, Context>;

  /**
   * Get a substring of the string stored at a key
   * - _group_: string
   * - _complexity_: O(N) where N is the length of the returned string. The complexity is ultimately determined by the returned length, but because creating a substring from an existing string is very cheap, it can be considered O(1) for small strings.
   * - _since_: 1.0.0
   */
  substr(key: RedisKey, start: number, end: number, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Add multiple sets
   * - _group_: set
   * - _complexity_: O(N) where N is the total number of elements in all given sets.
   * - _since_: 1.0.0
   */
  sunion(...args: [...keys: (RedisKey)[], callback: Callback<string[]>]): Result<string[], Context>;
  sunionBuffer(...args: [...keys: (RedisKey)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  sunion(...args: [keys: (RedisKey)[], callback: Callback<string[]>]): Result<string[], Context>;
  sunionBuffer(...args: [keys: (RedisKey)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  sunion(...args: [...keys: (RedisKey)[]]): Result<string[], Context>;
  sunionBuffer(...args: [...keys: (RedisKey)[]]): Result<Buffer[], Context>;
  sunion(...args: [keys: (RedisKey)[]]): Result<string[], Context>;
  sunionBuffer(...args: [keys: (RedisKey)[]]): Result<Buffer[], Context>;

  /**
   * Add multiple sets and store the resulting set in a key
   * - _group_: set
   * - _complexity_: O(N) where N is the total number of elements in all given sets.
   * - _since_: 1.0.0
   */
  sunionstore(...args: [destination: RedisKey, ...keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  sunionstore(...args: [destination: RedisKey, keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  sunionstore(...args: [destination: RedisKey, ...keys: (RedisKey)[]]): Result<number, Context>;
  sunionstore(...args: [destination: RedisKey, keys: (RedisKey)[]]): Result<number, Context>;

  /**
   * Swaps two Redis databases
   * - _group_: server
   * - _complexity_: O(N) where N is the count of clients watching or blocking on keys from both databases.
   * - _since_: 4.0.0
   */
  swapdb(index1: number, index2: number, callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Internal command used for replication
   * - _group_: server
   * - _complexity_: undefined
   * - _since_: 1.0.0
   */
  sync(callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Return the current server time
   * - _group_: server
   * - _complexity_: O(1)
   * - _since_: 2.6.0
   */
  time(callback?: Callback<number[]>): Result<number[], Context>;

  /**
   * Alters the last access time of a key(s). Returns the number of existing keys specified.
   * - _group_: generic
   * - _complexity_: O(N) where N is the number of keys that will be touched.
   * - _since_: 3.2.1
   */
  touch(...args: [...keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  touch(...args: [keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  touch(...args: [...keys: (RedisKey)[]]): Result<number, Context>;
  touch(...args: [keys: (RedisKey)[]]): Result<number, Context>;

  /**
   * Get the time to live for a key in seconds
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  ttl(key: RedisKey, callback?: Callback<number>): Result<number, Context>;

  /**
   * Determine the type stored at key
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 1.0.0
   */
  type(key: RedisKey, callback?: Callback<string>): Result<string, Context>;

  /**
   * Delete a key asynchronously in another thread. Otherwise it is just as DEL, but non blocking.
   * - _group_: generic
   * - _complexity_: O(1) for each key removed regardless of its size. Then the command does O(N) work in a different thread in order to reclaim memory, where N is the number of allocations the deleted objects where composed of.
   * - _since_: 4.0.0
   */
  unlink(...args: [...keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  unlink(...args: [keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  unlink(...args: [...keys: (RedisKey)[]]): Result<number, Context>;
  unlink(...args: [keys: (RedisKey)[]]): Result<number, Context>;

  /**
   * Stop listening for messages posted to the given channels
   * - _group_: pubsub
   * - _complexity_: O(N) where N is the number of clients already subscribed to a channel.
   * - _since_: 2.0.0
   */
  unsubscribe(callback?: Callback<unknown>): Result<unknown, Context>;
  unsubscribe(...args: [...channels: (string | Buffer)[], callback: Callback<unknown>]): Result<unknown, Context>;
  unsubscribe(...args: [...channels: (string | Buffer)[]]): Result<unknown, Context>;

  /**
   * Forget about all watched keys
   * - _group_: transactions
   * - _complexity_: O(1)
   * - _since_: 2.2.0
   */
  unwatch(callback?: Callback<'OK'>): Result<'OK', Context>;

  /**
   * Wait for the synchronous replication of all the write commands sent in the context of the current connection
   * - _group_: generic
   * - _complexity_: O(1)
   * - _since_: 3.0.0
   */
  wait(numreplicas: number | string, timeout: number | string, callback?: Callback<number>): Result<number, Context>;

  /**
   * Watch the given keys to determine execution of the MULTI/EXEC block
   * - _group_: transactions
   * - _complexity_: O(1) for every key.
   * - _since_: 2.2.0
   */
  watch(...args: [...keys: (RedisKey)[], callback: Callback<'OK'>]): Result<'OK', Context>;
  watch(...args: [keys: (RedisKey)[], callback: Callback<'OK'>]): Result<'OK', Context>;
  watch(...args: [...keys: (RedisKey)[]]): Result<'OK', Context>;
  watch(...args: [keys: (RedisKey)[]]): Result<'OK', Context>;

  /**
   * Marks a pending message as correctly processed, effectively removing it from the pending entries list of the consumer group. Return value of the command is the number of messages successfully acknowledged, that is, the IDs we were actually able to resolve in the PEL.
   * - _group_: stream
   * - _complexity_: O(1) for each message ID processed.
   * - _since_: 5.0.0
   */
  xack(...args: [key: RedisKey, group: string | Buffer, ...ids: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  xack(...args: [key: RedisKey, group: string | Buffer, ...ids: (string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Appends a new entry to a stream
   * - _group_: stream
   * - _complexity_: O(1) when adding a new entry, O(N) when trimming where N being the number of entries evicted.
   * - _since_: 5.0.0
   */
  xadd(...args: [key: RedisKey, ...args: (RedisValue)[], callback: Callback<string | null>]): Result<string | null, Context>;
  xaddBuffer(...args: [key: RedisKey, ...args: (RedisValue)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  xadd(...args: [key: RedisKey, ...args: (RedisValue)[]]): Result<string | null, Context>;
  xaddBuffer(...args: [key: RedisKey, ...args: (RedisValue)[]]): Result<Buffer | null, Context>;

  /**
   * Changes (or acquires) ownership of messages in a consumer group, as if the messages were delivered to the specified consumer.
   * - _group_: stream
   * - _complexity_: O(1) if COUNT is small.
   * - _since_: 6.2.0
   */
  xautoclaim(key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, start: string | Buffer | number, callback?: Callback<unknown[]>): Result<unknown[], Context>;
  xautoclaim(key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, start: string | Buffer | number, justid: 'JUSTID', callback?: Callback<unknown[]>): Result<unknown[], Context>;
  xautoclaim(key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, start: string | Buffer | number, countToken: 'COUNT', count: number, callback?: Callback<unknown[]>): Result<unknown[], Context>;
  xautoclaim(key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, start: string | Buffer | number, countToken: 'COUNT', count: number, justid: 'JUSTID', callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Changes (or acquires) ownership of a message in a consumer group, as if the message was delivered to the specified consumer.
   * - _group_: stream
   * - _complexity_: O(log N) with N being the number of messages in the PEL of the consumer group.
   * - _since_: 5.0.0
   */
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[]]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], force: 'FORCE', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], force: 'FORCE']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], force: 'FORCE', justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], force: 'FORCE', justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], countToken: 'RETRYCOUNT', count: number, callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], countToken: 'RETRYCOUNT', count: number]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], countToken: 'RETRYCOUNT', count: number, justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], countToken: 'RETRYCOUNT', count: number, justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], countToken: 'RETRYCOUNT', count: number, force: 'FORCE', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], countToken: 'RETRYCOUNT', count: number, force: 'FORCE']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], countToken: 'RETRYCOUNT', count: number, force: 'FORCE', justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], countToken: 'RETRYCOUNT', count: number, force: 'FORCE', justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, force: 'FORCE', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, force: 'FORCE']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, force: 'FORCE', justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, force: 'FORCE', justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, force: 'FORCE', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, force: 'FORCE']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, force: 'FORCE', justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, force: 'FORCE', justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, force: 'FORCE', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, force: 'FORCE']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, force: 'FORCE', justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, force: 'FORCE', justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, countToken: 'RETRYCOUNT', count: number, callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, countToken: 'RETRYCOUNT', count: number]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, countToken: 'RETRYCOUNT', count: number, justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, countToken: 'RETRYCOUNT', count: number, justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, countToken: 'RETRYCOUNT', count: number, force: 'FORCE', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, countToken: 'RETRYCOUNT', count: number, force: 'FORCE']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, countToken: 'RETRYCOUNT', count: number, force: 'FORCE', justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, countToken: 'RETRYCOUNT', count: number, force: 'FORCE', justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, force: 'FORCE', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, force: 'FORCE']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, force: 'FORCE', justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, force: 'FORCE', justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, justid: 'JUSTID']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, force: 'FORCE', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, force: 'FORCE']): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, force: 'FORCE', justid: 'JUSTID', callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xclaim(...args: [key: RedisKey, group: string | Buffer, consumer: string | Buffer, minIdleTime: string | Buffer | number, ...ids: (string | Buffer | number)[], msToken: 'IDLE', ms: number | string, unixTimeMillisecondsToken: 'TIME', unixTimeMilliseconds: number, countToken: 'RETRYCOUNT', count: number, force: 'FORCE', justid: 'JUSTID']): Result<unknown[], Context>;

  /**
   * Removes the specified entries from the stream. Returns the number of items actually deleted, that may be different from the number of IDs passed in case certain IDs do not exist.
   * - _group_: stream
   * - _complexity_: O(1) for each single item to delete in the stream, regardless of the stream size.
   * - _since_: 5.0.0
   */
  xdel(...args: [key: RedisKey, ...ids: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  xdel(...args: [key: RedisKey, ...ids: (string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Destroy a consumer group.
   * - _group_: stream
   * - _complexity_: O(N) where N is the number of entries in the group's pending entries list (PEL).
   * - _since_: 5.0.0
   */
  xgroup(subcommand: 'DESTROY', key: RedisKey, groupname: string | Buffer, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Create a consumer group.
   * - _group_: stream
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  xgroup(subcommand: 'CREATE', key: RedisKey, groupname: string | Buffer, id: string | Buffer | number, callback?: Callback<unknown>): Result<unknown, Context>;
  xgroup(subcommand: 'CREATE', key: RedisKey, groupname: string | Buffer, id: string | Buffer | number, mkstream: 'MKSTREAM', callback?: Callback<unknown>): Result<unknown, Context>;
  xgroup(subcommand: 'CREATE', key: RedisKey, groupname: string | Buffer, newId: '$', callback?: Callback<unknown>): Result<unknown, Context>;
  xgroup(subcommand: 'CREATE', key: RedisKey, groupname: string | Buffer, newId: '$', mkstream: 'MKSTREAM', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Delete a consumer from a consumer group.
   * - _group_: stream
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  xgroup(subcommand: 'DELCONSUMER', key: RedisKey, groupname: string | Buffer, consumername: string | Buffer, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Create a consumer in a consumer group.
   * - _group_: stream
   * - _complexity_: O(1)
   * - _since_: 6.2.0
   */
  xgroup(subcommand: 'CREATECONSUMER', key: RedisKey, groupname: string | Buffer, consumername: string | Buffer, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Set a consumer group to an arbitrary last delivered ID value.
   * - _group_: stream
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  xgroup(subcommand: 'SETID', key: RedisKey, groupname: string | Buffer, id: string | Buffer | number, callback?: Callback<unknown>): Result<unknown, Context>;
  xgroup(subcommand: 'SETID', key: RedisKey, groupname: string | Buffer, newId: '$', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: stream
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  xgroup(subcommand: 'HELP', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * List the consumer groups of a stream
   * - _group_: stream
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  xinfo(subcommand: 'GROUPS', key: RedisKey, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * List the consumers in a consumer group
   * - _group_: stream
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  xinfo(subcommand: 'CONSUMERS', key: RedisKey, groupname: string | Buffer, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Get information about a stream
   * - _group_: stream
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  xinfo(subcommand: 'STREAM', key: RedisKey, callback?: Callback<unknown>): Result<unknown, Context>;
  xinfo(subcommand: 'STREAM', key: RedisKey, fullToken: 'FULL', callback?: Callback<unknown>): Result<unknown, Context>;
  xinfo(subcommand: 'STREAM', key: RedisKey, fullToken: 'FULL', countToken: 'COUNT', count: number, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Show helpful text about the different subcommands
   * - _group_: stream
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  xinfo(subcommand: 'HELP', callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Return the number of entries in a stream
   * - _group_: stream
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  xlen(key: RedisKey, callback?: Callback<number>): Result<number, Context>;

  /**
   * Return information and entries from a stream consumer group pending entries list, that are messages fetched but never acknowledged.
   * - _group_: stream
   * - _complexity_: O(N) with N being the number of elements returned, so asking for a small fixed number of entries per call is O(1). O(M), where M is the total number of entries scanned when used with the IDLE filter. When the command returns just the summary and the list of consumers is small, it runs in O(1) time; otherwise, an additional O(N) time for iterating every consumer.
   * - _since_: 5.0.0
   */
  xpending(key: RedisKey, group: string | Buffer, callback?: Callback<unknown[]>): Result<unknown[], Context>;
  xpending(key: RedisKey, group: string | Buffer, start: string | Buffer | number, end: string | Buffer | number, count: number, callback?: Callback<unknown[]>): Result<unknown[], Context>;
  xpending(key: RedisKey, group: string | Buffer, start: string | Buffer | number, end: string | Buffer | number, count: number, consumer: string | Buffer, callback?: Callback<unknown[]>): Result<unknown[], Context>;
  xpending(key: RedisKey, group: string | Buffer, minIdleTimeToken: 'IDLE', minIdleTime: number | string, start: string | Buffer | number, end: string | Buffer | number, count: number, callback?: Callback<unknown[]>): Result<unknown[], Context>;
  xpending(key: RedisKey, group: string | Buffer, minIdleTimeToken: 'IDLE', minIdleTime: number | string, start: string | Buffer | number, end: string | Buffer | number, count: number, consumer: string | Buffer, callback?: Callback<unknown[]>): Result<unknown[], Context>;

  /**
   * Return a range of elements in a stream, with IDs matching the specified IDs interval
   * - _group_: stream
   * - _complexity_: O(N) with N being the number of elements being returned. If N is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(1).
   * - _since_: 5.0.0
   */
  xrange(key: RedisKey, start: string | Buffer | number, end: string | Buffer | number, callback?: Callback<[id: string, fields: string[]][]>): Result<[id: string, fields: string[]][], Context>;
  xrangeBuffer(key: RedisKey, start: string | Buffer | number, end: string | Buffer | number, callback?: Callback<[id: Buffer, fields: Buffer[]][]>): Result<[id: Buffer, fields: Buffer[]][], Context>;
  xrange(key: RedisKey, start: string | Buffer | number, end: string | Buffer | number, countToken: 'COUNT', count: number, callback?: Callback<[id: string, fields: string[]][]>): Result<[id: string, fields: string[]][], Context>;
  xrangeBuffer(key: RedisKey, start: string | Buffer | number, end: string | Buffer | number, countToken: 'COUNT', count: number, callback?: Callback<[id: Buffer, fields: Buffer[]][]>): Result<[id: Buffer, fields: Buffer[]][], Context>;

  /**
   * Return never seen elements in multiple streams, with IDs greater than the ones reported by the caller for each stream. Can block.
   * - _group_: stream
   * - _complexity_: For each stream mentioned: O(N) with N being the number of elements being returned, it means that XREAD-ing with a fixed COUNT is O(1). Note that when the BLOCK option is used, XADD will pay O(M) time in order to serve the M clients blocked on the stream getting new data.
   * - _since_: 5.0.0
   */
  xread(...args: [streamsToken: 'STREAMS', ...args: (RedisValue)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xread(...args: [streamsToken: 'STREAMS', ...args: (RedisValue)[]]): Result<unknown[], Context>;
  xread(...args: [millisecondsToken: 'BLOCK', milliseconds: number, streamsToken: 'STREAMS', ...args: (RedisValue)[], callback: Callback<unknown[] | null>]): Result<unknown[] | null, Context>;
  xread(...args: [millisecondsToken: 'BLOCK', milliseconds: number, streamsToken: 'STREAMS', ...args: (RedisValue)[]]): Result<unknown[] | null, Context>;
  xread(...args: [countToken: 'COUNT', count: number, streamsToken: 'STREAMS', ...args: (RedisValue)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xread(...args: [countToken: 'COUNT', count: number, streamsToken: 'STREAMS', ...args: (RedisValue)[]]): Result<unknown[], Context>;
  xread(...args: [countToken: 'COUNT', count: number, millisecondsToken: 'BLOCK', milliseconds: number, streamsToken: 'STREAMS', ...args: (RedisValue)[], callback: Callback<unknown[] | null>]): Result<unknown[] | null, Context>;
  xread(...args: [countToken: 'COUNT', count: number, millisecondsToken: 'BLOCK', milliseconds: number, streamsToken: 'STREAMS', ...args: (RedisValue)[]]): Result<unknown[] | null, Context>;

  /**
   * Return new entries from a stream using a consumer group, or access the history of the pending entries for a given consumer. Can block.
   * - _group_: stream
   * - _complexity_: For each stream mentioned: O(M) with M being the number of elements returned. If M is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(1). On the other side when XREADGROUP blocks, XADD will pay the O(N) time in order to serve the N clients blocked on the stream getting new data.
   * - _since_: 5.0.0
   */
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, streamsToken: 'STREAMS', ...args: (RedisValue)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, streamsToken: 'STREAMS', ...args: (RedisValue)[]]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, noack: 'NOACK', streamsToken: 'STREAMS', ...args: (RedisValue)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, noack: 'NOACK', streamsToken: 'STREAMS', ...args: (RedisValue)[]]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, millisecondsToken: 'BLOCK', milliseconds: number, streamsToken: 'STREAMS', ...args: (RedisValue)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, millisecondsToken: 'BLOCK', milliseconds: number, streamsToken: 'STREAMS', ...args: (RedisValue)[]]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, millisecondsToken: 'BLOCK', milliseconds: number, noack: 'NOACK', streamsToken: 'STREAMS', ...args: (RedisValue)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, millisecondsToken: 'BLOCK', milliseconds: number, noack: 'NOACK', streamsToken: 'STREAMS', ...args: (RedisValue)[]]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, countToken: 'COUNT', count: number, streamsToken: 'STREAMS', ...args: (RedisValue)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, countToken: 'COUNT', count: number, streamsToken: 'STREAMS', ...args: (RedisValue)[]]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, countToken: 'COUNT', count: number, noack: 'NOACK', streamsToken: 'STREAMS', ...args: (RedisValue)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, countToken: 'COUNT', count: number, noack: 'NOACK', streamsToken: 'STREAMS', ...args: (RedisValue)[]]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, countToken: 'COUNT', count: number, millisecondsToken: 'BLOCK', milliseconds: number, streamsToken: 'STREAMS', ...args: (RedisValue)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, countToken: 'COUNT', count: number, millisecondsToken: 'BLOCK', milliseconds: number, streamsToken: 'STREAMS', ...args: (RedisValue)[]]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, countToken: 'COUNT', count: number, millisecondsToken: 'BLOCK', milliseconds: number, noack: 'NOACK', streamsToken: 'STREAMS', ...args: (RedisValue)[], callback: Callback<unknown[]>]): Result<unknown[], Context>;
  xreadgroup(...args: [groupConsumerToken: 'GROUP', group: string | Buffer, consumer: string | Buffer, countToken: 'COUNT', count: number, millisecondsToken: 'BLOCK', milliseconds: number, noack: 'NOACK', streamsToken: 'STREAMS', ...args: (RedisValue)[]]): Result<unknown[], Context>;

  /**
   * Return a range of elements in a stream, with IDs matching the specified IDs interval, in reverse order (from greater to smaller IDs) compared to XRANGE
   * - _group_: stream
   * - _complexity_: O(N) with N being the number of elements returned. If N is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(1).
   * - _since_: 5.0.0
   */
  xrevrange(key: RedisKey, end: string | Buffer | number, start: string | Buffer | number, callback?: Callback<[id: string, fields: string[]][]>): Result<[id: string, fields: string[]][], Context>;
  xrevrangeBuffer(key: RedisKey, end: string | Buffer | number, start: string | Buffer | number, callback?: Callback<[id: Buffer, fields: Buffer[]][]>): Result<[id: Buffer, fields: Buffer[]][], Context>;
  xrevrange(key: RedisKey, end: string | Buffer | number, start: string | Buffer | number, countToken: 'COUNT', count: number, callback?: Callback<[id: string, fields: string[]][]>): Result<[id: string, fields: string[]][], Context>;
  xrevrangeBuffer(key: RedisKey, end: string | Buffer | number, start: string | Buffer | number, countToken: 'COUNT', count: number, callback?: Callback<[id: Buffer, fields: Buffer[]][]>): Result<[id: Buffer, fields: Buffer[]][], Context>;

  /**
   * An internal command for replicating stream values
   * - _group_: stream
   * - _complexity_: O(1)
   * - _since_: 5.0.0
   */
  xsetid(key: RedisKey, lastId: string | Buffer | number, callback?: Callback<unknown>): Result<unknown, Context>;

  /**
   * Trims the stream to (approximately if '~' is passed) a certain size
   * - _group_: stream
   * - _complexity_: O(N), with N being the number of evicted entries. Constant times are very small however, since entries are organized in macro nodes containing multiple entries that can be released with a single deallocation.
   * - _since_: 5.0.0
   */
  xtrim(key: RedisKey, maxlen: 'MAXLEN', threshold: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;
  xtrim(key: RedisKey, maxlen: 'MAXLEN', threshold: string | Buffer | number, countToken: 'LIMIT', count: number, callback?: Callback<number>): Result<number, Context>;
  xtrim(key: RedisKey, maxlen: 'MAXLEN', equal: '=', threshold: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;
  xtrim(key: RedisKey, maxlen: 'MAXLEN', equal: '=', threshold: string | Buffer | number, countToken: 'LIMIT', count: number, callback?: Callback<number>): Result<number, Context>;
  xtrim(key: RedisKey, maxlen: 'MAXLEN', approximately: '~', threshold: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;
  xtrim(key: RedisKey, maxlen: 'MAXLEN', approximately: '~', threshold: string | Buffer | number, countToken: 'LIMIT', count: number, callback?: Callback<number>): Result<number, Context>;
  xtrim(key: RedisKey, minid: 'MINID', threshold: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;
  xtrim(key: RedisKey, minid: 'MINID', threshold: string | Buffer | number, countToken: 'LIMIT', count: number, callback?: Callback<number>): Result<number, Context>;
  xtrim(key: RedisKey, minid: 'MINID', equal: '=', threshold: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;
  xtrim(key: RedisKey, minid: 'MINID', equal: '=', threshold: string | Buffer | number, countToken: 'LIMIT', count: number, callback?: Callback<number>): Result<number, Context>;
  xtrim(key: RedisKey, minid: 'MINID', approximately: '~', threshold: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;
  xtrim(key: RedisKey, minid: 'MINID', approximately: '~', threshold: string | Buffer | number, countToken: 'LIMIT', count: number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Add one or more members to a sorted set, or update its score if it already exists
   * - _group_: sorted-set
   * - _complexity_: O(log(N)) for each item added, where N is the number of elements in the sorted set.
   * - _since_: 1.2.0
   */
  zadd(...args: [key: RedisKey, ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string>]): Result<string, Context>;
  zaddBuffer(...args: [key: RedisKey, incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer>]): Result<Buffer, Context>;
  zadd(...args: [key: RedisKey, incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string, Context>;
  zaddBuffer(...args: [key: RedisKey, incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer, Context>;
  zadd(...args: [key: RedisKey, ch: 'CH', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, ch: 'CH', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string>]): Result<string, Context>;
  zaddBuffer(...args: [key: RedisKey, ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer>]): Result<Buffer, Context>;
  zadd(...args: [key: RedisKey, ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string, Context>;
  zaddBuffer(...args: [key: RedisKey, ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer, Context>;
  zadd(...args: [key: RedisKey, gt: 'GT', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, gt: 'GT', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, gt: 'GT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string>]): Result<string, Context>;
  zaddBuffer(...args: [key: RedisKey, gt: 'GT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer>]): Result<Buffer, Context>;
  zadd(...args: [key: RedisKey, gt: 'GT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string, Context>;
  zaddBuffer(...args: [key: RedisKey, gt: 'GT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer, Context>;
  zadd(...args: [key: RedisKey, gt: 'GT', ch: 'CH', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, gt: 'GT', ch: 'CH', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, gt: 'GT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string>]): Result<string, Context>;
  zaddBuffer(...args: [key: RedisKey, gt: 'GT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer>]): Result<Buffer, Context>;
  zadd(...args: [key: RedisKey, gt: 'GT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string, Context>;
  zaddBuffer(...args: [key: RedisKey, gt: 'GT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer, Context>;
  zadd(...args: [key: RedisKey, lt: 'LT', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, lt: 'LT', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, lt: 'LT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string>]): Result<string, Context>;
  zaddBuffer(...args: [key: RedisKey, lt: 'LT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer>]): Result<Buffer, Context>;
  zadd(...args: [key: RedisKey, lt: 'LT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string, Context>;
  zaddBuffer(...args: [key: RedisKey, lt: 'LT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer, Context>;
  zadd(...args: [key: RedisKey, lt: 'LT', ch: 'CH', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, lt: 'LT', ch: 'CH', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, lt: 'LT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string>]): Result<string, Context>;
  zaddBuffer(...args: [key: RedisKey, lt: 'LT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer>]): Result<Buffer, Context>;
  zadd(...args: [key: RedisKey, lt: 'LT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string, Context>;
  zaddBuffer(...args: [key: RedisKey, lt: 'LT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string | null>]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, nx: 'NX', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, nx: 'NX', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', ch: 'CH', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', ch: 'CH', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string | null>]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, nx: 'NX', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, nx: 'NX', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', gt: 'GT', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', gt: 'GT', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', gt: 'GT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string | null>]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, nx: 'NX', gt: 'GT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', gt: 'GT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, nx: 'NX', gt: 'GT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', gt: 'GT', ch: 'CH', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', gt: 'GT', ch: 'CH', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', gt: 'GT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string | null>]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, nx: 'NX', gt: 'GT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', gt: 'GT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, nx: 'NX', gt: 'GT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', lt: 'LT', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', lt: 'LT', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', lt: 'LT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string | null>]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, nx: 'NX', lt: 'LT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', lt: 'LT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, nx: 'NX', lt: 'LT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', lt: 'LT', ch: 'CH', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', lt: 'LT', ch: 'CH', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', lt: 'LT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string | null>]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, nx: 'NX', lt: 'LT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, nx: 'NX', lt: 'LT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, nx: 'NX', lt: 'LT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string | null>]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, xx: 'XX', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, xx: 'XX', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', ch: 'CH', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', ch: 'CH', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string | null>]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, xx: 'XX', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, xx: 'XX', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', gt: 'GT', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', gt: 'GT', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', gt: 'GT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string | null>]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, xx: 'XX', gt: 'GT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', gt: 'GT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, xx: 'XX', gt: 'GT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', gt: 'GT', ch: 'CH', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', gt: 'GT', ch: 'CH', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', gt: 'GT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string | null>]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, xx: 'XX', gt: 'GT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', gt: 'GT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, xx: 'XX', gt: 'GT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', lt: 'LT', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', lt: 'LT', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', lt: 'LT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string | null>]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, xx: 'XX', lt: 'LT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', lt: 'LT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, xx: 'XX', lt: 'LT', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', lt: 'LT', ch: 'CH', ...scoreMembers: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', lt: 'LT', ch: 'CH', ...scoreMembers: (string | Buffer | number)[]]): Result<number, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', lt: 'LT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<string | null>]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, xx: 'XX', lt: 'LT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[], callback: Callback<Buffer | null>]): Result<Buffer | null, Context>;
  zadd(...args: [key: RedisKey, xx: 'XX', lt: 'LT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<string | null, Context>;
  zaddBuffer(...args: [key: RedisKey, xx: 'XX', lt: 'LT', ch: 'CH', incr: 'INCR', ...scoreMembers: (string | Buffer | number)[]]): Result<Buffer | null, Context>;

  /**
   * Get the number of members in a sorted set
   * - _group_: sorted-set
   * - _complexity_: O(1)
   * - _since_: 1.2.0
   */
  zcard(key: RedisKey, callback?: Callback<number>): Result<number, Context>;

  /**
   * Count the members in a sorted set with scores within the given values
   * - _group_: sorted-set
   * - _complexity_: O(log(N)) with N being the number of elements in the sorted set.
   * - _since_: 2.0.0
   */
  zcount(key: RedisKey, min: number | string, max: number | string, callback?: Callback<number>): Result<number, Context>;

  /**
   * Subtract multiple sorted sets
   * - _group_: sorted-set
   * - _complexity_: O(L + (N-K)log(N)) worst case where L is the total number of elements in all the sets, N is the size of the first set, and K is the size of the result set.
   * - _since_: 6.2.0
   */
  zdiff(...args: [numkeys: number | string, ...keys: (RedisKey)[], callback: Callback<string[]>]): Result<string[], Context>;
  zdiffBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zdiff(...args: [numkeys: number | string, keys: (RedisKey)[], callback: Callback<string[]>]): Result<string[], Context>;
  zdiffBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zdiff(...args: [numkeys: number | string, ...keys: (RedisKey)[]]): Result<string[], Context>;
  zdiffBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[]]): Result<Buffer[], Context>;
  zdiff(...args: [numkeys: number | string, keys: (RedisKey)[]]): Result<string[], Context>;
  zdiffBuffer(...args: [numkeys: number | string, keys: (RedisKey)[]]): Result<Buffer[], Context>;
  zdiff(...args: [numkeys: number | string, ...keys: (RedisKey)[], withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zdiffBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zdiff(...args: [numkeys: number | string, keys: (RedisKey)[], withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zdiffBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zdiff(...args: [numkeys: number | string, ...keys: (RedisKey)[], withscores: 'WITHSCORES']): Result<string[], Context>;
  zdiffBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zdiff(...args: [numkeys: number | string, keys: (RedisKey)[], withscores: 'WITHSCORES']): Result<string[], Context>;
  zdiffBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], withscores: 'WITHSCORES']): Result<Buffer[], Context>;

  /**
   * Subtract multiple sorted sets and store the resulting sorted set in a new key
   * - _group_: sorted-set
   * - _complexity_: O(L + (N-K)log(N)) worst case where L is the total number of elements in all the sets, N is the size of the first set, and K is the size of the result set.
   * - _since_: 6.2.0
   */
  zdiffstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  zdiffstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  zdiffstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[]]): Result<number, Context>;
  zdiffstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[]]): Result<number, Context>;

  /**
   * Increment the score of a member in a sorted set
   * - _group_: sorted-set
   * - _complexity_: O(log(N)) where N is the number of elements in the sorted set.
   * - _since_: 1.2.0
   */
  zincrby(key: RedisKey, increment: number | string, member: string | Buffer | number, callback?: Callback<string>): Result<string, Context>;
  zincrbyBuffer(key: RedisKey, increment: number | string, member: string | Buffer | number, callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Intersect multiple sorted sets
   * - _group_: sorted-set
   * - _complexity_: O(N*K)+O(M*log(M)) worst case with N being the smallest input sorted set, K being the number of input sorted sets and M being the number of elements in the resulting sorted set.
   * - _since_: 6.2.0
   */
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[]]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[]]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[]]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[]]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], withscores: 'WITHSCORES']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], withscores: 'WITHSCORES']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[]]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[]]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], withscores: 'WITHSCORES']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zinter(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES']): Result<string[], Context>;
  zinterBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES']): Result<Buffer[], Context>;

  /**
   * Intersect multiple sorted sets and store the resulting sorted set in a new key
   * - _group_: sorted-set
   * - _complexity_: O(N*K)+O(M*log(M)) worst case with N being the smallest input sorted set, K being the number of input sorted sets and M being the number of elements in the resulting sorted set.
   * - _since_: 2.0.0
   */
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[]]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[]]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<number>]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<number>]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<number>]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<number>]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<number>]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<number>]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], callback: Callback<number>]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[]]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<number>]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<number>]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<number>]): Result<number, Context>;
  zinterstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<number, Context>;

  /**
   * Count the number of members in a sorted set between a given lexicographical range
   * - _group_: sorted-set
   * - _complexity_: O(log(N)) with N being the number of elements in the sorted set.
   * - _since_: 2.8.9
   */
  zlexcount(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Get the score associated with the given members in a sorted set
   * - _group_: sorted-set
   * - _complexity_: O(N) where N is the number of members being requested.
   * - _since_: 6.2.0
   */
  zmscore(...args: [key: RedisKey, ...members: (string | Buffer | number)[], callback: Callback<(string | null)[]>]): Result<(string | null)[], Context>;
  zmscoreBuffer(...args: [key: RedisKey, ...members: (string | Buffer | number)[], callback: Callback<(Buffer | null)[]>]): Result<(Buffer | null)[], Context>;
  zmscore(...args: [key: RedisKey, members: (string | Buffer | number)[], callback: Callback<(string | null)[]>]): Result<(string | null)[], Context>;
  zmscoreBuffer(...args: [key: RedisKey, members: (string | Buffer | number)[], callback: Callback<(Buffer | null)[]>]): Result<(Buffer | null)[], Context>;
  zmscore(...args: [key: RedisKey, ...members: (string | Buffer | number)[]]): Result<(string | null)[], Context>;
  zmscoreBuffer(...args: [key: RedisKey, ...members: (string | Buffer | number)[]]): Result<(Buffer | null)[], Context>;
  zmscore(...args: [key: RedisKey, members: (string | Buffer | number)[]]): Result<(string | null)[], Context>;
  zmscoreBuffer(...args: [key: RedisKey, members: (string | Buffer | number)[]]): Result<(Buffer | null)[], Context>;

  /**
   * Remove and return members with the highest scores in a sorted set
   * - _group_: sorted-set
   * - _complexity_: O(log(N)*M) with N being the number of elements in the sorted set, and M being the number of elements popped.
   * - _since_: 5.0.0
   */
  zpopmax(key: RedisKey, callback?: Callback<string[]>): Result<string[], Context>;
  zpopmaxBuffer(key: RedisKey, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zpopmax(key: RedisKey, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zpopmaxBuffer(key: RedisKey, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Remove and return members with the lowest scores in a sorted set
   * - _group_: sorted-set
   * - _complexity_: O(log(N)*M) with N being the number of elements in the sorted set, and M being the number of elements popped.
   * - _since_: 5.0.0
   */
  zpopmin(key: RedisKey, callback?: Callback<string[]>): Result<string[], Context>;
  zpopminBuffer(key: RedisKey, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zpopmin(key: RedisKey, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zpopminBuffer(key: RedisKey, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Get one or multiple random elements from a sorted set
   * - _group_: sorted-set
   * - _complexity_: O(N) where N is the number of elements returned
   * - _since_: 6.2.0
   */
  zrandmember(key: RedisKey, callback?: Callback<string[]>): Result<string[], Context>;
  zrandmemberBuffer(key: RedisKey, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrandmember(key: RedisKey, count: number, callback?: Callback<string | null>): Result<string | null, Context>;
  zrandmemberBuffer(key: RedisKey, count: number, callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;
  zrandmember(key: RedisKey, count: number, withscores: 'WITHSCORES', callback?: Callback<string | null>): Result<string | null, Context>;
  zrandmemberBuffer(key: RedisKey, count: number, withscores: 'WITHSCORES', callback?: Callback<Buffer | null>): Result<Buffer | null, Context>;

  /**
   * Return a range of members in a sorted set
   * - _group_: sorted-set
   * - _complexity_: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
   * - _since_: 1.2.0
   */
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, offsetCountToken: 'LIMIT', offset: number | string, count: number, withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, offsetCountToken: 'LIMIT', offset: number | string, count: number, withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, rev: 'REV', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, rev: 'REV', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, rev: 'REV', withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, rev: 'REV', withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', offsetCountToken: 'LIMIT', offset: number | string, count: number, withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', offsetCountToken: 'LIMIT', offset: number | string, count: number, withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', rev: 'REV', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', rev: 'REV', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', rev: 'REV', withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', rev: 'REV', withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', offsetCountToken: 'LIMIT', offset: number | string, count: number, withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', offsetCountToken: 'LIMIT', offset: number | string, count: number, withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', rev: 'REV', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', rev: 'REV', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', rev: 'REV', withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', rev: 'REV', withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrange(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangeBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Return a range of members in a sorted set, by lexicographical range
   * - _group_: sorted-set
   * - _complexity_: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
   * - _since_: 2.8.9
   */
  zrangebylex(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, callback?: Callback<string[]>): Result<string[], Context>;
  zrangebylexBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrangebylex(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrangebylexBuffer(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Return a range of members in a sorted set, by score
   * - _group_: sorted-set
   * - _complexity_: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
   * - _since_: 1.0.5
   */
  zrangebyscore(key: RedisKey, min: number | string, max: number | string, callback?: Callback<string[]>): Result<string[], Context>;
  zrangebyscoreBuffer(key: RedisKey, min: number | string, max: number | string, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrangebyscore(key: RedisKey, min: number | string, max: number | string, offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrangebyscoreBuffer(key: RedisKey, min: number | string, max: number | string, offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrangebyscore(key: RedisKey, min: number | string, max: number | string, withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrangebyscoreBuffer(key: RedisKey, min: number | string, max: number | string, withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrangebyscore(key: RedisKey, min: number | string, max: number | string, withscores: 'WITHSCORES', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrangebyscoreBuffer(key: RedisKey, min: number | string, max: number | string, withscores: 'WITHSCORES', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Store a range of members from sorted set into another key
   * - _group_: sorted-set
   * - _complexity_: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements stored into the destination key.
   * - _since_: 6.2.0
   */
  zrangestore(dst: RedisKey, src: RedisKey, min: string | Buffer | number, max: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;
  zrangestore(dst: RedisKey, src: RedisKey, min: string | Buffer | number, max: string | Buffer | number, offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<number>): Result<number, Context>;
  zrangestore(dst: RedisKey, src: RedisKey, min: string | Buffer | number, max: string | Buffer | number, rev: 'REV', callback?: Callback<number>): Result<number, Context>;
  zrangestore(dst: RedisKey, src: RedisKey, min: string | Buffer | number, max: string | Buffer | number, rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<number>): Result<number, Context>;
  zrangestore(dst: RedisKey, src: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', callback?: Callback<number>): Result<number, Context>;
  zrangestore(dst: RedisKey, src: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<number>): Result<number, Context>;
  zrangestore(dst: RedisKey, src: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', rev: 'REV', callback?: Callback<number>): Result<number, Context>;
  zrangestore(dst: RedisKey, src: RedisKey, min: string | Buffer | number, max: string | Buffer | number, byscore: 'BYSCORE', rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<number>): Result<number, Context>;
  zrangestore(dst: RedisKey, src: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', callback?: Callback<number>): Result<number, Context>;
  zrangestore(dst: RedisKey, src: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<number>): Result<number, Context>;
  zrangestore(dst: RedisKey, src: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', rev: 'REV', callback?: Callback<number>): Result<number, Context>;
  zrangestore(dst: RedisKey, src: RedisKey, min: string | Buffer | number, max: string | Buffer | number, bylex: 'BYLEX', rev: 'REV', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Determine the index of a member in a sorted set
   * - _group_: sorted-set
   * - _complexity_: O(log(N))
   * - _since_: 2.0.0
   */
  zrank(key: RedisKey, member: string | Buffer | number, callback?: Callback<number | null>): Result<number | null, Context>;

  /**
   * Remove one or more members from a sorted set
   * - _group_: sorted-set
   * - _complexity_: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
   * - _since_: 1.2.0
   */
  zrem(...args: [key: RedisKey, ...members: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zrem(...args: [key: RedisKey, members: (string | Buffer | number)[], callback: Callback<number>]): Result<number, Context>;
  zrem(...args: [key: RedisKey, ...members: (string | Buffer | number)[]]): Result<number, Context>;
  zrem(...args: [key: RedisKey, members: (string | Buffer | number)[]]): Result<number, Context>;

  /**
   * Remove all members in a sorted set between the given lexicographical range
   * - _group_: sorted-set
   * - _complexity_: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.
   * - _since_: 2.8.9
   */
  zremrangebylex(key: RedisKey, min: string | Buffer | number, max: string | Buffer | number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Remove all members in a sorted set within the given indexes
   * - _group_: sorted-set
   * - _complexity_: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.
   * - _since_: 2.0.0
   */
  zremrangebyrank(key: RedisKey, start: number, stop: number, callback?: Callback<number>): Result<number, Context>;

  /**
   * Remove all members in a sorted set within the given scores
   * - _group_: sorted-set
   * - _complexity_: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.
   * - _since_: 1.2.0
   */
  zremrangebyscore(key: RedisKey, min: number | string, max: number | string, callback?: Callback<number>): Result<number, Context>;

  /**
   * Return a range of members in a sorted set, by index, with scores ordered from high to low
   * - _group_: sorted-set
   * - _complexity_: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
   * - _since_: 1.2.0
   */
  zrevrange(key: RedisKey, start: number, stop: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrevrangeBuffer(key: RedisKey, start: number, stop: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrevrange(key: RedisKey, start: number, stop: number, withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrevrangeBuffer(key: RedisKey, start: number, stop: number, withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
   * - _group_: sorted-set
   * - _complexity_: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
   * - _since_: 2.8.9
   */
  zrevrangebylex(key: RedisKey, max: string | Buffer | number, min: string | Buffer | number, callback?: Callback<string[]>): Result<string[], Context>;
  zrevrangebylexBuffer(key: RedisKey, max: string | Buffer | number, min: string | Buffer | number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrevrangebylex(key: RedisKey, max: string | Buffer | number, min: string | Buffer | number, offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrevrangebylexBuffer(key: RedisKey, max: string | Buffer | number, min: string | Buffer | number, offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Return a range of members in a sorted set, by score, with scores ordered from high to low
   * - _group_: sorted-set
   * - _complexity_: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
   * - _since_: 2.2.0
   */
  zrevrangebyscore(key: RedisKey, max: number | string, min: number | string, callback?: Callback<string[]>): Result<string[], Context>;
  zrevrangebyscoreBuffer(key: RedisKey, max: number | string, min: number | string, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrevrangebyscore(key: RedisKey, max: number | string, min: number | string, offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrevrangebyscoreBuffer(key: RedisKey, max: number | string, min: number | string, offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrevrangebyscore(key: RedisKey, max: number | string, min: number | string, withscores: 'WITHSCORES', callback?: Callback<string[]>): Result<string[], Context>;
  zrevrangebyscoreBuffer(key: RedisKey, max: number | string, min: number | string, withscores: 'WITHSCORES', callback?: Callback<Buffer[]>): Result<Buffer[], Context>;
  zrevrangebyscore(key: RedisKey, max: number | string, min: number | string, withscores: 'WITHSCORES', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<string[]>): Result<string[], Context>;
  zrevrangebyscoreBuffer(key: RedisKey, max: number | string, min: number | string, withscores: 'WITHSCORES', offsetCountToken: 'LIMIT', offset: number | string, count: number, callback?: Callback<Buffer[]>): Result<Buffer[], Context>;

  /**
   * Determine the index of a member in a sorted set, with scores ordered from high to low
   * - _group_: sorted-set
   * - _complexity_: O(log(N))
   * - _since_: 2.0.0
   */
  zrevrank(key: RedisKey, member: string | Buffer | number, callback?: Callback<number | null>): Result<number | null, Context>;

  /**
   * Incrementally iterate sorted sets elements and associated scores
   * - _group_: sorted-set
   * - _complexity_: O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection..
   * - _since_: 2.8.0
   */
  zscan(key: RedisKey, cursor: number | string, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  zscanBuffer(key: RedisKey, cursor: number | string, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  zscan(key: RedisKey, cursor: number | string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  zscanBuffer(key: RedisKey, cursor: number | string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  zscan(key: RedisKey, cursor: number | string, patternToken: 'MATCH', pattern: string, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  zscanBuffer(key: RedisKey, cursor: number | string, patternToken: 'MATCH', pattern: string, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;
  zscan(key: RedisKey, cursor: number | string, patternToken: 'MATCH', pattern: string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: string, elements: string[]]>): Result<[cursor: string, elements: string[]], Context>;
  zscanBuffer(key: RedisKey, cursor: number | string, patternToken: 'MATCH', pattern: string, countToken: 'COUNT', count: number, callback?: Callback<[cursor: Buffer, elements: Buffer[]]>): Result<[cursor: Buffer, elements: Buffer[]], Context>;

  /**
   * Get the score associated with the given member in a sorted set
   * - _group_: sorted-set
   * - _complexity_: O(1)
   * - _since_: 1.2.0
   */
  zscore(key: RedisKey, member: string | Buffer | number, callback?: Callback<string>): Result<string, Context>;
  zscoreBuffer(key: RedisKey, member: string | Buffer | number, callback?: Callback<Buffer>): Result<Buffer, Context>;

  /**
   * Add multiple sorted sets
   * - _group_: sorted-set
   * - _complexity_: O(N)+O(M*log(M)) with N being the sum of the sizes of the input sorted sets, and M being the number of elements in the resulting sorted set.
   * - _since_: 6.2.0
   */
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[]]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[]]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[]]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[]]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], withscores: 'WITHSCORES']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], withscores: 'WITHSCORES']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[]]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[]]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], withscores: 'WITHSCORES']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', withscores: 'WITHSCORES']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES', callback: Callback<string[]>]): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES', callback: Callback<Buffer[]>]): Result<Buffer[], Context>;
  zunion(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES']): Result<string[], Context>;
  zunionBuffer(...args: [numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', withscores: 'WITHSCORES']): Result<Buffer[], Context>;

  /**
   * Add multiple sorted sets and store the resulting sorted set in a new key
   * - _group_: sorted-set
   * - _complexity_: O(N)+O(M log(M)) with N being the sum of the sizes of the input sorted sets, and M being the number of elements in the resulting sorted set.
   * - _since_: 2.0.0
   */
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], callback: Callback<number>]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[]]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[]]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<number>]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<number>]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<number>]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<number>]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<number>]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<number>]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, keys: (RedisKey)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], callback: Callback<number>]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[]]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM', callback: Callback<number>]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', sum: 'SUM']): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN', callback: Callback<number>]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', min: 'MIN']): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX', callback: Callback<number>]): Result<number, Context>;
  zunionstore(...args: [destination: RedisKey, numkeys: number | string, ...args: (RedisValue)[], aggregate: 'AGGREGATE', max: 'MAX']): Result<number, Context>;
}

export default RedisCommander;