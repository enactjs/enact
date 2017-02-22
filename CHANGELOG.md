# Change Log

The following is a curated list of changes in the Enact project, newest changes on the top.

## [1.0.0-beta.3] - 2017-02-21

### Added

- `ui/Resizable` Higher-order Component to facilitate notification of resized components
- `core/handle` function `forProp` to test properties passed to a component
- localStorage caching support for ilib resource files
- Support for 5-way operation of `moonstone/Slider` and `moonstone/VideoPlayer.MediaSlider`
- `moonstone/Slider` now supports `children` which are added to the `Slider`'s knob, and follow it as it moves
- `moonstone/ExpandableInput` properties `iconAfter` and `iconBefore` to display icons after and before the input, respectively
- `moonstone/Dialog` property `preserveCase`, which affects `title` text

### Changed

- `core/handle` function `forProp` to be called `forEventProp` to test for properties on an event
- `moonstone/Marquee` to allow disabled marquees to animate
- `moonstone/Dialog` to marquee `title` and `titleBelow`
- `moonstone/Marquee.MarqueeController` config option `startOnFocus` to `marqueeOnFocus`. `startOnFocus` is deprecated and will be removed in a future update.
- `moonstone/Button`, `moonstone/IconButton`, `moonstone/Item` to not forward `onClick` when `disabled`

### Fixed

- `moonstone/Scroller` to recalculate when an expandable child opens.
- `spotlight.Spotlight` behavior to follow container config rules when navigating between containers
- `spotlight.Spotlight` behavior to not set focus on spottable components animating past the pointer when not in pointer-mode
- `spotlight.Spotlight` 5-way behavior where selecting a spottable component may require multiple attempts before performing actions
- `spotlight.Spotlight` to not unfocus elements on scroll

## [1.0.0-beta.2] - 2017-01-30

### Added

- Support for a new `handlers` block for components created with `core/kind` to allow cached event handlers
- `core/handle` handler `forKey`
- `core/keymap` module to abstract keyboard key codes behind common names (e.g. 'up' and 'down')
- `moonstone/Panels.Panel` property `showChildren` to support deferring rendering the panel body until animation completes
- `moonstone/MarqueeDecorator` property `invalidateProps` that specifies which props cause the marquee distance to be invalidated
- developer-mode warnings to several components to warn when values are out-of-range
- `moonstone/Divider` property `spacing` which adjusts the amount of empty space above and below the `Divider`. `'normal'`, `'small'`, `'medium'`, `'large'`, and `'none'` are available.
- `moonstone/Picker` when `joined` the ability to be incremented and decremented by arrow keys
- `onSpotlightDisappear` event property support for spottable moonstone components
- `spotlight.SpotlightContainerDecorator` support for `spotlightDisabled` prop
- `spotlight.Spottable` support for `onSpotlightDown`, `onSpotlightLeft`, `onSpotlightRight`, and `onSpotlightUp` properties
- `spotlight.Spotlight` method `getDirection` to replace `spotlightDirections`
- `ui/ViewManager` properties `enteringDelay` and `enteringProp` to aid deferred rendering of views
- `ui/resolution` function `scaleToRem` for those times when you have a size in pixels that you want to convert directly to `rem` to support automatic dynamic resizing

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

- `core/handle.withArgs` helper function which is no longer needed with the addition of the `handlers` support in `kind()`
- `moonstone/ProgressBar` properties `min` and `max`
- `spotlight` `spotlightDirections`

### Fixed

- `moonstone/IncrementSlider` so that the knob is spottable via pointer, and 5-way navigation between the knob and the increment/decrement buttons is functional
- `moonstone/Slider` and `moonstone/IncrementSlider` to not fire `onChange` for value changes from props

## [1.0.0-beta.1] - 2016-12-30

### Added

- `core/factory` which provides the means to support design-time customization of components
- `Moonstone/VideoPlayer` and `moonstone/TooltipDecorator` components
- `moonstone/Panels.Panels` property `onBack` to support `ui/Cancelable`
- `moonstone/VirtualFlexList` Work-In-Progress component (with sample) to support variably sized rows or columns
- `moonstone/ExpandableItem` properties `autoClose` and `lockBottom`
- `moonstone/ExpandableList` properties `noAutoClose` and `noLockBottom`
- `moonstone/ContextualPopup` property `noAutoDismiss`
- `moonstone/Dialog` property `scrimType`
- `moonstone/Popup` property `spotlightRestrict`
- `spotlight.Spotlight` methods `isPaused()`, `isSpottable()`, `getCurrent()`, and `isMuted()`
- `spotlight.SpotlightContainerDecorator` property `spotlightMuted`
- `spotlight.spotlightDirections` export
- `ui/RadioDecorator` and `ui/RadioControllerDecorator` to support radio group-style management of components
- `ui/Holdable` Higher-order Component
- `ui/ViewManager` events `onAppear`, `onEnter`, `onLeave`, `onStay`, `onTransition`, and `onWillTransition`
- `ui/FloatingLayer` `scrimType` prop value `none`
- `ui/Pressable` config option `onMouseLeave`

