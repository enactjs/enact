# Change Log

The following is a curated list of changes in the Enact spotlight module, newest changes on the top.

## [unreleased]

### Fixed

`spotlight.Spotlight` behavior to properly save the last-focused element for nested containers

### Removed

- `spotlight.Spottable` replaced by `spotlight/Spottable`
- `spotlight.spottableClass` replaced by `spotlight/Spottable.spottableClass`
- `spotlight.SpotlightContainerDecorator` replaced by `spotlight/SpotlightContainerDecorator`
- `spotlight.spotlightDefaultClass` replaced by `spotlight/SpotlightContainerDecorator.spotlightDefaultClass`
- `spotlight.SpotlightRootDecorator` replaced by `spotlight/SpotlightRootDecorator`

## [1.0.0-beta.4] - 2017-03-10

### Fixed

- `spotlight.Spotlight` pointer behavior where upon immediately entering pointer-mode, hovering over a spottable component may result in the component not receiving focus

### Changed

- `spotlight.Spottable` to prevent emulating mouse events for repeated key events

## [1.0.0-beta.3] - 2017-02-21

### Fixed

- `spotlight.Spotlight` behavior to follow container config rules when navigating between containers
- `spotlight.Spotlight` behavior to not set focus on spottable components animating past the pointer when not in pointer-mode
- `spotlight.Spotlight` 5-way behavior where selecting a spottable component may require multiple attempts before performing actions
- `spotlight.Spotlight` to not unfocus elements on scroll

## [1.0.0-beta.2] - 2017-01-30

### Added

- `spotlight.SpotlightContainerDecorator` support for `spotlightDisabled` prop
- `spotlight.Spottable` support for `onSpotlightDown`, `onSpotlightLeft`, `onSpotlightRight`, and `onSpotlightUp` properties
- `spotlight.Spotlight` method `getDirection()` to replace `spotlightDirections`

### Removed

- `spotlight.Spotlight` `spotlightDirections`

## [1.0.0-beta.1] - 2016-12-30

### Added

- `spotlight.Spotlight` methods `isPaused()`, `isSpottable()`, `getCurrent()`, and `isMuted()`
- `spotlight.SpotlightContainerDecorator` property `spotlightMuted`
- `spotlight.spotlightDirections` export

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
