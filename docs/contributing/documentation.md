---
title: Documentation Style Guide
---

Almost all documentation for Enact is generated directly from the source code or from files stored within the Enact repository. It is important that in-line documentation is correct as developers will rely on this information.

## Documentation Overview

In-line documentation uses standard [jsDoc tags](http://usejsdoc.org/) with some additional Enact-specific tags. In-line documentation appears within comment blocks that begin with double asterisks:

```
/**
 * jsdoc Comment
 */
```

Descriptions within jsDoc comments use [Markdown](https://daringfireball.net/projects/markdown/syntax). Enact style is to set off variable names, properties, short sections of code, types and other symbolic information within code markers: `` `name` ``. Filenames are set off with double asterisks:  `**package.json**`. Code blocks, when they appear, should be set off with the code block marker: ```` ``` ````.

There are three general levels of documentation that will appear within the source files of Enact modules.  Each will be discussed in turn.

## Module Documentation

Each module (and, consequently, directory) within Enact should have one (and only one) file that includes the `@module` tag. The name of the module should be prefixed with the name of the package that contains it (e.g. `moonstone/Button`). Each module has a limited number of exports so they should be documented within the module block using the `@exports` tag. The module description should not list the exports or repeat information that should appear at the component level.

```
/**
 * Provides Moonstone-themed button components and behaviors.
 *
 * @example
 * <Button size="small">Hello Enact!</Button>
 *
 * @module moonstone/Button
 * @exports Button
 * @exports ButtonBase
 * @exports ButtonDecorator
 */
```

Usually this block will appear in the file with the same name as the module.  If the module uses an **index.js** file to export, it should appear there.

If possible, include an executable example showing the module using the `@example` tag.

## Class Level Documentation

Class level documentation includes components and higher-order components (HOCs).  Each component or HOC export should have a class level block that discusses the features and provides an example usage. This block also serves as a place to indicate any HOCs that may be applied or to cross-reference related components.

### Components

Below is an example block for a component:

```
/**
 * A Moonstone-styled button with built-in support for tooltips, marqueed text, and
 * Spotlight focus.
 *
 * Usage:
 * ```
 * <Button>Press me!</Button>
 * ```
 *
 * @class Button
 * @memberof moonstone/Button
 * @extends moonstone/Button.ButtonBase
 * @mixes moonstone/Button.ButtonDecorator
 * @ui
 * @public
 */
```

* `@link` tags can be used to link to related materials.
* `@class` should include the name of the object being documented.
* `@memberof` is required and should reflect the name of the module the object belongs to.
* `@extends` is used when a component's root element is another public custom component.
* `@mixes` is used to call out HOCs that may be applied.
* `@ui` is a custom tag that should be applied to any component that creates visible controls.
* `@public` should be used for any component or HOC that is exported. Unexported objects should be marked `@private` to prevent them from appearing in the documentation.
* Note: The Usage example is not runnable and will not render a preview.

### Higher-order Components

Below is an example of HOC declaration:

```
/**
 * A higher-order component that provides a consistent set of pointer events -- `onDown`, `onUp`,
 * and `onTap` -- across mouse and touch interfaces along with support for common gestures including
 * `onFlick`, `onDrag`, `onHold`, and `onHoldPulse`.
 *
 * @class Touchable
 * @memberof ui/Touchable
 * @hoc
 * @public
 */
```

* `@class`, `@memberof` and `@public` are as above
* `@hoc` is used to identify higher-order components

HOCs that include configurable options should be documented as follows:

```
/**
 * Default config for {@link ui/Touchable.Touchable}.
 *
 * @memberof ui/Touchable.Touchable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the prop name to pass the active state to the wrapped component
	 *
	 * @type {String}
	 * @default null
	 * @memberof ui/Touchable.Touchable.defaultConfig
	 */
	activeProp: null
};
```

* `@memberof` needs to be applied both to the default config object itself and all its members. HOC configs should be a member of the HOC component, not the module it is a member of.
* `@hocconfig` is an Enact-specific tag used to flag HOC config objects
* `@type` and `@default` are used for identifying properties and will be discussed more in the section on properties below

## Property Level Documentation

Property-level documentation refers to documentation within a component or HOC. In particular, this refers to the public API provided via properties. Each component (even those within HOCs) that has a `propTypes` member should be documented as follows:

```
	propTypes: /** @lends moonstone/ExpandableList.ExpandableListBase.prototype */ {
		/**
		 * The items to be displayed in the list
		 *
		 * @type {String[]}
		 * @required
		 * @public
		 */
		children: PropTypes.arrayOf(PropTypes.string).isRequired,
		...
		/**
		 * Selection mode for the list
		 *
		 * * `'single'` - Allows for 0 or 1 item to be selected. The selected item may be deselected.
		 * * `'radio'` - Allows for 0 or 1 item to be selected. The selected item may only be
		 *    deselected by selecting another item.
		 * * `'multiple'` - Allows 0 to _n_ items to be selected. Each item may be selected or
		 *    deselected.
		 *
		 * @type {String}
		 * @default 'single'
		 * @public
		 */
		select: PropTypes.oneOf(['single', 'radio', 'multiple']),

		/**
		 * Index or array of indices of the selected item(s)
		 *
		 * @type {Number|Number[]}
		 * @public
		 */
		selected: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)])

```

* In the description, be sure to call out anything important about the property. If the property only accepts a range of inputs, list the appropriate values, being sure to use code blocks to set off the values. If the property relates to another property, be sure to provide a `@link` to the other property.
* `@lends` must appear following the colon (or equal if it is a HOC and you are extending React.Component) and before the `{` in the `proptypes` declaration.  The string following `@lends` can be constructed with the following formula:  Module Name + '.' + Component Name + '.prototype'
* `@type` is used to indicate the type or types the property accepts. Multiple types are separated by the pipe character `|` and arrays are indicated by adding `[]` to the base type. Common types include: `Number`, `String`, `Object`, `Boolean` and `Node`. Type definitions for custom types can be created.
* `@required` should be applied to any property that has `isRequired` set on it.
* `@default` can be used to indicate the default value (if applicable) of a property. Only properties that appear in the `defaultProps` section should use this. Values should not be wrapped in code blocks.

In general, we do not provide jsDoc comments for methods that appear within components as we generally do not expose public methods this way.

>Note: We use three types to refer to renderable items: `Node`, `Element`, and `Component`.
>* `Node` refers to one or more renderable values which may be strings, booleans, or Elements: `<div>HTML Element</div>`, `<Button>React Component</Button>`, or `'string'`;
>* `Element` is a single instance of React.Element as returned by a JSX element (or `React.createElement`): `<div>HTML Element</div>` or `<Button>React Component</Button>`
>* `Component` is a function or class that returns a React.Element (e.g.: `'div'` or `Button`). This will typically be used to create dynamic JSX; something like: `render ({YourProp}) => { return (<YourProp />); }`

## Special Cases

There are some special cases that appear within the Enact framework. One example is `core/dispatcher`, which exports a set of utility functions. In this file, there are no class-level exports and all the functions are documented using jsDoc tags.  Here is the documentation for the `on` function:

```
/**
 * Adds a new global event listener
 *
 * @function
 * @param	{String}	name				Event name
 * @param	{Function}	fn					Event handler
 * @param	{Node}		[target=`document`]	Event listener target
 *
 * @returns {undefined}
 * @memberof core/dispatcher
 */
```

* `@function` indicates the documentation belongs to a function.
* `@param` should be repeated for each parameter. The type(s) is set within curly braces, followed by the name of the parameter. A short description of the parameter follows. Default parameter values are documented by including them within square brackets in the name position as shown above.
* `@returns` indicates the type of the return. Functions that have no return should be documented as returning `{undefined}` to keep ESLint happy.

## The Enact Voice

Enact docs should strive to have a common voice.  They should be concise, informative and, as appropriate, a bit playful.  Don't be afraid to inject a little bit of fun into what could otherwise be dry reading.

Tips:

* Use the active voice when writing docs.
* Descriptions should focus on what the componet or property provides.
* Only document the `true` state for boolean propertues unless the `false` state's operation is unclear.
* Property descriptions use the present tense and complete either 'This property ...' or 'This property configures ...'
* Callbacks use the future perfect tense and complete the sentence 'This callback will be ...'
* Imperative methods (rarely used) use the present tense and completes the sentence 'Call this method to ...'

Good:

* A Moonstone-styled button with built-in support for ...
* The color of the underline beneath button's content.
* Applies a disabled style and prevents interacting with the component.
* Called when the internal input is focused.

Could be better:

* This component could be used to display a button ...
* Set this to change the color of the underline beneath the button's content.
* Controls whether the item is expanded or not.
* A callback function invoked when the internal input is focused.

## Verifying Correct Documentation

Errors in documentation can prevent the doc tool from correctly generating our docs. Always run the `parse` command over the documentation to be sure there are no parse warnings. To do this, follow these steps:

```bash
git clone git@github.com:enactjs/docs.git
cd docs
npm install
rm -rf raw/enact
ln -s /path/to/your/enact/repo raw/enact
npm run parse
```

The `parse` command should execute without any warnings (e.g. 'Too many doclets').
