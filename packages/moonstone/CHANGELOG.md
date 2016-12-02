# Change Log

The following is a curated list of changes in the Enact moonstone module, newest changes on the top.

## [unreleased]

### Added

- `moonstone/Popup`, `moonstone/ContextualPopupDecorator`, `moonstone/Notification` and `moonstone/Dialog` components
- `marqueeCentered` prop to `moonstone/MarqueeDecorator` and `moonstone/MarqueeText`
- `ItemOverlay` component to `moonstone/Item` module
- `placeholder` prop to `moonstone/Image`
- `moonstone/MarqueeController` component to synchronize multiple `moonstone/Marquee` components
- Non-latin locale support to all existing Moonstone components.

### Changed

- `moonstone/Icon` and `moonstone/IconButton` so the `children` property supports both font-based icons and images.
- the `checked` property to `selected` for consistency across the whole framework. This allows better interoperability when switching between various components.  Affects the following: `CheckboxItem`, `RadioItem`, `SelectableItem`, `Switch`, `SwitchItem`, and `ToggleItem`. Additionally, these now use `moonstone/Item.ItemOverlay` to position and handle their Icons.
- `moonstone/Slider` and `moonstone/IncrementSlider` to be more performant. No changes were made to
	the public API.
- `moonstone/GridListImageItem` so that a placeholder image displays while loading the image, and the caption and subcaption support marqueeing.
- `moonstone/MoonstoneDecorator` to add `FloatingLayerDecorator`

### Removed

- LESS mixins that belong in `@enact/ui`, so that only moonstone-specific mixins are contained in
this module. When authoring components and importing mixins, only the local mixins need to be
imported, as they already import the general mixins.

### Fixed

- Joined picker so that it now has correct animation when using the mouse wheel.

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
