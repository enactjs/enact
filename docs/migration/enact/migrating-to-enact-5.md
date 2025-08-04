---
title: Migrating to Enact 5.0
toc: 2
---

## Overview
This document lists changes between Enact versions 4.5 and 5.0 likely to affect most apps.  If you
are coming from Enact 3.x, please [migrate to 4.0](./migrating-to-enact-4.md) and then consult
this guide.

## General Changes

### React and React DOM

Enact 5.0 updates the `react` and `react-dom` dependencies to 19.x. Developers should ensure
their code does not rely on features that are no longer available in these versions.
React 19 introduces Actions, new API `use`, `ref` as a prop, `Context` as a provider and some deprecated APIs.

#### Actions
Actions in React 19 are new features designed to handle asynchronous transitions automatically, such as submitting a form or fetching data.

For example, you can use `useTransition` to handle the pending state for you:

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
The async transition will immediately set the `isPending` state to `true`, make the async request(s), and then switch `isPending` to `false` after any transitions. This allows you to keep the current UI responsive and interactive while the data is changing.

Please take a look at the new hooks for Actions, such as `useActionState` or `useOptimistic`, too.

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
In React 19, you can now access ref as a prop for function components:

```js
function MyComponent({ref}) {
  return <button ref={ref}>Button</button>;
}
// Usage
<MyComponent ref={ref} />;
```

Function components no longer need `forwardRef` to expose a DOM node to a parent component. `forwardRef` will be deprecated and removed in future versions.

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

