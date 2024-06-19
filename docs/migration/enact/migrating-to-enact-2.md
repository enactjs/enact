---
title: Migrating to Enact 2.0
toc: 2
---

## Overview
This document lists changes between Enact versions 1.x and 2.0 likely to affect most apps.

## General Changes

### React and React DOM
Enact 2.0 updates the `react` and `react-dom` dependencies to 16.x.  Developers should ensure
their code does not rely on features that are no longer available in these versions.

## core

### `factory`
The `factory` module has been replaced by the `css` override feature.

#### Example
##### 1.x
```js
import factory from '@enact/core/factory';
import kind from '@enact/core/kind';

import * as componentCss from './Button.module.less';

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

// If `buttonCss` includes a `button` class, it will be appended to the `button` class of the
// `Button` component.
import * as buttonCss from './CustomButton.less';
const CustomizedButton = ButtonFactory({css: buttonCss});
...
	render: ({...rest}) => {
		return (
			<div {...rest} >
				<CustomizedButton />
			</div>
		);
	}
...
```
##### 2.0
```js
...
import Button from '@enact/ui/Button';

// If `buttonCss` includes a `button` class, it will be appended to the `button` class of the
// `Button` component.
import * as buttonCss from './CustomButton.less';
...
	render: ({...rest}) => {
		return (
			<div {...rest} >
				<Button css={buttonCss} />
			</div>
		);
	}
...
```

### `kind`
`kind` will always return a component regardless of the configuration options.  Prior to 2.0,
`kind` could return either a component or a stateless functional component (SFC).  This change
should only impact rare cases such as relying on a reference to a contained component, or
caching the result of calling the SFC directly.

### `util.childrenEquals`
`childrenEquals` has been removed since React components should not be directly compared.  Developers
can do shallow compares of `String` children in `shouldComponentUpdate` instead.
#### Example
##### 1.x
```js
shouldComponentUpdate (nextProps) {
	return !childrenEquals(this.props.children, nextProps.children);
}
```
##### 2.0
```js
shouldComponentUpdate (nextProps) {
	return this.props.children !== nextProps.children;
}
```

## i18n
The API for accessing the context for `i18n/I18nDecorator` has been removed.  It is replaced with `i18n/I18nDecorator.I18nContextDecorator`.
This change only impacts apps that were using context to determine locale or RTL/LTR settings.

## moonstone

### `Button`
The `noAnimation` prop has been removed.  This change only impacts Enact apps that rely
on Enyo UX.

The exports for `ButtonFactory` and `ButtonBaseFactory` have been removed.  If your code imported
these, you should use `ui/Button` and `ui/ButtonBase` instead.
#### Example
##### 1.x
```js
import {ButtonFactory} from '@enact/moonstone/Button';
import {ButtonBaseFactory} from '@enact/moonstone/Button';
```
##### 2.0
```js
import Button from '@enact/ui/Button';
import {ButtonBase} from '@enact/ui/Button';
```

Automatic tooltip support has been removed.  It can be easily added using `moonstone/TooltipDecorator`.
#### Example
##### 1.x
```js
import Button from '@enact/ui/Button';
```
##### 2.0
```js
import BasicButton from '@enact/ui/Button';
import TooltipDecorator from '@enact/ui/TooltipDecorator';

const Button = TooltipDecorator(BasicButton);
```
### `ContextualPopup`
The `popupContainerId` prop has changed to `popupSpotlightId`.
#### Example
##### 1.x
```js
<ContextualPopup popupContainerId="popupSpotlightContainer" />
```
##### 2.0
```js
<ContextualPopup popupSpotlightId="popupSpotlightContainer" />
```

### `Dialog`
The `preserveCase` and `showDivider` props have changed to `casing` and `noDivider`, respectively.
#### Example
##### 1.x
```js
<Dialog preserveCase showDivider />  // preserve casing and show divider
<Dialog preserveCase />  // preserve casing and do not show divider
```
##### 2.0
```js
<Dialog casing="preserve" /> // preserve casing and show divider
<Dialog casing="preserve" noDivider /> // preserve casing and do not show divider
```

### `Divider`
The `preserveCase` prop has changed to `casing`.
#### Example
##### 1.x
```js
<Divider preserveCase />
```
##### 2.0
```js
<Divider casing="preserve" />
```

### `ExpandableInput`
The `onInputChange` prop has changed to `onChange`.
#### Example
##### 1.x
```js
const handleChange = () => {
    // do something when the input changes
};
...
<ExpandableInput onInputChange={handleChange} />
```
##### 2.0
```js
const handleChange = () => {
    // do something when the input changes
};
...
<ExpandableInput onChange={handleChange} />
```

