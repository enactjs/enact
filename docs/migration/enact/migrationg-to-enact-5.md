---
title: Migrating to Enact 5.0
toc: 2
---

## Overview

## General Changes

### React and React DOM

Enact 5.0 updates the `react` and `react-dom` dependencies to 19.x. Developers should ensure
their code does not rely on features that are no longer available in these versions.
React 19 introduces Actions, new API `use`, `ref` as a prop, `Context` as a provider and some deprecated APIs.

#### Actions
Actions in React 19 are new feature designed to handle asynchronous transitions, such as submitting a form or fetching data.

```js
function Button() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await new Promise(() => {
        setTimeout(resolve, 3000);
      });
      console.log('Async job done');
    });
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Loading' : 'Click Me'}
    </button>
  );
}
```

#### `use`
The `use` API can be used in a component to read the value of a `Promise` or `context`
When used with a `Promise`, React will suspend until the promise resolves. When `use` is used to read context, `use` can be called inside loops or conditional statements unlike `useContext`.
```js
const CounterContext = createContext(0);

function MyCounter() {
  const count = use(CounterContext);

  return <div>Count: {count}</div>;
}
```

#### `ref` as a prop
Function components no longer need `forwardRef` to expose a DOM node to a parent component. `forwardRef` will be deprecated in future versions.
```js
function MyComponent({ref}) {
  return <button ref={ref}>Button</button>;
}
// Usage
<MyComponent ref={ref} />;
```

#### `Context` as a provider
`<Context>` can now be rendered as a provider. Note that `<Context.Provider>` will be deprecated in future versions.
```js
const CounterContext = createContext(0);

function App({children}) {
  return <CounterContext value={5}>{children}</CounterContext>;
}
```

#### Removed deprecated React APIs and React DOM APIs
* **`propTypes` and `defaultProps` for functions**: These are removed. Using `propType` will be silently ignored. Use ES6 default parameters instead of `defaultProps`. Class components will continue to support `defaultProps`.
* **`ReactDOM.findDOMNode`**: This API is removed. Replace it with DOM refs.
* **`react-dom/test-utils`**: Import `act` from `react` instead of `react-dom/test-utils`.

### cli

### WebOS TV

## limestone

### General

Limestone now uses the design-tokens system to style its components, importing alias tokens from the `design-tokens`. This enables consistent and customizable styling across all components.
With the removal of the `ReactDOM.findDOMNode` API, `ContextualPopupDecorator` and `Dropdown` is changed to have sibling DOM node by using `@enact/core/internal/WithRef` to access DOM nodes.

### `Alert`
The prop `overlayPosition` is added to set the position of the alert when the type is `overlay`.

### `Button`
The prop `centered` is added.

### `Card`
The new component `Card` is added.

### `Chip`
The new component `Chip` is added.

### `ContextualPopupDecorator`


### `KeyGuide`
The image-based `keyGuide` is added.

### `Switch`
The Switch icon is now drawn using CSS instead of an icon font.

### `TabLayout`
Tabs in horizontal `TabLayout` now support scrolling.

### Style
Various styling changes have been made to support new UI/UX designs for the webOS TV platform.

#### Colors
* `@lime-bg-color` has been removed
* `@lime-text-color` has been removed
* `@lime-text-sub-color` has been removed
* `@lime-shadow-base-color` has been removed
* `@lime-component-text-color` has been removed
* `@lime-component-text-sub-color` has been removed
* `@lime-component-bg-color` has been removed
* `@lime-component-active-indicator-bg-color` has been removed
* `@lime-component-inactive-indicator-bg-color` has been removed
* `@lime-focus-text-color` has been removed
* `@lime-focus-bg-color` has been removed
* `@lime-component-focus-text-color` has been removed
* `@lime-component-focus-active-indicator-bg-color` has been removed
* `@lime-component-focus-inactive-indicator-bg-color` has been removed
* `@lime-selected-color` has been removed
* `@lime-selected-text-color` has been removed
* `@lime-selected-bg-color` has been removed
* `@lime-disabled-focus-bg-color` has been removed
* `@lime-disabled-selected-color` has been removed
* `@lime-disabled-selected-bg-color` has been removed
* `@lime-disabled-selected-focus-color` has been removed
* `@lime-disabled-selected-focus-bg-color` has been removed
* `@lime-fullscreen-bg-color` has been removed
* `@lime-overlay-text-shadow` has been removed
* `@lime-overlay-bg-color` has been removed
* `@lime-overlay-outline-color` has been removed
* `@lime-overlay-outline-style` has been removed
* `@lime-selection-color` has been removed
* `@lime-selection-bg-color` has been removed
* `@lime-toggle-off-color` has been removed
* `@lime-toggle-off-bg-color` has been removed
* `@lime-toggle-on-color` has been removed
* `@lime-toggle-on-bg-color` has been removed
* `@lime-progress-color` has been removed
* `@lime-progress-bg-color` has been removed
* `@lime-progress-bg-color-opacity` has been removed
* `@lime-progress-highlighted-color` has been removed
* `@lime-progress-slider-color` has been removed
* `@lime-invalid-sub-color` has been removed

## ui

### General
`ReactDOM.findDOMNode` API is removed. `Placeholder.PlaceholderControllerDecorator` and `ViewManager` is changed to have sibling DOM node by using `@enact/core/internal/WithRef` to access DOM nodes.

#### `ViewManager`
As `ReactDOM.findDOMNode` API is removed from `ViewManager`, transition needs `index` of the node to animate.
Each panel must be wrapped with `<div>` instead of `<>` to map properly to the transition group.

## spotlight
`spotlight/Spottable` is changed to have sibling DOM node by using `@enact/core/internal/WithRef` to access DOM nodes instead of using `ReactDOM.findDOMNode` to access DOM nodes.
