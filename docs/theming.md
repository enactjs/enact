---
title: Theming
---

## Introduction

When building your own theme, it's important to understand how to leverage the many parts of Enact so you get the most out of your effort, get something that's easy to maintain, and are able to extend it over time. We've built a bunch of useful things for achieving this, so let's start to learn about them!

## Writing Customizable Components

### publicClassNames

Components built with the `kind` feature can use the `publicClassNames` key in the `styles` block of their component definition. This key allows a component to define an array of CSS class names that will be available for a component consumer to add styling to. For brevity and convenience, if you simply specify `true` as the value (`publicClassNames: true`), every class from your CSS file will be exported and available. All components in `@enact/ui` and many in `@enact/moonstone` and other themes have already been imbued with this feature, which allows direct access to customize that component's appearance.

Sometimes, behavior is built into a component, but no visual qualities are assigned to that behavior. For example, Enact handles the `selected` state of a `Button`, and it's implemented in our `ui` package, so it's universally available to all themes. `ui` has no opinion on how this state is visually represented, so it simply exports a blank class that the consuming theme can style to its liking.

Here's a simplified example of `ui/Button/Button.module.less`:

```css
// Button.module.less
//
@import "../styles/mixins.less";

.button {
	display: inline-block;
	position: relative;

	// The background element of the Button, used on a child of the base element
	.bg {
		.position(0);
		position: absolute;
	}

	.icon,
	&.small,
	// The selected state of the Button, applied to the base element
	&.selected {
		/* Public Class Names */
	}
}
```
*There is a small caveat here, which is that classes will not be exported if they do not have something in their rule-set, like the `.selected` class. It must have that CSS comment `/* comment */` in place for the minifier to not prune it out. Also, a LESS style comment  `//` is not sufficient, since those are pruned out at compile-time.*

In the above example, we define our base component class `.button`, then set up child element classes: `.bg` and `.icon`, we also add state classes: `.selected` and `.small`. Because this is in our `ui` package, where all of our base components are, we want to establish the common behaviors, but not the appearance, so `.icon`, `.selected`, and `.small` have no rules on them, just a CSS comment. This way, they will be available to the theme and it can choose how to visually represent those states, and not worry about the logic of *how* those are applied.

### Using a UI Component

Let's look at an example, Moonstone's `Button`:

```jsx
import React from 'react';
import kind from '@enact/core/kind';
import UiButton from '@enact/ui/Button';

import componentCss from './Button.module.less';

const Button = kind({
	name: 'CustomizedButton',

	styles: {
		css: componentCss,
		className: 'button',
		publicClassNames: ['button', 'bg', 'selected', 'small']
	},

	render: ({children, css, ...rest}) => (
		<UiButton {...rest} css={css}>{children}</UiButton>
	)
});

export default Button;
```

In this example, we've imported the unstyled `ui/Button`, which exports all available classes for customization (by setting `publicClassNames: true`), and we've imported our LESS file where we have many styles defined for the available states that a button can be in: small, selected, pressed, disabled, etc. We also have access to the internal element classes: bg, client, and marquee. Each of these classes match one of the public class names made available by the `ui/Button` component. So what can we do with this? We, as the component authors, have access to all of the class names which were made available in the components we're using, however, we can choose to restrict the available classes being made available to our consumers. In the above example we've only chosen to export four (4) classes for customization. It is the theme's discretion to determine how customizable or rigid it should be. Moonstone, for example, is relatively rigid so it maintains consistency for its visual identity. Our `ui` package, on the other hand, is *completely* open to customization and expresses only minimal initial styling. It makes prolific use of `publicClassNames: true`, which is shorthand for allowing *all* classes to be customized.

### Adding State Classes

Moonstone also adds its own props, which are specific to Moonstone; things like the `backgroundOpacity` prop and the `color` prop. They are added to the example above via the `computed` block:

```javascript
	computed: {
		className: ({backgroundOpacity, color, styler}) => styler.append(
			backgroundOpacity,
			color
		)
	},
```

These props are sent to our `styler.append` feature, which in this case, takes the value of these prop variables and applies them directly as class names. Setting `<Button color="red">` appends the `.red` class to the component. If you were wanting a Boolean state class, something like the following would do the job:

```javascript
	computed: {
		className: ({backgroundOpacity, color, ready, styler}) => styler.append(
			backgroundOpacity,
			color,
			{
				ready
			}
		)
	},
```
This would apply the `.ready` class, only if the `ready` prop was truthy, like so:  `<Button color="red" ready>` and not in this this case:  `<Button color="red">`.

### How It Works

When creating customizable components it may be helpful to understand how the theming system passes information between layers and how the internals work.

#### Importing

When a LESS or CSS file is imported, the classes are inventoried and a hash map is generated of original class names to obfuscated modularized class names: `{original: obfuscated}`. Your module now has a map of all of the class names you referenced. Normally, when using `kind()` you simply pass this into the `styles` block, and indicate which one is your base class, with the `className` key.

```javascript
import css from './Button.module.less';
...
{
	css,	// Via ES6, the `css` variable is converted to {'css': css}
	className: 'button'
},
...
```

Here, `kind()` handles the mapping from the `css` hash to your `'button'` class name. A similar process happens when you include the `publicClassNames` key and array in this block. The names of your classes are mapped to the previously published class names, and they are paired up.

For example, `Button` publishes the `.bg` class from `ui`. Moonstone adds its own styling rules to the existing `.bg` class simply by giving its custom rules the same name as `ui`. Internally, Enact is attaching both the `ui` and `moonstone` classes together for the `.bg` original class name key, like: `{bg: 'ui_Button_bg moonstone_Button_bg'}`. Excluding a class name from the `publicClassNames` array will ignore that class when they're appended to the map.

### The `css` prop

You can access the full collection of mapped class names via the automatically added `css` prop. The `css` prop doesn't behave like normal props, though. It does not automatically pass down to deeper layers, via props-spreading. This is because we wanted to be conscious of when we are passing classes down to another layer. When you add a `publicClassNames` key to your component, it will automatically receive the `css` prop in its collection of props, which can be used in the `render` or `computed` functions just like any other prop. To reference an earlier example, when `moonstone/Button` encounters the `css` prop, it is an object like this: 

```javascript
{
	button: 'ui_Button_button moonstone_Button_button',
	bg: 'ui_Button_bg moonstone_Button_bg'
}
```

 You then simply use this object to refer to your internal elements, like this:

```jsx
render({children, css, ...rest}) => 
	<div {...rest}>
		<div className={css.bg}></div>
		{children}
	</div>
)
```

Conveniently, the base class name is applied automatically to the `className` prop, which is passed through the `rest` spread above. This is also true for the `backgroundOpacity` and `color` prop classes applied during the computed `className` function.

#### Combining all the bits

Let's look at our combined example again.

```jsx
import React from 'react';
import kind from '@enact/core/kind';
import UiButton from '@enact/ui/Button';

import componentCss from './Button.module.less';

const Button = kind({
	name: 'CustomizedButton',

	styles: {
		css: componentCss,
		className: 'button',
		publicClassNames: ['button', 'bg', 'selected', 'small']
	},

	render: ({children, css, ...rest}) => (
		<UiButton {...rest} css={css}>{children}</UiButton>
	)
});

export default Button;
```

We're importing our CSS with a non-conflicting name (`componentCss`); sending it into `kind()`; setting our base class name, which we could have named differently than our `ui` component base class name; adding some classes to be published; then extracting the automatically added `css` prop down in `render`; and finally, forwarding it to the `UiButton` component, which publishes all of its class names for customization. And there we have a fully styled, customized Button.

## Theme Creation Concepts

So, you're fully versed in the theming system and you're ready to make your own themed set of components, or want to create a new base component that can be themed. Let's cover some concepts that will make your project easier to maintain.

### Visually Divorced

All of the Enact components follow a naming strategy that we call "visually divorced". This is the concept of naming all APIs, classes, and components with words that do not relate to visual concepts, but rather to semantic concepts. This way, when a theme chooses to visually represent something, like a state or a prop that we added to a component, it can fully decide how that looks, and not be dependent on how we've named something. As a contrived example, think about it like the shift in HTML from using `<b>` bold and `<i>` italic tags to `<strong>` and `<em>` tags. The former describe how the components visually appear, while the latter describe what the meaning of those is, which just _happen_ to be represented by bold text and italic text by the browser. A web developer could choose to represent those concepts differently on their site, for visually impaired users, or for languages or fonts that are unable to represent a bold or italic font style.

