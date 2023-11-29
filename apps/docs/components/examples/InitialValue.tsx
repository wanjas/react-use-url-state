import { useUrlState } from 'react-use-url-state';
import { z } from 'zod';

import { Button } from '../Button';
import { ButtonsGroup } from '../ButtonsGroup';
import { StateDisplay } from '../StateDisplay';

export function InitialValue({
  applyInitialValue,
}: {
  applyInitialValue: boolean;
}) {
  const urlState = useUrlState(
    z.object({
      search: z.string(),
      limit: z.coerce.number().max(100),
      from: z.coerce.date().optional(),
    }),
    {
      search: applyInitialValue ? 'init-apply' : 'init-not-apply',
      limit: 1,
      from: new Date('1000-01-01'),
    },
    {
      applyInitialValue,
    },
  );

  const { setState, setValue, data, isReady } = urlState;

  return (
    <div>
      <ButtonsGroup>
        <Button
          onClick={() =>
            setState({
              search: 'query',
              limit: 10,
              from: new Date(),
            })
          }
        >
          Set the state
        </Button>

        {/*<Button*/}
        {/*  onClick={() => setValue('limit', 999)}*/}
        {/*  color="error"*/}
        {/*  disabled={!data}*/}
        {/*>*/}
        {/*  2. Set errored state*/}
        {/*</Button>*/}
      </ButtonsGroup>

      <StateDisplay {...urlState} />
    </div>
  );
}
