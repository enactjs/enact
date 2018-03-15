# Change Log

The following is a curated list of changes in the Enact spotlight module, newest changes on the top.

## [2.0.0-alpha.5] - 2018-03-07

No significant changes.

## [2.0.0-alpha.4] - 2018-02-13

### Fixed

- `spotlight/Spottable` to not remove `tabindex` from unspottable components to allow blur events to propagate as expected when a component becomes disabled
- `spotlight/Spottable` to prevent unnecessary updates due to focus changes

## [2.0.0-alpha.3] - 2018-01-18

No significant changes.

## [2.0.0-alpha.2] - 2017-08-29

No significant changes.

## [2.0.0-alpha.1] - 2017-08-27

No significant changes.

## [1.15.0] - 2018-02-28

No significant changes.

## [1.14.0] - 2018-02-23

No significant changes.

## [1.13.3] - 2018-01-16

No significant changes.

## [1.13.2] - 2017-12-14

### Fixed

- `spotlight` to guard against accessing unconfigured container configurations

## [1.13.1] - 2017-12-06

No significant changes.

## [1.13.0] - 2017-11-28

No significant changes.

## [1.12.2] - 2017-11-15

### Fixed

- `spotlight` to handle non-5-way keys correctly to focus on next 5-way keys
- `spotlight/Spottable` to forward `onMouseEnter` and `onMouseLeave`

## [1.12.1] - 2017-11-07

No significant changes.

## [1.12.0] - 2017-10-27

### Fixed

- `spotlight` to focus enabled items that were hovered while disabled
- `spotlight` to not access non-existent container configurations
- `spotlight/Spottable` to not block next enter key when focus is moved while pressing enter

## [1.11.0] - 2017-10-24

### Changed

- `spotlight` to handle key events to preserve pointer mode for specific keys

### Fixed

- `spotlight` to not require multiple 5-way key presses in order to change focus after the window regains focus

## [1.10.1] - 2017-10-16

### Fixed

- `spotlight.Spotlight` method `focus()` to prevent focusing components within containers that are being removed

## [1.10.0] - 2017-10-09

### Fixed

- `spotlight.Spotlight` method `focus()` to verify that the target element matches its container's selector rules prior to setting focus

## [1.9.3] - 2017-10-03

- `spotlight.Spotlight` method `focus()` to verify that the target element matches its container's selector rules prior to setting focus

## [1.9.2] - 2017-09-26

No significant changes.

## [1.9.1] - 2017-09-25

No significant changes.

## [1.9.0] - 2017-09-22

### Changed

- `spotlight` to block handling repeated key down events that were interrupted by a pointer event

### Fixed

- `spotlight` to not try to focus something when the window is activated unless the window has been previously blurred
- `spotlight` to prevent containers that have been unmounted from being considered potential targets

## [1.8.0] - 2017-09-07

### Fixed

- `spotlight/Spottable` to clean up internal spotted state when blurred within `onSpotlightDisappear` handler

## [1.7.0] - 2017-08-23

### Added

- `spotlight/SpotlightContainerDecorator` config option `continue5WayHold` to support moving focus to the next spottable element on 5-way hold key
- `spotlight/Spottable` ability to restore focus when an initially disabled component becomes enabled

### Fixed

- `spotlight` to correctly restore focus to a spotlight container in another container
- `spotlight` to not try to focus something when the window is activated if focus is already set

## [1.6.1] - 2017-08-07

No significant changes.

## [1.6.0] - 2017-08-04

### Changed

- `spotlight` containers using a `restrict` value of `'self-only'` will ignore `leaveFor` directives when attempting to leave the container via 5-way

### Fixed

- `spotlight` to not blur and re-focus an element that is already focused

## [1.5.0] - 2017-07-19

### Changed

- `spotlight` 5-way target selection to ignore empty containers
- `spotlight` containers to support an array of selectors for `defaultElement`

## [1.4.1] - 2017-07-05

### Changed

- `spotlight/Spottable` to remove focus from a component when it becomes disabled and move it to another component if not explicitly moved during the `onSpotlightDisappear` event callback

## [1.4.0] - 2017-06-29

### Added

- `spotlight` handlers for window focus events

### Fixed

- `spotlight` navigation through spottable components while holding down a directional key
- `spotlight` support for preventing 5-way navigation out of a container using an empty selector
- `spotlight` container support for default elements within subcontainers

## [1.3.1] - 2017-06-14

### Fixed

- `spotlight` incorrectly focusing components within spotlight containers with `data-container-disabled` set to `false`
- `spotlight` failing to focus the default element configured for a container

## [1.3.0] - 2017-06-12

### Added

- `spotlight/styles/mixins.less` mixins which allow state-selector-rules (muted, spottable, focus, disabled) to be applied to the parent instead of the component's self. This provides much more flexibility without extra mixins to memorize.

### Changed

- `spotlight` submodules to significantly improve testability

### Fixed

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
- `spotlight.Spotlight` method `getSpottableDescendants()`

### Changed

- `spotlight/SpotlightContainerDecorator` to have no default for `spotlightRestrict`

### Fixed

- `spotlight.Spotlight` to consider nested containers when adjusting focus

## [1.0.0] - 2017-03-31

### Removed

- `spotlight.Spottable` replaced by `spotlight/Spottable`
- `spotlight.spottableClass` replaced by `spotlight/Spottable.spottableClass`
- `spotlight.SpotlightContainerDecorator` replaced by `spotlight/SpotlightContainerDecorator`
- `spotlight.spotlightDefaultClass` replaced by `spotlight/SpotlightContainerDecorator.spotlightDefaultClass`
- `spotlight.SpotlightRootDecorator` replaced by `spotlight/SpotlightRootDecorator`

### Fixed

- `spotlight.Spotlight` `set()` to properly update the container config
- `spotlight.Spotlight` to properly save the last-focused element for nested containers

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
