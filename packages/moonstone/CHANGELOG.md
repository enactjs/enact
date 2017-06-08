# Change Log

The following is a curated list of changes in the Enact moonstone module, newest changes on the top.

## [unreleased]

### Deprecated

- `moonstone/Scroller` props `horizontal` and `vertical`. Deprecated props are replaced with `direction` prop. `horizontal` and `vertical` will be removed in 2.0.0.
- `moonstone/Panel` prop `noAutoFocus` in favor of `autoFocus="none"`

### Added

- `moonstone/Image` support for `children` prop inside images
- `moonstone/Scroller` prop `direction` which replaces `horizontal` and `vertical` props.

### Changed

- `moonstone/Skinnable` to support context and allow it to be added to any component to be individually skinned. This includes a further optimization in skinning which consolidates all color assignments into a single block, so non-color rules aren't unnecessarily duplicated.
- `moonstone/VideoPlayer` to set play/pause icon to display "play" when rewinding or fast forwarding
- `moonstone/VideoPlayer` to rewind or fast forward when previous command is slow-forward or slow-rewind respectively
- `moonstone/VideoPlayer` to fast forward when previous command is slow-forward and it reaches the last of its play rate

### Fixed

- `moonstone/ExpandableItem` to correct the `titleIcon` when using `open` and `disabled`
- `moonstone/GridListImageItem` to center its selection icon on the image instead of the item
- `moonstone/Input` to have correct `Tooltip` position in `RTL`

### Removed

## [1.2.0] - 2017-05-17

### Deprecated

- `moonstone/Scroller.Scrollable` option `indexToFocus` in `scrollTo` method to be removed in 2.0.0

### Added

- `moonstone/Slider` and `moonstone/IncrementSlider` prop `noFill` to support a style without the fill
- `moonstone/Marquee` property `rtl` to set directionality to right-to-left
- `moonstone/VirtualList.GridListImageItem` property `selectionOverlay` to add custom component for selection overlay
- `moonstone/MoonstoneDecorator` property `skin` to let an app choose its skin: "moonstone" and "moonstone-light" are now available
- `moonstone/FormCheckboxItem`
- `moonstone/FormCheckbox`, a standalone checkbox, to support `moonstone/FormCheckboxItem`
- `moonstone/Input` props `invalid` and `invalidMessage` to display a tooltip when input value is invalid
- `moonstone/Scroller.Scrollable` option `focus` in `scrollTo()` method
- `moonstone/Scroller.Scrollable` property `spottableScrollbar`
- `moonstone/Icon.IconList` icons: `arrowshrinkleft` and `arrowshrinkright`

### Changed

- `moonstone/Picker` arrow icon for `joined` picker: small when not spotted, hidden when it reaches the end of the picker
- `moonstone/Checkbox` and `moonstone/CheckboxItem` to reflect the latest design
- `moonstone/MoonstoneDecorator/fontGenerator` was refactored to use the browser's FontFace API to dynamically load locale fonts
- `moonstone/VideoPlayer` space allotment on both sides of the playback controls to support 4 buttons; consequently the "more" controls area has shrunk by the same amount
- `moonstone/VideoPlayer` to not disable media button (play/pause)
- `moonstone/Scroller.Scrollable` so that paging controls are not spottable by default with 5-way
- `moonstone/VideoPlayer`'s more/less button to use updated arrow icon

### Fixed

- `moonstone/MarqueeDecorator` to properly stop marquee on items with `'marqueeOnHover'`
- `moonstone/ExpandableList` to work properly with object-based children
- `moonstone/styles/fonts.less` to restore the Moonstone Icon font to request the local system font by default. Remember to update your webOS build to get the latest version of the font so you don't see empty boxes for your icons.
- `moonstone/Picker` and `moonstone/RangePicker` to now use the correct size from Enyo (60px v.s. 84px) for icon buttons
- `moonstone/Scrollable` to apply ri.scale properly
- `moonstone/Panel` to not cover a `Panels`'s `ApplicationCloseButton` when not using a `Header`
- `moonstone/IncrementSlider` to show tooltip when buttons focused

## [1.1.0] - 2017-04-21

### Deprecated

- `moonstone/ExpandableInput` property `onInputChange`

### Added

