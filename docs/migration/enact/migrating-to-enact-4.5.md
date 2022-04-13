---
title: Migrating to Enact 4.5
toc: 2
---

## Overview
This document lists changes between Enact versions 4.0.x and 4.5 likely to affect most apps.  If you
are coming from Enact 3.x, please [migrate to 4.0](./migrating-to-enact-4.md) and then consult
this guide.

## General Changes

### React and React DOM
Enact 4.5 updates the `react` and `react-dom` dependencies to 18.x.  Developers should ensure
their code does not rely on features that are no longer available in these versions.

React 18 introduces out-of-the-box improvements like automatic batching, new APIs like startTransition, and streaming server-side rendering with support for Suspense.
In this guide, we'll walk you through what are these features and how to use them with examples.

#### The new root API
Root API in React is a pointer for the top-level data structures on the application that React uses to track a render tree.
Two different root APIs will be deployed when using React 18, the Legacy `ReactDOM.render` and `ReactDOMClient.createRoot`.
The Legacy root API will run a legacy mode root API, trigger warnings that the API is deprecated, and suggest moving it to the new root API like below.

```sh
ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it’s running React 17. Learn more: https://reactjs.org/link/switch-to-createroot
```

The new root API as known as `ReactDOMClient.createRoot` will add all the improvements to the application. Without adding it to the app, the new Concurrent Features, Suspense, or Automatic Batching features will not be available!

So, all you have to do is the below in your `index.js`, the entry of your app.

```js
// Before
import {render} from 'react-dom';

import App from './App';

const appElement = (<App />);

if (typeof window !== 'undefined') {
	render(appElement, document.getElementById('root'));
}

export default appElement;

// After
import {createRoot} from 'react-dom/client';

import App from './App';

const appElement = (<App />);

if (typeof window !== 'undefined') {
	const container = document.getElementById('root');
	const root = createRoot(container);
    // or simply, const root = createRoot(document.getElementById('root'));

	root.render(appElement);
}

export default appElement;
```

Now, you are all set to use the new Concurrent Features of React 18.
Let's look into some of Concurrent Features in detail.


### Automatic Batching
In earlier versions of React, batching was only done for the React event handlers.
With `createRoot`, all updates will be automatically batched, no matter where they originate from.
Updates inside of promises, setTimeout, native event handlers, or any other event were not batched in React by default:
```js
// After React 18 updates inside of timeouts, promises,
// native event handlers or any other event are batched.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```
The old behavior is still maintained when using `ReactDOM.render` or `flushSync` with the new root API.
```js
import {flushSync} from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React has updated the DOM by now
  flushSync(() => {
    setFlag(f => !f);
  });
  // React has updated the DOM by now
}
```
We have an example app for demonstration.
In the example we increment and decrement a variable that by 1 for a 1000 times and we count the re-renders. Before Automatic Batching every time the value is changed the component had to re-render, slowing the app for no real reason.


### startTransition
Updates wrapped in `startTransition` are handled as non-urgent and will be interrupted if more urgent updates like clicks or key presses come in. If a transition gets interrupted by the user (for example, by typing multiple characters in a row), React will throw out the stale rendering work that wasn’t finished and render only the latest update.

Imagine that you have multiple tabs and when a tab is selected, some data needs to be fetched.

Until React 17, when needing to fetch data before showing some UI that depends on that data, a custom loading state would have been rendered in its place(if the app developers decided to have a visual loading state), for example a spinner, until the request resolved. The main disadvantage is that the previous state of the UI was automatically lost.

With React18's `useTransition` hook, the previous state of the UI can be held until the data is ready. It can be introduced in the app like any other hooks.

```js
const [isPending, startTransition] = useTransition({timeoutMs: 3000});
```
The fetching of the new data is wrapped inside `startTransition`. The `isPending` data tells if the content is currently being loaded or not. Its `timeoutMs` property specifies how long we're willing to wait for the transition to finish.
Now instead of switching tabs immediately, the current tab continues to show its content until the new tab's content is ready. There is also the possibility to show a loading indicator, by making use of the `isPending` prop of `useTransition`.

If you want more information, please refer to [How to Upgrade to React 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html) and other great articles from the official [React Blog](https://reactjs.org/blog).


### cli
`@enact/cli` must be upgraded to version `5.0.0-alpha.1` or newer.
`@enact/cli` `5.0.0-alpha.1` updates the `webpack` to `5.x`, `eslint` to `8.x`, `jest` to `27.x`,
`react`, `react-dom` to `18.x`, and drops the support of `enzyme`.

Please proceed to replace `enzyme` with [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) when you make your unit tests.

As `@enact/cli` updates `react` and `react-dom` to `18.x`, `PrerenderPlugin` will automatically
convert `ReactDOMClient.createRoot` to `ReactDOMClient.hydrateRoot` for prerendered apps.
Please make sure to follow the above new `createRoot` API pattern to work prerendering properly.

Below are the highlights of `webpack 5` changes for your information.



### webOS TV
Enact 4.5 no longer supports the 2022 TV platform or earlier versions.

## sandstone

###

## ui

### `A11yDecorator`
The `ui/A11yDecorator` has been removed.

### `Button`, `Icon`, `IconButton`, and `LabeledIcon`
The default `size` value has been removed.

### `BodyText`, `Button`, `Group`, `Heading`, `Icon`, `IconButton`, `Image`, `ImageItem`, `LabeledIcon`, `Layout`, `ProgressBar`, `Repeater`, `Slider`, `SlotItem`, `Spinner`, `ToggleIcon`, `ToggleItem`, and `ViewManager`
The forwarding `ref`s to the respective root component support is added.

### `Touchable`
The `onHold` and `onHoldPulse` changed to `onHoldStart` and `onHold` respectively.

| 3.x | 4.0 |
|---|---|
| onHold | onHoldStart |
| onHoldPulse | onHold |
| onHoldEnd | onHoldEnd |

#### Example
##### 3.x
```js
...
import Button from '@enact/ui/Button';
...
<Button onHold={handleHoldStart} onHoldPulse={handleHold} />
...
```
##### 4.0
```js
...
import Button from '@enact/ui/Button';
...
<Button onHoldStart={handleHoldStart} onHold={handleHold} />
...
```
