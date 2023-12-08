# react-use-url-state

![npm](https://img.shields.io/npm/v/react-use-url-state?logo=npm)
![npm type definitions](https://img.shields.io/npm/types/react-use-url-state?logo=typescript)
![npm](https://img.shields.io/npm/dw/react-use-url-state)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/react-use-url-state)
[![Known Vulnerabilities](https://snyk.io/test/npm/react-use-url-state/badge.svg)](https://snyk.io/test/react-use-url-state/axios)

Use URL to store a state in React.

* Easily handle numbers, dates, booleans, and arrays.
* Have a type-safety with [Zod](https://zod.dev/)
* CJS and ESM support
* 0 dependencies

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
