# react-url-router

Connect and control your React components' state with the URL.

## TODO

* Support for Next.js page/app routers without polling

## Installation

```sh
pnpm add react-use-url-state zod
```
```sh
npm i react-use-url-state zod
```

## Usage

> 💥 It's important to use `.coerce` on your Zod schema to ensure that the values are parsed correctly from the URL.

```tsx
function MyComponent() {
  const { data, replace, setValue, isError } = useUrlState(
    z.object({
      name: z.string(),
      age: z.coerce.number(),
      birthDate: z.coerce.date().optional(),
    }),
  );
  
  return <div>
    <Button
      onClick={() => {
        replace({ name: 'test', age: 10, birthDate: new Date() });
      }}
    >
      {`replace({ name: 'test', age: 10, birthDate: new Date() })`}
    </Button>

    <Button
      onClick={() => {
        setValue('age', age);
        setAge(age + 1);
      }}
    >
      Increment age
    </Button>

    <pre>{JSON.stringify(state, null, 2)}</pre>
  </div>
}
```