### Changed

- `moonstone/Panels.Routable` to require a `navigate` configuration property indicating the event callback for back or cancel actions
- `moonstone/MarqueeController` focus/blur handling to start and stop synchronized `moonstone/Marquee` components
- `moonstone/ExpandableList` property `autoClose` to `closeOnSelect` to disambiguate it from the added `autoClose` on 5-way up
- `moonstone/ContextualPopupDecorator.ContextualPopupDecorator` component's `onCloseButtonClick` property to `onClose`
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
- `ui/FloatingLayer` property `autoDismiss` to handle both ESC key and click events

### Removed

- `ui/Transition` prop `fit` in favor of using `className`

### Fixed

- `i18n/I18nDecorator` issue causing multiple requests for ilibmanifest.
- `moonstone/Popup` and `moonstone/ContextualPopup` 5-way navigation behavior using spotlight.
- Bug where a synchronized marquee whose content fit the available space would prevent restarting of the marquees
- `moonstone/Input` to show an ellipsis on the correct side based on the text directionality of the `value` or `placeholder` content.
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to prevent unwanted scrolling when focused with the pointer
- `moonstone/Picker` to remove fingernail when a the pointer is held down, but the pointer is moved off the `joined` picker.
- `moonstone/LabeledItem` to include marquee on both `title` and `label`, and be synchronized

## [1.0.0-alpha.5] - 2016-12-16

### Fixed

- `core/dispatcher` to support pre-rendering

## [1.0.0-alpha.4] - 2016-12-2

> NOTE: The framework was updated to support React 15.4

### Added

- `moonstone/Popup`, `moonstone/ContextualPopupDecorator`, `moonstone/Notification`, `moonstone/Dialog`, `moonstone/ExpandableInput`, `moonstone/Item.ItemOverlay`, `ui/FloatingLayer` and `ui/FloatingLayer.FloatingLayerDecorator` components
- `moonstone/Popup`, `moonstone/ContextualPopupDecorator`, `moonstone/Notification`, `moonstone/Dialog`, `moonstone/Item.ItemOverlay`, `moonstone/ExpandableInput` and `ui/Group` samples
- `marqueeCentered` prop to `moonstone/MarqueeDecorator` and `moonstone/MarqueeText`
- `placeholder` prop to `moonstone/Image`
- `moonstone/MarqueeController` component to synchronize multiple `moonstone/Marquee` components
- Non-latin locale support to all existing Moonstone components
- Language-specific font support
- `setPointerMode()` and `setActiveContainer()` methods to `@enact/spotlight` export
- `fit`, `noAnimation` props to `ui/TransitionBase`
- `onHide` prop to `ui/Transition`

### Changed

- `moonstone/Input` component's `iconStart` and `iconEnd` properties to be `iconBefore` and `iconAfter`, respectively, for consistency with `moonstone/Item.ItemOverlay` naming
- `moonstone/Icon` and `moonstone/IconButton` so the `children` property supports both font-based icons and images. This removes support for the `src` property.
- the `checked` property to `selected` for consistency across the whole framework. This allows better interoperability when switching between various components.  Affects the following: `CheckboxItem`, `RadioItem`, `SelectableItem`, `Switch`, `SwitchItem`, and `ToggleItem`. Additionally, these now use `moonstone/Item.ItemOverlay` to position and handle their Icons.
- documentation to support our doc generation tool
- `moonstone/Slider` and `moonstone/IncrementSlider` to be more performant. No changes were made to
	the public API.
- `moonstone/GridListImageItem` so that a placeholder image displays while loading the image, and the caption and subcaption support marqueeing
- `moonstone/MoonstoneDecorator` to add `FloatingLayerDecorator`

### Removed

- the `src` property from `moonstone/Icon` and `moonston/IconButton`. Use the support for URLs in
	the `children` property as noted above.

### Fixed

- Addressed many bugs and performance issues

## [1.0.0-alpha.3] - 2016-11-8

