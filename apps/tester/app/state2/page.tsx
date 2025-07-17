'use client';
import Link from 'next/link';
import { useUrlState } from 'react-use-url-state';
import { z } from 'zod';
import { Button } from '../../components/Button';
import { StateView } from '../../components/StateView';

export default function Index() {
  const { data, setValue } = useUrlState(
    z.object({
      name: z.string().default('default-name'),
      age: z.coerce.number().default(20),
      birthDate: z.coerce.date().default(new Date()),
    }),
  );

  return (
    <div>
      <h1>Another state</h1>

      <Button
        onClick={() => {
          setValue('age', (data?.age || 0) + 9);
          setValue('age', (data?.age || 0) + 10);
        }}
      >
        Set new value
      </Button>
      <Link href="/state">To first state</Link>

      <StateView state={data} />
    </div>
  );
}
