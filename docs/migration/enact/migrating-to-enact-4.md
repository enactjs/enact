---
title: Migrating to Enact 4.0
toc: 2
---

## Overview
This document lists changes between Enact versions 3.x and 4.0 likely to affect most apps.  If you
are coming from Enact 2.x, please [migrate to 3.0](./migrating-to-enact-3.md) and then consult
this guide.

## General Changes

### React and React DOM
Enact 4.0 updates the `react` and `react-dom` dependencies to 17.x.  Developers should ensure
their code does not rely on features that are no longer available in these versions.
React 17 introduced the new JSX Transform. The big change is, with the new JSX Transform,
you can use JSX without importing React. Enact CLI 4 supports this feature on related commands
and you will now see below lint warning after packing or linting if you didn't change your code.

```js
warning  'React' is defined but never used  no-unused-vars
```

Well, you may see lots of them! But don't be afraid. Fortunately, React provides a module that automatically converts the code on behalf of you. It's "react-codemod". Please see more details on [here](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#removing-unused-react-imports.).

### cli
`cli` must be upgraded to version `4.0.0` or newer.

### webOS TV
Enact 4.0 no longer supports the 2021 TV platform or earlier versions.

## moonstone

### General
As we changed the default theme for webOS TV from `moonstone` to `sandstone`, we had to move
`moonstone` out of `enact` repo since `3.3.0`.
The new `moonstone` repo is [enactjs/moonstone](https://github.com/enactjs/moonstone).
We've done to update it with React 17.x recently.

## ui

### `A11yDecorator`
The `ui/A11yDecorator` has been removed.

### `Button`, `Icon`, `IconButton`, and `LabeledIcon`
The default `size` value has been removed.

### `BodyText`, `Button`, `Goup`, `Heading`, `Icon`, `IconButton`, `Image`, `ImageItem`, `LabeledIcon`, `Layout`, `ProgressBar`, `Repeater`, `Slider`, `SlotItem`, `Spinner`, `ToggleIcon`, `ToggleItem`, and `ViewManager`
The forwarding `ref`s to the repective root component support is added.

### `Touchable`
The `onHold` and `onHoldPulse` changed to `onHoldStart` and `onHold` respectively.

#### Example
##### 3.x
```js
...
import Button from '@enact/ui/Button';
...
<Button onHold={fn} onHoldPulse={fn} />
...
```
##### 4.0
```js
...
import Button from '@enact/ui/Button';
...
<Button onHoldStart={fn} onHold={fn} />
...
```
