---
title: Spotlight
toc: 2
---


## What Is Spotlight?

Spotlight is an extensible utility that enables users to navigate
applications using a keyboard or television remote control.  Responding to input
from the **UP**, **DOWN**, **LEFT**, **RIGHT**, and **RETURN** keys, Spotlight
provides a navigation experience that compares favorably to that of a
computer-with-mouse.

It was developed for use with the [Enact JavaScript framework](http://enactjs.com), but is useful as a standalone
library.

Spotlight is based on a fork of [JavaScript SpatialNavigation](https://github.com/luke-chang/js-spatial-navigation)
(c) 2016 Luke Chang, under the terms of the [Mozilla Public License](https://www.mozilla.org/en-US/MPL/2.0/).

## Using Spotlight Standalone

When you build an app with only `@enact/spotlight`—without a theme library—you wire up Spotlight yourself.
The steps below cover the minimum setup; the rest of this guide explains navigation, containers, styling, and
the API in detail.

### Install dependencies

Add `@enact/spotlight` to your project. Enact components also rely on `@enact/core` for the `kind` factory and on React:

```json
"dependencies": {
	"@enact/core": "^5.5.1",
	"@enact/spotlight": "^5.5.1",
	"react": "^19.2.7",
	"react-dom": "^19.2.7"
}
```

If you use the Enact CLI, create a new app with `enact create` and add `@enact/spotlight` to `package.json`, or
start from the [spotlight-sandbox](https://github.com/enactjs/samples/tree/master/ui/spotlight-sandbox) sample in
the Enact samples repository.

### Initialize Spotlight

Wrap your application root with `SpotlightRootDecorator`. This initializes Spotlight, attaches global key listeners,
and manages 5-way and pointer modes. See [SpotlightRootDecorator](#spotlightrootdecorator) for configuration options.

```js
import kind from '@enact/core/kind';
import SpotlightRootDecorator from '@enact/spotlight/SpotlightRootDecorator';

const AppView = kind({
	name: 'App',
	render: (props) => (
		<div {...props}>
			{/* spottable controls go here */}
		</div>
	)
});

export default SpotlightRootDecorator(AppView);
```

Do **not** wrap with both `SpotlightRootDecorator` and a theme decorator that already includes it (for example
`@enact/sandstone/ThemeDecorator`).

### Make controls spottable

Wrap each focusable control with the `Spottable` HOC. Spottable adds the `.spottable` CSS class, `tabIndex`, and key
handlers to the root DOM node. Spread the received props onto that node. See [Spottable](#spottable) for the full API.

```js
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';

const Button = Spottable(kind({
	name: 'Button',
	render: ({children, ...rest}) => (
		<div role="button" {...rest}>
			{children}
		</div>
	)
}));
```

Style the focused state using the `[data-spotlight-focused]` attribute or `focusEffectClass` on the root decorator.
See [Customizing the Focus Effect](#customizing-the-focus-effect).

Assign a `spotlightId` to controls and containers when you need to target them with `Spotlight.focus()`:

```js
<Button spotlightId="submit">Submit</Button>
```

### Organize navigation with containers

When a set of controls should be navigated as a group—for example, a radio cluster or a panel—wrap them in
`SpotlightContainerDecorator`. See [Containers](#containers).

```js
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

const Panel = SpotlightContainerDecorator('div');

<Panel spotlightId="settings">
	<Button spotlightId="option-a">Option A</Button>
	<Button spotlightId="option-b">Option B</Button>
</Panel>
```

### Move focus programmatically

When the spotted control is removed from the DOM (disabled, hidden, or unmounted), call `Spotlight.focus()` to move
focus to a known target. After DOM changes, call `focus` from a layout effect so Spotlight runs after the updated
tree is painted:

```js
import Spotlight from '@enact/spotlight';
import {useLayoutEffect, useRef} from 'react';

const pendingFocusRef = useRef(false);

useLayoutEffect(() => {
	if (pendingFocusRef.current) {
		pendingFocusRef.current = false;
		Spotlight.focus('button02');
	}
}, [showPanel]);

const handleRemovePanel = () => {
	pendingFocusRef.current = true;
	setShowPanel(false);
};
```

See [Selectors](#selectors) and [Spotlight API](#spotlight-api) for selector strings and cache refresh behavior.

### Try the sample app

The [spotlight-sandbox](https://github.com/enactjs/samples/tree/master/ui/spotlight-sandbox) sample is a standalone
Enact app that exercises nested containers, draggable spottable controls, disappearing controls, hold-to-activate,
and a wide test layout. Clone the samples repository, then from `ui/spotlight-sandbox` run `npm install` and
`npm run serve`. Use the arrow keys and Enter on your keyboard to explore each sample page.

## Modes

Spotlight operates in two mutually exclusive modes: **5-way mode** and **Pointer
mode**.  By default, Spotlight is configured to switch between these modes
whenever suitable input is received--i.e.: it switches to pointer mode on
`mousemove` and back to 5-way mode on `keydown`.

Spotlight initializes in 5-way mode. On webOS, the platform's current pointer mode is used instead.

## Navigation

Spotlight enables navigation between controls by assigning focus to one control
at a time.  Focus-enabled controls are considered to be "spottable". These spottable
controls take on the CSS class `.spottable`, which allow focused controls to be styled
on a per-kind basis using `.<kindClass>.spottable:focus` selectors.

Spotlight uses the native HTML DOM `focus` method to assign focus to controls. Form
elements can gain focus by default, but Spotlight designates a `tabindex` value to its
controls, meaning even a simple `div` can be a spottable control.

When an application loads, Spotlight will initially spot the first spottable
control. If a control has been programmatically spotted via `Spotlight.focus(element)`
immediately after being rendered, that control will be spotted instead.

In 5-way mode, Spotlight uses an algorithm to determine which spottable control
is the nearest one in the direction of navigation.  The coordinates of a
spottable control are derived from its actual position on the screen.

It's worth noting that spottable controls may be found on different hierarchical
levels of a component tree.  Spotlight facilitates seamless navigation
among the topmost spottable components found in the tree.

Spottable controls can receive `onSpotlight[Direction]` properties to handle custom
navigation actions.  This is mainly a convenience function used for preventing natural
5-way behavior and setting focus on specific spottable components that may not normally
be in the next component to be spotted.

```js
handleSpotlightDown = (e) => {
	e.preventDefault();
	e.stopPropagation();
	Spotlight.focus('[data-component-id="myButton"]');
}
```
```js
<Button data-component-id='myButton'>Source Button</Button>
<Button onSpotlightDown={this.handleSpotlightDown}>Target Button</Button>
```

## Selectors

Spotlight identifies spottable controls via selectors. A selector can be any of the
following types:
- a valid selector string for `querySelectorAll`
- a NodeList or an array containing DOM elements
- a single DOM element
- a string `'@<containerId>'` to indicate the specified container
- the string `'@'` to indicate the default container

There may be times where it is preferable to specify a selector instead of relying on a reference to an element
or `@<containerId>`. Each time a Spottable control receives focus via 5-way or pointer navigation, Spotlight updates
its cache of available Spottable controls. So for example, if your container DOM is updated programmatically, followed
by the need to set focus on a newly-created default Spottable control, you will be unable to spot the control by
calling focus on the container.

```js
Spotlight.focus('container-name');
```

Be default, Spotlight will not always update its cache of available Spottable controls when simply attempting to
set focus. This is done for performance reasons. Instead, you can supply a `querySelector` string that will allow
Spotlight to parse the selector, re-indexing the available Spottable controls.

```js
Spotlight.focus('[data-container-id="container-name"] .spottable');
```

## SpotlightRootDecorator
The `SpotlightRootDecorator` is a top-level HOC (Higher Order Component) that is
required to use Spotlight. It is responsible for initializing the Spotlight instance
and managing navigation event listeners.

To use Spotlight in an application, simply import and wrap the `SpotlightRootDecorator`
HOC around your application view:

```js
import ApplicationView from './ApplicationView';
import SpotlightRootDecorator from '@enact/spotlight/SpotlightRootDecorator';
const App = SpotlightRootDecorator(ApplicationView);
```

It's worth noting that `@enact/sandstone` applications include `SpotlightRootDecorator`
by default in its `@enact/sandstone/ThemeDecorator` HOC.

## Spottable

In order to make a control focus-enabled (or "spottable") with Spotlight, simply
wrap your base control with the `Spottable` HOC, like so:

```js
    import Spottable from '@enact/spotlight/Spottable';
    import Component from './Component';
    const SpottableComponent = Spottable(Component);
```

## Customizing the Focus Effect

Spotlight provides multiple ways to customize the visual appearance of focused components,
ranging from a zero-configuration CSS hook to an app-wide class applied via the root decorator.
All approaches use direct DOM manipulation and do not trigger React re-renders.

### `data-spotlight-focused` attribute

Every spottable component automatically receives the `data-spotlight-focused` DOM attribute
when it gains spotlight focus. The attribute is removed on blur. No configuration is required.

This is the recommended approach for component library authors styling focus within their own
component stylesheets:

```less
// Button.module.less
.button {
    &[data-spotlight-focused] {
        .bg {
            background-color: var(--my-focus-bg-color);
        }
    }
}
```

It can also be used as a global selector in any plain CSS or Less file:

```css
[data-spotlight-focused] {
    outline: 3px solid var(--my-focus-color);
    outline-offset: 2px;
}
```

### `focusEffectClass` configuration parameter

`SpotlightRootDecorator` accepts a `focusEffectClass` configuration parameter that applies
a CSS class to every focused spottable component across the entire application. This is
useful when an app needs to apply focus styles that are defined in its own stylesheet without
modifying any component internals.

```js
import SpotlightRootDecorator from '@enact/spotlight/SpotlightRootDecorator';

import ApplicationView from './ApplicationView';

import css from './App.module.less';

const App = SpotlightRootDecorator({focusEffectClass: css.focusRing}, ApplicationView);
```

```less
// App.module.less
.focusRing {
    outline: 3px solid var(--my-focus-color);
    outline-offset: 2px;
}
```

Note that when using CSS Modules, `css.focusRing` must be passed rather than the plain
string `'focusRing'`, since CSS Modules transforms class names at build time. This also
means the class is scoped to the stylesheet it is defined in, so it can style properties
on the focused element itself (such as `outline`, `box-shadow`, or `filter`) but cannot
reach into child nodes of other components.

For component-level customization of child nodes (such as a button's background), use the
`data-spotlight-focused` attribute selector inside the component's own stylesheet instead.

### Choosing the right approach

| Approach | Scope | Reaches into child nodes | CSS Modules compatible |
|---|---|---|---|
| `[data-spotlight-focused]` in component stylesheet | per-component | yes | yes |
| `[data-spotlight-focused]` in global stylesheet | all components | yes | n/a |
| `focusEffectClass` via `SpotlightRootDecorator` | all components | no | yes (pass `css.className`) |

## Containers

In order to organize controls into navigation groups, we have created Spotlight
containers.

A good example of how containers should be used is a set of radio buttons that
must be navigable separately from the rest of the app's controls.

When a Spotlight container is focused, it passes the focus to its own configurable
hierarchy of spottable child controls--specifically, to the last spottable child to
hold focus before the focus moved outside of the container.  If the container in
question has never been focused, it passes focus to its first spottable child.

To define a container, wrap your base control with the `SpotlightContainerDecorator`
HOC:

```js
import kind from '@enact/core/kind';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
const Container = SpotlightContainerDecorator(kind({
	name: 'Container',
	render: (props) => {
		return (
			<div {...props}>
				{/* A list of spottable controls */}
			</div>
		);
	}
}));
```

In a way, containers may be thought of as the branches--and spottable controls
as the leaves--of the Spotlight navigation tree.

A `spotlightDisabled` property may be applied to the container to temporarily disable the specified container's
spottable controls:

```js
import kind from '@enact/core/kind';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
const Container = SpotlightContainerDecorator('div');
const App = kind({
	name: 'App',
	render: (props) => {
		return (
			<Container {...props} spotlightDisabled>
				{/* A list of spottable controls */}
			</Container>
		);
	}
});
```


## Events

Spotlight uses native DOM events to navigate the available spottable controls and does not
directly dispatch synthetic events to the currently spotted control.

To determine if spotlight is the cause of a specific spotted control's key event, you can
validate the native `target` property of the key event against `document.activeElement`.


## Spotlight API

In order to use the Spotlight API, simply import Spotlight into your application and call
any of its available methods to manipulate how your application responds to navigation
events.

```js
import Spotlight from '@enact/spotlight';
```

#### `Spotlight.pause()`
Temporarily pauses Spotlight until `resume()` is called.

#### `Spotlight.resume()`
Resumes Spotlight navigation.

#### `Spotlight.focus([containerId/selector])`
+ `containerId/selector`: (optional) String / [Selector](./#selectors) (without @ syntax)

Dispatches focus to the specified containerId or the first spottable child that
matches `selector`. This method has no effect if Spotlight is paused.

#### `Spotlight.move(direction, [selector])`
+ `direction`: `'left'`, `'right'`, `'up'` or `'down'`
+ `selector`: (optional) [Selector](./#selectors) (without @ syntax)

Moves focus in the specified direction of `selector`. If `selector` is not specified,
Spotlight will move in the given direction of the currently spotted control.

## HOC Configuration Parameters And Properties

##### Spotlight HOC Configuration Parameters

Configuration parameters in the form of an object can be passed as an initial argument to a HOC when creating a
Spotlight control. In these cases, the HOC configuration parameters should remain static and unchanged in the
life-cycle of the control.

```js
import Spottable from '@enact/spotlight/Spottable';
// spottable control that doesn't emit `onClick` events when pressing the enter key
const Control = Spottable({emulateMouse: false}, 'div');
```

##### Spotlight HOC Properties

Spotlight HOCs are able to use properties that are passed to them via parent controls. These properties
are passed like in any other Enact component.

```js
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';

const SpottableComponent = Spottable('div');
const App = kind({
	render: () => (<SpottableComponent spotlightDisabled />)
});
```

### Spottable

For more details and full list of `Spottable` API, see [spotlight/Spottable](../../../modules/spotlight/Spottable/).

##### Configuration Parameters

`emulateMouse`
+ Type: [boolean]
+ Default: `true`

Whether or not the component should emulate mouse events as a response to Spotlight 5-way events.

##### Properties
`spotlightDisabled`
+ Type: [boolean]
+ Default: `false`

May be added to temporarily make a control not spottable.

`onSpotlightLeft`
`onSpotlightRight`
`onSpotlightUp`
`onSpotlightDown`
+ Type: [function]

A callback function to override default spotlight behavior when exiting the spottable control.

### SpotlightRootDecorator

For more details and full list of `SpotlightRootDecorator` API, see [spotlight/SpotlightRootDecorator](../../../modules/spotlight/SpotlightRootDecorator/).

##### Configuration Parameters

`noAutoFocus`
+ Type: [boolean]
+ Default: `false`

When `true`, the contents of the component will not receive spotlight focus after being rendered.

`rootId`
+ Type: [string]
+ Default: `'root'`

Specifies the id of the React DOM tree root node.

`focusEffectClass`
+ Type: [string]
+ Default: `null`

A CSS class name to apply globally to every spottable component when it receives spotlight focus.
Applied via direct DOM manipulation on focus and removed on blur — no React re-render is triggered.

```js
import css from './App.module.less';
const App = SpotlightRootDecorator({focusEffectClass: css.focusRing}, ApplicationView);
```

See [Customizing the Focus Effect](#customizing-the-focus-effect) for a full discussion of this
feature and guidance on when to use this versus the `data-spotlight-focused` attribute.

### Container

For more details and full list of `Container` API, see [spotlight/SpotlightContainerDecorator](../../../modules/spotlight/SpotlightContainerDecorator/).

##### Configuration Parameters

`defaultElement`
+ Type: [string|string[]]
+ Default: `'.spottable-default'`

The selector for the default spottable element within the container. When an array of selectors is
provided, the first selector that successfully matches a node is used.

`enterTo`
+ Type: [string]
+ Values: [`null`, `'last-focused'`, or `'default-element'`]
+ Default: `null`

If the focus originates from another container, you can define which element in
this container receives focus first.

`leaveFor`
+ Type: [object]
+ Values: {left: [selector](./#selectors), right: [selector](./#selectors), up: [selector](./#selectors), down: [selector](./#selectors)}
+ Default : `null`

If the focus leaves the current container, you can define which element
outside of this container receives focus using which 5-way direction key.
If `null`, the default 5-way behavior will be applied.
If you want the focus to move to the button on the left of the screen whose id value is `left` when pressing 5-way down, you just set the value to `{down: '#left'}`.
If you don't want the focus to leave the current container with a specific direction key, set `''` to the desired direction key, such as `{left:''}`.

`preserveId`
+ Type: [boolean]
+ Default: `false`

Whether the container will preserve the id when it unmounts.

#### Properties

`containerId`
+ Type: [string]

Specifies the container id. If the value is `null`, an id will be generated.

`spotlightRestrict`
+ Type: [string]
+ Values: [`'none'`, `'self-first'`, or `'self-only'`]
+ Default: `'none'`

Restricts or prioritizes focus to the controls in the current container.

```js
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Component from './Component';
const Container = SpotlightContainerDecorator({enterTo: 'last-focused', leaveFor: {left:'', right:''}, restrict: 'self-only'}, Component);
```

## Examples

#### Basic usage

```js
import kind from '@enact/core/kind';
import SpotlightRootDecorator from '@enact/spotlight/SpotlightRootDecorator';
import Spottable from '@enact/spotlight/Spottable';

const SpottableComponent = Spottable(kind({
	name: 'SpottableComponent',
	render: (props) => {
		return (
			<div {...props} />
		);
	}
}));

const App = SpotlightRootDecorator(kind({
	name: 'SpotlightRootDecorator',
	render: (props) => {
		return (
			<SpottableComponent {...props} />
		);
	}
}));
```

#### Customizing focus appearance with `data-spotlight-focused`

No configuration needed. Add the attribute selector to any component stylesheet:

```less
// MyComponent.module.less
.myComponent {
    &[data-spotlight-focused] {
        outline: 3px solid var(--my-focus-color);
    }
}
```

#### Applying an app-wide focus class via `SpotlightRootDecorator`

```js
import css from './App.module.less';
import ApplicationView from './ApplicationView';
import SpotlightRootDecorator from '@enact/spotlight/SpotlightRootDecorator';

const App = SpotlightRootDecorator({focusEffectClass: css.focusRing}, ApplicationView);
```

```less
// App.module.less
.focusRing {
    outline: 3px solid var(--my-focus-color);
    outline-offset: 2px;
}
```
