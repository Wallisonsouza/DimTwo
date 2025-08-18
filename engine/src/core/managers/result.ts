export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export const Result = {
  /**
   * Cria um resultado de sucesso.
   */
  ok<T>(value: T): Result<T> {
    return { ok: true, value };
  },

  /**
   * Cria um resultado de erro.
   */
  err<T = never>(error: string): Result<T> {
    return { ok: false, error };
  },

  /**
   * Verifica se o resultado é sucesso.
   */
  isOk<T>(result: Result<T>): result is { ok: true; value: T } {
    return result.ok;
  },

  /**
   * Verifica se o resultado é erro.
   */
  isErr<T>(result: Result<T>): result is { ok: false; error: string } {
    return !result.ok;
  },

  /**
   * Obtém o valor ou lança um erro se for falha.
   */
  unwrap<T>(result: Result<T>): T {
    if (result.ok) return result.value;
    throw new Error(`Unwrap failed: ${result.error}`);
  },

  /**
   * Obtém o valor ou retorna um valor padrão.
   */
  unwrapOr<T>(result: Result<T>, defaultValue: T): T {
    return result.ok ? result.value : defaultValue;
  },

  /**
   * Obtém o valor ou executa uma função fallback.
   */
  unwrapOrElse<T>(result: Result<T>, fallback: (error: string) => T): T {
    return result.ok ? result.value : fallback(result.error);
  },
} as const;
