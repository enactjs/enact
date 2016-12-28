---
title: Documentation Style Guide
---

Almost all documentation for Enact is generated directly from the source code or from files stored within the Enact repository. It is important that in-line documentation is correct as developers will rely on this information.

## Documentation Overview

In-line documentation uses standard [jsDoc tags](http://usejsdoc.org/) with some addtional Enact-specific tags. In-line documentation appears within comment blocks that begin with double asterisks:

```
/**
 * jsdoc Comment
 */
```

Descriptions within jsDoc comments use [Markdown](https://daringfireball.net/projects/markdown/syntax). Enact style is to set off variable names, properties, short sections of code, types and other symbolic information within code markers: `` `name` ``. Filenames are set off with double asterisks:  `**package.json**`. Code blocks, when they appear, should be set off with the code block marker: ```` ``` ````.

There are three general levels of documentation that will appear within files within Enact modules.  Each will be discussed in turn.

## Module Documentation

Each module within Enact should have one (and only one) file that includes the `@module` tag. The name of the module should be prefixed with the name of the package it is part of (e.g. `moonstone/Button`). Each module has a limited number of exports so they should be documented within the module block and the default export should be identified:

```
/**
 * Exports the {@link moonstone/Button.Button} and {@link moonstone/Button.ButtonBase}
 * components.  The default export is {@link moonstone/Button.Button}.
 *
 * @module moonstone/Button
 */
```

Usually this block will appear in the file with the same name as the module.  If the module uses an **index.md** file to export, it should appear there.

## Class Level Documentation

Class level documentation includes components and Higher-order Components (HOCs).  Each component or HOC export should have a class level block that discusses the features and a provides a usage example. This block also serves as a place to indicate any HOCs that may be applied or cross-reference related components.

### Components

Below is an example block for a component:

```
/**
 * {@link moonstone/Button.Button} is a Button with Moonstone styling, Spottable and
 * Pressable applied.  If the Button's child component is text, it will be uppercased unless
 * `preserveCase` is set.
 *
 * Usage:
 * ```
 * <Button>Press me!</Button>
 * ```
 *
 * @class Button
 * @memberof moonstone/Button
 * @mixes i18n/Uppercase.Uppercase
 * @mixes moonstone/TooltipDecorator.TooltipDecorator
 * @mixes spotlight.Spottable
 * @mixes ui/Pressable.Pressable
 * @ui
 * @public
 */
```

* `@link` tags can be used to link to related materials
* `@class` should include the name of the object being documented
* `@memberof` is required and should reflect the name of the module the object belongs to.
* `@mixes` is used to call out HOCs that may be applied
* `@ui` is a custom tag that should be applied to any component that creates visible controls
* `@public` should be used for any component or HOC that is exported. Unexported objects should be marked `@private` to prevent them from appearing in the documentation.

### Higher-order Components

Below is an example of HOC declaration:

```
/**
 * {@link ui/Holdable.Holdable} is a Higher-order Component that applies a 'Holdable' behavior
 * to its wrapped component, providing methods that fire when a hold behavior is detected.
 *
 * @class Holdable
 * @memberof ui/Holdable
 * @hoc
 * @public
 */
```

* `@class`, `@memberof` and `@public` are as above
* `@hoc` is used to identify Higher-order components

HOCs that include configurable options should be documented as follows:

```
/**
 * Default config for {@link ui/Holdable.Holdable}
 *
 * @memberof ui/Holdable.Holdable
 * @hocconfig
 * @public
 */
const defaultConfig = {
	/**
	 * You can use the `endHold` property...
	 *
	 * @type {String}
	 * @default 'onMove'
	 * @memberof ui/Holdable.defaultConfig
	 */
	endHold: 'onMove',
	...
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
* `@lends` must appear following the colon and before the `{` in the `proptypes` declaration.  The string following `@lends` can be constructed with the following formula:  Module Name + '.' + Component Name + '.prototype'
* `@type` is used to indicate the type or types the property accepts. Multiple types are separated by the pipe character `|` and arrays are indicated by adding `[]` to the base type. Common types include: `Number`, `String`, `Object`, `Boolean` and `Node`. Type definitions for custom types can be created.
* `@required` should be applied to any property that has `isRequired` set on it.
* `@default` can be used to indicate the default value (if applicable) of a property. Only properties that appear in the `defaultProps` section should be listed here. Values should not be wrapped in code blocks.

In general, we do not provide jsDoc comments for methods that appear within components as we do not expose any public methods this way.

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
* `@param` should be repeated for each parameter. The type(s) is set within curly braces, followed by the name of the parameter. A short description of the parameter follows. Default parameter values are set documented by included them within square brackets in the name position as shown above.
* `@returns` indicates the type of the return. Functions that have no return should be documented as returning `{undefined}` to keep ESLint happy.

## Verifying Correct Documentation

Errors in documentation can prevent the doc tool from correctly generating our docs. Always run the `parse` command over the documentation to be sure there are no parse warnings. To do this, follow these steps:

```bash
git clone git@github.com:enyojs/enact-docs.git
cd enact-docs
npm install
rm -rf node_modules/enact
ln -s /path/to/your/enact/repo node_modules/enact
npm run parse
```

The `parse` command should execute without any warnings (e.g. 'Too many doclets').
