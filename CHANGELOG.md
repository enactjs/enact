# Change Log

The following is a curated list of changes in the Enact project, newest changes on the top.

## [1.0.0-alpha.2] - 2016-10-21
This version includes a lot of refactoring from the previous release. Developers need to switch
to the new `enact-dev` command-line tool.

### Added
- New components and HOCs: `moonstone/Scroller`, `moonstone/VirtualList`,
`moonstone/VirtualGridList`, `moonstone/Scrollable` `moonstone/MarqueeText`, `moonstone/Spinner`,
`moonstone/ExpandableCheckboxItemGroup`, `moonstone/MarqueeDecorator`, `ui/Cancelable`,
`ui/Changeable`, `ui/Selectable`
- Support for `enact-dev` command-line tool.
- `fetch()` polyfill to support pre-rendering
- New options for `Toggleable` HOC
- Ability to adjust locale in Sampler
- Marquee support to many components
- Image support to `Icon` and `IconButton`
- QA Sampler with test-specific samples (not to be used as examples of good coding style!)
- Looser app-specific ESLint rules
- webOS utility functions
- `dismissOnEnter` prop for `moonstone/Input`
- New config options to `Toggleable` HOC
- Many more unit tests

### Changed
- Sampler now uses port 8080
- Removed `Pickable` HOC
- Some props for UI state were renamed to have `default` prefix where state was managed by
the component. (e.g. `defaultOpen`)
- Removed Babel polyfill to support future snapshot work. This may affect apps that relied on specific
polyfills. Added the following specific polyfills: `window.fetch` (plus associated Fetch APIs), `window.Promise`,
`Math.sign`, `Object.assign`, `String.fromCodePoint`, `String.prototype.codePointAt`
- Computed properties in `kind()` no longer mutate props. In other words, changing the value of a prop in one computed
property does not affect the value of that prop in another computed property.

### Fixed
- Many components were fixed, polished, updated and documented
- Inline docs updated to be more consistent and comprehensive

## [1.0.0-alpha.1] - 2016-09-29
### Initial Release
