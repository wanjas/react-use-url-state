import { clsx } from 'clsx';
import { Pre } from 'nextra/components';
import { DefaultSchema, UrlState } from '../../../packages/core/src/types';

export function StateDisplay<T extends DefaultSchema>(props: UrlState<T>) {
  const { isError, error, data, isReady } = props;

  return (
    <div>
      <div>
        <Pre
          className={clsx(isError && '!bg-red-700')}
          filename={isError ? 'Errored' : 'State'}
        >
          {JSON.stringify(data, null, 2)}
        </Pre>
      </div>
      {isError && (
        <Pre filename="Zod Error">{JSON.stringify(error, null, 2)}</Pre>
      )}
    </div>
  );
}
