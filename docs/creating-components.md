---
title: Creating Components the Enact Way
---

The Enact framework is built upon the foundation of [React](https://facebook.github.io/react).
As a result, any component that is built for React can be used in Enact and any of the patterns for
creating a component in React can also be used in Enact. To address some of the common use cases we
encountered, we've included a few modules with `@enact/core` that standardize the "Enact way" for
and provide some 'sugar' to reduce developer boilerplate.

## Creating Stateless Functional Components

We've found that Stateless Functional Components (SFCs) are a great way to decompose your
application. A primary role of a user interface component is to provide a mapping of the
Computer's model into the User's mental model. SFCs are a pure implementation of this
responsibility. They accept an object of properties and map them into a component hierarchy using
JSX.

In very simple components, a single function is sufficient to perform that mapping. However, as
components grow more complex, you often find that you need to merge incoming data with fixed data or
transform incoming data into other formats. This often leads you to decompose logic out of your main
render method for improved clarity and maintainability. This process led us to create
`@enact/core/kind`.

The `kind()` factory creates SFCs from a configuration object. It adds declarative sugar for setting
the display name, merging incoming `className` and `style` properties with component values, and computing property
values, allowing you to merge or transform incoming data outside of your render function.

Unlike simple functions which must be declared before any metadata can be attached, `kind()`
components encourage a consistent ordering of keys for top-down readability:

> The `name` component accepts these `propTypes`, which have the following default values,
> `defaultProps`. It is formatted according to the CSS modules map and `className` in `styles`. That
> data is used to produce several `computed` properties which ultimately are provided to `render` to
> create the final component hierarchy.

For the following sample, the `'Badge'` component accepts the `children` and `greeting` properties, with
`greeting` having a default of `'Hello, my name is ...'`. It applies the `'badge'` `className` (combined
with any passed-in `className`), it computes a new value for `children` and renders the result.

```
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

const Badge = kind({
	name: 'Badge',

	propTypes: {
		children: PropTypes.string.isRequired,
		greeting: PropTypes.string,
	},

	defaultProps: {
		greeting: 'Hello, my name is ...'
	},

	styles: {
		css,
		className: 'badge'
	},

	computed: {
		children: ({children, greeting}) => `${greeting} ${children}`
	},

	render: ({children, ...rest}) => {
		delete rest.greeting;

		return (
			<div {...rest}>
				{children}
			</div>
		);
	}
});
```

> Note: You should be sure to delete any properties that are only used in calculations to avoid warnings during rendering.

## SFCs Compared with React Components

While SFCs have some important benefits, not every problem can be effectively solved with them
alone. Sometimes creating component instances that extend `React.Component` is necessary. Here are a
few possible reasons:

* You need access to the [component lifecycle methods](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle)
* You need to maintain some component state (and it's not managed by something like Redux)
* You need consistent event handler references to prevent unnecessary renders
* You need to expose imperative APIs (though you should always avoid this when possible)

The way in which you would achieve each of these is beyond the scope of this discussion but each are
valid reasons to create a custom instance of `React.Component`. However, these reasons do not
preclude you from creating an SFC for the primary render logic. Your `React.Component` can do
whatever work it needs to do and defer the property-to-user-interface mapping to the SFC.

## Higher-Order Components

Higher-Order Components (HOCs) are useful for adding behavior or chrome UI around other independent
components. In the general sense, they are functions that accept a component (a native DOM node like
`div`, an SFC, or a `React.Component`), decorate that component in some way, and return either the
original component or a new component that wraps the original component.

Enact provides several HOCs within `@enact/ui` and `@enact/moonstone` that allow us to provide consistent
behaviors across components. All of these HOCs were created using the `hoc()` factory from
`@enact/core/hoc`. This factory gives them a couple key features:

* HOCs can be configurable by passing an object with parameters to the HOC function. This object is
  merged with a set of default configuration parameters.
* HOCs are flexible in their usage. They can:
  * Accept a configuration object and a component 
    ```
    const ToggleableWidget = Toggleable({toggle: 'onClick', prop: 'selected'}, Widget);
    ```
  * Accept only a component and use the default configuration:
    ```
    const ToggleableWidget = Toggleable(Widget);
    ```
  * Accept a configuration object in one invocation and a component in a second invocation. This
    allows you to reuse a pre-configured HOC on multiple components:
    ```
    const ToggleDecorator = Toggleable({toggle: 'onClick', prop: 'selected'});
    const ToggleableWidget = ToggleDecorator(Widget);
    const ToggleableFrob = ToggleDecorator(Frob);
    ```

If you need to create your own HOCs, you can import the `hoc()` factory to take advantage of these
features. The factory accepts an optional default configuration object and a function. The
function will receive the merged configuration object and the Wrapped component and should return
a component.

Here's a simple example to illustrate:

```
const Countable = hoc({prop: 'data-count'}, (config, Wrapped) => {
	return class extends React.Component {
		constructor (props) {
			super(props);
			this.state = {
				count: 0
			};
		},
		inc = () => this.setState({count: this.state.count + 1}),
		render () {
			const props = Object.assign({}, this.props, {
				[config.prop]: this.state.count,
				onClick: this.inc
			});
			return <Wrapped {...props} />
		}
	}
});

const CountableAsDataNumber = Countable({prop: 'data-number'});
const CountableDiv = Countable('div');
const CountableDivAsDataNumber = CountableAsDataNumber('div');
```

## Adding Design-Time Customizations to Components

> NOTE: `factory()` is deprecated and will be removed in 2.0

While many of our components are easily configured using properties, we've found that sometimes an app
needs the more flexibility. Generally, this type of customization isn't variable at
run-time and is primarily used to adjust the visual design of a component. To support this use case,
we've introduced the `factory()` function.

Like `hoc()`, `factory()` accepts a configuration object which is merged with the component's default
configuration. Unlike `hoc()`, `factory()` only supports a known set of configuration keys rather
than an arbitrary set. Currently, the only supported key is `css`, which allows authors to provide
a custom CSS class name map which is merged with the component's CSS class name map. This feature
allows for overriding the style of particular children within the component's internal
hierarchy.

A few important notes about this feature:

* This is a recent addition to Enact and has not been widely adopted by framework components yet
* In order to promote UX consistency, not every class will be customizable
* We do not yet have a means to document which classes may be customized

However, we do think this is an important feature for the framework and we will continue to roll it out
throughout and improve the overall developer experience around it. Here's a short example to whet
your appetite:

```
import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';

import componentCss from './Button.less';

const ButtonFactory = factory({css: componentCss}, ({css}) => {
	return kind({
		name: 'Button',

		// Since 'button' will be resolved against the combined `css` map, it can be overridden too
		styles: {
			css,
			className: 'button'
		},

		// Component authors can also prevent overrides by using their css map directly as is done
		// with the `inner` class below
		render: ({children, ...rest}) => (
			<button {...rest}>
				<div className={componentCss.inner}>
					{children}
				</div>
			</button>
		)
	});
});
```

```
// If `buttonCss` includes a `button` class, it will be appended to the `button` class of the
// `Button` component.
import buttonCss from './CustomButton.less';
CustomizedButton = ButtonFactory({css: buttonCss});

<CustomizedButton />
```
