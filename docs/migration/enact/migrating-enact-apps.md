---
title: Migrating Enact Applications
---

## Overview
This document lists changes between major versions of Enact likely to affect most apps.

## 1.x to 2.0

### General Changes

#### React and React DOM
Enact 2.0 updates the `react` and `react-dom` dependencies to 16.x.  Developers should ensure
their code does not rely on features that are no longer available in these versions.

### core

#### `factory`
The `factory` module has been replaced by the `css` override feature.

##### Example
###### 1.x
```
import factory from '@enact/core/factory';
import kind from '@enact/core/kind';

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

// If `buttonCss` includes a `button` class, it will be appended to the `button` class of the
// `Button` component.
import buttonCss from './CustomButton.less';
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
###### 2.0
```
...
import Button from '@enact/ui/Button';

// If `buttonCss` includes a `button` class, it will be appended to the `button` class of the
// `Button` component.
import buttonCss from './CustomButton.less';
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

#### `kind`
`kind` will always return a component regardless of the configuration options.  Prior to 2.0,
`kind` could return either a component or a stateless functional component (SFC).  This change
should only impact rare cases such as relying on a reference to a contained component, or
caching the result of calling the SFC directly.

#### `util.childrenEquals`
`childrenEquals` has been removed since React components should not be directly compared.  Developers
can do shallow compares of `String` children in `shouldComponentUpdate` instead.
##### Example
###### 1.x
```
shouldComponentUpdate (nextProps) {
	return !childrenEquals(this.props.children, nextProps.children);
}
```
###### 2.0
```
shouldComponentUpdate (nextProps) {
	return this.props.children !== nextProps.children;
}
```

### i18n
There are no significant changes in the `i18n` module.

### moonstone

#### `Button`
The `noAnimation` prop has been removed.  This change only impacts Enact apps that rely
on Enyo UX.

The exports for `ButtonFactory` and `ButtonBaseFactory` have been removed.  If your code imported
these, you should use `ui/Button` and `ui/ButtonBase` instead.
##### Example
###### 1.x
```
import {ButtonFactory} from '@enact/moonstone/Button';
import {ButtonBaseFactory} from '@enact/moonstone/Button';
```
###### 2.0
```
import Button from '@enact/ui/Button';
import {ButtonBase} from '@enact/ui/Button';
```

#### `ContextualPopup`
The `popupContainerId` prop has changed to `popupSpotlightId`.
##### Example
###### 1.x
```
<ContextualPopup popupContainerId="popupSpotlightContainer" />
```
###### 2.0
```
<ContextualPopup popupSpotlightId="popupSpotlightContainer" />
```

