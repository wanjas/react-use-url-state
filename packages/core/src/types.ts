import { z } from 'zod';

export type UrlStateOptions = {
  preserveUnknown: boolean;
};

export type UrlState<T extends DefaultSchema> = {
  data: z.infer<T> | null;
  isError: boolean;
  isReady: boolean;
  error: z.ZodError | null;
};

export type UrlStateMethods<T extends DefaultSchema> = {
  reset: () => void;
  replace: (data: z.infer<T>) => void;
  setValue: <K extends keyof z.infer<T>>(key: K, value: z.infer<T>[K]) => void;
};

export type DefaultSchema = z.ZodObject<Record<string, z.ZodTypeAny>>;