### `ExpandableList`
`ExpandableList` now requires a unique key for `Object` type data. [Read about keys](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)
for more information.

### `IconButton`
The `noAnimation` prop has been removed.  This change only impacts Enact apps that rely
on Enyo UX.

The exports for `IconButtonFactory` and `IconButtonBaseFactory` have been removed.  If your code
imported these, you should use `ui/IconButton` and `ui/IconButtonBase` instead.
#### Example
##### 1.x
```js
import {IconButtonFactory} from '@enact/moonstone/IconButton';
import {IconButtonBaseFactory} from '@enact/moonstone/IconButton';
```
##### 2.0
```js
import IconButton from '@enact/ui/IconButton';
import {IconButtonBase} from '@enact/ui/IconButton';
```

### `IncrementSlider`
The exports for `IncrementSliderFactory` and `IncrementSliderBaseFactory` have been removed.  If your
code imported these, you should use `moonstone/IncrementSlider` and `moonstone/IncrementSliderBase`
instead.
#### Example
##### 1.x
```js
import {IncrementSliderFactory} from '@enact/moonstone/IncrementSlider';
import {IncrementSliderBaseFactory} from '@enact/moonstone/IncrementSlider';
```
##### 2.0
```js
import IncrementSlider from '@enact/moonstone/IncrementSlider';
import {IncrementSliderBase} from '@enact/moonstone/IncrementSlider';
```
The boolean props `horizontal` and `vertical` have been replaced by the `orientation` prop.
#### Example
##### 1.x
```js
<IncrementSlider /> // `horizontal` prop is `true` by default.
<IncrementSlider vertical />
```
##### 2.0
```js
<IncrementSlider /> // `orientation` prop is `"horizontal"` by default.
<IncrementSlider orientation="vertical" />
```
The `tooltipAsPercent`, `tooltipSide`, and `tooltipForceSide` props for the built-in tooltip
have been removed.  Use a `moonstone/IncrementSlider.IncrementSliderTooltip` and its `percent`
and `side` props instead. `side` supports both locale-aware and locale-independent values.
#### Example
##### 1.x
```js
<IncrementSlider orientation="vertical" tooltip tooltipAsPercent tooltipForceSide tooltipSide="after" />
```
##### 2.0
```js
...
import {IncrementSlider, IncrementSliderTooltip} from '@enact/moonstone/IncrementSlider';
...
<IncrementSlider orientation="vertical">
	<IncrementSliderTooltip percent side="right" />
</IncrementSlider>
```
The `onDecrement` and `onIncrement` props have been removed.  These callbacks were only available
on `IncrementSliderBase` and mostly used internally by the framework.  If necessary, developers can use
`onKeyDown` and/or `onKeyUp`.

The `detachedKnob` and `scrubbing` props have been removed with no replacement.

### `Input`
The `<input>` element's styles have changed for `height`, `vertical-align`, and `margin`s.  Some previously used
sizing and positioning CSS may no longer be necessary.  Developers should verify their layouts.

### `Item.OverlayDecorator`, `Item.Overlay`, and `Item.ItemOverlay`
These components are all replaced by `moonstone/SlotItem`.

### `Marquee.MarqueeText`
This component is replaced by `moonstone/Marquee`.
#### Example
##### 1.x
```js
import {MarqueeText} from '@enact/moonstone/Marquee';
```
##### 2.0
```js
import Marquee from '@enact/moonstone/Marquee';
```

### `MoonstoneDecorator.TextSizeDecorator`
This HOC has been replaced by `MoonstoneDecorator.AccessibilityDecorator`.

### `Panels.Header`
The `preserveCase` prop has changed to `casing`.
#### Example
##### 1.x
```js
<Header preserveCase />
```
##### 2.0
```js
<Header casing="preserve" />
```

### `Panels.Panel`
The `noAutoFocus` prop has changed to `autoFocus`.
#### Example
##### 1.x
```js
<Panel /> // automatically focus the Panel
<Panel noAutoFocus /> // do not automatically focus the Panel
```
##### 2.0
```js
<Panel /> // automatically focus the Panel
<Panel autoFocus="none" /> // do not automatically focus the Panel
```

### `Popup`
The `containerId` prop has changed to `spotlightId`.
#### Example
##### 1.x
```js
<Popup containerId="spotlightContainer" />
```
##### 2.0
```js
<Popup spotlightId="spotlightContainer" />
```

### `ProgressBar`
The boolean props `horizontal` and `vertical` have been replaced by the `orientation` prop.
#### Example
##### 1.x
```js
<ProgressBar /> // `horizontal` prop is `true` by default.
<ProgressBar vertical />
```
##### 2.0
```js
<ProgressBar /> // `orientation` prop is `"horizontal"` by default.
<ProgressBar orientation="vertical" />
```

