'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUrlState } from 'react-use-url-state';
import { z } from 'zod';
import { Button } from './Button';
import { StateView } from './StateView';

export function StateChanger() {
  const { data, replace, setValue, reset } = useUrlState(
    z.object({
      name: z.string(),
      age: z.coerce.number(),
      birthDate: z.coerce.date().optional(),
    }),
  );

  const [age, setAge] = useState(11);

  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-4">
        <Button
          onClick={() => {
            setValue('age', 10);
          }}
        >
          setValue('age', 10)
        </Button>
        <Button
          onClick={() => {
            setValue('age', age);
            setAge(age + 1);
          }}
        >
          setValue('age', setAge)
        </Button>
        <Button
          onClick={() => {
            setValue('birthDate', new Date());
          }}
        >
          setValue('birthDate', new Date());
        </Button>
        <Button
          onClick={() => {
            replace({ name: 'test', age: 10, birthDate: new Date() });
          }}
        >
          {`replace({ name: 'test', age: 10, birthDate: new Date() })`}
        </Button>
        <Button
          onClick={() => {
            replace({ name: 'test', age: 10 });
          }}
        >{`replace({ name: 'test', age: 10 })`}</Button>
      </div>

      <div>
        <Button
          onClick={() => {
            router.push(
              `?${new URLSearchParams({
                name: 'navigator/test',
                age: '44',
                birthDate: new Date().toISOString(),
              }).toString()}`,
            );
          }}
        >{`navigator`}</Button>
      </div>
      <div>
        <Link
          href={`?${new URLSearchParams({
            name: 'link/test',
            age: '77',
            birthDate: new Date().toISOString(),
          }).toString()}`}
        >
          Link
        </Link>
      </div>
      <hr className="my-4" />

      <StateView state={data || {}} />
    </div>
  );
}
