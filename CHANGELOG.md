# Change Log

The following is a curated list of changes in the Enact project, newest changes on the top.

## [1.0.0-alpha.3] - 2016-11-8

> Note: For those who are using `eslint-config-enact` for in-editor linting, there have been some important changes and reinstallation is necessary. Refer to [https://github.com/enyojs/eslint-config-enact/](https://github.com/enyojs/eslint-config-enact/) for install instructions or reinstall via:
>
> ```
> npm install -g eslint eslint-plugin-react eslint-plugin-babel babel-eslint enyojs/eslint-plugin-enact enyojs/eslint-config-enact
> ```
>
>If you don't use in-editor linting or use a different linting configuration, you can safely ignore this notice.

### Added

- `core/dispatcher` - an event dispatcher for global events (e.g. `window` and `document` events) that fire outside of the React tree
- Support for detecting browser locale change events through `languagechange` event in
	`i18n/I18nDecorator`
- `moonstone/BodyText`, `moonstone/DatePicker`, `moonstone/DayPicker`, `moonstone/ExpandableItem`, `moonstone/Image`, and `moonstone/TimePicker` components
- `fullBleed` prop to `moonstone/Panels/Header`. When `true`, the header content is indented and the header lines are removed.
- Application close button to `moonstone/Panels`. Fires `onApplicationClose` when clicked. Can be omitted with the `noCloseButton` prop.
- Samples for `moonstone/BodyText`, `moonstone/DatePicker`, `moonstone/DayPicker`,
	`moonstone/ExpandableItem`, `moonstone/Image`, `moonstone/Scroller`, `moonstone/TimePicker`,
	`moonstone/VirtualList`, and `moonstone/VirtualList.VirtualGridList`
- `spotlightDefaultClass` to `@enact/spotlight` export. Applying this class to an item in a
	container will cause it to be the default spotted item in that container.
- Selection type support to `ui/Group`
- Documentation on Flexbox and an Enyo to Enact component migration guide

### Changed

- `data` parameter passed to `component` prop of `VirtualList`.
- `moonstone/Expandable` into a submodule of `moonstone/ExpandableItem`
- `ExpandableList` to properly support selection
- `moonstone/Divider`'s `children` property to be optional
- `moonstone/ToggleItem`'s `inline` version to have a `max-width` of `240px`
- `moonstone/Input` to use `<div>` instead of `<label>` for wrapping components. No change to
	functionality, only markup.
- Spotlight containers to spot the last focused element by default.
- `ui/Group` prop `select` to `childSelect` and added prop `select` to support selection types

### Removed

- `moonstone/ExpandableCheckboxItemGroup` in favor of `ExpandableList`
- `decorated` prop from `@enact/spotlight/focusable` as this relationship is managed
	implicitly by the component decorated by `@enact/spotlight/focusable`.

### Fixed

- Spotlight stops at container boundaries when 5-way key held down
- Several issues related to spotting controls in edge cases
- Joined picker now has correct animation onMouseWheel. 


## [1.0.0-alpha.2] - 2016-10-21

This version includes a lot of refactoring from the previous release. Developers need to switch to the new enact-dev command-line tool.

### Added

- New components and HOCs: `moonstone/Scroller`, `moonstone/VirtualList`, `moonstone/VirtualGridList`, `moonstone/Scrollable`, `moonstone/MarqueeText`, `moonstone/Spinner`, `moonstone/ExpandableCheckboxItemGroup`, `moonstone/MarqueeDecorator`, `ui/Cancelable`, `ui/Changeable`, `ui/Selectable`
- Support for enact-dev command-line tool.
- `fetch()` polyfill to support pre-rendering
- New options for `ui/Toggleable` HOC
- Ability to adjust locale in Sampler
- Marquee support to many components
- Image support to `moonstone/Icon` and `moonstone/IconButton`
- QA Sampler with test-specific samples (not to be used as examples of good coding style!)
- Looser app-specific ESLint rules
- webOS utility functions
- `dismissOnEnter` prop for `moonstone/Input`
- Many more unit tests

### Changed

- Sampler now uses port 8080
- Removed `ui/Pickable` HOC
- Some props for UI state were renamed to have `default` prefix where state was managed by the component. (e.g. `defaultOpen`)
- Removed Babel polyfill to support future snapshot work. This may affect apps that relied on specific polyfills. Added the following specific polyfills: `window.fetch` (plus associated Fetch APIs), `window.Promise`, `Math.sign`, `Object.assign`, `String.fromCodePoint`, `String.prototype.codePointAt`
- Computed properties in `kind()` no longer mutate props. In other words, changing the value of a prop in one computed property does not affect the value of that prop in another computed property.

### Fixed

- Many components were fixed, polished, updated and documented
- Inline docs updated to be more consistent and comprehensive

## [1.0.0-alpha.1] - 2016-09-26

Initial release