- `moonstone/Panels.Panel` prop and `moonstone/MoonstoneDecorator` config option: `noAutoFocus` to support prevention of setting automatic focus after render
- `moonstone/VideoPlayer` props: `backwardIcon`, `forwardIcon`, `jumpBackwardIcon`, `jumpForwardIcon`, `pauseIcon`, and `playIcon` to support icon customization of the player
- `moonstone/VideoPlayer` props `jumpButtonsDisabled` and `rateButtonsDisabled` for disabling the pairs of buttons when it's inappropriate for the playing media
- `moonstone/VideoPlayer` property `playbackRateHash` to support custom playback rates
- `moonstone/VideoPlayer` callback prop `onControlsAvailable` which fires when the players controls show or hide
- `moonstone/Image` support for `onLoad` and `onError` events
- `moonstone/VirtualList.GridListImageItem` prop `placeholder`
- `moonstone/Divider` property `preserveCase` to display text without capitalizing it

### Changed

- `moonstone/Slider` colors and sizing to match the latest designs
- `moonstone/ProgressBar` to position correctly with other components nearby
- `moonstone/Panels` breadcrumb to no longer have a horizontal line above it
- `moonstone/Transition` to measure itself when the CPU is idle
- style for disabled opacity from 0.4 to 0.3
- `moonstone/Button` colors for transparent and translucent background opacity when disabled
- `moonstone/ExpandableInput` property `onInputChange` to fire along with `onChange`. `onInputChange` is deprecated and will be removed in a future update.
- `Moonstone.ttf` font to include new icons
- `moonstone/Icon` to reference additional icons

### Fixed

- `moonstone/Popup` and `moonstone/ContextualPopupDecorator` 5-way navigation behavior
- `moonstone/Input` to not spot its own input decorator on 5-way out
- `moonstone/VideoPlayer` to no longer render its `children` in multiple places
- `moonstone/Button` text color when used on a neutral (light) background in some cases
- `moonstone/Popup` background opacity
- `moonstone/Marquee` to recalculate properly when its contents change
- `moonstone/TimePicker` to display time in correct order
- `moonstone/Scroller` to prefer spotlight navigation to its internal components

## [1.0.0] - 2017-03-31

> NOTE: We have also modified most form components to be usable in a controlled (app manages component
> state) or uncontrolled (Enact manages component state) manner. To put a component into a
> controlled state, pass in `value` (or other appropriate state property such as `selected` or
> `open`) at component creation and then respond to events and update the value as needed. To put a
> component into an uncontrolled state, do not set `value` (or equivalent), at creation. From this
> point on, Enact will manage the state and events will be sent when the state is updated. To
> specify an initial value, use the `defaultValue` (or, `defaultSelected, `defaultOpen, etc.)
> property.  See the documentation for individual components for more information.

### Added

- `moonstone/Button` property `icon` to support a built-in icon next to the text content. The Icon supports everything that `moonstone/Icon` supports, as well as a custom icon.
- `moonstone/MoonstoneDecorator` property `textSize` to resize several components to requested CMR sizes. Simply add `textSize="large"` to your `App` and the new sizes will automatically take effect.

### Changed

- `moonstone/Slider` to use the property `tooltip` instead of `noTooltip`, so the built-in tooltip is not enabled by default
- `moonstone/IncrementSlider` to include tooltip documentation
- `moonstone/ExpandableList` to accept an array of objects as children which are spread onto the generated components
- `moonstone/CheckboxItem` style to match the latest designs, with support for the `moonstone/Checkbox` to be on either the left or the right side by using the `iconPosition` property
- `moonstone/VideoPlayer` to supply every event callback-method with an object representing the VideoPlayer's current state, including: `currentTime`, `duration`, `paused`, `proportionLoaded`, and `proportionPlayed`

### Fixed

- `moonstone/Panels.Panel` behavior for remembering focus on unmount and setting focus after render
- `moonstone/VirtualList.VirtualGridList` showing empty items when items are continuously added dynamically
- `moonstone/Picker` to marquee on focus once again

## [1.0.0-beta.4] - 2017-03-10

### Added

- `moonstone/VirtualList` `indexToFocus` option to `scrollTo` method to focus on item with specified index
- `moonstone/IconButton` and `moonstone/Button` `color` property to add a remote control key color to the button
- `moonstone/Scrollbar` property `disabled` to disable both paging controls when it is true
- `moonstone/VirtualList` parameter `moreInfo` to pass `firstVisibleIndex` and `lastVisibleIndex` when scroll events are firing
- Accessibility support to UI components
- `moonstone/VideoPlayer` property `onUMSMediaInfo` to support the custom webOS “umsmediainfo” event
- `moonstone/Region` component which encourages wrapping components for improved accessibility rather than only preceding the components with a `moonstone/Divider`
- `moonstone/Slider` tooltip. It's enabled by default and comes with options like `noTooltip`, `tooltipAsPercent`, and `tooltipSide`. See the component docs for more details.
- `moonstone/Panels.Panel` property `hideChildren` to defer rendering children
- `moonstone/Spinner` properties `blockClickOn` and `scrim` to block click events behind spinner
- `moonstone/VirtualList` property `clientSize` to specify item dimensions instead of measuring them