### States

Typically, we'll represent the state of a component using a class. The presence of the class means "on" and the absence of it means "off". This works really well for boolean properties, but can also be used to represent enumerated properties. The `orientation` prop is a good example of this. A Slider can choose an orientation, which applies one of the allowed values as a class. `moonstone/Slider` currently supports `orientation="horizontal"` and `orientation="vertical"`. These values are applied literally to the component as classes `.horizontal` and `.vertical`. That being said, there's no reason why new orientations like "radial" or "2d" couldn't be implemented, which we can then fully style using CSS however we want; maybe "radial" describes a speedometer-like dial and "2d" describes a graph-like square. `Slider` imposes no expectations on how the values it manages are used, it just makes them available. The visual designer is then able to use this available information to design, restriction-free, how ever is most appropriate for their theme.

Something like the following is easy to read, understand, maintain, and extend:

```less
.slider {
	&.horizontal {
		max-width: 500px;
		height: 12px;
	}

	&.vertical {
		max-height: 500px;
		width: 12px;
	}

	&.radial {
		height: 300px;
		width: 300px;
		border-radius: 150px;
	}
}
```

Meanwhile, thanks to `kind()`, the code to implement multiple formats is as simple as the following:

```javascript
const Slider = kind({
	name: 'Slider',

	propTypes: {
		orientation: PropTypes.oneOf(['horizontal', 'vertical', 'radial'])
	},

	defaultProps: {
		orientation: 'horizontal'
	},

	computed: {
		className: ({orientation, styler}) => styler.append(orientation)
	},

...
```


### Base Components

A compelling base component, one that is usable by multiple themes, will do its best to impose as few visual rules as is possible while offering hooking-points for creative visual designers to do interesting things with. You'll want to balance what is minimally required to make the component functional, with visuals. Style rules that may be useful for functionality are things like `display` type: inline, inline-block, block, flex, etc, or `position` on a child element that allow it to fit to the arbitrary shape of its parent.

### Component Overrides

Conventionally, the base element is overridable using the prop `component`, and others via prefixing that word, e.g. `iconComponent`, `buttonComponent`, `marqueeComponent`. This gives the theme the ability to provide its own customized drop-in component. You can assign the default in the `defaultProps` config. It's also great practice to use some low-overhead basic DOM element for the default too, to reduce loading cost, something like `'div'`, `'span'`, `'img'`, or even `'section'`.

Enact includes a great feature for merging author and consumer props onto one component to make this process much simpler. Below is an example of how `ui/IconButton` is composed:

```
import ComponentOverride from '@enact/ui/ComponentOverride';

...
	defaultProps: {
		buttonComponent: 'div',
		iconComponent: 'span'
	},
...
	render: ({buttonComponent, children, css, icon, iconComponent: Icon, size, ...rest}) => (
		<ComponentOverride
			{...rest}
			component={buttonComponent}
			size={size}
			minWidth={false}
		>
			<Icon size={size} className={css.icon}>{icon}</Icon>
			{children}
		</ComponentOverride>
	)
```

The remainder of the props are spread onto the `buttonComponent` while the `size` and `minWidth` props are added directly. *(`size` could have been passed via `rest` but it is also sent to `Icon`, and we chose this approach to improve readability, rather than sending `size={rest.size}`.)*

### Best practices

#### Should

Recommendations for components:

* Establish the complete HTML DOM structure necessary for operation, with the minimum styling needed.
* Declare and export all state-classes via `publicClassNames: true`.
* Allow component and possibly sub-component (child component) overrides where reasonable.


#### Should Not

Generally avoid doing these for components:

* Include HOCs (higher-order components), not allowing the theme to compose and decorate its own features, unless they are always necessary for function.
* Define colors, measurements (that aren't critical for functionality), margins/paddings, or other purely visual aspects of the component's styles.
