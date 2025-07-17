'use client';
import Link from 'next/link';
import { useUrlState } from 'react-use-url-state';
import { z } from 'zod';
import { StateView } from '../../components/StateView';

export default function Index() {
  const { data } = useUrlState(
    z.object({
      name: z.string().default('default-name'),
      age: z.coerce.number().default(20),
      birthDate: z.coerce.date().default(new Date()),
    }),
    { applyInitialValue: true },
  );

  return (
    <div>
      <h1>Another state</h1>
      <Link href="/state">To first state</Link>

      <StateView state={data} />
    </div>
  );
}
