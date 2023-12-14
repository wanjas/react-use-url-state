import { Callout } from 'nextra/components';
import { useUrlState } from 'react-use-url-state';
import { z } from 'zod';

import { Button } from '../Button';
import { ButtonsGroup } from '../ButtonsGroup';
import { StateDisplay } from '../StateDisplay';

export function Basic() {
  const urlState = useUrlState(
    z.object({
      search: z.string(),
      limit: z.coerce.number(),
      from: z.coerce.date().optional(),
    }),
  );

  const { setState } = urlState;

  return (
    <div>
      <ButtonsGroup>
        <Button
          id="set-basic-state"
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
      </ButtonsGroup>

      <StateDisplay {...urlState} />
    </div>
  );
}
