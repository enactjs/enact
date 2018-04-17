---
title: Why Use kind()?
---

One question we hear a lot is:  What is the use of `kind()` and why should I use it?  It is true
that `kind()` is Enact specific and it is not a required feature. So, why does the Enact team use
it and why should you consider it? The simple is answer is that it allows for more consistent and
more readable React components. There are many other features of `kind()`, which will be
discussed below, but we think that the key is reducing the mental load developers have in creating
and maintaining components.

## What Does it Do?

The Enact `kind()` method is a factory for creating components. The concept is simple enough: `kind()`
creates a component that transforms `props` and calls a `render()` method to create the output
markup. The initial configuration for the component is passed as an object and the return value is a
regular React component that can be used anywhere.

## Features

The main features of `kind()` include:

* A centralized place to transform incoming props
* A way to create persistent event handlers
* A method for dealing with concatenating CSS classes, including user-supplied classes
* A consistent means for adding `propTypes` and `defaultProps`
* A way to easily add a name to the component for debugging

## Show Me an Example

Sure. Stateless Functional Components (SFC's) are great and provide for an easy way to make React
components. Let's look at a simple component:

```
export default (props) => (
	<div {...props}>Hooray!</div>
);
```

This component is so simple that, if this were the imaginary world where things never change, there
would be no reason to convert this to `kind()`. But, let's do it anyhow:

```
import kind from '@enact/core/kind';

export default kind({
	render: (props) => <div {...props}>Hooray!</div>
});
```

It's a little more verbose, but not too bad.

Now, let's say we want to cheer on a specific person. We'll need to add a prop for that:

```
export default ({name, ...rest}) => (
	<div {...rest}>Hooray, {name}!</div>
);
```

The `kind()` conversion is pretty similar (we're going to leave out the `import` line for brevity):

```
export default kind({
	render: ({name, ...rest}) => (
		<div {...rest}>Hooray, {name}!</div>
	)
});
```

Then, we get told we need to validate the type of `name` so that we don't get any funny data passed
in. `PropTypes` (import not shown) to the rescue:

```
const Hooray = ({name, ...rest}) => (
	<div {...rest}>Hooray, {name}!</div>
);

Hooray.propTypes = {
	name: PropTypes.string
};

export default Hooray;
```

Not too bad yet. Let's see what happens with the `kind()` version:

```
export default kind({
	propTypes: {
		name: PropTypes.string
	},

	render: ({name, ...rest}) => (
		<div {...rest}>Hooray, {name}!</div>
	)
});
```

We're starting to save a little space here. Our next task is to fix up that ugly comma that gets
left if the name is not supplied. We have two approaches here: we could create a temporary name
formatted like we want or we could drop a ternary into the jsx markup. Let's go with the first to
keep our jsx as clean as possible:

```
const Hooray = ({name, ...rest}) => {
	const formattedName = name ? ', ' + name : '';

	return <div {...rest}>Hooray{formattedName}!</div>;
};

Hooray.propTypes = {
	name: PropTypes.string
};

export default Hooray;
```

Our simple little SFC is getting complicated. Let's see what we could do with `kind()`:

```
export default kind({
	propTypes: {
		name: PropTypes.string
	},

	computed: {
		name: ({name}) => name ? ', ' + name : ''
	},

	render: ({name, ...rest}) => (
		<div {...rest}>Hooray{name}!</div>
	)
});
```

We're using `kind()`'s ability to transform the props before they are passed to `render()` to
rewrite `name` so that our render method barely has to change. And, we're keeping it clean so that
markup is in one place and logic is in another. Neat!

Next, we have to add a default `className` to our component so we can get a little styling in there.
But, we also know that our consumer may want to pass in one, too. So, we'll have to concatenate or
use an npm module like [classnames](https://www.npmjs.com/package/classnames). How's it look now?
Let's see:

```
import classNames from 'classnames';
import css from './hooray.less';

const Hooray = ({name, className, ...rest}) => {
	const formattedName = name ? ', ' + name : '';
	const classes = classNames(css.hooray, className);

	return <div className={classes} {...rest}>Hooray{formattedName}!</div>;
};

Hooray.propTypes = {
	name: PropTypes.string
};

export default Hooray;
```

With `kind()`:

```
import css from './hooray.less';

export default kind({
	propTypes: {
		name: PropTypes.string
	},

	styles: {
		css,
		className: 'hooray'
	},

	computed: {
		name: ({name}) => name ? ', ' + name : ''
	},

	render: ({name, ...rest}) => (
		<div {...rest}>Hooray{name}!</div>
	)
});
```

Kind takes care of merging `className` for us, there's nothing to import. Nifty! There's still more
to discover with `kind()`, such as the `handlers` block, which caches event handlers so we don't
re-create them each time `render()` is called and the `name` member, which allows us to set a debug
name for our component.

> Note: We used a little ES2015 shortcut (shorthand property names) to set the `css` member in the
> `styles` object to the `css` import.

## What Are the Downsides?

Sadly, nothing is free in this world. There are some downsides to `kind()` and it's important to be
aware of them. First, there is some small overhead at app startup where the configuration is
processed and the component is created. Second, there is some overhead during execution of the
render method, though we have worked very hard to keep this minimal. Third, you do not have access
to React lifecycle methods with these components. If you do feel the need for this, it's a fairly
simple matter to decompose a `kind()` component into a `React.Component`, or just wrap the kind with
one of the existing HOCs from the `ui` library.

## Conclusion

For us, the upsides outweigh the downsides. We encourage you to check it out and see if it works for
you. It won't hurt our feelings (promise!) if you don't adopt it. But, if you do, we'd like to hear
from you how we can make it better. And, keep in mind, that using this method provides us a single
point for future enhancements and performance improvements that can apply to an entire app all at
once!
