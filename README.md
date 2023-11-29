# react-use-url-state

Use URL to store a state in React.

* Easily handle numbers, dates, booleans, and arrays.
* Have a type-safety with [Zod](https://zod.dev/)

> `https://example.com/?text=query&number=10&date=2023-11-29T13%3A52%3A50.230Z`
> 
> <=>
> 
> `{ text: 'query', number: 10, date: new Date('2023-11-29T13:52:50.230Z') }`

## Installation

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

    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
}
```

## 🚧 TODO

* [ ] Add automatic tests
* [ ] Add routers without polling for Next App/Page