#### `ExpandableList`
`ExpandableList` now requires a unique key for `Object` type data. [Read about keys](https://reactjs.org/docs/lists-and-keys.html#keys)
for more information.

#### `IconButton`
The `noAnimation` prop has been removed.  This change only impacts Enact apps that rely
on Enyo UX.

The exports for `IconButtonFactory` and `IconButtonBaseFactory` have been removed.  If your code
imported these, you should use `ui/IconButton` and `ui/IconButtonBase` instead.
##### Example
###### 1.x
```
import {IconButtonFactory} from '@enact/moonstone/IconButton';
import {IconButtonBaseFactory} from '@enact/moonstone/IconButton';
```
###### 2.0
```
import IconButton from '@enact/ui/IconButton';
import {IconButtonBase} from '@enact/ui/IconButton';
```

#### `IncrementSlider`
The exports for `IncrementSliderFactory` and `IncrementSliderBaseFactory` have been removed.  If your
code imported these, you should use `moonstone/IncrementSlider` and `moonstone/IncrementSliderBase`
instead.
##### Example
###### 1.x
```
import {IncrementSliderFactory} from '@enact/moonstone/IncrementSlider';
import {IncrementSliderBaseFactory} from '@enact/moonstone/IncrementSlider';
```
###### 2.0
```
import IncrementSlider from '@enact/moonstone/IncrementSlider';
import {IncrementSliderBase} from '@enact/moonstone/IncrementSlider';
```
The boolean props `horizontal` and `vertical` have been replaced by the `orientation` prop.
##### Example
###### 1.x
```
<IncrementSlider /> // `horizontal` prop is `true` by default.
<IncrementSlider vertical />
```
###### 2.0
```
<IncrementSlider /> // `orientation` prop is `"horizontal"` by default.
<IncrementSlider orientation="vertical" />
```
The `tooltipAsPercent`, `tooltipSide`, and `tooltipForceSide` props for the built-in tooltip
have been removed.  Use a `moonstone/IncrementSlider.IncrementSliderTooltip` and its `percent`
and `side` props instead. `side` supports both local-aware and locale-independent values.
##### Example
###### 1.x
```
<IncrementSlider orientation="vertical" tooltip tooltipAsPercent tooltipForceSide tooltipSide="after" />
```
###### 2.0
```
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

#### `Input`
The `<input>` element's styles have changed for `height`, `vertical-align`, and `margin`s.  Some previously used
sizing and positioning CSS may no longer be necessary.  Developers should verify their layouts.

#### `Item.OverlayDecorator`, `Item.Overlay`, and `Item.ItemOverlay`
These components are all replaced by `moonstone/SlotItem`.

#### `Marquee.MarqueeText`
This component is replaced by `moonstone/Marquee`.
##### Example
###### 1.x
```
import {MarqueeText} from '@enact/moonstone/Marquee';
```
###### 2.0
```
import Marquee from '@enact/moonstone/Marquee';
```

#### `Popup`
The `containerId` prop has changed to `spotlightId`.
##### Example
###### 1.x
```
<Popup containerId="spotlightContainer" />
```
###### 2.0
```
<Popup spotlightId="spotlightContainer" />
```

#### `ProgressBar`
The boolean props `horizontal` and `vertical` have been replaced by the `orientation` prop.
##### Example
###### 1.x
```
<ProgressBar /> // `horizontal` prop is `true` by default.
<ProgressBar vertical />
```
###### 2.0
```
<ProgressBar /> // `orientation` prop is `"horizontal"` by default.
<ProgressBar orientation="vertical" />
```

#### `Scroller`
The boolean props `horizontal` and `vertical` have been replaced by the `direction` prop.
##### Example
###### 1.x
```
<Scroller /> // `horizontal` prop is `true` by default.
<Scroller vertical />
```
###### 2.0
```
<Scroller /> // `direction` prop is `"horizontal"` by default.
<Scroller direction="vertical" />
```
The `scrollTo` method's `indexToFocus` option has been removed.  Use the `focus` option and
scroll by `index` (only applicable for components like `VirtualList`) or `node`.
##### Example
###### 1.x
```
...
const cbScrollTo = () => {
	this.scrollTo({indexToFocus: 1});
};
...
<VirtualList cbScrollTo={cbScrollTo} ... />
...
```
###### 2.0
```
...
const cbScrollTo = () => {
	this.scrollTo({focus: true, index: 1});
};
...
<VirtualList cbScrollTo={cbScrollTo} ... />
...
```

#### `Slider`
The exports for `SliderFactory` and `SliderBaseFactory` have been removed.  If your code
imported these, you should use `ui/Slider` and `ui/SliderBase` instead.
##### Example
###### 1.x
```
import {SliderFactory} from '@enact/moonstone/Slider';
import {SliderBaseFactory} from '@enact/moonstone/Slider';
```
###### 2.0
```
import Slider from '@enact/ui/Slider';
import {SliderBase} from '@enact/ui/Slider';
```
The boolean props `horizontal` and `vertical` have been replaced by the `orientation` prop.
##### Example
###### 1.x
```
<Slider /> // `horizontal` prop is `true` by default.
<Slider vertical />
```
###### 2.0
```
<Slider /> // `orientation` prop is `"horizontal"` by default.
<Slider orientation="vertical" />
```
The `tooltipAsPercent`, `tooltipSide`, and `tooltipForceSide` props for the built-in tooltip
have been removed.  Use a `moonstone/Slider.SliderTooltip` and its `percent` and `side` props
instead. `side` supports both local-aware and locale-independent values.
##### Example
###### 1.x
```
<Slider orientation="vertical" tooltip tooltipAsPercent tooltipForceSide tooltipSide="after" />
```
###### 2.0
```
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

#### `Slider.SliderTooltip`
The boolean props `horizontal` and `vertical` have been replaced by the `orientation` prop.
##### Example
###### 1.x
```
<SliderTooltip /> // `horizontal` prop is `true` by default.
<SliderTooltip vertical />
```
###### 2.0
```
<SliderTooltip /> // `orientation` prop is `"horizontal"` by default.
<SliderTooltip orientation="vertical" />
```

#### `VideoPlayer`
The `containerId` prop has changed to `spotlightId`.
##### Example
###### 1.x
```
<VideoPlayer containerId="spotlightContainer" />
```
###### 2.0
```
<VideoPlayer spotlightId="spotlightContainer" />
```
The `tooltipHideDelay` prop has been removed with no replacement.

#### `VirtualFlexList`
This component has been removed with no replacement.

#### `VirtualGridList`
The `component` and `data` props are replaced by `itemRenderer`.  `itemRenderer` should
return the component to render from a set of arbitrary items given an index.
##### Example
###### 1.x
```
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
###### 2.0
```
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

#### `VirtualGridList.GridListImageItem`
This component is replaced by `moonstone/GridListImageItem`.

#### `VirtualList`
The `scrollTo` method's `indexToFocus` option has been removed.  Use the `focus` option and
scroll by `index` or `node`.
##### Example
###### 1.x
```
...
const cbScrollTo = () => {
	this.scrollTo({indexToFocus: 1});
};
...
<VirtualList cbScrollTo={cbScrollTo} ... />
...
```
###### 2.0
```
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
##### Example
###### 1.x
```
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
###### 2.0
```
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

### spotlight
Selectors targeting the `spotlight` container attributes `data-container-disabled` or `data-container-muted`
should use `data-spotlight-container-disabled` or `data-spotlight-container-muted` instead.

`spotlight/Spottable` added support for the `spotlightId` prop which can be used to identify the component
in calls to `Spotlight.focus()`. In cases where you might have added a custom data attribute to identify a node,
you can now use `spotlightId` instead.
##### Example
###### 1.x
```
...
	<MyComponent data-component-id="my-first-component" />
...
	Spotlight.focus('[data-component-id="my-first-component"]]);
...
```
###### 2.0
```
...
	<MyComponent spotlightId="my-first-component" />
...
	Spotlight.focus('my-first-component');
...
```

#### `SpotlightContainerDecorator`
The `containerId` prop has changed to `spotlightId`.
##### Example
###### 1.x
```
const MyComponent = ...;
const MyContainer = SpotlightContainerDecorator(MyComponent);
<MyContainer containerId="spotlightContainer" />
```
###### 2.0
```
const MyComponent = ...;
const MyContainer = SpotlightContainerDecorator(MyComponent);
<MyContainer spotlightId="spotlightContainer" />
```

### ui

#### `Group`
`Group` now requires a unique key for `Object` type data. [Read about keys](https://reactjs.org/docs/lists-and-keys.html#keys)
for more information.

#### `Holdable`
This component has been replaced by [`ui/Touchable`](../../../modules/ui/Touchable/).

#### `Pressable`
This component has been replaced by [`ui/Touchable`](../../../modules/ui/Touchable/).

#### `Repeater`
`Repeater` now requires a unique key for `Object` type data. [Read about keys](https://reactjs.org/docs/lists-and-keys.html#keys)
for more information.

#### `Toggleable`
The default `prop` for the default HOC configuration is changed from `'active'` to `'selected'`.
##### Example
###### 1.x
```
const MyComponent = ...;
const MyToggleComponent = Toggleable(MyComponent); // toggle prop is `active`
const MyOtherToggleComponent = Toggleable({prop: 'selected'}, MyComponent); // toggle prop is `selected`
```
###### 2.0
```
const MyComponent = ...;
const MyToggleComponent = Toggleable(MyComponent); // toggle prop is `selected`
const MyOtherToggleComponent = Toggleable({prop: 'active'}, MyComponent); // toggle prop is `active`
```

#### `Transition`
`children` is now a required prop for this component.

The `clipHeight` prop has been removed.  The base component's `clipHeight` is now automatically computed base on the
`Transition`'s initial height.

### webos

#### `VoiceReadout`
This module (which only had exported `readAlert`) has been replaced by `webos/speech/readAlert`.
##### Example
###### 1.x
```
import {readAlert} from `@enact/webos/VoiceReadout`;
```
###### 2.0
```
import {readAlert} from `@enact/webos/speech`;
```