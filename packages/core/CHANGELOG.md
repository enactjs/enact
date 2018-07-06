# Change Log

The following is a curated list of changes in the Enact core module, newest changes on the top.

## [unreleased]

### Added

* `core/hoc.compose` to facilitate composing multiple HOCs

## [2.0.0-beta.9] - 2018-07-02

No significant changes.

## [2.0.0-beta.8] - 2018-06-25

No significant changes.

## [2.0.0-beta.7] - 2018-06-11

No significant changes.

## [2.0.0-beta.6] - 2018-06-04

No significant changes.

## [2.0.0-beta.5] - 2018-05-29

No significant changes.

## [2.0.0-beta.4] - 2018-05-21

### Added

- `core/handle.handle` utility `bindAs` to facilitate debugging and binding handlers to component instances

## [2.0.0-beta.3] - 2018-05-14

No significant changes.

## [2.0.0-beta.2] - 2018-05-07

### Fixed

- `core/dispatcher.on` to not add duplicate event handlers

## [2.0.0-beta.1] - 2018-04-29

### Added

- `core/snapshot` module with `isWindowReady` method to check the window state and `onWindowReady` method to queue window-dependent callbacks for snapshot builds

### Fixed

- `core/util.memoize` to forward all args to memoized function

## [2.0.0-alpha.8] - 2018-04-17

### Added

- `core/handle.adaptEvent` to adapt event payload before passing to subsequent handler
- `core/handle.call` to invoke a named method on a bound handler

## [2.0.0-alpha.7] - 2018-04-03

No significant changes.

## [2.0.0-alpha.6] - 2018-03-22

### Removed

- `core/factory` module, replaced by the `css` override feature

## [2.0.0-alpha.5] - 2018-03-07

### Removed

- `core/util.childrenEquals` which was no longer supported by React 16

### Added

- `core/util.memoize` method to optimize the execution of expensive functions

## [2.0.0-alpha.4] - 2018-02-13

### Changed

- `core/kind` to always return a component rather than either a component or an SFC depending upon the configuration

## [2.0.0-alpha.3] - 2018-01-18

No significant changes.

## [2.0.0-alpha.2] - 2017-08-29

No significant changes.

## [2.0.0-alpha.1] - 2017-08-27

No significant changes.

## [1.15.0] - 2018-02-28

### Deprecated

- `core/util/childrenEquals`, to be removed in 2.0.0

## [1.14.0] - 2018-02-23

### Deprecated

- `core/factory`, to be removed in 2.0.0

## [1.13.3] - 2018-01-16

### Fixed

- `core/kind` and `core/hoc` public documentation to be visible

## [1.13.2] - 2017-12-14

No significant changes.

## [1.13.1] - 2017-12-06

No significant changes.

## [1.13.0] - 2017-11-28

No significant changes.

## [1.12.2] - 2017-11-15

No significant changes.

## [1.12.1] - 2017-11-07

No significant changes.

## [1.12.0] - 2017-10-27

### Added

- `core/util.Job` APIs `idle`, `idleUntil`, `startRaf` and `startRafAfter`

## [1.11.0] - 2017-10-24

No significant changes.

## [1.10.1] - 2017-10-16

No significant changes.

## [1.10.0] - 2017-10-09

No significant changes.

## [1.9.3] - 2017-10-03

No significant changes.

## [1.9.2] - 2017-09-26

No significant changes.

## [1.9.1] - 2017-09-25

No significant changes.

## [1.9.0] - 2017-09-22

No significant changes.

## [1.8.0] - 2017-09-07

No significant changes.

## [1.7.0] - 2017-08-23

No significant changes.

## [1.6.1] - 2017-08-07

No significant changes.

## [1.6.0] - 2017-08-04

No significant changes.

## [1.5.0] - 2017-07-19

### Changed

- `@core/handle.preventDefault` (and, subsequently, `forwardWithPrevent`) to also call `preventDefault()` on the originating event

## [1.4.1] - 2017-07-05

No significant changes.

## [1.4.0] - 2017-06-29

No significant changes.

## [1.3.1] - 2017-06-14

No significant changes.

## [1.3.0] - 2017-06-12

### Added

- `core/platform` to support platform detection across multiple browsers

## [1.2.2] - 2017-05-31

No significant changes.

## [1.2.1] - 2017-05-25

No significant changes.

## [1.2.0] - 2017-05-17

### Added

- `core/handle.oneOf` to support branching event handlers

## [1.1.0] - 2017-04-21

### Added

- `core/util` documentation

### Fixed

- `core/util.childrenEquals` to work with mixed components and text

## [1.0.0] - 2017-03-31

### Added

- `core/util.Job` to replace `core/jobs` with an API that reduced the chance of job name collisions

### Removed

- `core/jobs` and replaced it with `core/util.Job`
- `core/selection`, which was only used internally by `ui/GroupItem`
- `kind` and `hoc` named exports from root module. Should be directly imported via `@enact/core/kind` and `@enact/core/hoc`, respectively.
- `core/fetch` which was no longer used by Enact

## [1.0.0-beta.4] - 2017-03-10

### Added

- `core/kind` support for `contextTypes`
- `core/utils` function `extractAriaProps()` for redirecting ARIA props when the root node of a component isn't focusable

### Changed

- `core/handle` to allow binding to components. This also introduces a breaking change in the return value of handle methods.

## [1.0.0-beta.3] - 2017-02-21

### Added

- `core/handle` function `forEventProp` to test properties on an event

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