### `Scroller`
The boolean props `horizontal` and `vertical` have been replaced by the `direction` prop.
#### Example
##### 1.x
```js
<Scroller /> // `horizontal` prop is `true` by default.
<Scroller vertical />
```
##### 2.0
```js
<Scroller /> // `direction` prop is `"horizontal"` by default.
<Scroller direction="vertical" />
```
The `scrollTo` method's `indexToFocus` option has been removed.  Use the `focus` option and
scroll by `index` (only applicable for components like `VirtualList`) or `node`.
#### Example
##### 1.x
```js
...
const cbScrollTo = () => {
	this.scrollTo({indexToFocus: 1});
};
...
<VirtualList cbScrollTo={cbScrollTo} ... />
...
```
##### 2.0
```js
...
const cbScrollTo = () => {
	this.scrollTo({focus: true, index: 1});
};
...
<VirtualList cbScrollTo={cbScrollTo} ... />
...
```

### `Slider`
The exports for `SliderFactory` and `SliderBaseFactory` have been removed.  If your code
imported these, you should use `ui/Slider` and `ui/SliderBase` instead.
#### Example
##### 1.x
```js
import {SliderFactory} from '@enact/moonstone/Slider';
import {SliderBaseFactory} from '@enact/moonstone/Slider';
```
##### 2.0
```js
import Slider from '@enact/ui/Slider';
import {SliderBase} from '@enact/ui/Slider';
```
The boolean props `horizontal` and `vertical` have been replaced by the `orientation` prop.
#### Example
##### 1.x
```js
<Slider /> // `horizontal` prop is `true` by default.
<Slider vertical />
```
##### 2.0
```js
<Slider /> // `orientation` prop is `"horizontal"` by default.
<Slider orientation="vertical" />
```
The `tooltipAsPercent`, `tooltipSide`, and `tooltipForceSide` props for the built-in tooltip
have been removed.  Use a `moonstone/Slider.SliderTooltip` and its `percent` and `side` props
instead. `side` supports both local-aware and locale-independent values.
#### Example
##### 1.x
```js
<Slider orientation="vertical" tooltip tooltipAsPercent tooltipForceSide tooltipSide="after" />
```
##### 2.0
```js
...
import {Slider, SliderTooltip} from '@enact/moonstone/Slider';
...
<Slider orientation="vertical">
	<SliderTooltip percent side="right" />
</Slider>
```
The `onDecrement` and `onIncrement` props have been removed.  These callbacks were only available
on `SliderBase` and mostly used internally by the framework.  If necessary, developers can use
`onKeyDown` and/or `onKeyUp`.

The `detachedKnob`, `scrubbing` and `onKnobMove` props have been removed with no replacement.

### `Slider.SliderTooltip`
The boolean props `horizontal` and `vertical` have been replaced by the `orientation` prop.
#### Example
##### 1.x
```js
<SliderTooltip /> // `horizontal` prop is `true` by default.
<SliderTooltip vertical />
```
##### 2.0
```js
<SliderTooltip /> // `orientation` prop is `"horizontal"` by default.
<SliderTooltip orientation="vertical" />
```

### `TooltipDecorator`
The `tooltipPreserveCase` prop has changed to `tooltipCasing`.
#### Example
##### 1.x
```js
import BasicButton from '@enact/ui/Button';
import TooltipDecorator from '@enact/ui/TooltipDecorator';

const Button = TooltipDecorator(BasicButton);

<Button tooltipPreserveCase />
```
##### 2.0
```js
import BasicButton from '@enact/ui/Button';
import TooltipDecorator from '@enact/ui/TooltipDecorator';

const Button = TooltipDecorator({tooltipCasing: 'preserve'}, BasicButton);

<Button tooltipCasing="preserve" />
```

### `VideoPlayer`
The `containerId` prop has changed to `spotlightId`.
#### Example
##### 1.x
```
<VideoPlayer containerId="spotlightContainer" />
```
##### 2.0
```js
<VideoPlayer spotlightId="spotlightContainer" />
```
The `tooltipHideDelay` prop has been removed with no replacement.

### `VirtualFlexList`
This component has been removed with no replacement.

