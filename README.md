# react-use-url-state

Connect and control your React components' state with the URL.

## 🚧 TODO

> It's WIP. Not ready for use yet. Examples, docs, and tests are coming this year.
> Before stable release (v1), the API may change significantly.

* Next.js page/app routers without polling support
* Placeholder and initial value support
* `Date` in different locales testing

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
