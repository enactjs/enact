# Change Log

The following is a curated list of changes in the Enact core module, newest changes on the top.

## [1.0.0-beta.2] - 2017-01-30

### Added

- Support for a new `handlers` block for components created with `core/kind` to allow cached event handlers
- `core/handle` handler `forKey`
- `core/keymap` module to abstract keyboard key codes behind common names (e.g. 'up' and 'down')

### Removed

- `core/handle.withArgs` helper function which is no longer needed with the addition of the `handlers` support in `kind()`

## [1.0.0-beta.1] - 2016-12-30

### Added

- `core/factory` which provides the means to support design-time customization of components

## [1.0.0-alpha.5] - 2016-12-16

### Fixed

- `core/dispatcher` to support pre-rendering

## [1.0.0-alpha.4] - 2016-12-2

No developer-facing changes.

## [1.0.0-alpha.3] - 2016-11-8

### Added

- `core/dispatcher` - an event dispatcher for global events (e.g. `window` and `document` events) that fire outside of the React tree

## [1.0.0-alpha.2] - 2016-10-21

This version includes a lot of refactoring from the previous release. Developers need to switch to the new enact-dev command-line tool.

### Added

- `stopImmediate` to `core/handle`
- Many more unit tests

### Changed

- Computed properties in `kind()` no longer mutate props. In other words, changing the value of a prop in one computed property does not affect the value of that prop in another computed property.

### Fixed

- Inline docs updated to be more consistent and comprehensive

## [1.0.0-alpha.1] - 2016-09-26

Initial release
