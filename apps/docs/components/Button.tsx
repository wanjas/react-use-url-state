import { clsx } from 'clsx';
import { ComponentPropsWithoutRef } from 'react';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  color?: 'default' | 'error';
};

export function Button({ color = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        color === 'default' && 'bg-blue-500 hover:bg-blue-700',
        color === 'error' && 'bg-red-500 hover:bg-red-700',
        'text-white font-bold py-2 px-4 rounded',
        props.disabled && 'grayscale',
      )}
      {...props}
    />
  );
}
