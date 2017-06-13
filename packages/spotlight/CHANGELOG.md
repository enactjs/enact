# Change Log

The following is a curated list of changes in the Enact spotlight module, newest changes on the top.

## [unreleased]

### Deprecated

### Added

### Changed

### Fixed

- Spotlight continues through container boundaries when 5-way key is held down, as long as the next spottable component is wrapped by the immediate container of the previous spottable component.

### Removed

## [1.3.0] - 2017-06-12

### Added

- `spotlight/styles/mixins.less` mixins which allow state-selector-rules (muted, spottable, focus, disabled) to be applied to the parent instead of the component's self. This provides much more flexibility without extra mixins to memorize.

### Changed

- `spotlight` submodules to significantly improve testability

### Fixed

* Navigating to elements that are hidden within an overflow container (e.g. a scroller)

### Removed
- `spotlight` navigation to elements that are hidden within an overflow container (e.g. a `Scroller`)

## [1.2.2] - 2017-05-31

No significant changes.

## [1.2.1] - 2017-05-25

No significant changes.

## [1.2.0] - 2017-05-17

### Deprecated

- `spotlight/SpotlightRootDecorator.spotlightRootContainerName` to be removed in 2.0.0

### Added

- `spotlight/styles/mixins.less` which includes several mixins (`.focus`, `.disabled`, `.muted`, and `.mutedFocus`) to make it a little easier to target specific spotlight states

### Changed

- `spotlight/SpotlightContainerDecorator` config property, `enterTo`, default value to be `null` rather than `'last-focused'`
- `spotlight` container handling to address known issues and improve testability

## [1.1.0] - 2017-04-21

### Added

- `spotlight/SpotlightRootDecorator` config option: `noAutoFocus` to support prevention of setting automatic focus after render
- `spotlight/Spotlight` method `getSpottableDescendants()`

### Changed

- `spotlight/SpotlightContainerDecorator` to have no default for `spotlightRestrict`

### Fixed

- `spotlight/Spotlight` to consider nested containers when adjusting focus

## [1.0.0] - 2017-03-31

### Removed

- `spotlight.Spottable` replaced by `spotlight/Spottable`
- `spotlight.spottableClass` replaced by `spotlight/Spottable.spottableClass`
- `spotlight.SpotlightContainerDecorator` replaced by `spotlight/SpotlightContainerDecorator`
- `spotlight.spotlightDefaultClass` replaced by `spotlight/SpotlightContainerDecorator.spotlightDefaultClass`
- `spotlight.SpotlightRootDecorator` replaced by `spotlight/SpotlightRootDecorator`

### Fixed

- `spotlight/Spotlight` `set()` to properly update the container config
- `spotlight/Spotlight` to properly save the last-focused element for nested containers

## [1.0.0-beta.4] - 2017-03-10

### Changed

- `spotlight.Spottable` to prevent emulating mouse events for repeated key events

### Fixed

- `spotlight.Spotlight` pointer behavior where upon immediately entering pointer-mode, hovering over a spottable component may result in the component not receiving focus

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
