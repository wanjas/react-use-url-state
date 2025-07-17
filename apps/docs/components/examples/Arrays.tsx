import { Callout } from 'nextra/components';
import { useUrlState } from 'react-use-url-state';
import { array, z } from 'zod';

import { Button } from '../Button';
import { ButtonsGroup } from '../ButtonsGroup';
import { StateDisplay } from '../StateDisplay';

export function Arrays() {
  const urlState = useUrlState(
    z.object({
      search: z.string(),
      limit: z.coerce.number().max(100),
      from: z.coerce.date().optional(),
      stringArr: z.preprocess(
        (v) => (Array.isArray(v) ? v : [v]), // convert to array if only one item is present
        z.array(z.string()), // definition of the array items
      ),
      numberArr: z.preprocess(
        (v) => (Array.isArray(v) ? v : [v]), // convert to array if only one item is present
        z.array(z.coerce.number()), // definition of the array items
      ),
    }),
  );

  const { setState, setValue, data } = urlState;

  return (
    <div>
      <ButtonsGroup>
        <Button
          onClick={() =>
            setState({
              search: 'arrays',
              limit: 10,
              from: new Date(),
              stringArr: ['one', 'two'],
              numberArr: [123, 321],
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