> Note: For those who are using `eslint-config-enact` for in-editor linting, there have been some important changes and reinstallation is necessary. Refer to [https://github.com/enyojs/eslint-config-enact/](https://github.com/enyojs/eslint-config-enact/) for install instructions or reinstall via:
>
> ```
> npm install -g eslint eslint-plugin-react eslint-plugin-babel babel-eslint enyojs/eslint-plugin-enact enyojs/eslint-config-enact
> ```
>
>If you don't use in-editor linting or use a different linting configuration, you can safely ignore this notice.

### Added

- `core/dispatcher` - an event dispatcher for global events (e.g. `window` and `document` events) that fire outside of the React tree
- Support for detecting browser locale change events through `languagechange` event in
	`i18n/I18nDecorator`
- `moonstone/BodyText`, `moonstone/DatePicker`, `moonstone/DayPicker`, `moonstone/ExpandableItem`, `moonstone/Image`, and `moonstone/TimePicker` components
- `fullBleed` prop to `moonstone/Panels/Header`. When `true`, the header content is indented and the header lines are removed.
- Application close button to `moonstone/Panels`. Fires `onApplicationClose` when clicked. Can be omitted with the `noCloseButton` prop.
- Samples for `moonstone/BodyText`, `moonstone/DatePicker`, `moonstone/DayPicker`,
	`moonstone/ExpandableItem`, `moonstone/Image`, `moonstone/Scroller`, `moonstone/TimePicker`,
	`moonstone/VirtualList`, and `moonstone/VirtualList.VirtualGridList`
- `spotlightDefaultClass` to `@enact/spotlight` export. Applying this class to an item in a
	container will cause it to be the default spotted item in that container.
- Selection type support to `ui/Group`
- Documentation on Flexbox and an Enyo to Enact component migration guide

### Changed

- `data` parameter passed to `component` prop of `VirtualList`.
- `moonstone/Expandable` into a submodule of `moonstone/ExpandableItem`
- `ExpandableList` to properly support selection
- `moonstone/Divider`'s `children` property to be optional
- `moonstone/ToggleItem`'s `inline` version to have a `max-width` of `240px`
- `moonstone/Input` to use `<div>` instead of `<label>` for wrapping components. No change to
	functionality, only markup.
- Spotlight containers to spot the last focused element by default.
- `ui/Group` prop `select` to `childSelect` and added prop `select` to support selection types

### Removed

- `moonstone/ExpandableCheckboxItemGroup` in favor of `ExpandableList`
- `decorated` prop from `@enact/spotlight/focusable` as this relationship is managed
	implicitly by the component decorated by `@enact/spotlight/focusable`.

### Fixed

- Spotlight stops at container boundaries when 5-way key held down
- Several issues related to spotting controls in edge cases


## [1.0.0-alpha.2] - 2016-10-21

This version includes a lot of refactoring from the previous release. Developers need to switch to the new enact-dev command-line tool.

### Added

- New components and HOCs: `moonstone/Scroller`, `moonstone/VirtualList`, `moonstone/VirtualGridList`, `moonstone/Scrollable`, `moonstone/MarqueeText`, `moonstone/Spinner`, `moonstone/ExpandableCheckboxItemGroup`, `moonstone/MarqueeDecorator`, `ui/Cancelable`, `ui/Changeable`, `ui/Selectable`
- Support for enact-dev command-line tool.
- `fetch()` polyfill to support pre-rendering
- New options for `ui/Toggleable` HOC
- Ability to adjust locale in Sampler
- Marquee support to many components
- Image support to `moonstone/Icon` and `moonstone/IconButton`
- QA Sampler with test-specific samples (not to be used as examples of good coding style!)
- Looser app-specific ESLint rules
- webOS utility functions
- `dismissOnEnter` prop for `moonstone/Input`
- Many more unit tests

### Changed

- Sampler now uses port 8080
- Removed `ui/Pickable` HOC
- Some props for UI state were renamed to have `default` prefix where state was managed by the component. (e.g. `defaultOpen`)
- Removed Babel polyfill to support future snapshot work. This may affect apps that relied on specific polyfills. Added the following specific polyfills: `window.fetch` (plus associated Fetch APIs), `window.Promise`, `Math.sign`, `Object.assign`, `String.fromCodePoint`, `String.prototype.codePointAt`
- Computed properties in `kind()` no longer mutate props. In other words, changing the value of a prop in one computed property does not affect the value of that prop in another computed property.

### Fixed

- Many components were fixed, polished, updated and documented
- Inline docs updated to be more consistent and comprehensive

## [1.0.0-alpha.1] - 2016-09-26

Initial release
