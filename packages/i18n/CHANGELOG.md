# Change Log

The following is a curated list of changes in the Enact i18n module, newest changes on the top.

## [2.1.1] - 2018-08-27

No significant changes.

## [2.1.0] - 2018-08-20

### Changed

- `i18n` to use the latest version of the `ilib`

## [2.0.2] - 2018-08-13

No significant changes.

## [2.0.1] - 2018-08-01

No significant changes.

## [2.0.0] - 2018-07-30

No significant changes.

## [2.0.0-rc.3] - 2018-07-23

### Fixed

- `i18n/ilib` to calculate time properly over DST boundary in fa-IR locale

## [2.0.0-rc.2] - 2018-07-16

No significant changes.

## [2.0.0-rc.1] - 2018-07-09

### Fixed

- `i18n/Uppercase` to apply the designated `casing` prop format to each child instead of only the first child

### Removed

- `i18n/I18nDecorator.contextTypes`, replaced by `i18n/I18nDecorator.I18nContextDecorator`

### Added

- `i18n/I18nDecorator.I18nContextDecorator` HOC to support notification of locale changes

## [2.0.0-beta.9] - 2018-07-02

No significant changes.

## [2.0.0-beta.8] - 2018-06-25

No significant changes.

## [2.0.0-beta.7] - 2018-06-11

### Removed

- `i18n/Uppercase` property `preserveCase`, replaced by `casing`

## [2.0.0-beta.6] - 2018-06-04

No significant changes.

## [2.0.0-beta.5] - 2018-05-29

No significant changes.

## [2.0.0-beta.4] - 2018-05-21

No significant changes.

## [2.0.0-beta.3] - 2018-05-14

No significant changes.

## [2.0.0-beta.2] - 2018-05-07

No significant changes.

## [2.0.0-beta.1] - 2018-04-29

No significant changes.

## [2.0.0-alpha.8] - 2018-04-17

No significant changes.

## [2.0.0-alpha.7] - 2018-04-03

No significant changes.

## [2.0.0-alpha.6] - 2018-03-22

No significant changes.

## [2.0.0-alpha.5] - 2018-03-07

No significant changes.

## [2.0.0-alpha.4] - 2018-02-13

No significant changes.

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

## [1.13.4] - 2018-07-30

No significant changes.

## [1.13.3] - 2018-01-16

No significant changes.

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

No significant changes.

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

### Changed

- Vietnamese to be classified as a non-latin language

## [1.8.0] - 2017-09-07

Updated iLib to latest version

## [1.7.0] - 2017-08-23

No significant changes.

## [1.6.1] - 2017-08-07

No significant changes.

## [1.6.0] - 2017-08-04

No significant changes.

## [1.5.0] - 2017-07-19

No significant changes.

## [1.4.1] - 2017-07-05

No significant changes.

## [1.4.0] - 2017-06-29

No significant changes.

## [1.3.1] - 2017-06-14

No significant changes.

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