For more details, please refer to [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) and [React v19](https://react.dev/blog/2024/12/05/react-19) from React Blog.

### cli
`@enact/cli` must be upgraded to version `7.0.0` or newer, as shown below.

```sh
npm install -g @enact/cli@next
```

`@enact/cli` updates the `eslint` to `9.x`, `jest` to `29.x`, and `react`, `react-dom` to `19.x`.
Developers should ensure their code does not rely on features that are no longer available in these versions.

As `@enact/cli` updates the minimum version of `Node` to `20.10.0`, please check your development environment before installing `@enact/cli`.

As we update to `eslint 9`, some of the lint rules could be changed. If you run into unknown lint warnings or errors, don't be afraid, and please proceed to fix them. They are likely to be the rules from [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react), so refer to the console message and look up which rule is related.

### webOS TV

Enact 5.0 no longer supports the 2025 TV platform or earlier versions.

## Sandstone

### General
We've changed the default theme for webOS TV from `sandstone` to `limestone`.  If you would like to migrate your existing `sandstone` app,
please follow the steps below.

1. Update your `package.json`
```js
  ...
  "enact": {
    "theme": "limestone"
  },
  ...
  "dependenceis": {
    "@enact/core": "^5.0.0",
    "@enact/i18n": "^5.0.0",
    "@enact/limestone": "enactjs/limestone#1.0.0",
    "@enact/spotlight": "^5.0.0",
    "@enact/ui": "^5.0.0",
    ...
  }
```

2. Update the paths for importing components and any `sand` prefix to `lime`
```js
  // sandstone
  import Button from `@enact/sandstone/Button`

  // limestone
  import Button from `@enact/limestone/Button`

```

3. Delete your `npm-shrinkwrap.json` file and install the dependencies
```shell
$ rm -rf npm-shrinkwrap.json
$ npm install
$ npm shrinkwrap
```


Limestone now uses the Enova design-tokens system to style its components, importing semantic tokens from [@enovaui/webos-tokens](https://github.com/enovaui/design-tokens/blob/master/packages/webos-tokens) in the [Enova design-tokens](https://github.com/enovaui/design-tokens) repository. This enables consistent and customizable styling across all components.

With the removal of the `ReactDOM.findDOMNode` API, `ContextualPopupDecorator` and `Dropdown` have been changed to include a sibling DOM node by using `@enact/core/internal/WithRef` to access DOM nodes.

#### Tips

Due to introducing `@enact/core/internal/WithRef` HoC, one of your apps can face unexpected issues. We have found 2 sample cases that you should know in advance.

##### `ContextualPopupDecorator`
Make sure your component wrapped with `ContextualPopupDecorator` passes the `rest` props to the inner component to get the proper ref, as shown below.

```js
const SampleButton = kind({
  render: (props) => {
    const {icon, ...rest} = props;

    return (
      <Icon
        {...rest} // Ensure the inner component receives the `rest` props
        //...
      >{icon}</Icon>
    );
  }
});

const ContextualSampleButton = ContextualPopupDecorator(SampleButton);
```

##### `Panels`
Make sure the root element of your `Panel` component inside `Panels` is not a `<>` (fragment). It will result in incorrect panel transition animations.


```js
const SamplePanels = kind({
  render: (props) => {
    return (
      <Panels>
        <Panel>
          <> {/* This should be changed to <div> */}
            <ComponentA />
            <ComponentB />
          </>
        </Panel>
      </Panels>
    );
  }
});
```

## Changes of Limestone from Sandstone

### `Alert`
The prop `overlayPosition` is added to set the position of the alert when the type is `overlay`.

### `Button`
The prop `bordered` and `centered` are added.

### `Card`
The new component `Card` is added.

### `Chip`
The new component `Chip` is added.

### `Chips`
The new component `Chips` is added.

### `ContextualMenuDecorator`
`offset` prop now accepts a `large` value.

### `ContextualPopupDecorator`
`offset` prop now accepts a `large` value.

### `Heading`
The default value of the `size` prop is `tiny`.

### `Icon`
New icons are added.

### `ImageItem`
The prop `wideImage` is added.
The props `children` and `label` accept a `Node` type value.

### `Input`
The prop `buttons` is added.


### `KeyGuide`
The image-based `keyGuide` is added.

### `Switch`
The Switch icon is now drawn using CSS instead of an icon font.

### `TabLayout`
Tabs in horizontal `TabLayout` now support scrolling.
The prop `primaryIndex` is added to focus primary tab when pressing back key from other tabs or initial rendering.

### `VideoPlayer`
The prop `includeTimeHour` is added to conditionally show hour for current and total time

### `WizardPanels`
The subtitle of `WizardPanels` now supports a marquee effect.

### Style
Various styling changes have been made to support new UI/UX designs for the webOS TV platform.

#### Colors
The table below shows which less variables in sandstone match which variable or value in limestone.

##### Changed
| Sandstone                                               | Limestone                                                             |
|:--------------------------------------------------------|:----------------------------------------------------------------------|
| `@sand-bg-color`                                        | `var(--semantic-color-background-full-default)`                       |
| `@sand-text-color`                                      | `var(--semantic-color-on-background-main)`                            |
| `@sand-text-sub-color`                                  | `var(--semantic-color-on-background-sub)`                             |
| `@sand-shadow-base-color`                               | `var(--semantic-color-on-background-black)` with alpha 0.35           |
| `@sand-component-text-color`                            | `var(--semantic-color-on-surface-main)`                               |
| `@sand-component-text-sub-color`                        | `var(--semantic-color-on-surface-sub)`                                |
| `@sand-component-bg-color`                              | `var(--semantic-color-surface-default)`                               |
| `@sand-component-active-indicator-bg-color`             | `var(--semantic-color-surface-default-indicator)`                     |
| `@sand-component-inactive-indicator-bg-color`           | `var(--semantic-color-surface-default-indicator)` with alpha 0.4      |
| `@sand-focus-text-color`                                | `var(--semantic-color-on-surface-main-focused)`                       |
| `@sand-focus-bg-color`                                  | `var(--semantic-color-surface-default-focused)`                       |
| `@sand-component-focus-text-color`                      | `var(--semantic-color-on-surface-main-focused)`                       |
| `@sand-component-focus-active-indicator-bg-color`       | `var(--semantic-color-on-surface-main-focused)`                       |
| `@sand-component-focus-inactive-indicator-bg-color`     | `var(--semantic-color-on-surface-main-focused)` with alpha 0.4        |
| `@sand-selected-color`                                  | `var(--semantic-color-on-surface-main-selected)`                      |
| `@sand-selected-text-color`                             | `var(--semantic-color-on-surface-main-selected)`                      |
| `@sand-selected-bg-color`                               | `var(--semantic-color-surface-default-selected)`                      |
| `@sand-disabled-focus-bg-color`                         | `var(--semantic-color-surface-default-disabled-focused)`              |
| `@sand-disabled-selected-color`                         | `var(--semantic-color-on-surface-main-selected)`                      |
| `@sand-disabled-selected-bg-color`                      | `var(--semantic-color-surface-accent)`                                |
| `@sand-disabled-selected-focus-color`                   | `var(--semantic-color-on-surface-main-selected)`                      |
| `@sand-disabled-selected-focus-bg-color`                | `var(--semantic-color-surface-accent)`                                |
| `@sand-fullscreen-bg-color`                             | `var(--semantic-color-background-full-default)`                       |
| `@sand-overlay-text-shadow`                             | `0 4px 4px var(--semantic-color-on-background-black)` with alpha 0.35 |
| `@sand-overlay-bg-color`                                | `var(--semantic-color-background-overlay-default)`                    |
| `@sand-selection-color`                                 | `@lime-input-selection-color`                                         |
| `@sand-selection-bg-color`                              | `@lime-input-selection-bg-color`                                      |
| `@sand-toggle-off-color`                                | `@lime-switch-icon-bg-color`                                          |
| `@sand-toggle-off-bg-color`                             | `@lime-switch-bg-color`                                               |
| `@sand-toggle-on-color`                                 | `@lime-switch-selected-icon-bg-color`                                 |
| `@sand-toggle-on-bg-color`                              | `@lime-switch-selected-bg-color`                                      |
| `@sand-progress-color`                                  | `var(--semantic-color-on-surface-accent)`                             |
| `@sand-progress-bg-color`                               | `var(--semantic-color-surface-default-track)`                         |
| `@sand-progress-bg-color-opacity`                       | `1`                                                                   |
| `@sand-progress-highlighted-color`                      | `@lime-progressbar-highlighted-fill-bg-color`                         |
| `@sand-progress-slider-color`                           | `var(--semantic-color-on-surface-accent)`                             |
| `@sand-invalid-sub-color`                               | `var(--semantic-color-on-background-default-error)`                   |
| `@sand-checkbox-color`                                  | `var(--semantic-color-on-background-main)`                            |
| `@sand-keyguide-bg-base-color`                          | `var(--semantic-color-background-overlay-default)`                    |
| `@sand-keyguide-bg-color-opacity`                       | `1`                                                                   |
| `@sand-alert-overlay-text-color-rgb`                    | `@lime-alert-overlay-label-color`                                     |
| `@sand-alert-overlay-text-sub-color`                    | `@lime-alert-overlay-label-sub-color`                                 |
| `@sand-button-text-color`                               | `@lime-button-fill-label-color`                                       |
| `@sand-button-bg-color`                                 | `@lime-button-fill-container-color`                                   |
| `@sand-button-border-color`                             | `@lime-button-outline-border-color`                                   |
| `@sand-button-focus-bg-color`                           | `@lime-button-fill-container-focused-color`                           |
| `@sand-button-selected-text-color`                      | `@lime-button-fill-label-selected-color`                              |
| `@sand-button-selected-bg-color`                        | `@lime-button-fill-container-selected-color`                          |
| `@sand-button-focus-filter`                             | `@lime-button-filter-focused`                                         |
| `@sand-button-selected-filter`                          | `@lime-button-filter-selected`                                        |
| `@sand-button-transparent-text-color`                   | `@lime-button-transparent-label-color`                                |
| `@sand-button-focus-icononly-bg-color`                  | `@lime-button-icononly-bg-focused-color`                              |
| `@sand-button-text-shadow`                              | `@lime-button-text-shadow`                                            |
| `@sand-checkbox-text-color`                             | `@lime-checkbox-icon-color`                                           |
| `@sand-checkbox-bg-color`                               | `@lime-checkbox-container-color`                                      |
| `@sand-checkbox-border-color`                           | `@lime-checkbox-border-color`                                         |
| `@sand-checkbox-disabled-selected-text-color`           | `@lime-checkbox-icon-selected-disabled-color`                         |
| `@sand-checkbox-disabled-selected-bg-color`             | `@lime-checkbox-container-selected-disabled-color`                    |
| `@sand-checkbox-disabled-selected-border-color`         | `@lime-checkbox-border-selected-disabled-color`                       |
| `@sand-checkbox-focus-disabled-selected-text-color`     | `@lime-checkbox-icon-selected-disabled-focused-color`                 |
| `@sand-checkbox-focus-disabled-selected-bg-color`       | `@lime-checkbox-container-selected-disabled-focused-color`            |
| `@sand-checkbox-focus-disabled-selected-border-color`   | `@lime-checkbox-border-selected-disabled-focused-color`               |
| `@sand-checkbox-focus-text-color`                       | `@lime-checkbox-icon-focused-color`                                   |
| `@sand-checkbox-focus-bg-color`                         | `@lime-checkbox-container-focused-color`                              |
| `@sand-checkbox-focus-border-color`                     | `@lime-checkbox-border-focused-color`                                 |
| `@sand-checkbox-selected-text-color`                    | `@lime-checkbox-icon-selected-color`                                  |
| `@sand-checkbox-selected-bg-color`                      | `@lime-checkbox-container-selected-color`                             |
| `@sand-checkbox-selected-border-color`                  | `@lime-checkbox-border-selected-color`                                |
| `@sand-checkbox-selected-focus-text-color`              | `@lime-checkbox-icon-selected-focused-color`                          |
| `@sand-checkbox-selected-focus-bg-color`                | `@lime-checkbox-container-selected-focused-color`                     |
| `@sand-checkbox-selected-focus-border-color`            | `@lime-checkbox-border-selected-focused-color`                        |
| `@sand-checkbox-indeterminate-text-color`               | `@lime-checkbox-icon-indeterminate-color`                             |
| `@sand-checkbox-indeterminate-bg-color`                 | `@lime-checkbox-container-indeterminate-color`                        |
| `@sand-checkbox-indeterminate-border-color`             | `@lime-checkbox-border-indeterminate-color`                           |
| `@sand-checkbox-indeterminate-focus-text-color`         | `@lime-checkbox-icon-indeterminate-focused-color`                     |
| `@sand-checkbox-indeterminate-focus-bg-color`           | `@lime-checkbox-container-indeterminate-focused-color`                |
| `@sand-checkbox-indeterminate-focus-border-color`       | `@lime-checkbox-border-indeterminate-focused-color`                   |
| `@sand-checkbox-standalone-bg-disabled-focus-bg-color`  | `@lime-checkbox-container-standalone-disabled-focused-color`          |
| `@sand-contextualpopup-bg-color`                        | `@lime-contextualpopup-container-color`                               |
| `@sand-dropdown-selected-text-color`                    | `@lime-dropdown-label-selected-color`                                 |
| `@sand-heading-text-color`                              | `@lime-heading-label-main-color`                                      |
| `@sand-heading-subtitle-text-color`                     | `@lime-heading-label-sub-color`                                       |
| `@sand-heading-border-color`                            | `@lime-heading-border-color`                                          |
| `@sand-flexiblepopuppanels-panel-bg-color`              | `@lime-flexiblepopuppanels-panel-bg-color`                            |
| `@sand-fixedpopuppanels-bg-color`                       | `@lime-fixedpopuppanels-background-color`                             |
| `@sand-fixedpopuppanels-shadow`                         | `@lime-overlay-shadow`                                                |
| `@sand-formcheckboxitem-focus-text-color`               | `@lime-formcheckboxitem-label-main-focused-color`                     |
| `@sand-iconitem-label-color`                            | `@lime-iconitem-inner-label-color`                                    |
| `@sand-iconitem-label-dark-color`                       | `@lime-iconitem-inner-label-dark-color`                               |
| `@sand-iconitem-label-dark-color`                       | `@lime-iconitem-inner-label-dark-color`                               |
| `@sand-iconitem-border-color`                           | `@lime-iconitem-inner-border-color`                                   |
| `@sand-imageitem-caption-color`                         | `@lime-imageitem-label-main-color`                                    |
| `@sand-imageitem-label-color`                           | `lime-imageitem-label-sub-color`                                      |
| `@sand-imageitem-selected-selection-icon-bg-color`      | `@lime-imageitem-selection-container-selected-color`                  |
| `@sand-imageitem-selected-selection-icon-color`         | `@lime-imageitem-selection-icon-selected-color`                       |
| `@sand-item-label-color`                                | `@lime-item-label-sub-color`                                          |
| `@sand-item-focus-label-color`                          | `@lime-item-label-sub-focused-color`                                  |
| `@sand-item-disabled-focus-bg-color`                    | `@lime-item-container-disabled-focused-color`                         |
| `@sand-inputfield-text-color`                           | `@lime-inputfield-label-inactive-color`                               |
| `@sand-inputfield-placeholder-color`                    | `@lime-inputfield-label-inactive-color`                               |
| `@sand-inputfield-placeholder-active-color`             | `@lime-inputfield-label-inactive-focused-color`                       |
| `@sand-inputfield-focus-text-color`                     | `@lime-inputfield-label-active-color`                                 |
| `@sand-inputfield-disabled-text-color`                  | `@lime-inputfield-label-inactive-color`                               |
| `@sand-inputfield-invalid-color`                        | `@lime-inputfield-invalid-color`                                      |
| `@sand-inputfield-invalid-tooltip-color`                | `@lime-inputfield-invalid-tooltip-color`                              |
| `@sand-item-label-color`                                | `@lime-item-label-sub-color`                                          |
| `@sand-item-focus-label-color`                          | `@lime-item-label-sub-focused-color`                                  |
| `@sand-keyguide-bg-color`                               | `@lime-keyguide-container-color`                                      |
| `sand-keyguide-item-color`                              | `@lime-keyguide-label-color`                                          |
| `@sand-picker-text-color`                               | `@lime-picker-label-color`                                            |
| `@sand-picker-indicator-active-bg-color`                | `@lime-picker-indicator-color`                                        |
| `@sand-picker-indicator-active-focus-bg-color`          | `@lime-picker-indicator-focused-color`                                |
| `@sand-picker-indicator-inactive-bg-color`              | `@lime-picker-indicator-color` with alpha 0.4                         |
| `@sand-picker-indicator-inactive-focus-bg-color`        | `@lime-picker-indicator-focused-color` with alpha 0.4                 |
| `@sand-picker-joined-horizontal-text-color`             | `@lime-picker-joined-label-color`                                     |
| `@sand-picker-joined-horizontal-bg-color`               | `@lime-picker-container-color`                                        |
| `@sand-popuptablayout-bg-color`                         | `@lime-popuptablayout-content-background-color`                       |
| `@sand-progressbar-bar-bg-color`                        | `@lime-progressbar-track-color`                                       |
| `@sand-progressbar-load-bg-color`                       | `@lime-progressbar-track-buffer-color`                                |
| `@sand-progressbar-fill-bg-color`                       | `@lime-progressbar-track-active-color`                                |
| `@sand-progressbar-highlighted-fill-bg-color`           | `@lime-progressbar-track-active-focused-color`                        |
| `@sand-progressbutton-bar-color`                        | `@lime-progressbutton-track-color`                                    |
| `@sand-progressbutton-focus-fill-color`                 | `@lime-progressbutton-track-active-focused-color`                     |
| `@sand-radioitem-indicator-color`                       | `@lime-radioitem-icon-color`                                          |
| `@sand-radioitem-indicator-bg-color`                    | `@lime-radioitem-container-color`                                     |
| `@sand-radioitem-indicator-border-color`                | `@lime-radioitem-border-color`                                        |
| `@sand-radioitem-focus-indicator-color`                 | `@lime-radioitem-icon-focused-color`                                  |
| `@sand-radioitem-focus-indicator-bg-color`              | `@lime-radioitem-container-focused-color`                             |
| `@sand-radioitem-focus-indicator-border-color`          | `@lime-radioitem-border-focused-color`                                |
| `@sand-radioitem-selected-indicator-color`              | `@lime-radioitem-icon-selected-color`                                 |
| `@sand-radioitem-selected-indicator-bg-color`           | `@lime-radioitem-container-selected-color`                            |
| `@sand-radioitem-selected-indicator-border-color`       | `@lime-radioitem-border-selected-color`                               |
| `@sand-radioitem-selected-focus-indicator-color`        | `@lime-radioitem-icon-selected-focused-color`                         |
| `@sand-radioitem-selected-focus-indicator-bg-color`     | `@lime-radioitem-container-selected-focused-color`                    |
| `@sand-radioitem-selected-focus-indicator-border-color` | `@lime-radioitem-border-selected-focused-color`                       |
| `@sand-spinner-text-color`                              | `@lime-spinner-label-color`                                           |
| `@sand-steps-pageindicator-current-bg-color`            | `@lime-steps-indicator-icon-active-color`                             |
| `@sand-switch-color`                                    | `@lime-switch-handle-inactive-color`                                  |
| `@sand-switch-bg-color`                                 | `@lime-switch-container-inactive-color`                               |
| `@sand-switch-focus-color`                              | `@lime-switch-handle-inactive-focused-color`                          |
| `@sand-switch-selected-color`                           | `@lime-switch-handle-active-color`                                    |
| `@sand-switch-selected-bg-color`                        | `@lime-switch-container-active-color`                                 |
| `@sand-switch-selected-focus-color`                     | `@lime-switch-handle-active-focused-color`                            |
| `@sand-switch-disabled-selected-color`                  | `@lime-switch-handle-active-disabled-color`                           |
| `@sand-switch-disabled-selected-bg-color`               | `@lime-switch-container-active-disabled-color`                        |
| `@sand-scrollbar-track-bg-color`                        | `@lime-scroll-track-color`                                            |
| `@sand-scrollbar-thumb-bg-color`                        | `@lime-scroll-handle-color`                                           |
| `@sand-scrollbar-thumb-focus-bg-color`                  | `@lime-scroll-handle-focused-color`                                   |
| `@sand-scrollbar-thumb-focus-direction-indicator-color` | `@lime-scroll-arrow-color`                                            |
| `@sand-scrollbar-thumb-focus-box-shadow-color`          | `@lime-scrollbar-thumb-focus-box-shadow-color`                        |
| `@sand-slider-bar-bg-color`                             | `@lime-slider-track-color`                                            |
| `@sand-slider-fill-bg-color`                            | `@lime-slider-track-active-color`                                     |
| `@sand-slider-load-bg-color`                            | `@lime-slider-track-buffer-color`                                     |
| `@sand-slider-knob-bg-color`                            | `@lime-slider-handle-color`                                           |
| `@sand-slider-knob-border-color`                        | `@lime-slider-handle-border-color`                                    |
| `@sand-slider-focus-knob-bg-color`                      | `@lime-slider-handle-focused-color`                                   |
| `@sand-slider-focus-knob-border-color`                  | `@lime-slider-handle-focused-border-color`                            |
| `@sand-slider-focus-knob-shadow`                        | `@lime-slider-handle-focused-shadow`                                  |
| `@sand-tooltip-bg-color`                                | `@lime-tooltip-container`                                             |
| `@sand-tooltip-text-color`                              | `@lime-tooltip-label`                                                 |
| `@sand-video-player-title-color`                        | `@lime-video-player-label-color`                                      |

##### Added
- `@lime-alert-full-bg-color`
- `@lime-button-fill-container-disabled-focused-color`, `@lime-button-fill-icon-color`, `@lime-button-fill-icon-selected-color`, `@lime-button-fill-label-focused-color`, `@lime-button-outline-container-color`, `@lime-button-outline-container-focused-color`, `@lime-button-outline-container-selected-color`, `@lime-button-outline-border-selected-color`, `@lime-button-outline-label-color`, `@lime-button-outline-label-focused-color`, `@lime-button-outline-label-selected-color`, `@lime-button-transparent-container-focused-color`, `@lime-button-transparent-container-selected-color`, `@lime-button-transparent-label-focused-color`, `@lime-button-transparent-icon-color`, `@lime-button-transparent-icon-focused-color`, `@lime-button-transparent-icon-selected-color`, `@lime-button-transparent-label-selected-color`.
- `@lime-checkboxitem-item-container-selected-color`.
- `@lime-contextualpopup-border-color`.
- `@lime-datetime-label-color`.
- `@lime-heading-label-tiny-color`.
- `@lime-formcheckboxitem-label-sub-focused-color`.
- `@lime-iconitem-inner-icon-color`, `@lime-iconitem-inner-container-color`, `@lime-iconitem-outer-label-main-color`.
- `@lime-input-button-popup-transparent-label-color`, `@lime-input-button-popup-transparent-icon-color`, `@lime-input-fullscreen-dot-color`, `@lime-input-header-popup-label-main-color`, `@lime-input-header-popup-label-sub-color`, `@lime-input-inputfield-popup-container-color`, `@lime-input-inputfield-popup-label-inactive-color`, `@lime-input-overlay-dot-color`.
- `@lime-inputfield-container-color`, `@lime-inputfield-container-disabled-focused-color`, `@lime-inputfield-cursor-color`, `@lime-inputfield-label-success-color`.
- `@lime-imageitem-full-image-border-color`,`@lime-imageitem-label-main-focused-color`, `@lime-imageitem-label-main-selected-color`,`@lime-imageitem-label-sub-focused-color`, `@lime-imageitem-label-sub-selected-color`.
- `@lime-item-label-main-selected-color`, `@lime-item-label-sub-selected-color`, `@lime-item-container-selected-color`, `@lime-item-container-disabled-focused-color`.
- `@lime-keyguide-icon-color`.
- `@lime-mediaoverlay-inner-border-focused`.
- `@lime-overlay-shadow`.
- `@lime-pageviews-bg-color`, `@lime-pageviews-indicator-icon-active`, `@lime-pageviews-indicator-icon-inactive`.
- `@lime-picker-icon-color`, `@lime-picker-icon-focused-color`.
- `@lime-progressbutton-track-active-color`, `@lime-progressbutton-track-focused-color`.
- `@lime-steps-indicator-icon-inactive-color`, `@lime-steps-step-icon-success-color`, `@lime-steps-step-label-active-color`, `@lime-steps-step-label-inactive-color`.
- `@lime-switchitem-item-selected-container-color`.
- `@lime-tablayout-tab-button-selected-color`, `@lime-tablayout-tab-container-selected-color`, `@lime-tablayout-tab-group-container-color`.
- `@lime-virtuallist-container-color`.

#### Removed
- `@sand-alert-overlay-focus-text-color`, `@sand-alert-overlay-disabled-selected-color`, `@sand-alert-overlay-disabled-selected-bg-color`, `@sand-alert-overlay-disabled-selected-focus-color`, `@sand-alert-overlay-disabled-selected-focus-bg-color`, `@sand-alert-overlay-progress-color-rgb`, `@sand-alert-overlay-progress-bg-color-rgb`, `@sand-alert-overlay-progress-bg-color-alpha`, `@sand-alert-overlay-checkbox-color`, `@sand-alert-overlay-checkbox-disabled-selected-text-color`, `@sand-alert-overlay-formcheckboxitem-focus-text-color`, `@sand-alert-overlay-item-disabled-focus-bg-color`.
- `@sand-dropdown-title-color`,
- `@sand-fixedpopuppanels-scrimtransparent-bg-color`.
- `@sand-item-focus-background`.
- `@sand-picker-joined-text-color`, `@sand-picker-joined-incrementer-color`, `@sand-picker-joined-focus-incrementer-color`, `@sand-picker-joined-focus-disabled-indicator-bg-color`, `@sand-picker-joined-focus-disabled-indicator-opacity`, `@sand-picker-joined-focus-disabled-indicator-active-opacity`.
- `@sand-popuptablayout-shadow`, `@sand-popuptablayout-scrimtransparent-bg-color`.
- `@sand-radioitem-disabled-selected-color`, `@sand-radioitem-disabled-selected-bg-color`, `@sand-radioitem-disabled-selected-border-color`, `@sand-radioitem-focus-disabled-selected-color`, `@sand-radioitem-focus-disabled-selected-bg-color`, `@sand-radioitem-focus-disabled-selected-border-color`.
- `@sand-slider-active-bar-bg-color`, `@sand-slider-disabled-focus-knob-bg-color`, `@lime-slider-disabled-knob-bg-color`, `@sand-slider-focus-bar-bg-color`, `@sand-slider-focus-load-bg-color`, `@sand-slider-focus-knob-bg-color`, `@sand-slider-active-fill-bg-color`.
- `@sand-spinner-text-shadow-color`.
- `@sand-tablayout-tab-horizontal-border-color`, `@sand-tablayout-tab-horizontal-selected-border-color`.
- `@sand-video-feedback-mini-text-color`, `@sand-video-player-title-text-shadow`.

## ui

### General
`ReactDOM.findDOMNode` API is removed. `Placeholder.PlaceholderControllerDecorator` and `ViewManager` is changed to have sibling DOM node by using `@enact/core/internal/WithRef` to access DOM nodes.

#### `ViewManager`
As `ReactDOM.findDOMNode` API is removed from `ViewManager`, transition needs `index` of the node to animate.
Each panel must be wrapped with `<div>` instead of `<>` to map properly to the transition group.

## spotlight
`spotlight/Spottable` is changed to have sibling DOM node by using `@enact/core/internal/WithRef` to access DOM nodes instead of using `ReactDOM.findDOMNode`.
