import { useUrlState } from 'react-use-url-state';
import { z } from 'zod';

import { Button } from '../Button';
import { ButtonsGroup } from '../ButtonsGroup';
import { StateDisplay } from '../StateDisplay';

export function Advanced() {
  const urlState = useUrlState(
    z.object({
      search: z.string(),
      limit: z.coerce.number().max(100),
      from: z.coerce.date().optional(),
    }),
  );

  const { setState, setValue, data } = urlState;

  return (
    <div>
      <ButtonsGroup>
        <Button
          onClick={() =>
            setState({
              search: 'advanced',
              limit: 99,
              from: new Date(),
            })
          }
        >
          1. Set the state
        </Button>

        <Button
          onClick={() => setValue('limit', 999)}
          color="error"
          disabled={!data}
        >
          2. Set errored state
        </Button>
      </ButtonsGroup>

      <StateDisplay {...urlState} />
    </div>
  );
}
