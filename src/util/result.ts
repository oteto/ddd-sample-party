export type Result<T, E extends Error = Error> = {
  match<U>(fn: { ok: (value: T) => U; err: (error: E) => U }): U;
  map<U>(fn: (value: T) => U): Result<U, E>;
  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>;

  unwrap(): T;
};

class _Ok<T, E extends Error = Error> implements Result<T, E> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  match<U>({ ok }: { ok: (value: T) => U; err: (error: E) => U }): U {
    return ok(this.value);
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return Ok(fn(this.value));
  }

  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }

  unwrap(): T {
    return this.value;
  }
}

class _Err<T, E extends Error = Error> implements Result<T, E> {
  error: E;

  constructor(error: E) {
    this.error = error;
  }

  match<U>({ err }: { ok: (value: T) => U; err: (error: E) => U }): U {
    return err(this.error);
  }

  map<U>(_: (value: T) => U): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  andThen<U>(_: (value: T) => Result<U, E>): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  unwrap(): T {
    throw new Error("failed to unwrap");
  }
}

export function Ok<T>(value: T): Result<T> {
  return new _Ok(value);
}

export function Err<T, E extends Error = Error>(error: E): Result<T, E> {
  return new _Err(error);
}

export function isOk<T, E extends Error = Error>(
  result: Result<T, E>,
): result is _Ok<T, E> {
  return result.match({
    ok: (_) => true,
    err: (_) => false,
  });
}

export function isError<T, E extends Error = Error>(
  result: Result<T, E>,
): result is _Err<T, E> {
  return result.match({
    ok: (_) => false,
    err: (_) => true,
  });
}
