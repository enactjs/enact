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
Enact 4.5 updates the `react` and `react-dom` dependencies to 18.x.

React 18 introduces out-of-the-box improvements like automatic batching, new APIs like startTransition, and streaming server-side rendering with support for Suspense.  
In this guide, we'll walk you through what are these features and how to use them with examples.

#### The new root API
Root API in React is a pointer for the top-level data structures on the application that React uses to track a render tree.  
Two different root APIs will be deployed when using React 18, the Legacy `ReactDOM.render` and `ReactDOMClient.createRoot`.  
The Legacy root API will run a legacy mode root API, trigger warnings that the API is deprecated, and suggest moving it to the new root API like below.

```sh
ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it’s running React 17. Learn more: https://reactjs.org/link/switch-to-createroot
```

The new root API as known as `ReactDOMClient.createRoot` will add all the improvements to the application. Without adding it to the app, the new Concurrent Features, like Suspense or Automatic Batching features will not be available!

So, all you have to do is the below in your `index.js`, entry of your app.

```js
// Before
import {render} from 'react-dom';
import App from './App';

const appElement = (<App />);

if (typeof window !== 'undefined') {
	render(appElement, document.getElementById('root'));
}

export default appElement;
```
The code above should be changed to below.

```js
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

If you build your app with the isomorphic or snapshot build option with the Enact CLI, please use `ReactDOMClient.hydrateRoot` like below.

```js
/* global ENACT_PACK_ISOMORPHIC */
import {createRoot, hydrateRoot} from 'react-dom/client';

import App from './App';

const appElement = (<App />);

// In a browser environment, render the app to the document.
if (typeof window !== 'undefined') {
  const container = document.getElementById('root');
	if (ENACT_PACK_ISOMORPHIC) {
		hydrateRoot(container, appElement);
	} else {
		createRoot(container).render(appElement);
	}
}

