import { clsx } from 'clsx';
import { Pre } from 'nextra/components';
import { DefaultSchema, UrlState } from 'react-use-url-state';

export function StateDisplay<T extends DefaultSchema>(props: UrlState<T>) {
  const { isError, error, data, isReady } = props;

  return (
    <div>
      <div>
        <Pre
          className={clsx(isError && '!bg-red-700', 'state-result')}
          filename={isError ? 'Errored' : 'State'}
        >
          {JSON.stringify(data, null, 2)}
        </Pre>
      </div>
      {isError && (
        <Pre filename="Zod Error" className="state-error">
          {JSON.stringify(error, null, 2)}
        </Pre>
      )}
    </div>
  );
}
