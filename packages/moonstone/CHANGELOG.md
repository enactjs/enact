# Change Log

The following is a curated list of changes in the Enact moonstone module, newest changes on the top.

## [unreleased]

### Added

- `moonstone/DatePicker`, `moonstone/DayPicker`, `moonstone/ExpandableItem`, `moonstone/Image`, and `moonstone/TimePicker` components
- `fullBleed` prop to `moonstone/Panels/Header`. When `true`, the header content is indented and the header lines are removed.
- `marqueeDisabled` prop to `moonstone/Picker`
- `padded` prop to `moonstone/RangePicker`

### Changed

- `data` parameter passed to `component` prop of `VirtualList`.
- Overhauled and moved `moonstone/Expandable` into a submodule of `moonstone/ExpandableItem`
- Overhauled `ExpandableList` to properly support selection
- Removed `moonstone/ExpandableCheckboxItemGroup` in favor of `ExpandableList`
- `moonstone/Divider`'s `children` property is now optional
- `moonstone/ToggleItem`'s `inline` now has a `max-width` of `240px`


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
