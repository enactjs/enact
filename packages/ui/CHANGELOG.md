# Change Log

The following is a curated list of changes in the Enact ui module, newest changes on the top.

## [unreleased]

### Change

- `ui/Repeater` to accept an array of objects as children which are spread onto the generated components

## [1.0.0-beta.4] - 2017-03-10

### Added

- `ui/A11yDecorator` to facilitate adding pre/post hints to components
- `ui/AnnounceDecorator` to facilitate announcing actions for accessibility

## [1.0.0-beta.3] - 2017-02-21

### Added

- `ui/Resizable` Higher-order Component to facilitate notification of resized components

## [1.0.0-beta.2] - 2017-01-30

### Added

- `ui/ViewManager` properties `enteringDelay` and `enteringProp` to aid deferred rendering of views
- `ui/resolution` function `scaleToRem` for those times when you have a size in pixels that you want to convert directly to `rem` to support automatic dynamic resizing

## [1.0.0-beta.1] - 2016-12-30

### Added

- `ui/RadioDecorator` and `ui/RadioControllerDecorator` to support radio group-style management of components
- `ui/Holdable` Higher-order Component
- `ui/ViewManager` events `onAppear`, `onEnter`, `onLeave`, `onStay`, `onTransition`, and `onWillTransition`
- `ui/FloatingLayer` `scrimType` prop value `none`
- `ui/Pressable` config option `onMouseLeave`

### Removed

- `ui/Transition` prop `fit` in favor of using `className`

### Changed

- `ui/FloatingLayer` property `autoDismiss` to handle both ESC key and click events

## [1.0.0-alpha.5] - 2016-12-16

No changes.

## [1.0.0-alpha.4] - 2016-12-2

### Added

- `ui/FloatingLayer` module with `FloatingLayer` and `FloatingLayerDecorator` components
- `fit`, `noAnimation` props to `ui/TransitionBase`
- `onHide` prop to `ui/Transition`
- LESS mixins from `@enact/moonstone` that are general purpose and can be utilized by various UI
libraries.

## [1.0.0-alpha.3] - 2016-11-8

### Added

- Selection type support to `ui/Group`

### Changed

- Renamed `ui/Group` prop `select` to `childSelect` and added prop `select` to support selection types


## [1.0.0-alpha.2] - 2016-10-21

This version includes a lot of refactoring from the previous release. Developers need to switch to the new enact-dev command-line tool.

### Added

- New components and HOCs: `ui/Cancelable`, `ui/Changeable`, `ui/Selectable`
- Support for enact-dev command-line tool.
- New options for `ui/Toggleable` HOC
- Many more unit tests

### Changed

- Removed `ui/Pickable` HOC
- Some props for UI state were renamed to have `default` prefix where state was managed by the component. (e.g. `defaultOpen`)

### Fixed

- Many components were fixed, polished, updated and documented
- Inline docs updated to be more consistent and comprehensive

## [1.0.0-alpha.1] - 2016-09-26

Initial release
