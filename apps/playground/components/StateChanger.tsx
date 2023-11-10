'use client';

import { useUrlState } from 'react-url-state';
import { z } from 'zod';
import { Button } from './Button';
import { StateView } from './StateView';

export function StateChanger() {
  const { data, replace, setValue, reset } = useUrlState(z.object({
    name: z.string(),
    age: z.number(),
    birthDate: z.date().optional(),
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-4">
        <Button
          onClick={() => {
            setValue('age', 10);
          }}
        >setValue('age', 10)
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
            replace({name: 'test', age: 10, birthDate: new Date()});
          }}
        >
          {`replace({ name: 'test', age: 10, birthDate: new Date() })`}
        </Button>
        <Button
          onClick={() => {
            replace({name: 'test', age: 10});
          }}
        >{`replace({ name: 'test', age: 10 })`}</Button>
      </div>

      <hr className="my-4"/>

      <StateView state={data || {}} />
    </div>
  );
}
