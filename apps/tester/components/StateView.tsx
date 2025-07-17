'use client';

export type StateViewProps = {
  state: Record<string, unknown> | null;
};

export function StateView({ state }: StateViewProps) {
  return <pre>{JSON.stringify(state, null, 2)}</pre>;
}
