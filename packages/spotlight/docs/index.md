# SPOTLIGHT DOCUMENTATION #

1. [What Is Spotlight?](#1)
2. [Modes](#2)
3. [Navigation](#3)
4. [Selectors](#4)
5. [SpotlightRootDecorator](#5)
6. [Spottable](#6)
7. [Container](#7)
8. [Focusable](#8)
9. [Events](#9)
10. [Spotlight API](#10)
11. [HOC Parameters](#11)
12. [Examples](#12)

<a name="1"></a>
## 1. What Is Spotlight?

Spotlight is an extensible utility that enables users to navigate
applications using a keyboard or television remote control.  Responding to input
from the **UP**, **DOWN**, **LEFT**, **RIGHT**, and **RETURN** keys, Spotlight
provides a navigation experience that compares favorably to that of a
computer-with-mouse.

It was developed for use with the [Enact JavaScript framework](http://enactjs.com), but is useful as a standalone
library.

Spotlight is based on a fork of [JavaScript SpatialNavigation](https://github.com/luke-chang/js-spatial-navigation)
(c) 2016 Luke Chang, under the terms of the [Mozilla Public License](https://www.mozilla.org/en-US/MPL/2.0/).

<a name="2"></a>
## 2. Modes

Spotlight operates in two mutually exclusive modes: **5-way mode** and **Pointer
mode**.  By default, Spotlight is configured to switch between these modes
whenever suitable input is received--i.e.: it switches to pointer mode on
`mousemove` and back to 5-way mode on `keydown`.

<a name="3"></a>
## 3. Navigation

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

<a name="4"></a>
## 4. Selectors

Spotlight identifies spottable controls via selectors. A selector can be any of the
following types:
- a valid selector string for `querySelectorAll`
- a NodeList or an array containing DOM elements
- a single DOM element
- a string `'@<containerId>'` to indicate the specified container
- the string `'@'` to indicate the default container

<a name="5"></a>
## 5. SpotlightRootDecorator
The `SpotlightRootDecorator` is a top-level HOC (Higher Order Component) that is 
required to use Spotlight. It is responsible for initializing the Spotlight instance
and managing navigation event listeners.

To use Spotlight in an application, simply import and wrap the `SpotlightRootDecorator` 
HOC around your application view:

```javascript
import ApplicationView from './ApplicationView';
import {SpotlightRootDecorator} from 'enact-spotlight';
const App = SpotlightRootDecorator(ApplicationView);
```

It's worth noting that `enact-moonstone` applications include `SpotlightRootDecorator`
by default in its `MoonstoneDecorator` HOC.

<a name="6"></a>
## 6. Spottable

In order to make a control focus-enabled (or "spottable") with Spotlight, simply
wrap your base control with the `Spottable` HOC, like so:

```javascript
    import {Spottable} from 'enact-spotlight';
    import Component from './Component';
    const SpottableComponent = Spottable(Component);
```

<a name="7"></a>
## 7. Containers

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

```javascript
import kind from 'enact-core/kind';
import {SpotlightContainerDecorator} from 'enact-spotlight';
const Container = SpotlightContainerDecorator(kind({
	name: 'Container',
	render: ({className, ...rest}) => {
		return (
			<div className={className}>
				{/* A list of spottable controls */}
			</div>
		);
	}
}));
```

In a way, containers may be thought of as the branches--and spottable controls
as the leaves--of the Spotlight navigation tree.

<a name="8"></a>
## 8. Focusable

Sometimes it's necessary to change the style of an outer-control based on the
focus state of an inner-control--i.e.: in the case of a decorated spottable control.
The `SpotlightFocusableDecorator` HOC -- when used with the `SpotlightContainerDecorator`
HOC -- adds focus and state management in these scenarios by adding the CSS 
class `.focused` to your spottable outer-control when the spottable inner-control 
is focused. This allows decorated controls to be styled on a  per-kind basis 
using `.<kindClass>.focused` selectors.

The `SpotlightFocusableDecorator` HOC provides certain properties that can be used
to determine which element in your control should be designated as the inner or 
outer elements, allowing for complex and configurable controls.

To define a focusable control, wrap your base control with the `SpotlightFocusableDecorator`
& `SpotlightContainerDecorator` HOCs, and designate which controls should receive the
`onFocus`, `onKeyDown`, `spotlightDisabled`, and `decorated` properties:

```javascript
import kind from 'enact-core/kind';
import {Spottable, SpotlightContainerDecorator, SpotlightFocusableDecorator} from 'enact-spotlight';

const SpottableComponent = Spottable(kind({
	name: 'SpottableComponent',
	render: (props) => {
		return (
			<div {...props} />
		);
	}
}));
const FocusableComponent = SpotlightContainerDecorator(SpotlightFocusableDecorator(kind({
	name: 'FocusableComponent',
	render: ({className, onFocus, onKeyDown, spotlightDisabled, ...rest}) => {
		return (
			<SpottableComponent className={className} onFocus={onFocus} onKeyDown={onKeyDown} spotlightDisabled={spotlightDisabled}>
				<SpottableComponent {...rest} decorated spotlightDisabled={!spotlightDisabled} />
			</SpottableComponent>
		);
	}
})));
```

<a name="9"></a>
## 9. EVENTS ##

Spotlight uses native DOM events to navigate the available spottable controls and does not
directly dispatch synthetic events to the currently spotted control.

To determine if spotlight is the cause of a specific spotted control's key event, you can 
validate the native `target` property of the key event against `document.activeElement`.


<a name="10"></a>
## 10. SPOTLIGHT API ##

In order to use the Spotlight API, simply import Spotlight into your application and call
any of its available methods to manipulate how your application responds to navigation
events.

```javascript
import Spotlight from 'enact-spotlight';
```

#### `Spotlight.disable(containerId)` ####
+ `containerId`: (optional) String

May be used to temporarily disable the specified container's spottable controls.

#### `Spotlight.enable(containerId)` ####
+ `containerId`: (optional) String

Enables the specified container's spottable controls.

#### `Spotlight.pause()` ####
Temporarily pauses Spotlight until `resume()` is called.

#### `Spotlight.resume()` ####
Resumes Spotlight navigation.

#### `Spotlight.focus([containerId/selector])` ####
+ `containerId/selector`: (optional) String / Selector (without @ syntax)

Dispatches focus to the specified containerId or the first spottable child that 
matches `selector`. This method has no effect if Spotlight is paused.

#### `Spotlight.move(direction, [selector])` ####
+ `direction`: `'left'`, `'right'`, `'up'` or `'down'`
+ `selector`: (optional) Selector (without @ syntax)

Moves focus in the specified direction of `selector`. If `selector` is not specified,
Spotlight will move in the given direction of the currently spotted control.

<a name="11"></a>
## 11. HOC PARAMETERS ##

### Spottable ###
`spotlightDisabled`
+ Type: [boolean]
+ Default: `false`

May be added to temporarily make a control not spottable.

`decorated`
+ Type: [boolean]
+ Default: `false`

Designates whether a control is being decorated by another spottable control.

### Container ###
`enterTo`
+ Type: [string]
+ Values: [`''`, `'last-focused'`, or `'default-element'`]
+ Default: `''`

If the focus originates from another container, you can define which element in
this container receives focus first.

`restrict`
+ Type: [string]
+ Values: [`'none'`, `'self-first'`, or `'self-only'`]
+ Default: `'none'`

Restricts or prioritizes focus to the controls in the current container.

`disabled`
+ Type: [boolean]
+ Default: `false`

When `true`, controls in the container cannot be navigated.

```javascript
import {SpotlightContainerDecorator} from 'enact-spotlight';
import Component from './Component';
const Container = SpotlightContainerDecorator({enterTo: 'last-focused', restrict: 'self-only'}, Component);
```

### Focusable ###
`useEnterKey`
+ Type: [boolean]
+ Default: `false`

When `true`, focus will not be moved to the inner-control unless the `<enter>`
key has been pressed.

`pauseSpotlightOnFocus`
+ Type: [boolean]
+ Default: `false`

When `true`, Spotlight will be paused while the inner-control has focus.

```javascript
import {SpotlightFocusableDecorator} from 'enact-spotlight';
import Component from './Component';
const Focusable = SpotlightFocusableDecorator({useEnterKey: true, pauseSpotlightOnFocus: true}, Component);
```

<a name="12"></a>
## 12. Examples ##

#### Basic usage

```javascript
import kind from 'enact-core/kind';
import {SpotlightRootDecorator, Spottable} from 'enact-spotlight';

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