### Changed

- `moonstone/VirtualGridImageItem` styles to reduce redundant style code app side
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to add essential CSS for list items automatically
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to not add `data-index` to their item DOM elements directly, but to pass `data-index` as the parameter of their `component` prop like the `key` parameter of their `component` prop
- `moonstone/ExpandableItem` and derivatives to defer focusing the contents until animation completes
- `moonstone/LabeledItem`, `moonstone/ExpandableItem`, `moonstone/ExpandableList` to each support the `node` type in their `label` property. Best used with `ui/Slottable`.

### Fixed

- `moonstone/VirtualList.GridListImageItem` to have proper padding size according to the existence of caption/subcaption
- `moonstone/Scrollable` to display scrollbars with proper size
- `moonstone/VirtualGridList` to not be truncated

### Removed

- `moonstone/Scrollable` property `hideScrollbars` and replaced it with `horizontalScrollbar` and `verticalScrollbar`

## [1.0.0-beta.3] - 2017-02-21

### Added

- `moonstone/VideoPlayer` support for 5-way show/hide of media playback controls
- `moonstone/VideoPlayer` property `feedbackHideDelay`
- `moonstone/Slider` property `onKnobMove` to fire when the knob position changes, independently from the `moonstone/Slider` value
- `moonstone/Slider` properties `active`, `disabled`, `knobStep`, `onActivate`, `onDecrement`, and `onIncrement` as part of enabling 5-way support to `moonstone/Slider`, `moonstone/IncrementSlider` and the media slider for `moonstone/VideoPlayer`
- `moonstone/Slider` now supports `children` which are added to the `Slider`'s knob, and follow it as it moves
- `moonstone/ExpandableInput` properties `iconAfter` and `iconBefore` to display icons after and before the input, respectively
- `moonstone/Dialog` property `preserveCase`, which affects `title` text

### Changed

- `moonstone/IncrementSlider` to change when the buttons are held down
- `moonstone/Marquee` to allow disabled marquees to animate
- `moonstone/Dialog` to marquee `title` and `titleBelow`
- `moonstone/Marquee.MarqueeController` config option `startOnFocus` to `marqueeOnFocus`. `startOnFocus` is deprecated and will be removed in a future update.
- `moonstone/Button`, `moonstone/IconButton`, `moonstone/Item` to not forward `onClick` when `disabled`

### Fixed

- `moonstone/Marquee.MarqueeController` to start marquee on newly registered components when controller has focus and to restart synced marquees after completion
- `moonstone/Scroller` to recalculate when an expandable child opens
- `spotlightDisabled` property support for spottable moonstone components
- `moonstone/Popup` and `moonstone/ContextualPopupDecorator` so that when the popup is closed, spotlight focus returns to the control that had focus prior to the popup opening
- `moonstone/Input` to not get focus when disabled

## [1.0.0-beta.2] - 2017-01-30

### Added

- `moonstone/Panels.Panel` property `showChildren` to support deferring rendering the panel body until animation completes
- `moonstone/MarqueeDecorator` property `invalidateProps` that specifies which props cause the marquee distance to be invalidated
- developer-mode warnings to several components to warn when values are out-of-range
- `moonstone/Divider` property `spacing` which adjusts the amount of empty space above and below the `Divider`. `'normal'`, `'small'`, `'medium'`, `'large'`, and `'none'` are available.
- `moonstone/Picker` when `joined` the ability to be incremented and decremented by arrow keys
- `onSpotlightDisappear` event property support for spottable moonstone components
- `moonstone/VideoPlayer` property `titleHideDelay`

### Changed

