import { z } from 'zod';

export type UrlStateOptions = {
  applyInitialValue: boolean;
};

export type UrlStateValue<T extends DefaultSchema> = z.infer<T>;

export type UrlState<T extends DefaultSchema> = {
  data: UrlStateValue<T> | null;
  isError: boolean;
  isReady: boolean;
  error: z.ZodError | null;
};

export type UrlStateMethods<T extends DefaultSchema> = {
  setState: (
    state:
      | UrlStateValue<T>
      | ((state: UrlStateValue<T> | null) => UrlStateValue<T>),
  ) => void;
  setValue: <K extends keyof z.infer<T>>(
    key: K,
    value: UrlStateValue<T>[K],
  ) => void;
  updateState: (
    state:
      | Partial<UrlStateValue<T>>
      | ((state: UrlStateValue<T> | null) => Partial<UrlStateValue<T>>),
  ) => void;
};

export type DefaultSchema = z.ZodObject<Record<string, z.ZodTypeAny>>;
