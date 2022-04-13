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
