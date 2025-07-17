import { useCallback, useEffect, useRef, useState } from 'react';
import { Callback, UrlStateController } from './controller';
import { useHandlers } from './handlers';
import { DefaultSchema, UrlState, UrlStateOptions } from './types';
import { searchIsEmpty, useStableSchema } from './utils';

export type { DefaultSchema, UrlState } from './types';

/**
 * Creates a hook that will manage the state of the URL search params.
 * @param {z.ZodObject} schema - zod schema to verify the url state
 * @param {UrlStateOptions} [options]
 * @param {boolean} [options.applyInitialValue] - if true, the initial value will be applied to the URL
 */
export function useUrlState<T extends DefaultSchema>(
  schema: T,
  options?: UrlStateOptions,
) {
  schema = useStableSchema(schema);
  const controller = UrlStateController.getUrlStateController();

  const [state, setState] = useState<UrlState<T>>({
    data: null,
    error: null,
    isError: false,
    isReady: false,
  });

  // need this in order to make handler functions stable
  const stateRef = useRef(state);
  stateRef.current = state;

  const recalculateState = useCallback<Callback>(
    (params) => {
      const validationResult = schema.safeParse(params);

      const result = validationResult.success
        ? { success: true, data: validationResult.data, error: null }
        : { success: false, data: null, error: validationResult.error };

      setState({
        data: result.data,
        isError: !result.success,
        error: result.error,
        isReady: true,
      });
    },
    [schema],
  );

  useEffect(() => {
    controller.subscribe(recalculateState);

    return () => {
      controller.unsubscribe(recalculateState);
    };
  }, [controller, recalculateState]);

  const handlers = useHandlers<T>(controller, stateRef);

  // apply initial value to the URL if the state is ready and applyInitialValue is true
  // initial value is taken from the default values of the schema
  useEffect(() => {
    if (state.isReady && options?.applyInitialValue) {
      handlers.setValues(state.data || {});
    }
  }, [handlers, options?.applyInitialValue, state.isReady]);

  return { ...state, ...handlers };
}