export default appElement;
```

Now, you are all set to use the new Concurrent Features of React 18.  
Let's look into some of the Concurrent Features in detail.


#### Automatic Batching
In earlier versions of React, batching was only done for the React event handlers.  
With `createRoot`, all updates will be automatically batched, no matter where they originate from.  
This means that updates inside of timeouts, promises, native event handlers, or any other event will batch the same way as updates inside of React events:
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
We have an example app for demonstration [here](https://github.com/enactjs/samples/tree/master/sandstone/pattern-react18-new) at the `Automatic Batching` tab.  
In the example, we increment and decrement a variable by 1 for 1000 times and we count the re-renders. Before Automatic Batching, every time the value is changed the component had to re-render, slowing the app for no real reason.


#### startTransition
A transition is a new concept in React to distinguish between urgent and non-urgent updates.  
Updates wrapped in `startTransition` are handled as non-urgent and will be interrupted if more urgent updates like clicks or keypresses come in. If a transition gets interrupted by the user (for example, by typing multiple characters in a row), React will throw out the stale rendering work that wasn’t finished and render only the latest update.

Imagine that you have multiple tabs and when a tab is selected, some data needs to be fetched.

Until React 17, when needing to fetch data before showing some UI that depends on that data, a custom loading state would have been rendered in its place(if the app developers decided to have a visual loading state), for example a spinner, until the request resolved. The main disadvantage is that the previous state of the UI was automatically lost.

With React18's `useTransition` hook, the previous state of the UI can be held until the data is ready.

```js
const [isPending, startTransition] = useTransition({timeoutMs: 3000});
```
The fetching of the new data is wrapped inside `startTransition`. The `isPending` tells if the content is currently being loaded or not. Its `timeoutMs` property specifies how long we're willing to wait for the transition to finish.  
Now instead of switching tabs immediately, the current tab continues to show its content until the new tab's content is ready. There is also the possibility to show a loading indicator, by making use of the `isPending` prop of `useTransition`.

[Here](https://github.com/enactjs/samples/tree/master/sandstone/pattern-react18-new) is an example app for demonstration.
Check out the `useTransition` tab.


#### Suspense
`Suspense` lets you declaratively specify the loading state for a part of the component tree if it’s not yet ready to be displayed:
```js
function ProfilePage() {
    return (
        <Suspense fallback={<Spinner />}>
            <ProfileDetails />
            <Suspense fallback={<Spinner />}>
                <ProfileTimeline />
            </Suspense>
        </Suspense>
    );
}
```
Let's look at the example app from [here](https://github.com/enactjs/samples/tree/master/sandstone/pattern-react18-new) at the `Suspense` tab.  
We have two panels, one with `Suspense`, one without. They both load the same list of images. On the first panel, where we have implemented `Suspense`, we can see that until the data is available, we display a skeleton page that has the exact visual structure of the page with placeholders for the lazy loading data. This offers a more pleasant UI experience. As opposed to it, on the second panel, where we haven't implemented `Suspense`, we can observe that it takes several seconds for content to show on the page. During this time user sees a blank page that might be confusing.

So far, we took around for key Concurrent Features of React 18, other than this, React 18 introduces new hooks like `useId`, `useDeferredValue`, etc.  
If you want more information, please refer to [How to Upgrade to React 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html) and other great articles from the official [React Blog](https://react.dev/blog).


### cli
`@enact/cli` must be upgraded to version `5.0.0` or newer like below.  

```sh
npm install -g @enact/cli
```

`@enact/cli` `5.0.0` updates the `webpack` to `5.x`, `eslint` to `8.x`, `jest` to `27.x`,
`react`, `react-dom` to `18.x`, and drops the support of `enzyme`.  
Developers should ensure their code does not rely on features that are no longer available in these versions.

Please do not hesitate to replace `enzyme` with [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) when you make your unit tests.

As `@enact/cli` updates `react` and `react-dom` to `18.x`, please make sure to follow the above new `hydrateRoot` API pattern to work prerendering properly.

As we update to `eslint 8`, some of the lint rules could be changed. If you run into unknown lint warnings or errors, don't be afraid, and please proceed to fix them. They are likely to be the rules from [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react), so refer to the console message and look up which rule is related.  

`webpack 5` removed polyfills for native NodeJS libraries like `crypto`.  
But `@enact/cli` needs to have NodeJS polyfills to run Screenshot tests so we've added `node-polyfill-webpack-plugin`. So, if you were using those polyfills, you will be fine.  
Although `@enact/cli` supports them for specific reasons, please avoid using it in the front-end code.


### webOS TV
Enact 4.5 no longer supports the 2022 TV platform or earlier versions.

## sandstone

### General

All unit tests were migrated to [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/).  
All components are updated to use `forwardCustom` and add `type` when forwarding custom events. If you were using `event` object from custom events, it may not have the information that you expect.

### `DatePicker` and `TimePicker`
They are changed to not show a pressing effect on touch input.

### `FixedPopupPanels`, `FlexiblePopupPanels`, `Popup`, and `PopupTabLayout`
Detail property containing `inputType` is added in `onClose` event payload.

### `Icon`
The public class name `icon` is added.  
The new icon `wallpaper` is added.

### `Panels.Header` and `WizardPanels`
The prop `noSubtitle` is added to hide subtitle area.

### `Panels.Header` and `RadioItem`
They are changed to use `onClick` instead of `onTap` for touch support.

### `Picker` and `RangePicker`
The prop `changedBy` is added to provide a way to control left and right keys in horizontal joined Picker.  
They are changed to read out `title`.

### `Scroller`
The prop `editable` is added to enable editing items in the scroller.  
Scrollbar thumb is now read out 'press ok button to read text' additionally when `focusableScrollbar` prop is `byEnter` and read out 'leftmost', 'rightmost', 'topmost', or 'downmost' when reaching the end of the scroll.

### `Scroller` and `VirtualList`
They are changed to show overscroll effect when flicking by default.  
The props `data-webos-voice-focused`, `data-webos-voice-disabled`, and `data-webos-voice-group-label` are added.

### `TabLayout`
The component is changed to eliminate the horizontal maximum number of tabs.

### `VideoPlayer`
The props `backButtonAriaLabel`, `onWillFastForward`, `onWillJumpBackward`, `onWillJumpForward`, `onWillPause`, `onWillPlay`, and `onWillRewind` are added.  
The prop `onBack` is added to provide a way to exit the video player via touch.

## ui

### General
All components are updated to use `forwardCustom` and add `type` when forwarding custom events. If you were using `event` object from custom events, it may not have the information that you expect.

### `MarqueeDecorator`
The `locale` type for `forceDirection` prop is added not to override the direction depending on contents.  
The `className` config is deprecated and has been replaced by `css`. It will be removed in 5.0.0. Use `css` instead to customize the marquee styles.

### `Scroller` and `VirtualList`
The props `data-webos-voice-focused`, `data-webos-voice-disabled`, and `data-webos-voice-group-label` are removed.

## spotlight
It has been changed to not focus on an invisible element.  
An optional `containerOption.toOuterContainer` parameter is added to `focus` function to search target recursively to outer container.
