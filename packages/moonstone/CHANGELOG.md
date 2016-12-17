# Change Log

The following is a curated list of changes in the Enact moonstone module, newest changes on the top.

## [unreleased]

### Added
- `Moonstone/VideoPlayer` component

### Changed

- `moonstone/Spinner` component's `center` and `middle` properties to a single `centered` property
	that applies both horizontal and vertical centering
- `moonstone/Popup.PopupBase` component's `onCloseButtonClicked` property to `onCloseButtonClick`
- `moonstone/Item.ItemOverlay` component's `autoHide` property to remove the `'no'` option. The same
	effect can be achieved by omitting the property or passing `null`.
- `moonstone/VirtualGridList` to be scrolled by page when navigating with a 5-way direction key
- `moonstone/Scroller`, `moonstone/VirtualList`, `moonstone/VirtualGridList`, and `moonstone/Scrollable` to no longer respond to mouse down/move/up events

### Fixed

- `moonstone/Input` to show an ellipsis on the correct side based on the text directionality of the `value` or `placeholder` content.
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to prevent unwanted scrolling when focused with the pointer
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