### `VirtualGridList`
The `component` and `data` props are replaced by `itemRenderer`.  `itemRenderer` should
return the component to render from a set of arbitrary items given an index.
#### Example
##### 1.x
```js
...
import Item from '@enact/moonstone/Item';
const items = [];
const ListItem = ({data, index}) => {
	const {title} = data[index];
	return (
		<Item>
			{title}
		</Item>
	);
};
...
<VirtualGridList
	...
	component={ListItem}
	data={items}
	...
/>
...
```
##### 2.0
```js
...
import Item from '@enact/moonstone/Item';
const items = [];
const itemRenderer = ({index}) => {
	const {title} = items[index];
	return (
		<Item>
			{title}
		</Item>
	);
};
...
<VirtualGridList
	...
	itemRenderer={itemRenderer}
	...
/>
...
```

### `VirtualGridList.GridListImageItem`
This component is replaced by `moonstone/GridListImageItem`.

### `VirtualList`
The `scrollTo` method's `indexToFocus` option has been removed.  Use the `focus` option and
scroll by `index` or `node`.
#### Example
##### 1.x
```js
...
const cbScrollTo = () => {
	this.scrollTo({indexToFocus: 1});
};
...
<VirtualList cbScrollTo={cbScrollTo} ... />
...
```
##### 2.0
```js
...
const cbScrollTo = () => {
	this.scrollTo({focus: true, index: 1});
};
...
<VirtualList cbScrollTo={cbScrollTo} ... />
...
```
The `component` and `data` props are replaced by `itemRenderer`.  `itemRenderer` should return
the component to render from a set of arbitrary items given an index.
#### Example
##### 1.x
```js
...
import Item from '@enact/moonstone/Item';
const items = [];
const ListItem = ({data, index}) => {
	const {title} = data[index];
	return (
		<Item>
			{title}
		</Item>
	);
};
...
<VirtualList
	...
	component={ListItem}
	data={items}
	...
/>
...
```
##### 2.0
```js
...
import Item from '@enact/moonstone/Item';
const items = [];
const itemRenderer = ({index}) => {
	const {title} = items[index];
	return (
		<Item>
			{title}
		</Item>
	);
};
...
<VirtualList
	...
	itemRenderer={itemRenderer}
	...
/>
...
```

## spotlight
Selectors targeting the `spotlight` container attributes `data-container-disabled` or `data-container-muted`
should use `data-spotlight-container-disabled` or `data-spotlight-container-muted` instead.

`spotlight/Spottable` added support for the `spotlightId` prop which can be used to identify the component
in calls to `Spotlight.focus()`. In cases where you might have added a custom data attribute to identify a node,
you can now use `spotlightId` instead.
#### Example
##### 1.x
```js
...
	<MyComponent data-component-id="my-first-component" />
...
	Spotlight.focus('[data-component-id="my-first-component"]]);
...
```
##### 2.0
```js
...
	<MyComponent spotlightId="my-first-component" />
...
	Spotlight.focus('my-first-component');
...
```

### `SpotlightContainerDecorator`
The `containerId` prop has changed to `spotlightId`.
#### Example
##### 1.x
```js
const MyComponent = ...;
const MyContainer = SpotlightContainerDecorator(MyComponent);
<MyContainer containerId="spotlightContainer" />
```
##### 2.0
```js
const MyComponent = ...;
const MyContainer = SpotlightContainerDecorator(MyComponent);
<MyContainer spotlightId="spotlightContainer" />
```

## ui

### `Group`
`Group` now requires a unique key for `Object` type data. [Read about keys](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)
for more information.

### `Holdable`
This component has been replaced by [`ui/Touchable`](../../../modules/ui/Touchable/).

### `Pressable`
This component has been replaced by [`ui/Touchable`](../../../modules/ui/Touchable/).

### `Repeater`
`Repeater` now requires a unique key for `Object` type data. [Read about keys](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)
for more information.

### `Toggleable`
The default `prop` for the default HOC configuration is changed from `'active'` to `'selected'`.
#### Example
##### 1.x
```js
const MyComponent = ...;
const MyToggleComponent = Toggleable(MyComponent); // toggle prop is `active`
const MyOtherToggleComponent = Toggleable({prop: 'selected'}, MyComponent); // toggle prop is `selected`
```
##### 2.0
```js
const MyComponent = ...;
const MyToggleComponent = Toggleable(MyComponent); // toggle prop is `selected`
const MyOtherToggleComponent = Toggleable({prop: 'active'}, MyComponent); // toggle prop is `active`
```

### `Transition`
`children` is now a required prop for this component.

The `clipHeight` prop has been removed.  The base component's `clipHeight` is now automatically computed base on the
`Transition`'s initial height.

## webos

### `VoiceReadout`
This module (which only had exported `readAlert`) has been replaced by `webos/speech/readAlert`.
#### Example
##### 1.x
```js
import {readAlert} from `@enact/webos/VoiceReadout`;
```
##### 2.0
```js
import {readAlert} from `@enact/webos/speech`;
```