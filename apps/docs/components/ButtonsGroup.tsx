import { PropsWithChildren } from 'react';

export function ButtonsGroup(props: PropsWithChildren<any>) {
  return <div className="flex gap-4 my-4">{props.children}</div>;
}