- `moonstone/Panels.Panels` and variations to defer rendering the children of contained `Panel` instances until animation completes
- `moonstone/ProgressBar` properties `progress` and `backgroundProgress` to accept a number between 0 and 1
- `moonstone/Slider` and `moonstone/IncrementSlider` property `backgroundPercent` to `backgroundProgress` which now accepts a number between 0 and 1
- `moonstone/Slider` to not ignore `value` prop when it is the same as the previous value
- `moonstone/Picker` component's buttons to reverse their operation such that 'up' selects the previous item and 'down' the next
- `moonstone/Picker` and derivatives may now use numeric width, which represents the amount of characters to use for sizing. `width={4}` represents four characters, `2` for two characters, etc. `width` still accepts the size-name strings.
- `moonstone/Divider` to now behave as a simple horizontal line when no text content is provided
- `moonstone/Scrollable` to not display scrollbar controls by default
- `moonstone/DatePicker` and `moonstone/TimePicker` to emit `onChange` event whenever the value is changed, not just when the component is closed

### Removed

- `moonstone/ProgressBar` properties `min` and `max`

### Fixed

- `moonstone/IncrementSlider` so that the knob is spottable via pointer, and 5-way navigation between the knob and the increment/decrement buttons is functional
- `moonstone/Slider` and `moonstone/IncrementSlider` to not fire `onChange` for value changes from props

## [1.0.0-beta.1] - 2016-12-30

### Added

- `moonstone/VideoPlayer` and `moonstone/TooltipDecorator` components and samples
- `moonstone/Panels.Panels` property `onBack` to support `ui/Cancelable`
- `moonstone/VirtualFlexList` Work-In-Progress component to support variably sized rows or columns
- `moonstone/ExpandableItem` properties `autoClose` and `lockBottom`
- `moonstone/ExpandableList` properties `noAutoClose` and `noLockBottom`
- `moonstone/Picker` property `reverse`
- `moonstone/ContextualPopup` property `noAutoDismiss`
- `moonstone/Dialog` property `scrimType`
- `moonstone/Popup` property `spotlightRestrict`

### Changed

- `moonstone/Panels.Routable` to require a `navigate` configuration property indicating the event callback for back or cancel actions
- `moonstone/MarqueeController` focus/blur handling to start and stop synchronized `moonstone/Marquee` components
- `moonstone/ExpandableList` property `autoClose` to `closeOnSelect` to disambiguate it from the added `autoClose` on 5-way up
- `moonstone/ContextualPopupDecorator.ContextualPopupDecorator` component's `onCloseButtonClick` property to `onClose`
- `moonstone/Dialog` component's `onCloseButtonClicked` property to `onClose`
- `moonstone/Spinner` component's `center` and `middle` properties to a single `centered` property
	that applies both horizontal and vertical centering
- `moonstone/Popup.PopupBase` component's `onCloseButtonClicked` property to `onCloseButtonClick`
- `moonstone/Item.ItemOverlay` component's `autoHide` property to remove the `'no'` option. The same
	effect can be achieved by omitting the property or passing `null`.
- `moonstone/VirtualGridList` to be scrolled by page when navigating with a 5-way direction key
- `moonstone/Scroller`, `moonstone/VirtualList`, `moonstone/VirtualGridList`, and `moonstone/Scrollable` to no longer respond to mouse down/move/up events
- all Expandables to include a state arrow UI element
- `moonstone/LabeledItem` to support a `titleIcon` property which positions just after the title text
- `moonstone/Button` to include `moonstone/TooltipDecorator`
- `moonstone/Expandable` to support being managed, radio group-style, by a component wrapped with `RadioControllerDecorator` from `ui/RadioDecorator`
- `moonstone/Picker` to animate `moonstone/Marquee` children when any part of the `moonstone/Picker` is focused
- `moonstone/VirtualList` to mute its container instead of disabling it during scroll events
- `moonstone/VirtualList`, `moonstone/VirtualGridList`, and `moonstone/Scroller` to continue scrolling when holding down the paging controls
- `moonstone/VirtualList` to require a `component` prop and not have a default value
- `moonstone/Picker` to continuously change when a button is held down by adding `ui/Holdable`.

### Fixed

- `moonstone/Popup` and `moonstone/ContextualPopup` 5-way navigation behavior using spotlight.
- Bug where a synchronized marquee whose content fit the available space would prevent restarting of the marquees
- `moonstone/Input` to show an ellipsis on the correct side based on the text directionality of the `value` or `placeholder` content.
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to prevent unwanted scrolling when focused with the pointer
- `moonstone/Picker` to remove fingernail when a the pointer is held down, but the pointer is moved off the `joined` picker.
- `moonstone/LabeledItem` to include marquee on both `title` and `label`, and be synchronized

## [1.0.0-alpha.5] - 2016-12-16

No changes.

## [1.0.0-alpha.4] - 2016-12-2

### Added

