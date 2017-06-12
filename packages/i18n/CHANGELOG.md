# Change Log

The following is a curated list of changes in the Enact i18n module, newest changes on the top.

## [unreleased]

### Deprecated

### Added

### Changed

### Fixed

### Removed

## [1.3.0] - 2017-06-12

No significant changes.

## [1.2.2] - 2017-05-31

No significant changes.

## [1.2.1] - 2017-05-25

No significant changes.

## [1.2.0] - 2017-05-17

No significant changes.

## [1.1.0] - 2017-04-21

### Added

- `i18n/Uppercase` prop `casing` to control how the component should be uppercased
- `i18n/util` methods `toCapitalized` and `toWordCase` to locale-aware uppercase strings

## [1.0.0] - 2017-03-31

Updated iLib to 20151019-build-12.0-002-04

### Removed

- `i18n.$L` and replaced by `i18n/$L`
- `i18n.toIString` and replaced by `i18n/$L.toIString`

## [1.0.0-beta.4] - 2017-03-10

No significant changes.

## [1.0.0-beta.3] - 2017-02-21

### Added

- localStorage caching support for ilib resource files

## [1.0.0-beta.2] - 2017-01-30

No significant changes.

## [1.0.0-beta.1] - 2016-12-30

### Fixed

- `i18n/I18nDecorator` issue causing multiple requests for ilibmanifest.

## [1.0.0-alpha.5] - 2016-12-16

No changes.

## [1.0.0-alpha.4] - 2016-12-2


## [1.0.0-alpha.3] - 2016-11-8

### Added
- Unit tests
- Support for detecting browser locale change events through `languagechange` event in
	`i18n/I18nDecorator`

## [1.0.0-alpha.2] - 2016-10-21

This version includes a lot of refactoring from the previous release. Developers need to switch to the new enact-dev command-line tool.

### Fixed

- XHR file requests in Chrome were returning failure code after success

## [1.0.0-alpha.1] - 2016-09-26

Initial release
