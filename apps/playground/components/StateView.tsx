'use client';

export type StateViewProps = {
  state: Record<string, unknown>;
};

export function StateView({ state }: StateViewProps) {
  return <pre>{JSON.stringify(state, null, 2)}</pre>;
}