- `moonstone/Popup`, `moonstone/ContextualPopupDecorator`, `moonstone/Notification`, `moonstone/Dialog` and `moonstone/ExpandableInput` components
- `ItemOverlay` component to `moonstone/Item` module
- `marqueeCentered` prop to `moonstone/MarqueeDecorator` and `moonstone/MarqueeText`
- `placeholder` prop to `moonstone/Image`
- `moonstone/MarqueeController` component to synchronize multiple `moonstone/Marquee` components
- Non-latin locale support to all existing Moonstone components
- Language-specific font support
- `moonstone/IncrementSlider` now accepts customizable increment and decrement icons, as well as `moonstone/Slider` being more responsive to external styling

### Changed

- `moonstone/Input` component's `iconStart` and `iconEnd` properties to be `iconBefore` and `iconAfter`, respectively, for consistency with `moonstone/Item.ItemOverlay` naming
- `moonstone/Icon` and `moonstone/IconButton` so the `children` property supports both font-based icons and images
- the `checked` property to `selected` for consistency across the whole framework. This allows better interoperability when switching between various components.  Affects the following: `CheckboxItem`, `RadioItem`, `SelectableItem`, `Switch`, `SwitchItem`, and `ToggleItem`. Additionally, these now use `moonstone/Item.ItemOverlay` to position and handle their Icons.
- `moonstone/Slider` and `moonstone/IncrementSlider` to be more performant. No changes were made to
	the public API.
- `moonstone/GridListImageItem` so that a placeholder image displays while loading the image, and the caption and subcaption support marqueeing
- `moonstone/MoonstoneDecorator` to add `FloatingLayerDecorator`
- `moonstone/IncrementSlider` in vertical mode looks and works as expected.

### Removed

- LESS mixins that belong in `@enact/ui`, so that only moonstone-specific mixins are contained in
this module. When authoring components and importing mixins, only the local mixins need to be
imported, as they already import the general mixins.
- the `src` property from `moonstone/Icon` and `moonston/IconButton`. Use the support for URLs in
	the `children` property as noted above.
- the `height` property from `moonstone/IncrementSlider` and `moonstone/Slider`

### Fixed

- Joined picker so that it now has correct animation when using the mouse wheel
- Bug in DatePicker/TimePicker that prevented setting of value earlier than 1969

## [1.0.0-alpha.3] - 2016-11-8

### Added

- `moonstone/BodyText`, `moonstone/DatePicker`, `moonstone/DayPicker`, `moonstone/ExpandableItem`, `moonstone/Image`, and `moonstone/TimePicker` components
- `fullBleed` prop to `moonstone/Panels/Header`. When `true`, the header content is indented and the header lines are removed.
- Application close button to `moonstone/Panels`. Fires `onApplicationClose` when clicked. Can be omitted with the `noCloseButton` prop.
- `marqueeDisabled` prop to `moonstone/Picker`
- `padded` prop to `moonstone/RangePicker`
- `forceDirection` prop to `moonstone/Marquee`. Forces the direction of `moonstone/Marquee`. Useful for when `RTL` content cannot be auto detected.

### Changed

- `data` parameter passed to `component` prop of `VirtualList`.
- `moonstone/Expandable` into a submodule of `moonstone/ExpandableItem`
- `ExpandableList` to properly support selection
- `moonstone/Divider`'s `children` property to be optional
- `moonstone/ToggleItem`'s `inline` version to have a `max-width` of `240px`
- `moonstone/Input` to use `<div>` instead of `<label>` for wrapping components. No change to
	functionality, only markup.

### Removed

- `moonstone/ExpandableCheckboxItemGroup` in favor of `ExpandableList`

## [1.0.0-alpha.2] - 2016-10-21

This version includes a lot of refactoring from the previous release. Developers need to switch to the new enact-dev command-line tool.

### Added

- New components and HOCs: `moonstone/Scroller`, `moonstone/VirtualList`, `moonstone/VirtualGridList`, `moonstone/Scrollable`, `moonstone/MarqueeText`, `moonstone/Spinner`, `moonstone/ExpandableCheckboxItemGroup`, `moonstone/MarqueeDecorator`
- New options for `ui/Toggleable` HOC
- Marquee support to many components
- Image support to `moonstone/Icon` and `moonstone/IconButton`
- `dismissOnEnter` prop for `moonstone/Input`
- Many more unit tests

### Changed

- Some props for UI state were renamed to have `default` prefix where state was managed by the component. (e.g. `defaultOpen`)

### Fixed

- Many components were fixed, polished, updated and documented
- Inline docs updated to be more consistent and comprehensive
