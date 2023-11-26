# react-use-url-state

Use URL to store a state in React.

* Easily handle numbers, dates, booleans, and arrays.
* Have a type-safety with [Zod](https://zod.dev/)


## Installation

```sh
pnpm add react-use-url-state zod
```
```sh
npm i react-use-url-state zod
```

# Documentation

📝[Documentation and examples](https://react-use-url-state.vercel.app/)


## Usage

> It's important to use `.coerce` on your Zod schema to ensure that the values are parsed correctly from the URL. 

```tsx
function MyComponent() {
  const { data, setState, setValue, isError, error } = useUrlState(
    z.object({
      name: z.string(),
      age: z.coerce.number(),
      birthDate: z.coerce.date().optional(),
    }),
  );

  return <div>
    <Button
      onClick={() => {
        setState({ name: 'test', age: 10, birthDate: new Date() });
      }}
    >
      Set state
    </Button>

    <Button
      onClick={() => {
        setValue('age', data.age + 1);
      }}
    >
      Increment age
    </Button>

    <pre>{JSON.stringify(state, null, 2)}</pre>
  </div>
}
```

## 🚧 TODO

* [ ] Add automatic tests
* [ ] Add routers without polling for Next App/Page
