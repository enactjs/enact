# Change Log

The following is a curated list of changes in the Enact spotlight module, newest changes on the top.

## [unreleased]

### Added

- `spotlightDisabled` prop support in `@enact/spotlight/container`
- `onSpotlightDisappear` event property support in `@enact/spotlight/spottable`

### Removed

- `@enact/spotlight.spotlightDirections` export and replaced it with `getDirection()` 

## [1.0.0-beta.1] - 2016-12-30

### Added

- `@enact/spotlight.Spotlight` methods `isPaused()`, `isSpottable()`, `getCurrent()`, and `isMuted()`
- `@enact/spotlight.SpotlightContainerDecorator` property `spotlightMuted`
- `@enact/spotlight.spotlightDirections` export

## [1.0.0-alpha.5] - 2016-12-16

No changes.

## [1.0.0-alpha.4] - 2016-12-2

### Added

- `setPointerMode()` and `setActiveContainer()` methods

## [1.0.0-alpha.3] - 2016-11-8

### Added

- `spotlightDefaultClass` to `@enact/spotlight` export. Applying this class to an item in a
	container will cause it to be the default spotted item in that container.

### Changed

- Spotlight containers to spot the last focused element by default

### Removed

- `decorated` prop from `@enact/spotlight/focusable` as this relationship is managed
	implicitly by the component decorated by `@enact/spotlight/focusable`.

### Fixed

- Spotlight stops at container boundaries when 5-way key held down
- Several issues related to spotting controls in edge cases

## [1.0.0-alpha.2] - 2016-10-21

This version includes a lot of refactoring from the previous release. Developers need to switch to the new enact-dev command-line tool.

### Fixed

- Update spotlight container handling
- Inline docs updated to be more consistent and comprehensive

## [1.0.0-alpha.1] - 2016-09-26

Initial release
