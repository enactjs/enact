# Change Log

The following is a curated list of changes in the Enact project, newest changes on the top.

## [3.1.0] - 2019-09-16

### Deprecated

- `moonstone/ProgressBar.ProgressBarTooltip` and `moonstone/Slider.SliderTooltip` prop `side`, will be replaced by `position` in 4.0.0

### Added

- `core/platform` member `touchscreen` to detect the presence of a touchscreen separately from support for touch events
- `moonstone/Dropdown` to add new size `x-large`
- `moonstone/ProgressBar.ProgressBarTooltip` and `moonstone/Slider.SliderTooltip` prop `position`, replacing `side`
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` prop `role` to set the ARIA `role`
- `spotlight` support for passing a spottable node or a container node or selector to `Spotlight.focus()`
- `ui/Routable` module
- `ui/VirtualList.VirtualGridList` and `ui/VirtualList.VirtualList` prop `role` to set its ARIA `role`

### Fixed

- `core/kind` and `core/handle` documentation to support better Typescript definitions
- `core/platform` touch event detection
- `moonstone/Header` to fix font size of `titleBelow` and `subTitleBelow`
- `moonstone/Dropdown` to apply `tiny` width
- `moonstone/Dropdown` to include selected `data` in the `onSelect` handler
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` spotlight behavior to focus the last item when reaching the bounds after scroll by page up or down
- `moonstone/VirtualList.VirtualList` to allow a dynamically resized item to scroll into view properly
- `moonstone/Dropdown` accessibility read out when an item is focused

## [3.0.1] - 2019-09-09

### Fixed

- `moonstone/Button` text alignment when `color` is set
- `moonstone/FormCheckboxItem` opacity of `itemIcon` value when focused and disabled
- `moonstone/Notification` to shrink to fit small content
- `moonstone/Scroller` to restore focus properly when pressing page up after holding 5-way down
- `moonstone/Switch` colors to improve visibility
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` to properly navigate from paging controls to items by 5-way key when `focusableScrollbar` is false

## [3.0.0] - 2019-09-03

### Fixed

- `moonstone/ContextualPopupDecorator` layout in large text mode in RTL locales
- `moonstone/Dropdown` performance when using many options
- `moonstone/ProgressBar` fill color when `highlighted` is set
- `moonstone/Scroller` to correctly handle horizontally scrolling focused elements into view when using a `direction` value of `'both'`
- `moonstone/Skinnable` TypeScript signature
- `moonstone/Slider` progress bar fill color when focused with `noFill` set
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` to render the first item properly when the `dataSize` prop is updated and the function as a parameter of the `cbScrollTo` prop is called
- `spotlight` TypeScript signatures
- `ui/Scroller` TypeScript signatures
- `ui/VirtualList.VirtualGridList` and `ui/VirtualList.VirtualList` to apply `will-change` CSS property to the proper node
- `webos/LS2Request` to automatically prefix `luna://` service protocol when absent

## [3.0.0-rc.4] - 2019-08-22

### Fixed

- `i18n/Text` to generate a proper TypeScript definition and to properly detect if translations were available when async
- `moonstone/ContextualPopupDecorator` arrow rendering issue in Chromium
- `moonstone/EditableIntegerPicker` to properly rerender when the edited value is invalid
- `moonstone/FormCheckboxItem` to marquee its contents
- `moonstone/VideoPlayer` to have correct jump forward/backward icon
- `ui/styles/mixins.less` mixins: `.buildLocaleFont`, `.buildLocaleFonts`, `.buildFontFace` to properly support font-weight ranges, font-weight default values, and font-stretch values
- Language-specific fonts so they always use the correct typeface for their locale

## [3.0.0-rc.3] - 2019-08-15

### Fixed

- `moonstone/Header` input highlight positioning
- `moonstone/MediaOverlay` to not mute media playback
- `moonstone/Panels` animation performance issues on low powered hardware
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` to correctly scroll to a selected component when focused via 5way
- `sampler` to limit the fields included in the Actions tab to improve serialization performance on low-powered hardware
- `spotlight` to attempt to restore focus to an element nearest the pointer position when the pointer hides within an overflow container
- `ui/VirtualList.VirtualGridList` and `ui/VirtualList.VirtualList` to retain the proper scroll position when updating the `itemSize` or `spacing` props

## [3.0.0-rc.2] - 2019-08-08

### Added

- `moonstone/Icon.icons` entries for new icons

### Fixed

- `moonstone` to support custom font for simplified Chinese
- `moonstone` disabled focus appearance to match the latest designs
- `moonstone/DatePicker`, `moonstone/DayPicker`, `moonstone/ExpandableList`, and `moonstone/TimePicker` disabled opacity in high contrast mode
- `moonstone/Picker` to avoid overlapping items on render
- `moonstone/Scroller` and other scrolling components to properly scroll via remote page up/down buttons when nested within another scrolling component
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to scroll via a page up or down key when focus is on any vertical paging control while in pointer mode
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to correctly set focus after scrolling by page up/down keys
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` not to scroll via a page up or down key when focus is on any horizontal paging control

## [3.0.0-rc.1] - 2019-07-31

### Added

- `moonstone/LabeledIconButton` prop `flip` to flip the icon horizontally, vertically, or both
- `moonstone/Popup` public class names `body` and `closeContainer`
- `ui/Icon`, `ui/IconButton`, and `ui/LabeledIcon` prop `flip` to flip the icon horizontally, vertically, or both

### Changed

- `moonstone/Dialog` appearance to match the latest designs
- `moonstone/Scroller` and other scrolling components to scroll via remote page up/down buttons when the scrollbar is hidden
- `spotlight` containers to include nodes identified on the `aria-owns` attribute of the container node as candidates within that container

### Fixed

- `moonstone` fonts be consolidated under "Moonstone" font-family to properly display all localized fonts when representing glyphs from any locale
- `moonstone/Input` text color when focused and disabled
- `moonstone/Panels` to allow 5-way navigation to components within `controls` when used with a `Header` with `headerInput`
- `moonstone/Panels` to treat all components within `controls` as part of the active panel for the purposes of accessibility
- `moonstone/Scroller` to not jump to the top when right key is pressed in the right most item of a vertical scroller
- `moonstone/Scroller` to not scroll horizontally via 5-way down in horizontal scroller
- `moonstone/Tooltip` arrow gap
- `moonstone/VideoPlayer` feedback tooltip to overlap in non-latin locale
- `moonstone/VideoPlayer` more button tooltip to not clip or reverse text in RTL locales
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` to navigate items properly in RTL languages
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` to properly navigate from paging controls to controls out of the list
- `spotlight` to attempt to restore focus through ancestor containers when the pointer hides
- `ui/Scroller`, `ui/VirtualList.VirtualGridList`, and `ui/VirtualList.VirtualList` to handle mouse down events on scrollbars

## [3.0.0-beta.2] - 2019-07-23

### Added

- `moonstone/Panels.Header` prop `hideLine` to hide the bottom separator line
- `moonstone/Panels.Header` type "dense" for "AlwaysViewing" Panels types

### Fixed

- `moonstone/Dropdown` button to not animate
- `moonstone/FormCheckboxItem` so it doesn't change size between normal and large text mode
- `moonstone/Heading` to have a bit more space between the text and the line, when the line is present
- `moonstone/LabeledItem` to pass `marqueeOn` prop to its contents
- `moonstone/Panels.Header` to use the latest designs with better spacing between the titles below
- `moonstone/Picker` accessibility read out when a button becomes disabled
- `moonstone/ProgressBar`, `moonstone/Slider`, and `moonstone/IncrementSlider` to use the latest set of design colors
- `moonstone/RadioItem` to have a much prettier dot in dark and light skins
- `moonstone/Spinner` to use the latest designs
- `moonstone/Tooltip` layer order so it doesn't interfere with other positioned elements, like `ContextualPopup`
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` to properly respond to 5way directional key presses
- `ui/ProgressBar` public class name `bar` to support customizing the background of the bar
- `webos/LS2Request` to return an error for a null response from a service

## [3.0.0-beta.1] - 2019-07-15

### Removed

- `core/kind` config property `contextTypes`
- `i18n/ilib` embedded copy of iLib in favour of the NPM package `ilib`
- `small` prop in `moonstone/Input`, `moonstone/ToggleButton`, `moonstone/Button`, `moonstone/Icon`, `moonstone/IconButton`, and `moonstone/LabeledIcon`, replaced by `size` prop, which accepts `"small"` or `"large"`
- `moonstone/Divider`, replaced by `moonstone/Heading`

### Added

- `ilib@^14.2.0` package as a peer dependency for `@enact/i18n` and `@enact/moonstone`, which apps will need to include
- `moonstone/Dropdown` widths `tiny`, and `huge`
- `ui/VirtualList.VirtualGridList` and `ui/VirtualList.VirtualList` support for resizing a window

### Fixed

- Moonstone Fonts to use the updated names of global fonts available in the system
- `core/platform` logic for webOS detection
- `moonstone/Popup` to properly handle closing in mid-transition
- `moonstone/Scroller` to properly move focus out of the container
- `moonstone/VirtualList` to allow keydown events to bubble up when not handled by the component
- `moonstone/IncrementSlider` to support aria-label when disabled
- `moonstone/LabeledItem` to not clip the bottom of descender glyphs in large text mode
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` to focus an item properly after an update
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` not to scroll too far by page up/down keys
- `spotlight/SpotlightContainerDecorator` to correctly forward `onFocusCapture` and `onBlurCapture` events
- `ui/Icon` to support arbitrary icon name strings, like in material icons

## [3.0.0-alpha.7] - 2019-06-24

### Changed

- `sampler` look and feel by updating to Storybook 5 and applying an Enact theme

### Fixed

- `moonstone/Dropdown` to scroll to and focus the selected item when opened
- `moonstone/ExpandableItem.ExpandableItemBase` to not error if `onClose` or `onOpen` was not supplied
- `moonstone/GridListImageItem` to support overriding the `image` CSS class name
- `moonstone/Scroller` to scroll and to move focus to the paging control properly if the current item sticking to the top is only spottable
- `moonstone/VirtualList` to scroll to the focused item when navigating out of the viewport via 5-way

## [3.0.0-alpha.6] - 2019-06-17

## Removed

- `i18n/Uppercase` HOC, replaced by `i18n/util` casing functions
- `moonstone/Divider`, `moonstone/Dialog`, and `moonstone/Heading` prop `casing`

### Fixed

- `moonstone/Dropdown` to support voice readout
- `moonstone/Dropdown` remaining open after it becomes `disabled`
- `ui/ViewManager` to correctly arrange views when initially rendering a non-zero index

## [3.0.0-alpha.5] - 2019-06-10

### Added

- `moonstone/Dropdown` property `width` to support `'small'`, `'medium'`, and `'large'` sizes
- `ui/Toggleable` HOC config prop `eventProps` to allow wrapped components to specify additional event information

## Fixed

- `Fonts` for non-Latin to not intermix font weights for bold when using a combination of Latin and non-Latin glyphs
- `moonstone/VirtualList` to restore focus to an item when scrollbars are visible
- `ui/ToggleItem` to send its `value` prop when toggled

## [3.0.0-alpha.4] - 2019-06-03

### Changed

- `moonstone/Dropdown` to prevent spotlight moving out of the popup
- `moonstone/Dropdown` to use radio selection which allows only changing the selection but not deselection

### Fixed

- Non-Latin locale font assignments to match the new font family support in `LG Smart UI`
- `moonstone/Checkbox`, `moonstone/FormCheckbox`, `moonstone/Panels.Header`, `moonstone/RadioItem`, `moonstone/Slider`, and `moonstone/Switch` to render correctly in high contrast
- `moonstone/VideoPlayer` to hide scrim for high contrast if bottom controls are hidden

## [3.0.0-alpha.3] - 2019-05-29

### Added

- `moonstone/Panels` support for managing share state of contained components
- `moonstone/Scroller` and `moonstone/VirtualList` support for restoring scroll position when within a `moonstone/Panels.Panel`
- `moonstone/Panels.Header` sample

### Changed

- `moonstone/Scroller` to scroll when no spottable child exists in the pressed 5-way key direction and, when `focusableScrollbar` is set, focus the scrollbar button
- `ui/ViewManager` to use Web Animations instead of animation callbacks to improve performance resulting in API changes to `Arranger` and the pre-configured arrangers `SlideArranger`, `SlideBottomArranger`, `SlideLeftArranger`, `SlideRightArranger`, and `SlideTopArranger`

### Fixed

- Fonts to correctly use the new font files and updated the international font name from "Moonstone LG Display" to "Moonstone Global"
- `moonstone/Dropdown` `children` propType so it supports the same format as `ui/Group` (an array of strings or an array of objects with props)
- `moonstone/FormCheckbox`, `moonstone/Input`, `moonstone/ProgressBar`, `moonstone/RadioItem`, `moonstone/SwitchItem`, and `moonstone/Tooltip` light skin colors.
- `moonstone/VideoPlayer` to have correct sized control buttons

## [3.0.0-alpha.2] - 2019-05-20

### Added

- `moonstone/Heading` prop `spacing` with default value `'small'`

### Fixed

- `moonstone/Button` background colors for translucent and lightTranslucent
- `moonstone/Checkbox` by updating colors for both dark and light skins
- `moonstone/DaySelector` item text size in large-text mode
- `moonstone/Dropdown` popup scroller arrows showing in non-latin locales and added large-text mode support
- `moonstone/FormCheckboxItem` to match the designs
- `moonstone/Panels.Header` with `Input` to not have a distracting white background color
- `moonstone/Input` caret color to match the designs (black bar on white background, white bar on black background, standard inversion)
- `moonstone/Item` height in non-latin locales
- `moonstone/RadioItem` and `moonstone/SelectableItem` icon size in large-text mode

## [3.0.0-alpha.1] - 2019-05-15

> NOTE:  Support for 2019 TV platform (Blink <68) has been dropped from this version of Enact

### Removed

- `moonstone/Button` and `moonstone/Panels.Header` prop `casing` which is no longer supported
- `moonstone/Input.InputBase` prop `focused` which was used to indicate when the internal input field had focused but was replaced by the `:focus-within` pseudo-selector
- `moonstone/VirtualList` and `moonstone/VirtualList.VirtualGridList` property `isItemDisabled`

### Added

- `core/util.clamp` to safely clamp a value between min and max bounds
- `moonstone/BodyText` prop `size` to offer a new "small" size
- `moonstone/Button` prop `iconPosition`
- `moonstone/ContextualPopup` config `noArrow`
- `moonstone/Dropdown` component
- `moonstone/Panels.Header` prop `centered` to support immersive apps with a completely centered design
- `moonstone/Heading` component, an improved version of `moonstone/Divider` with additional features
- `moonstone/Panels` slot `<controls>` to easily add custom controls next to the Panels' "close" button
- `moonstone/Spinner` prop `size` to support a new "small" size for use inside `SlotItem` components
- `moonstone/TooltipDecorator` prop `tooltipRelative` and `moonstone/TooltipDecorator.Tooltip` prop `relative` to support relative positioning. This is an advanced feature and requires a container with specific rules. See documentation for details.
- `ui/Button` public class `.hasIcon` which is present on the root node only when an icon has been provided
- `ui/Heading` component
- `ui/Measurable` HOC and Hook for quick and convenient measuring of simple components
- `ui/Scroller`, `ui/VirtualList.VirtualGridList`, and `ui/VirtualList.VirtualList` prop `noScrollByWheel` for preventing scroll by wheel

### Changed

- `moonstone/Button.ButtonDecorator` to remove `i18n/Uppercase` HOC
- `moonstone/Button`, `moonstone/Checkbox`, `moonstone/CheckboxItem`, `moonstone/ContextualPopupDecorator`, `moonstone/FormCheckbox`, `moonstone/FormCheckboxItem`, `moonstone/Panels.Header`, `moonstone/Notification`, `moonstone/RadioItem`, and `moonstone/Tooltip` appearance to match the latest designs
- `moonstone/Button`, `moonstone/Dropdown`, `moonstone/Icon`, `moonstone/IconButton`, `moonstone/Input`, and `moonstone/ToggleButton` default size to "small", which unifies their initial heights
- `moonstone/DaySelector` to have squared check boxes to match the rest of the checkmark components
- `moonstone/LabeledIcon` and `moonstone/LabeledIconButton` text size to be smaller
- `moonstone/Panel` and `moonstone/Panels` now allocate slightly more screen edge space for a cleaner look
- `moonstone/Scroller.Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` scrollbar button to gain focus when pressing a page up or down key if `focusableScrollbar` is true
- `spotlight/Spottable` to allow disabled items to be focused
- global styling rules affecting standard font-weight, disabled opacity, and LESS color variable definitions

### Fixed

- `ui/Measurable` to remeasure after a re-layout so the measurement value is always correct
- `ui/Scroller`, `ui/VirtualList.VirtualGridList`, and `ui/VirtualList.VirtualList` not to scroll by wheel at the same time when multiple lists/scrollers are nested

## [2.6.0] - ???

### Deprecated

- `moonstone/Divider` which will be replaced by `moonstone/Heading`
- `moonstone/Input.InputBase` prop `focused` which will be handled by CSS in 3.0
- `small` prop in `moonstone/Input` and `moonstone/ToggleButton`, which will be replaced by `size="small"` in 3.0
- `small` prop in `ui/Button.ButtonBase`, `ui/Icon.IconBase`, `ui/IconButton.IconButtonBase`, and `ui/LabeledIcon.LabeledIconBase`, which will be replaced by `size="small"` in 3.0

### Added

- `moonstone/Input` and `moonstone/ToggleButton` prop `size`
- `moonstone/Button`, `moonstone/IconButton`, and `moonstone/LabeledIconButton` public class name `large` to support customizing the style for the new `size` prop on `ui/Button`
- `ui/Button`, `ui/Icon`, `ui/IconButton`, and `ui/LabeledIcon` prop `size`
- `ui/ToggleItem` props  `itemIcon` and `itemIconPosition` to support additional icons on ToggleItem-derived components

### Fixed

- `moonstone/EditableIntegerPicker`, `moonstone/Picker`, and `moonstone/RangePicker` to not error when the `min` prop exceeds the `max` prop

## [2.5.3] - 2019-06-06

### Fixed

- `moonstone/ContextualPopupDecorator` imperative methods to be correctly bound to the instance
- `moonstone/ExpandableInput` to retain focus when touching within the input field on touch platforms
- `moonstone/ExpandableList` to not error if `selected` is passed as an array to a non-multi-select list
- `moonstone/Input` refocusing on touch on iOS
- `moonstone/Scroller` to allow changing spotlight focus to opposite scroll button when switching to 5way mode
- `moonstone/Scroller` and `moonstone/VirtualList` to animate with 5-way navigation by default
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to change spotlight focus due to touch events
- `moonstone/Slider` to not scroll the viewport when dragging on touch platforms
- `moonstone/VideoPlayer` to correctly handle touch events while moving slider knobs
- `spotlight` to unspot the current element when tapping on non-spottable target on touch platforms
- `ui/Scroller`, `ui/VirtualList`, and `ui/VirtualGridList` to size properly
- `ui/Scroller`, `ui/VirtualList`, and `ui/VirtualGridList` to scroll correctly on iOS and Safari
- `ui/Touchable` to not misfire a hold pulse when a drag re-enters a touch target and `cancelOnMove` is set
- `ui/ViewManager` to correctly handle transitioning quickly between two children

## [2.5.2] - 2019-04-23

### Fixed

- `moonstone/EditableIntegerPicker` text alignment when not editing the value
- `moonstone/Scroller` to scroll via dragging when the platform has touch support
- `moonstone/VideoPlayer` to continue to display the thumbnail image while the slider is focused
- `ui/Skinnable` to allow overriding default `skinVariant` values
- `ui/Touchable` to prevent events firing on different nodes for the same touch action
- `ui/Touchable` to neither force focus to components nor blur components after they are touched

## [2.5.1] - 2019-04-09

### Fixed

- `core/kind` to address warnings raised in React 16.8.6
- `moonstone/ExpandableInput` to close on touch platforms when tapping another component
- `ui/Touchable` to prevent doubled events in some situations on touch devices

## [2.5.0] - 2019-04-01

### Added

- `ui/Item`, `ui/Layout`, `ui/Repeater`, `ui/SlotItem`, `ui/Spinner`, `ui/ToggleItem`, and `ui/ViewManager` support for `ref` to gain access to the wrapped `component`

### Fixed

- `moonstone/ContextualPopupDecorator` method `positionContextualPopup()` to correctly reposition the popup when invoked from app code
- `moonstone/Tooltip` to better support long tooltips
- `moonstone/Popup` to resume spotlight pauses when closing with animation
- `moonstone/Panels` to correctly ignore `null` children
- `spotlight` to guard against runtime errors caused by attempting to access containers that do not exist
- `spotlight/Spottable` to prevent unnecessary updates due to focus and blur changes

## [2.4.1] - 2019-03-11

### Fixed

- `core/util.isRenderable` to treat values returned by `React.lazy()`, `React.memo()`, and `React.forwardRef()` as renderable
- `core/hoc` to support wrapping components returned by `React.lazy()`, `React.memo()`, and `React.forwardRef()`
- `i18n/I18nDecorator` to defer updating the locale until window is focused
- `moonstone/Checkbox`, `moonstone/FormCheckbox`, `moonstone/RadioItem`, `moonstone/SelectableIcon`, and `moonstone/Slider` spotlight muted colors
- `moonstone/Spinner` animation synchronization after a rerender
- `moonstone/TooltipDecorator` to position `Tooltip` correctly when the wrapped component moves or resizes
- `moonstone/VideoPlayer` to continue to show thumbnail when playback control keys are pressed
- `moonstone/VideoPlayer` to stop seeking by remote key when it loses focus
- `moonstone/VirtualList` to only resume spotlight pauses it initiated
- `spotlight` to remain in pointer mode when any 'cancel' key (e.g. Escape or back buttoon) is pressed
- `ui/VirtualList` `scrollTo` callback to scroll properly during prop change updates

## [2.4.0] - 2019-03-04

### Added

- `moonstone` `line-height` rule to base text CSS for both latin and non-latin locales
- `moonstone` support for high contrast colors in dark and light skin
- `moonstone/BodyText` prop `noWrap` which automatically adds `moonstone/Marquee` support as well as limits the content to only display one line of text
- `ui/BodyText` prop `component` to allow customization of the tag/component used to render its base element
- `ui/Repeater` prop `component` to allow customization of its base element
- `ui/Spinner` prop `paused` to halt the animation. Previously this was hard-coded "on", but now it can be toggled.

### Changed

- `moonstone/Spinner` visuals from 3 spinning balls to an energetic flexing line
- `ui/Changeable` and `ui/Toggleable` to warn when both `[defaultProp]` and `[prop]` are provided

### Fixed

- `moonstone/Panels` to set child's `autoFocus` prop to `default-element` when `index` increases
- `moonstone/Slider` to prevent gaining focus when clicked when disabled
- `moonstone/Slider` to prevent default browser scroll behavior when 5-way directional key is pressed on an active knob
- `moonstone/DatePicker` and `moonstone/TimePicker` to close with back/ESC
- `moonstone/DatePicker` and `moonstone/TimePicker` value handling when open on mount
- `moonstone/ContextualPopupDecorator` to correctly focus on popup content when opened
- `spotlight/Spottable` to prevent unnecessary updates due to focus changes

## [2.3.0] - 2019-02-11

### Deprecated

- `core/kind` config property `contextTypes`, to be removed in 3.0.

### Added

- `core/kind` config property `contextType` replacing legacy `contextTypes` property
- `i18n/I18nDecorator` HOC config prop `resources` to support retrieval of user-space i18n resource files on locale change
- `i18n/I18nDecorator` HOC config prop `sync` to support asynchronous retrieval of i18n resource files
- `i18n/I18nDecorator` HOC config props `latinLanguageOverrides` and `nonLatinLanguageOverrides` to allow consumers to configure some locales to be treated as Latin or non-Latin for the purposes of applying the `enact-locale-non-latin` global class name.
- `i18n/Text` component to provide asynchronous text translations
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` property `childProps` to support additional props included in the object passed to the `itemsRenderer` callback
- `moonstone/Skinnable` support for `skinVariants`, to enable features like high contrast mode and large text mode
- Support for 8k (UHD2) displays
- `spotlight/Spottable` property `selectionKeys`
- `ui/Skinnable` support for `skinVariants`; a way to augment a skin by adding variations of a skin to your visuals, like large text, high contrast, or grayscale
- `ui/Touchable` event `onHoldEnd` to notify when a hold has been released
- `ui/Touchable` prop `holdConfig.global` to allow a hold to continue when leaving or blurring the element

### Changed

- All content-containing LESS stylesheets (not within a `styles` directory) extensions to be `*.module.less` to retain modular context with CLI 2.x.

### Fixed

- `i18n` resource loader to use intelligent defaults when the path variables are not injected
- `moonstone/VirtualList` to focus an item properly by `scrollTo` API immediately after a prior call to the same position
- `moonstone/Popup` to close floating layer when the popup closes without animation
- `spotlight` to improve prioritization of the contents of spotlight containers within overflow containers
- `spotlight/Spottable` and `spotlight/SpotlightContainerDecorator` to prevent focus when `spotlightDisabled` is set
- `spotlight/Spottable` to prevent emitting multiple click events when certain node types are selected via 5-way enter
- `ui/Touchable` to continue drag events when blurring the element when `dragConfig.global` is set
- `ui/Marquee` to marquee when necessary after a locale change

## [2.2.9] - 2019-01-11

### Fixed

- `moonstone/Scroller` scrolling to boundary behavior for short scrollers

## [2.2.8] - 2018-12-06

### Fixed

- `moonstone/ExpandableInput` to focus labeled item on close
- `moonstone/ExpandableItem` to disable its spotlight container when the component is disabled
- `moonstone/Scroller` to correctly handle scrolling focused elements and containers into view
- `spotlight` to focus correctly within an overflow container in which the first element is another container without spottable children
- `ui/Marquee` to display an ellipsis when changing to text that no longer fits within its bounds
- `ui/VirtualList`, `ui/VirtualGridList`, and `ui/Scroller` to debounce `onScrollStop` events for non-animated scrolls

## [2.2.7] - 2018-11-21

### Fixed

- `moonstone/Picker`, `moonstone/ExpandablePicker`, `moonstone/ExpandableList`, `moonstone/IncrementSlider` to support disabling voice control
- `ui/Marquee` to avoid very small animations

## [2.2.6] - 2018-11-15

### Fixed

- `i18n/I18nDecorator` to allow changing the locale to a falsey value to use the device locale
- `moonstone/VideoPlayer` to blur slider when hiding media controls
- `moonstone/VideoPlayer` to disable pointer mode when hiding media controls via 5-way
- `moonstone/VirtualList` and `moonstone/Scroller` to not to animate with 5-way navigation by default
- `ui/Marquee` to handle contents which overflow their containers only slightly


## [2.2.5] - 2018-11-05

### Fixed

- `moonstone/ExpandableItem` to not steal focus after closing
- `ui/Transition` to better support layout after changing children

## [2.2.4] - 2018-10-29

### Fixed

- `moonstone/DayPicker` separator character used between selected days in the label in fa-IR locale
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` scrolling by voice commands in RTL locales

## [2.2.3] - 2018-10-22

### Fixed

- `moonstone/Scroller` to respect the disabled spotlight container status when handling pointer events
- `moonstone/Scroller` to scroll to the boundary when focusing the first or last element with a minimal margin in 5-way mode
- `moonstone/VideoPlayer` to position the slider knob correctly when beyond the left or right edge of the slider
- `spotlight` selection of elements clipped by an overflow container

## [2.2.2] - 2018-10-15

### Fixed

- `core/util.Job` to cancel existing scheduled `idle()` jobs before scheduling another
- `moonstone/Scroller` stuttering when page up/down key is pressed
- `ui/Scroller` slowed scrolling behavior when repeatedly requesting a scroll to the same position

## [2.2.1] - 2018-10-09

### Fixed

- `i18n/ilib/DurationFmt` to respect `sync` parameter when loading strings
- `i18n` resource loading failure due to resolving the path incorrectly
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to notify user when scrolling is not possible via voice command
- `moonstone/TimePicker` to not read out meridiem label when changing the value
- `spotlight` navigation into an overflow container which contains elements or containers larger than the container's bounds
- `ui/Marquee` to prevent restarting animation after blurring just before the previous animation completed

## [2.2.0] - 2018-10-02

### Added

- `moonstone/GridListImageItem` voice control feature support
- `ui/Marquee.MarqueeBase` prop `willAnimate` to improve app performance by deferring animation preparation styling such as composite layer promotion
- `ui/Skinnable` config option `prop` to configure the property in which to pass the current skin to the wrapped component
- `ui/Transition` prop `css` to support customizable styling

### Changed

- `spotlight` to not explicitly `blur()` the currently focused element when focusing another, allowing the platform to manage blurring before focus
- `ui/Cell` and `ui/Layout` to accept any type of children, since the `component` that may be set could accept any format of `children`

### Fixed

- `moonstone/DayPicker` to prevent closing when selecting days via voice control
- `moonstone/VideoPlayer` to unfocus media controls when hidden
- `moonstone/Scroller` to set correct scroll position when an expandable child is closed
- `moonstone/Scroller` to prevent focusing children while scrolling
- `spotlight` to correctly set focus when the window is activated
- `spotlight` to correctly set focus when entering a restricted container
- `ui/Touchable` to correctly handle a hold cancelled from an onHold handler

## [2.1.4] - 2018-09-17

### Fixed

- `moonstone/Button` and `moonstone/IconButton` to style image-based icons correctly when focused and disabled
- `moonstone/FormCheckboxItem` styling when focused and disabled
- `moonstone/Panels` to always blur breadcrumbs when transitioning to a new panel
- `moonstone/Scroller` to correctly set scroll position when nested item is focused
- `moonstone/Scroller` to not adjust `scrollTop` when nested item is focused
- `moonstone/VideoPlayer` to show correct playback rate feedback on play or pause
- `spotlight/Spottable` to respect paused state when it becomes enabled
- `ui/ViewManager` to emit `onWillTransition` when views are either added or removed

## [2.1.3] - 2018-09-10

### Fixed

- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to show overscroll effects properly on repeating wheel input
- `moonstone/TooltipDecorator` to handle runtime error when setting `tooltipText` to an empty string
- `moonstone/VideoPlayer` timing to read out `infoComponents` accessibility value when `moreButton` or `moreButtonColor` is pressed
- `ui/Marquee` to stop when blurred during restart timer

## [2.1.2] - 2018-09-04

### Fixed

- `moonstone/ExpandableItem` to prevent default browser scroll behavior when 5-way key is pressed on the first item or the last item
- `moonstone/Scroller` scrolling behavior for focused items in 5-way mode
- `moonstone/Scroller` to scroll container elements into view
- `moonstone/TooltipDecorator` to update position when `tooltipText` is changed
- `moonstone/VideoPlayer` to prevent default browser scroll behavior when navigating via 5-way
- `moonstone/VirtuaList` to allow `onKeyDown` events to bubble
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` scrolling via page up or down keys
- `spotlight` to prevent default browser scrolling behavior when focusing elements within a spotlight container configured with `overflow: true`
- `ui/GridListImageItem` to properly set `selected` style
- `ui/Marquee` positioning bug when used with CSS flexbox layouts

## [2.1.1] - 2018-08-27

### Changed

- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to show overscroll effects only by wheel input

### Fixed

- `moonstone/VideoPlayer` so that activity is detected and the `autoCloseTimeout` timer is reset when using 5-way to navigate from the media slider
- `spotlight` to correctly handle focus with `'self-only'` containers
- `spotlight/SpotlightContainerDecorator` to unmount config instead of remove when spotlightId is changed if it preserves id

## [2.1.0] - 2018-08-20

### Added

- `moonstone/VideoPlayer` property `noMediaSliderFeedback`
- `moonstone/VideoPlayer.MediaControls` property `playPauseButtonDisabled`

### Changed

- `i18n` to use the latest version of the `ilib`
- `moonstone/Picker` key down hold threshold to 800ms before firing the `onChange` event

### Fixed

- `moonstone/GridListImageItem` to properly vertically align when the content varies in size
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to not scroll by dragging
- `moonstone/Slider` to not emit `onChange` event when `value` has not changed
- `moonstone/VideoPlayer` to focus on available media buttons if the default spotlight component is disabled
- `moonstone/VideoPlayer` to keep media controls visible when interacting with popups
- `moonstone/VideoPlayer` to read out `infoComponents` accessibility value when `moreButtonColor` is pressed
- `moonstone/VideoPlayer` to round the time displayed down to the nearest second
- `moonstone/VirtualList` to restore last focused item correctly
- `ui/VirtualList` sampler to use `ui/Item` instead of `moonstone/Item`
- `ui/FloatingLayer` to apply `key`s to prevent React warnings

## [2.0.2] - 2018-08-13

### Fixed

- `moonstone/DatePicker` to correctly change year when `minYear` and `maxYear` aren't provided
- `moonstone/EditableIntegerPicker` management of spotlight pointer mode
- `moonstone/LabeledIcon` and `moonstone/LabeledIconButton` to have proper spacing and label-alignment with all label positions
- `moonstone/Popup` to prevent duplicate 5-way navigation when `spotlightRestrict="self-first"`
- `moonstone/Scroller` not to scroll to wrong position via 5way navigation in RTL languages
- `moonstone/Scroller` not to scroll when focusing in pointer mode
- `moonstone/Slider` to forward `onActivate` event
- `moonstone/VideoPlayer` to reset key down hold when media becomes unavailable
- `spotlight` to update pointer mode after hiding webOS VKB
- `ui/Image` to not display "missing image" icon when `src` fails to load
- `ui/Image` to not require `src` prop if `placeholder` is specified
- `ui/GridListImageItem` to not require `source` prop
- `ui/Scrollable` to use GPU acceleration to improve rendering performance
- `ui/Marquee` to move `position: relative` style into `animate` class to improve rendering performance

## [2.0.1] - 2018-08-01

### Fixed

- `moonstone/Dialog` read order of dialog contents
- `moonstone/Scroller` to go to next page properly via page up/down keys
- `spotlight` to not blur when pointer leaves floating webOS app while paused

## [2.0.0] - 2018-07-30

### Removed

- `ui/Skinnable.withSkinnableProps` higher-order component

### Added

- `moonstone/LabeledIcon` and `moonstone/LabeledIconButton` components for a lightweight `Icon` or `IconButton` with a label
- `moonstone/VideoPlayer` property `noAutoShowMediaControls`
- `ui/LabeledIcon` component for a lightweight `Icon` with a label

### Changed

- `spotlight` to default to 5-way mode on initialization

### Fixed

- `moonstone/Scroller` to prevent scrolling via page up/down keys if there is no spottable component in that direction
- `moonstone/Dialog` to hide `titleBelow` when `title` is not set
- `moonstone/Image` to suppress drag and drop support by default
- `moonstone/VideoPlayer` audio guidance behavior of More button
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` to handle focus properly via page up/down keys when switching to 5-way mode
- `moonstone/Popup` to spot the content after it's mounted
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to scroll properly via voice control in RTL locales
- `spotlight` to blur when pointer leaves floating webOS app
- `spotlight` to prevent changing the active container when the currently active container is restricted is "self-only"
- `ui/Scrollable` to ignore native drag events which interfered with touch drag support

## [2.0.0-rc.3] - 2018-07-23

### Fixed

- `i18n/ilib` to calculate time properly over DST boundary in fa-IR locale
- `moonstone/ContextualPopup` to refocus its activator on close when the popup lacks spottable children
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to scroll properly when holding down paging control buttons
- `moonstone/ExpandableItem` spotlight behavior when leaving the component via 5-way
- `moonstone/RadioItem` circle thickness to be 2px, matching the design
- `moonstone/Slider` to correctly prevent 5-way actions when activated
- `moonstone/ExpandableItem` and other expandable components to spotlight correctly when switching from pointer mode to 5-way with `closeOnSelect`
- `spotlight` to track pointer mode while paused

## [2.0.0-rc.2] - 2018-07-16

### Added

- `spotlight` debugging to visualize which components will be targeted as the next component for any 5-way direction

### Fixed

- `moonstone/Input` to not focus by *tab* key
- `moonstone/Picker` to properly set focus when navigating between buttons
- `moonstone/ProgressBar.ProgressBarTooltip` unknown props warning
- `moonstone/Scrollable` to disable spotlight container during flick events only when contents can scroll
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to scroll properly when `animate` is false via `scrollTo`
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` page controls to stop propagating an event when the event is handled
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to hide overscroll effect when focus is moved from a disabled paging control button to the opposite button
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to show overscroll effect when reaching the edge for the first time by wheel
- `moonstone/VideoPlayer` to display feedback tooltip when pointer leaves slider while playing
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to restore focus on items focused by pointer

## [2.0.0-rc.1] - 2018-07-09

### Removed

- `core/util.withContextFromProps` function
- `i18n/I18nDecorator.contextTypes`, replaced by `i18n/I18nDecorator.I18nContextDecorator`
- `moonstone/Button` built-in support for tooltips
- `ui/FloatingLayer.contextTypes` export
- `ui/Marquee.controlContextTypes` export
- `ui/Placeholder.contextTypes` export
- `ui/Resizable.contextTypes` export

### Added

- `i18n/I18nDecorator.I18nContextDecorator` HOC to support notification of locale changes
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` support `data-webos-voice-focused` and `data-webos-voice-group-label`

### Changed

- `moonstone/Spinner` to blur Spotlight when the spinner is active

### Fixed

- `i18n/Uppercase` to apply the designated `casing` prop format to each child instead of only the first child
- `moonstone/Scroller.Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to handle direction, page up, and page down keys properly on page controls them when `focusableScrollbar` is false
- `moonstone/Scroller.Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to handle a page up or down key in pointer mode
- `moonstone/VideoPlayer.MediaControls` to correctly handle more button color when the prop is not specified

## [2.0.0-beta.9] - 2018-07-02

### Added

- `moonstone/ContextualPopupDecorator` instance method `positionContextualPopup()`
- `moonstone/MoonstoneDecorator` config property `disableFullscreen` to prevent the decorator from filling the entire screen
- `moonstone/Scroller` prop `onUpdate`

### Fixed

- `moonstone/Scrollable` to update scroll properly on pointer click
- `moonstone/TooltipDecorator` to prevent unnecessary re-renders when losing focus
- `moonstone/TooltipDecorator` to not dismiss the tooltip on pointer click

## [2.0.0-beta.8] - 2018-06-25

### Added

- `moonstone/Scroller.Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` support for scrolling via voice control on webOS
- `moonstone/Scroller.Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` overscroll effect when the edges are reached

### Changed

- `moonstone/Divider` property `marqueeOn` default value to `render`
- `moonstone/Scroller.Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` scrollbar button to move a previous or next page when pressing a page up or down key instead of releasing it

### Fixed

- `moonstone/VideoPlayer` to prevent updating state when the source is changed to the preload source, but the current preload source is the same
- `moonstone/MediaOverlay` to marquee correctly
- `moonstone/MediaOverlay` to match UX guidelines
- `spotlight/Spottable` to retain focus for disabled component after updates
- `spotlight/Spottable` to emulate `onMouseUp` events that occur immediately after a non-enter key press
- `spotlight/Spottable` to prevent scroll on focus on webOS
- `ui/VirtualList` to allow scrolling on focus by default on webOS

## [2.0.0-beta.7] - 2018-06-11

### Removed

- `i18n/Uppercase` property `preserveCase`, replaced by `casing`
- `moonstone/Dialog` properties `preserveCase` and `showDivider`, replaced by `casing` and `noDivider` respectively
- `moonstone/Divider` property `preserveCase`, replaced by `casing`
- `moonstone/ExpandableInput` property `onInputChange`, replaced by `onChange`
- `moonstone/MoonstoneDecorator.TextSizeDecorator`, replaced by `moonstone/MoonstoneDecorator.AccessibilityDecorator`
- `moonstone/Panels.Header` property `preserveCase`, replaced by `casing`
- `moonstone/Panels.Panel` property `noAutoFocus`, replaced by `autoFocus`
- `moonstone/TooltipDecorator` property `tooltipPreserveCase`, replaced by `tooltipCasing`

### Added

- `ui/FloatingLayer.FloatingLayerBase` export

### Changed

- `moonstone/VideoPlayer` to allow spotlight focus to move left and right from `MediaControls`
- `moonstone/VideoPlayer` to disable bottom controls when loading until it's playable
- `ui/FloatingLayer` to call `onOpen` only after it is rendered

### Fixed

- `moonstone/EditableIntegerPicker` to disable itself when on a range consisting of a single static value
- `moonstone/Picker` to disable itself when containing fewer than two items
- `moonstone/Popup` to spot its content correctly when `open` by default
- `moonstone/RangePicker` to disable itself when on a range consisting of a single static value
- `moonstone/TooltipDecorator` to hide when `onDismiss` has been invoked
- `moonstone/VideoPlayer` to show media controls when pressing down in pointer mode
- `moonstone/VideoPlayer` to provide a more natural 5-way focus behavior
- `moonstone/VideoPlayer.MediaControls` to handle left and right key to jump when `moonstone/VideoPlayer` is focused
- `ui/MarqueeDecorator` to stop marqueeing when using hover and pointer hides

## [2.0.0-beta.6] - 2018-06-04

### Removed

- `moonstone/IncrementSlider` prop `children` which was no longer supported for setting the tooltip (since 2.0.0-beta.1)

### Fixed

- `moonstone/Scroller` to check focus possibilities first then go to fallback at the top of the container of focused item
- `moonstone/Scroller` to scroll by page when focus was at the edge of the viewport
- `moonstone/ToggleButton` padding and orientation for RTL
- `moonstone/VideoPlayer` to not hide title and info section when showing more components
- `moonstone/VideoPlayer` to select a position in slider to seek in 5-way mode
- `moonstone/VideoPlayer` to show thumbnail only when focused on slider
- `spotlight` to provide more natural 5-way behavior
- `spotlight` to handle pointer events only when pointer has moved
- `spotlight` to update the last focused container when unable to set focus within that container
- `spotlight/Spottable` to not trigger a scroll on focus on webOS
- `ui/FloatingLayer` to render correctly if already opened at mounting time
- `webos/speech` method `readAlert` to subscribe to changes in audio guidance to improve speech response time

## [2.0.0-beta.5] - 2018-05-29

### Removed

- `moonstone/Popup`, `moonstone/Dialog` and `moonstone/Notification` property `spotlightRestrict` option `'none'`
- `moonstone/VideoPlayer` prop `preloadSource`, to be replaced by `moonstone/VideoPlayer.Video` prop `preloadSource`
- `moonstone/Button` and `moonstone/IconButton` allowed value `'opaque'` from prop `backgroundOpacity` which was the default and therefore has the same effect as omitting the prop

### Added

- `moonstone/VideoPlayer` props `selection` and `onSeekOutsideRange` to support selecting a range and notification of interactions outside of that range
- `moonstone/VideoPlayer.Video` component to support preloading video sources
- `ui/FloatingLayerDecorator` imperative API to close all floating layers registered in the same id
- `ui/ProgressBar` and `ui/Slider` prop `progressAnchor` to configure from where in the progress bar or slider progress should begin
- `ui/Slider` prop `progressBarComponent` to support customization of progress bar within a slider
- `ui/ForwardRef` HOC to adapt `React.forwardRef` to HOC chains
- `ui/Media` component

### Changed

- `moonstone/VideoPlayer.videoComponent` prop to default to `ui/Media.Media` instead of `'video'`. As a result, to use a custom video element, one must pass an instance of `ui/Media` with its `mediaComponent` prop set to the desired element.

### Fixed

- `moonstone/ContextualPopupDecorator` to properly stop propagating keydown event if fired from the popup container
- `moonstone/Slider` to read when knob gains focus or for a change in value
- `moonstone/Scroller` to not cut off Expandables when scrollbar appears
- `moonstone/VideoPlayer` to correctly read out when play button is pressed
- `ui/MarqueeController` to update hovered state when pointer hides
- `ui/Touchable` to end gestures when focus is lost
- `ui/VirtualList.VirtualList` and `ui/VirtualList.VirtualGridList` to prevent items overlap with scroll buttons

## [2.0.0-beta.4] - 2018-05-21

### Added

- `core/handle.handle` utility `bindAs` to facilitate debugging and binding handlers to component instances
- `moonstone/Button` and `moonstone/IconButton` class name `small` to the list of allowed `css` overrides
- `moonstone/ProgressBar` prop `highlighted` for when the UX needs to call special attention to a progress bar

### Fixed

- `moonstone/ContextualPopupDecorator` to not set focus to activator when closing if focus was set elsewhere
- `moonstone/IconButton` to allow external customization of vertical alignment of its `Icon` by setting `line-height`
- `moonstone/Marquee.MarqueeController` to not cancel valid animations
- `moonstone/VideoPlayer` feedback and feedback icon to hide properly on play/pause/fast forward/rewind
- `moonstone/VideoPlayer` to correctly focus to default media controls component
- `moonstone/VideoPlayer` to show controls on mount and when playing next preload video
- `moonstone/VirtualList`, `moonstone/VirtualGridList`, `ui/VirtualList`, and `ui/VirtualGridList` samples to show items properly when `dataSize` is greater than 1000
- `spotlight/Spottable` to not make components spottable when `spotlightDisabled` is set
- `ui/Touchable` to guard against null events

## [2.0.0-beta.3] - 2018-05-14

### Added

- `moonstone/SelectableItem.SelectableItemDecorator`
- `ui/Touchable` support to fire `onTap` when a `click` event occurs

### Changed

- `moonstone/ToggleItem` to forward native events on `onFocus` and `onBlur`
- `moonstone/Input` and `moonstone/ExpandableInput` to support forwarding valid `<input>` props to the contained `<input>` node
- `moonstone/ToggleButton` to fire `onToggle` when toggled
- `ui/Touchable` custom events `onDown`, `onUp`, `onMove`, and `onTap` to use the event name as the `type` rather than the shorter name (e.g. `onTap` rather than `tap`)
- `ui/Toggleable` to forward events on `activate` and `deactivate` instead of firing toggled payload. Use `toggle` to handle toggled payload from the event.

### Fixed

- `moonstone/VirtualList.VirtualList`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/Scroller.Scroller` to ignore any user key events in pointer mode
- `moonstone/Image` so it automatically swaps the `src` to the appropriate resolution dynamically as the screen resizes
- `moonstone/Popup` to support all `spotlightRestrict` options
- `moonstone` component `disabled` colors to match the most recent design guidelines (from 30% to 60% opacity)
- `moonstone/ExpandableInput` spotlight behavior when leaving the component via 5-way
- `spotlight` to retry setting focus when the window is activated
- `spotlight` handling of 5-way events after the pointer hides


## [2.0.0-beta.2] - 2018-05-07

### Fixed

- `core/dispatcher.on` to not add duplicate event handlers
- `moonstone/IconButton` to allow theme-style customization, like it claimed was possible
- `moonstone/ExpandableItem` and related expandables to deal with disabled items and the `autoClose`, `lockBottom` and `noLockBottom` props
- `moonstone/Slider` not to fire `onChange` event when 5-ways out of boundary
- `moonstone/ToggleButton` layout for RTL locales
- `moonstone/Item`, `moonstone/SlotItem`, `moonstone/ToggleItem` to not apply duplicate `className` values
- `moonstone/VirtualList.VirtualList`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/Scroller.Scroller` scrollbar button's aria-label in RTL
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` to scroll properly with all disabled items
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` to not scroll on focus when jumping
- `spotlight/Spottable` to not add a focused state when a component had already been set as disabled
- `ui/Marquee` to always marquee when `marqueeOn` is set to `'render'`
- `ui/Item` to use its natural width rather than imposing a 100% width allowing inline Items to be the correct width
- `ui/Marquee.MarqueeDecorator` to correctly reset animation when `children` updates

## [2.0.0-beta.1] - 2018-04-29

### Removed

- `moonstone/IncrementSlider` and `moonstone/Slider` props `tooltipAsPercent`, `tooltipSide`, and `tooltipForceSide`, to be replaced by `moonstone/IncrementSlider.IncrementSliderTooltip` and `moonstone/Slider.SliderTooltip` props `percent`, and `side`
- `moonstone/IncrementSlider` props `detachedKnob`, `onDecrement`, `onIncrement`, and `scrubbing`
- `moonstone/ProgressBar` props `tooltipSide` and `tooltipForceSide`, to be replaced by `moonstone/ProgressBar.ProgressBarTooltip` prop `side`
- `moonstone/Slider` props `detachedKnob`, `onDecrement`, `onIncrement`, `scrubbing`, and `onKnobMove`
- `moonstone/VideoPlayer` property `tooltipHideDelay`
- `moonstone/VideoPlayer` props `backwardIcon`, `forwardIcon`, `initialJumpDelay`, `jumpBackwardIcon`, `jumpButtonsDisabled`, `jumpDelay`, `jumpForwadIcon`, `leftComponents`, `moreButtonCloseLabel`, `moreButtonColor`, `moreButtonDisabled`, `moreButtonLabel`, `no5WayJump`, `noJumpButtons`, `noRateButtons`, `pauseIcon`, `playIcon`, `rateButtonsDisabled`, and `rightComponents`, replaced by corresponding props on `moonstone/VideoPlayer.MediaControls`
- `moonstone/VideoPlayer` props `onBackwardButtonClick`, `onForwardButtonClick`, `onJumpBackwardButtonClick`, `onJumpForwardButtonClick`, and `onPlayButtonClick`, replaced by `onRewind`, `onFastForward`, `onJumpBackward`, `onJumpForward`, `onPause`, and `onPlay`, respectively
- `webos/VoiceReadout` module and replaced with `webos/speech.readAlert()`

### Added

- `core/snapshot` module with `isWindowReady` method to check the window state and `onWindowReady` method to queue window-dependent callbacks for snapshot builds
- `moonstone/DatePicker` props `dayAriaLabel`, `dayLabel`, `monthAriaLabel`, `monthLabel`, `yearAriaLabel` and `yearLabel` to configure the label set on date pickers
- `moonstone/DayPicker` and `moonstone/DaySelector` props `dayNameLength`, `everyDayText`, `everyWeekdayText`, and `everyWeekendText`
- `moonstone/ExpandablePicker` props `checkButtonAriaLabel`, `decrementAriaLabel`, `incrementAriaLabel`, and `pickerAriaLabel` to configure the label set on each button and picker
- `moonstone/MediaOverlay` component
- `moonstone/Picker` props `aria-label`, `decrementAriaLabel`, and `incrementAriaLabel` to configure the label set on each button
- `moonstone/Popup` property `closeButtonAriaLabel` to configure the label set on popup close button
- `moonstone/ProgressBar.ProgressBarTooltip` props `percent` to format the value as a percent and `visible` to control display of the tooltip
- `moonstone/TimePicker` props `hourAriaLabel`, `hourLabel`, `meridiemAriaLabel`, `meridiemLabel`, `minuteAriaLabel`, and `minuteLabel` to configure the label set on time pickers
- `moonstone/VideoPlayer.MediaControls` component to support additional customization of the playback controls
- `moonstone/VideoPlayer` props `mediaControlsComponent`, `onRewind`, `onFastForward`, `onJumpBackward`, `onJumpForward`, `onPause`, `onPlay`, and `preloadSource`
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` `role="list"`
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` prop `wrap` to support wrap-around spotlight navigation
- `moonstone/VirtualList`, `moonstone/VirtualGridList` and `moonstone/Scroller` props `scrollRightAriaLabel`, `scrollLeftAriaLabel`, `scrollDownAriaLabel`, and `scrollUpAriaLabel` to configure the aria-label set on scroll buttons in the scrollbars
- `webos/speech` module with `readAlert()` function and `VoiceControlDecorator` Higher-order Component

### Changed

- `moonstone/IncrementSlider` and `moonstone/Slider` prop `tooltip` to support either a boolean for the default tooltip or an element or component for a custom tooltip
- `moonstone/Input` to prevent pointer actions on other component when the input has focus
- `moonstone/ProgressBar.ProgressBarTooltip` prop `side` to support either locale-aware or locale-independent positioning
- `moonstone/ProgressBar.ProgressBarTooltip` prop `tooltip` to support custom tooltip components
- `moonstone/Scroller`, `moonstone/Picker`, and `moonstone/IncrementSlider` to retain focus on `moonstone/IconButton` when it becomes disabled
- `spotlight/Spottable` to retain focus on a component when it becomes disabled while focused
- `ui/Cancelable` callback `onCancel` to accept an event with a `stopPropagation` method to prevent upstream instances from handling the event instead of using the return value from the callback to prevent propagation. When a function is passed to `onCancel`, it will now receive an event and a props object instead of only the props object. When a string is passed to `onCancel`, it will now receive an event instead of no arguments. Also when a string is passed, the event will now propagate to upstream instances unless `stopPropagation` is called.
- `ui/Transition` property `duration` to now also support a numeric value representing milliseconds or a string representing any valid CSS duration value

### Fixed

- `core/util.memoize` to forward all args to memoized function
- `moonstone/ExpandableItem` and related expandable components to expand smoothly when used in a scroller
- `moonstone/GridListImageItem` to show proper `placeholder` and `selectionOverlay`
- `moonstone/MoonstoneDecorator` to optimize localized font loading performance
- `moonstone/Scroller` and `moonstone/VirtualList` navigation via 5-way from paging controls
- `moonstone/VideoPlayer` to render bottom controls at idle after mounting
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` to give initial focus
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` to have the default value for `dataSize`, `pageScroll`, and `spacing` props
- `ui/Layout.Cell` to no longer overflow when both `size` and `shrink` are set together
- `ui/Layout` to correctly support two `align` values, allowing horizontal and vertical in one property. Previously, the transverse alignment was ignored, only allowing perpendicular alignment.
- `ui/VirtualList.VirtualList` and `ui/VirtualList.VirtualGridList` showing blank when `direction` prop changed after scroll position changed
- `ui/VirtualList.VirtualList` and `ui/VirtualList.VirtualGridList` to support RTL by dynamic language changes

## [2.0.0-alpha.8] - 2018-04-17

### Added

- `core/handle.call` to invoke a named method on a bound handler
- `moonstone/Panels` property `closeButtonAriaLabel` to configure the label set on application close button
- `background` global knob to help visualize components over various background images
- `ui/Placeholder.PlaceholderControllerDecorator` config property `thresholdFactor`

### Changed

- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` to set its ARIA `role` to `"list"`
- `moonstone/VideoPlayer` property `title` to accept node type
- `ui/Transition` property `children` to not be required
- `ui/Transition` to fire `onShow` and `onHide` even when there are no `children`

### Fixed

- `moonstone/TimePicker` to show `meridiem` correctly in all locales
- `moonstone/Scrollable` scroll buttons to read out out audio guidance when button pressed down
- `moonstone/ExpandableItem` to show label properly when open and disabled
- `moonstone/Notification` to position properly in RTL locales
- `moonstone/VideoPlayer` to show controls when pressing 5-way select
- `ui/ViewManager` to not initially pass the wrong value for `enteringProp` when a view initiates a transition into the viewport

## [2.0.0-alpha.7] - 2018-04-03

### Removed

- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` property `data`
- `ui/VirtualList.VirtualList` and `ui/VirtualList.VirtualGridList` prop `data`

### Added

- `moonstone/VideoPlayer` property `noSpinner` to allow apps to show/hide spinner while loading video
- `webos/LS2Request` `send()` parameters `onTimeout` and `timeout`
- `webos/LS2Request` `send()` default `onFailure` and `onTimeout` handlers

### Changed

- `moonstone/VideoPlayer` to disable play/pause button when media controls are disabled
- `moonstone/VideoPlayer` property `moreButtonColor` to allow setting underline colors for more button
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` prop `isItemDisabled`, which accepts a function that checks if the item at the supplied index is disabled
- `moonstone/Panels.Header` support for `headerInput` so the Header can be used as an Input. See documentation for usage examples.
- `moonstone/ProgressBar` property `tooltipSide` to configure tooltip position relative to the progress bar
- `moonstone/ProgressBar` colors (affecting `moonstone/Slider` as well) for light and dark theme to match the latest designs and make them more visible when drawn over arbitrary background colors

### Fixed

- `moonstone/VideoPlayer` to correctly adjust spaces when the number of components changes in `leftComponents` and `rightComponents`
- `moonstone/VideoPlayer` to read out audio guidance every time `source` changes
- `moonstone/VideoPlayer` to display custom thumbnail node
- `moonstone/VideoPlayer` to hide more icon when right components are removed
- `moonstone/Picker` to correctly update pressed state when dragging off buttons
- `moonstone/Notification` to display when it's opened
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to show Spotlight properly while navigating with page up and down keys
- `moonstone/Input` to allow navigating via left or right to other components when the input is active and the selection is at start or end of the text, respectively
- `moonstone/Panels.ActivityPanels` to correctly lay out the existing panel after adding additional panels
- `spotlight` to partition and prioritize next spottable elements for more natural 5-way behavior
- `ui/Scroller` horizontal scrolling in RTL locales

## [2.0.0-alpha.6] - 2018-03-22

### Removed

- `core/factory` module, replaced by the `css` override feature
- `moonstone/Slider` exports `SliderFactory` and `SliderBaseFactory`
- `moonstone/IncrementSlider` exports `IncrementSliderFactory` and `IncrementSliderBaseFactory`
- `moonstone/ProgressBar`, `moonstone/Slider`, `moonstone/Slider.SliderTooltip`, `moonstone/IncrementSlider` components' `vertical` property and replaced it with `orientation`
- `spotlight/SpotlightContainerDecorator` prop `containerId`, to be replaced by `spotlightId`
- `ui/Transition` property `clipHeight`
- `ui/ProgressBar` property `vertical` and replaced it with `orientation`

### Added

- `moonstone/VideoPlayer` property `component` to handle custom video element
- `moonstone/IncrementSlider` properties `incrementAriaLabel` and `decrementAriaLabel` to configure the label set on each button
- `moonstone/Input` support for `small` prop
- `moonstone/ProgressBar` support for `tooltip` and `tooltipForceSide`
- `moonstone/ProgressBar`, `moonstone/Slider`, `moonstone/Slider.SliderTooltip`, `moonstone/IncrementSlider` property `orientation` to accept orientation strings like "vertical" and "horizontal" (replaced old `vertical` prop)
- `spotlight/Pause` module which acts as a semaphore for spotlight pause state
- `spotlight/Spottable` prop `spotlightId` to simplify focusing components
- `ui/Scrollable` support for scrolling by touch
- `ui/ProgressBar` property `orientation` to accept orientation strings like `"vertical"` and `"horizontal"`

### Changed

- `moonstone/Input` input `height`, `vertical-align`, and `margins`. Please verify your layouts to ensure everything lines up correctly; this change may require removal of old sizing and positioning CSS which is no longer necessary.
- `moonstone/FormCheckbox` to have a small border around the circle, according to new GUI designs
- `moonstone/RadioItem` dot size and added an inner-dot to selected-focused state, according to new GUI designs
- `moonstone/ContextualPopup` prop `popupContainerId` to `popupSpotlightId`
- `moonstone/Popup` prop `containerId` to `spotlightId`
- `moonstone/VideoPlayer` prop `containerId` to `spotlightId`
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` prop `component` to be replaced by `itemRenderer`
- `spotlight/Spotlight.focus` to support focusing by `spotlightId`
- `spotlight` container attributes `data-container-disabled` and `data-container-muted` to be `data-spotlight-container-disabled` and `data-spotlight-container-muted`, respectively
- `ui/VirtualList.VirtualList` and `ui/VirtualList.VirtualGridList` prop `component` to be replaced by `itemRenderer`

### Fixed

- `moonstone/ExpandableItem` to be more performant when animating
- `moonstone/GridListImageItem` to hide overlay checkmark icon on focus when unselected
- `moonstone/GridListImageItem` to use `ui/GridListImageItem`
- `moonstone/VirtualList`, `moonstone/VirtualGridList` and `moonstone/Scroller` components to use their base UI components
- `moonstone/VirtualList` to show the selected state on hovered paging controls properly
- `moonstone/Slider` to highlight knob when selected
- `moonstone/Slider` to handle updates to its `value` prop correctly
- `moonstone/ToggleItem` to accept HTML DOM node tag names as strings for its `component` property
- `moonstone/Popup` to properly pause and resume spotlight when animating
- `ui/Transition` animation for `clip` for `"up"`, `"left"`, and `"right"` directions. This includes a DOM addition to the Transition markup.
- `ui/ComponentOverride` and `ui/ToggleItem` to accept HTML DOM node tag names as strings for its `component` property

## [2.0.0-alpha.5] - 2018-03-07

### Removed

- `core/util.childrenEquals` which was no longer supported by React 16
- `moonstone/Marquee.MarqueeText`, replaced by `moonstone/Marquee.Marquee`
- `moonstone/VirtualGridList.GridListImageItem`, replaced by `moonstone/GridListImageItem`

### Added

- `core/util.memoize` method to optimize the execution of expensive functions
- `ui/Touchable` support for drag gesture
- `ui/Marquee` component

### Changed

- `moonstone/Marquee.Marquee` to be `moonstone/Marquee.MarqueeBase`
- `moonstone/ContextualPopupDecorator` to not restore last-focused child

### Fixed

- `moonstone/Slider` to correctly show localized percentage value in tooltip when `tooltipAsPercent` is true
- `moonstone/VirtualGridList` to show or hide its scrollbars properly
- `moonstone/Button` text to be properly centered
- `ui/ViewManager` to suppress `enteringProp` for views that are rendered at mount

## [2.0.0-alpha.4] - 2018-02-13

### Removed

- `moonstone/Button` and `moonstone/IconButton` prop `noAnimation`

### Added

- `ui/BodyText`, `ui/Image`, `ui/Item`, `ui/ProgressBar`, `ui/SlotItem`, `ui/Spinner`, `ui/ToggleIcon` components as unstyled base components to support UI libraries

### Changed

- `core/kind` to always return a component rather than either a component or an SFC depending upon the configuration
- `moonstone/Marquee` to do less-costly calculations during measurement and optimized the applied styles
- `moonstone/ExpandableList` to require a unique key for each object type data
- samples to be organized by library and removed background selector
- `ui/Repeater` and `ui/Group` to require a unique key for each object type data
- `ui/Toggleable` to use `'selected'` as its default `prop`, rather than `'active'`, since `'selected'` is by far the most common use case
- `ui/Touchable` to use global gesture configuration with instance override rather than component-level configuration via HOC configs with instance override

### Fixed

- `moonstone/VirtualList` to render properly with fiber reconciler
- `moonstone/VirtualList` focus option in scrollTo api
- `moonstone/ExpandableSpotlightDecorator` to not spot the title upon collapse when in `pointerMode`
- `moonstone/Spinner` to not unpause Spotlight unless it was the one to pause it
- `moonstone/Marquee` to stop when becoming disabled
- `spotlight/Spottable` to not remove `tabindex` from unspottable components to allow blur events to propagate as expected when a component becomes disabled

## [2.0.0-alpha.3] - 2018-01-18

### Added

- `ui/Button`, `ui/Icon`, and `ui/IconButton` components to support reuse by themes
- `ui/Touchable` support for flick gestures

### Fixed

- `moonstone/MoonstoneDecorator` root node to fill the entire space available, which simplifies positioning and sizing for child elements (previously always measured 0 in height)
- `moonstone/VirtualList` to prevent infinite function call when a size of contents is slightly longer than a client size without a scrollbar
- `moonstone/VirtualList` to sync scroll position when clientSize changed
- `ui/resolution` to measure the App's rendering area instead of the entire window, and now factors-in the height as well

### Removed

- `moonstone/Scroller` and `moonstone/VirtualList` option `indexToFocus` in `scrollTo` method which is deprecated from 1.2.0
- `moonstone/Scroller` props `horizontal` and `vertical` which are deprecated from 1.3.0 and replaced with `direction` prop

## [2.0.0-alpha.2] - 2017-08-29

## Added

- `ui/Scroller` and `ui/VirtualList`

## [2.0.0-alpha.1] - 2017-08-27

## Added

- `ui/Layout` which provides a technique for laying-out components on the screen using `Cells`, in rows or columns
- `ui/Touchable` to support consistent mouse and touch events along with hold gesture

### Changed

- `moonstone/Button`, `moonstone/Checkbox`, `moonstone/FormCheckbox`, `moonstone/IconButton`, `moonstone/IncrementSlider`, `moonstone/Item`, `moonstone/Picker`, and `moonstone/RangePicker`, `moonstone/Switch` and `moonstone/VideoPlayer` to use `ui/Touchable`

## Removed

- `ui/Holdable` and `ui/Pressable` which were replaced by `ui/Touchable`

## [1.15.0] - 2018-02-28

### Deprecated

- `core/util/childrenEquals`, to be removed in 2.0.0
- `moonstone/Marquee.Marquee`, to be moved to `moonstone/Marquee.MarqueeBase` in 2.0.0
- `moonstone/Marquee.MarqueeText`, to be moved to `moonstone/Marquee.Marquee` in 2.0.0

### Fixed

- `moonstone/GridListImageItem` to display correctly
- Internal method used by many components that sometimes prevented re-renders when they were needed

## [1.14.0] - 2018-02-23

### Deprecated

- `core/factory`, to be removed in 2.0.0
- `moonstone/VirtualFlexList`, to be replaced by `ui/VirtualFlexList` in 2.0.0
- `moonstone/VirtualGridList.GridListImageItem`, to be replaced by `moonstone/GridListImageItem` in 2.0.0
- `moonstone/Button` and `moonstone/IconButton` prop `noAnimation`, to be removed in 2.0.0
- `moonstone/Button.ButtonFactory`, `moonstone/Button.ButtonBaseFactory`, `moonstone/IconButton.IconButtonFactory`, `moonstone/IconButton.IconButtonBaseFactory`, `moonstone/IncrementSlider.IncrementSliderFactory`, `moonstone/IncrementSlider.IncrementSliderBaseFactory`, `moonstone/Slider.SliderFactory`, and `moonstone/Slider.SliderBaseFactory`, to be removed in 2.0.0
- `moonstone/Item.ItemOverlay`, to be replaced by `ui/SlotItem` in 2.0.0
- `moonstone/Item.Overlay` and `moonstone/Item.OverlayDecorator`, to be removed in 2.0.0
- `ui/Holdable` and `ui/Pressable`, to be replaced by `ui/Touchable` in 2.0.0

### Added

- `moonstone/DaySelector` component
- `moonstone/EditableIntegerPicker` component
- `moonstone/GridListImageItem` component

## [1.13.4] - 2018-07-30

### Fixed

- `moonstone/DatePicker` to calculate min and max year in the current calender

## [1.13.3] - 2018-01-16

### Fixed

- `core/kind` and `core/hoc` public documentation to be visible
- `moonstone/TimePicker` to not read out meridiem label when meridiem picker gets a focus
- `moonstone/Scroller` to correctly update scrollbars when the scroller's contents change
- Several samples that would not rescale correctly when the viewport was resized

## [1.13.2] - 2017-12-14

### Fixed

- `moonstone/Panels` to maintain spotlight focus when `noAnimation` is set
- `moonstone/Panels` to not accept back key presses during transition
- `moonstone/Panels` to revert 1.13.0 fix that blurred Spotlight when transitioning panels
- `moonstone/Scroller` and other scrolling components to not show scroll thumb when only child item is updated
- `moonstone/Scroller` and other scrolling components to not hide scroll thumb immediately after scroll position reaches the top or the bottom
- `moonstone/Scroller` and other scrolling components to show scroll thumb properly when scroll position reaches the top or the bottom by paging controls
- `spotlight` to guard against accessing unconfigured container configurations
- `ui/ViewManager` to revert 1.13.0 fix for lifecycle timing when entering a view

## [1.13.1] - 2017-12-06

### Fixed

- `moonstone/Slider` to not unnecessarily fire `onChange` if the initial value has not changed

## [1.13.0] - 2017-11-28

### Added

- `moonstone/VideoPlayer` props `disabled`, `loading`, `miniFeedbackHideDelay`, and `thumbnailComponent` as well as new APIs: `areControlsVisible`, `getVideoNode`, `showFeedback`, and `toggleControls`
- `ui/Transition` animation timing functions `ease-in`, `ease-out`, `ease-in-quart`, and `ease-out-quart` to provide prettier options for transitions that may be more suited to a specific visual style

### Fixed

- `moonstone/Expandable` and derivatives to use the new `ease-out-quart` animation timing function to better match the aesthetic of Enyo's Expandables
- `moonstone/LabeledItem` to start marquee when hovering while disabled
- `moonstone/Marquee.MarqueeController` to not abort marquee when moving among components
- `moonstone/Marquee` to correctly start when hovering on disabled spottable components
- `moonstone/Marquee` to restart animation on every resize update
- `moonstone/MarqueeDecorator` to stop when unhovering a disabled component using `marqueeOn` `'focus'`
- `moonstone/Panels` to prevent loss of spotlight issue when moving between panels
- `moonstone/Picker` marquee issues with disabled buttons or Picker
- `moonstone/Slider` by removing unnecessary repaints to the screen
- `moonstone/Slider` to fire `onChange` events when the knob is pressed near the boundaries
- `moonstone/Slider` to not forward `onChange` when `disabled` on `mouseUp/click`
- `moonstone/TooltipDecorator` to correctly display tooltip direction when locale changes
- `moonstone/VideoPlayer` to bring it in line with real-world use-cases
- `moonstone/VideoPlayer` to correctly position knob when interacting with media slider
- `moonstone/VideoPlayer` to defer rendering playback controls until needed
- `moonstone/VideoPlayer` to not read out the focused button when the media controls hide
- `moonstone/VirtualList` to handle focus properly via page up at the first page and via page down at the last page
- `moonstone/VirtualList` to render items from a correct index on edge cases at the top of a list
- `ui/ViewManager` to prevent interaction issue with `moonstone/Scroller`

## [1.12.2] - 2017-11-15

### Fixed

- `moonstone/VirtualList` to scroll and focus properly by pageUp and pageDown when disabled items are in it
- `moonstone/Button` to correctly specify minimum width when in large text mode
- `moonstone/Scroller.Scrollable` to restore last focused index when panel is changed
- `moonstone/VideoPlayer` to display time correctly in RTL locale
- `moonstone/VirtualList` to scroll correctly using page down key with disabled items
- `moonstone/Scrollable` to not cause a script error when scrollbar is not rendered
- `moonstone/Picker` incrementer and decrementer to not change size when focused
- `moonstone/Panels.Header` to use a slightly smaller font size for `title` in non-latin locales and a line-height for `titleBelow` and `subTitleBelow` that better meets the needs of tall-glyph languages like Tamil and Thai, as well as latin locales
- `moonstone/Scroller` and `moonstone/VirtualList` to keep spotlight when pressing a 5-way control while scrolling
- `moonstone/Panels` to prevent user interaction with panel contents during transition
- `moonstone/Slider` and related components to correctly position knob for `detachedKnob` on mouse down and fire value where mouse was positioned on mouse up
- `moonstone/DayPicker` to update day names when changing locale
- `moonstone/ExpandableItem` and all other `Expandable` components to revert 1.12.1 change to pull down from the top
- `spotlight` to handle non-5-way keys correctly to focus on next 5-way keys
- `spotlight/Spottable` to forward `onMouseEnter` and `onMouseLeave`
- `ui/Remeasurable` to update on every trigger change
- `ui/Transition` to revert 1.12.1 change to support `clip` transition-type directions and rendering optimizations

## [1.12.1] - 2017-11-07

### Fixed

- `moonstone/ExpandableItem` and all other `Expandable` components to now pull down from the top instead of being revealed from the bottom, matching Enyo's design
- `moonstone/VirtualListNative` to scroll properly with page up/down keys if there is a disabled item
- `moonstone/RangePicker` to display negative values correctly in RTL
- `moonstone/Scrollable` to not blur scroll buttons when wheeling
- `moonstone/Scrollbar` to hide scroll thumb immediately without delay after scroll position reaches min or max
- `moonstone/Divider` to pass `marqueeOn` prop
- `moonstone/Slider` to fire `onChange` on mouse up and key up
- `moonstone/VideoPlayer` to show knob when pressed
- `moonstone/Panels.Header` to layout `titleBelow` and `subTitleBelow` correctly
- `moonstone/Panels.Header` to use correct font-weight for `subTitleBelow`
- `ui/Transition` support for all `clip` transition-type directions and made rendering optimizations

## [1.12.0] - 2017-10-27

### Added

- `core/util.Job` APIs `idle`, `idleUntil`, `startRaf` and `startRafAfter`

### Fixed

- `moonstone/Input` to correctly hide VKB when dismissing
- `moonstone/Panels` to retain focus when back key is pressed on breadcrumb
- `moonstone/Popup` from `last-focused` to `default-element` in `SpotlightContainerDecorator` config
- `moonstone/Scrollable` to prevent focusing outside the viewport when pressing a 5-way key during wheeling
- `moonstone/Scroller` to called scrollToBoundary once when focus is moved using holding child item
- `moonstone/VideoPlayer` to apply skin correctly
- `spotlight` to focus enabled items that were hovered while disabled
- `spotlight` to not access non-existent container configurations
- `spotlight/Spottable` to not block next enter key when focus is moved while pressing enter

## [1.11.0] - 2017-10-24

### Added

- `moonstone/VideoPlayer` properties `seekDisabled` and `onSeekFailed` to disable seek function

### Changed

- `moonston/ExpandableList` to become `disabled` if there are no children
- `spotlight` to handle key events to preserve pointer mode for specific keys

### Fixed

- `moonstone/Scroller` to apply scroll position on vertical or horizontal Scroller when child gets a focus
- `moonstone/Scroller.Scrollable` to scroll withtout animation when panel is changed
- `moonstone/ContextualPopup` padding to not overlap close button
- `moonstone/Scroller.Scrollable` and `moonstone/Scroller` to change focus via page up/down only when the scrollbar is visible
- `moonstone/Picker` to only increment one value on hold
- `moonstone/ItemOverlay` to remeasure when focused
- `spotlight` to not require multiple 5-way key presses in order to change focus after the window regains focus

## [1.10.1] - 2017-10-16

### Fixed

- `moonstone/Scrollable` and `moonstone/Scroller` to scroll via page up/down when focus is inside a Spotlight container
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to scroll by 5-way keys right after wheeling
- `moonstone/VirtualList` not to move focus when a current item and the last item are located at the same line and pressing a page down key
- `moonstone/Panels.Header` to layout header row correctly in `standard` type
- `moonstone/Input` to not dismiss on-screen keyboard when dragging cursor out of input box
- `moonstone/Panels.Header` RTL `line-height` issue
- `moonstone/Panels` to render children on idle
- `moonstone/Scroller.Scrollable` to limit its muted spotlight container scrim to its bounds
- `moonstone/Input` to always forward `onKeyUp` event
- `spotlight.Spotlight` method `focus()` to prevent focusing components within containers that are being removed
- `ui/Pressable` to properly set pressed state to false on blur and release

## [1.10.0] - 2017-10-09

### Added

- `moonstone/VideoPlayer` support for designating components with `.spottable-default` as the default focus target when pressing 5-way down from the slider
- `moonstone/Slider` property `activateOnFocus` which when enabled, allows 5-way directional key interaction with the `Slider` value without pressing [Enter] first
- `moonstone/VideoPlayer` property `noMiniFeedback` to support controlling the visibility of mini feedback

### Changed

- `moonstone/Popup` to focus on mount if it’s initially opened and non-animating and to always pass an object to `onHide` and `onShow`
- `moonstone/VideoPlayer` to emit `onScrub` event and provide audio guidance when setting focus to slider

### Fixed

- `moonstone/ExpandableItem` and derivatives to restore focus to the Item if the contents were last focused when closed
- `moonstone/Slider` toggling activated state when holding enter/select key
- `moonstone/TimePicker` picker icons shifting slightly when focusing an adjacent picker
- `moonstone/Icon` so it handles color the same way generic text does, by inheriting from the parent's color. This applies to all instances of `Icon`, `IconButton`, and `Icon` inside `Button`.
- `moonstone/VideoPlayer` to correctly position knob on mouse click
- `moonstone/Panels.Header` to show an ellipsis for long titles with RTL text
- `moonstone/Marquee` to restart when invalidated by a prop change and managed by a `moonstone/Marquee.MarqueeController`

## [1.9.3] - 2017-10-03

### Changed

- `Moonstone Icons` font file to include the latest designs for several icons
- `moonstone/Panels/ApplicationCloseButton` to expose its `backgroundOpacity` prop
- `sampler` `Icon` and `IconButton` samples to include updated images assets

### Fixed

- `moonstone/Button` and `moonstone/IconButton` to be properly visually muted when in a muted container
- `moonstone/Icon` not to read out image characters
- `moonstone/Icon` to correctly display focused state when using external image
- `moonstone/Picker` to increment and decrement normally at the edges of joined picker
- `moonstone/Scrollable` not to accumulate paging scroll by pressing page up/down in scrollbar
- `moonstone/VirtualList` to apply "position: absolute" inline style to items
- `ui/Transition` to recalculate height when a resize occurs

## [1.9.2] - 2017-09-26

### Fixed

- `moonstone/ExpandableList` preventing updates when its children had changed

## [1.9.1] - 2017-09-25

### Fixed

- `moonstone/ExpandableList` run-time error when using an array of objects as children
- `moonstone/VideoPlayer` blocking pointer events when the controls were hidden

## [1.9.0] - 2017-09-22

### Added

- `moonstone/styles/mixins.less` mixins: `.moon-spotlight-margin()` and `.moon-spotlight-padding()`
- `moonstone/Button` property `noAnimation` to support non-animating pressed visual
- `sampler` locale Vietnamese to the locale list knob
- `ui/styles/mixins.less` mixins: `.remove-margin-on-edge-children()` and `.remove-padding-on-edge-children()` to better handle edge margins on container components

### Changed

- `i18n` to classify Vietnamese as a non-latin language
- `moonstone/TimePicker` to use "AM/PM" instead of "meridiem" for label under meridiem picker
- `moonstone/IconButton` default style to not animate on press. NOTE: This behavior will change back to its previous setting in release 2.0.0.
- `moonstone/Popup` to warn when using `scrimType` `'none'` and `spotlightRestrict` `'self-only'`
- `moonstone/Scroller` to block spotlight during scroll
- `moonstone/ExpandableItem` and derivatives to always pause spotlight before animation
- `spotlight` to block handling repeated key down events that were interrupted by a pointer event
- `ui/Holdable` to cancel key hold events when the pointer moves
- `ui/Holdable` and `ui/Changeable` back to Components and moved performance improvements elsewhere

### Fixed

- `moonstone/Input` height for non-latin locales
- `moonstone/VirtualGridList` to not move focus to wrong column when scrolled from the bottom by holding the "up" key
- `moonstone/VirtualList` to focus an item properly when moving to a next or previous page
- `moonstone/Scrollable` to move focus toward first or last child when page up or down key is pressed if the number of children is small
- `moonstone/VirtualList` to scroll to preserved index when it exists within dataSize for preserving focus
- `moonstone/Picker` buttons to not change size
- `moonstone/Panel` to move key navigation to application close button on holding the "up" key.
- `moonstone/Picker` to show numbers when changing values rapidly
- `moonstone/Popup` layout in large text mode to show close button correctly
- `moonstone/Picker` from moving scroller when pressing 5-way keys in `joined` Picker
- `moonstone/Input` so it displays all locales the same way, without cutting off the edges of characters
- `moonstone/TooltipDecorator` to hide tooltip when 5-way keys are pressed for disabled components
- `moonstone/Picker` to not tremble in width when changing values while using a numeric width prop value
- `moonstone/Picker` to not overlap values when changing values in `vertical`
- `moonstone/ContextualPopup` pointer mode focus behavior for `spotlightRestrict='self-only'`
- `moonstone/VideoPlayer` to prevent interacting with more components in pointer mode when hidden
- `moonstone/Scroller` to not repaint its entire contents whenever partial content is updated
- `moonstone/Slider` knob positioning after its container is resized
- `moonstone/VideoPlayer` to maintain focus when media controls are hidden
- `moonstone/Scroller` to scroll expandable components into view when opening when pointer has moved elsewhere
- `spotlight` to not try to focus something when the window is activated unless the window has been previously blurred
- `spotlight` to prevent containers that have been unmounted from being considered potential targets
- `ui/FloatingLayer` to not asynchronously attach a click handler when the floating layer is removed
- `ui/ViewManager` to correctly position items when changing mid-transition

## [1.8.0] - 2017-09-07

### Deprecated

- `moonstone/Dialog` property `showDivider`, will be replaced by `noDivider` property in 2.0.0

### Added

- `moonstone/Popup` callback property `onShow` which fires after popup appears for both animating and non-animating popups

### Changed

- `i18n` package to use latest iLib
- `moonstone/Popup` callback property `onHide` to run on both animating and non-animating popups
- `moonstone/VideoPlayer` state `playbackRate` to media events
- `moonstone/VideoPlayer` support for `spotlightDisabled`
- `moonstone/VideoPlayer` thumbnail positioning and style
- `moonstone/VirtualList` to render when dataSize increased or decreased
- `moonstone/Dialog` style
- `moonstone/Popup`, `moonstone/Dialog`, and `moonstone/Notification` to support `node` type for children
- `moonstone/Scroller` to forward `onKeyDown` events
- `ui/Holdable` and `ui/Changeable` to be PureComponents to reduce the number of updates

### Fixed

- `moonstone/Scrollable` to enable focus when wheel scroll is stopped
- `moonstone/VirtualList` to show scroll thumb when a preserved item is focused in a Panel
- `moonstone/Scroller` to navigate properly with 5-way when expandable child is opened
- `moonstone/VirtualList` to stop scrolling when focus is moved on an item from paging controls or outside
- `moonstone/VirtualList` to move out with 5-way navigation when the first or last item is disabled
- `moonstone/IconButton` Tooltip position when disabled
- `moonstone/VideoPlayer` Tooltip time after unhovering
- `moonstone/VirtualList` to not show invisible items
- `moonstone/IconButton` Tooltip position when disabled
- `moonstone/VideoPlayer` to display feedback tooltip correctly when navigating in 5-way
- `moonstone/MarqueeDecorator` to work with synchronized `marqueeOn` `'render'` and hovering as well as `marqueOn` `'hover'` when moving rapidly among synchronized marquees
- `moonstone/Input` aria-label for translation
- `moonstone/Marquee` to recalculate inside `moonstone/Scroller` and `moonstone/SelectableItem` by bypassing `shouldComponentUpdate`
- `spotlight/Spottable` to clean up internal spotted state when blurred within `onSpotlightDisappear` handler

## [1.7.0] - 2017-08-23

### Deprecated

- `moonstone/TextSizeDecorator` and it will be replaced by `moonstone/AccessibilityDecorator`
- `moonstone/MarqueeDecorator` property `marqueeCentered` and `moonstone/Marquee` property `centered` will be replaced by `alignment` property in 2.0.0

### Added

- `moonstone/TooltipDecorator` config property to direct tooltip into a property instead of adding to `children`
- `moonstone/VideoPlayer` prop `thumbnailUnavailable` to fade thumbnail
- `moonstone/AccessibilityDecorator` with `highContrast` and `textSize`
- `moonstone/VideoPlayer` high contrast scrim
- `moonstone/MarqueeDecorator`and `moonstone/Marquee` property `alignment` to allow setting  alignment of marquee content
- `spotlight/SpotlightContainerDecorator` config option `continue5WayHold` to support moving focus to the next spottable element on 5-way hold key.
- `spotlight/SpotlightContainerDecorator` config option `continue5WayHold` to support moving focus to the next spottable element on 5-way hold key
- `spotlight/Spottable` ability to restore focus when an initially disabled component becomes enabled

### Changed

- `moonstone/Scrollbar` to disable paging control down button properly at the bottom when a scroller size is a non-integer value
- `moonstone/VirtualList`, `moonstone/VirtualGridList`, and `moonstone/Scroller` to scroll on `keydown` event instead of `keyup` event of page up and page down keys
- `moonstone/VirtualGridList` to scroll by item via 5 way key
- `moonstone/VideoPlayer` to read target time when jump by left/right key
- `moonstone/IconButton` to not use `MarqueeDecorator` and `Uppercase`

### Fixed

- `moonstone/VirtualList` and `moonstone/VirtualGridList` to focus the correct item when page up and page down keys are pressed
- `moonstone/VirtualList` not to lose focus when moving out from the first item via 5way when it has disabled items
- `moonstone/VirtualList` to not lose focus when moving out from the first item via 5way when it has disabled items
- `moonstone/Slider` to align tooltip with detached knob
- `moonstone/FormCheckbox` to display correct colors in light skin
- `moonstone/Picker` and `moonstone/RangePicker` to forward `onKeyDown` events when not `joined`
- `moonstone/SelectableItem` to display correct icon width and alignment
- `moonstone/LabeledItem` to always match alignment with the locale
- `moonstone/Scroller` to properly 5-way navigate from scroll buttons
- `moonstone/ExpandableList` to display correct font weight and size for list items
- `moonstone/Divider` to not italicize in non-italic locales
- `moonstone/VideoPlayer` slider knob to follow progress after being selected when seeking
- `moonstone/LabeledItem` to correctly position its icon. This affects all of the `Expandables`, `moonstone/DatePicker` and `moonstone/TimePicker`.
- `moonstone/Panels.Header` and `moonstone/Item` to prevent them from allowing their contents to overflow unexpectedly
- `moonstone/Marquee` to recalculate when vertical scrollbar appears
- `moonstone/SelectableItem` to recalculate marquee when toggled
- `spotlight` to correctly restore focus to a spotlight container in another container
- `spotlight` to not try to focus something when the window is activated if focus is already set

### Removed

- `moonstone/Input` large-text mode

## [1.6.1] - 2017-08-07

### Changed

- `moonstone/Icon` and `moonstone/IconButton` to no longer fit image source to the icon's boundary

## [1.6.0] - 2017-08-04

### Added
- `moonstone/VideoPlayer` ability to seek when holding down the right and left keys. Sensitivity can be adjusted using throttling options `jumpDelay` and `initialJumpDelay`.
- `moonstone/VideoPlayer` property `no5WayJump` to disable jumping done by 5-way

- `moonstone/VideoPlayer` support for the "More" button to use tooltips
- `moonstone/VideoPlayer` properties `moreButtonLabel` and `moreButtonCloseLabel` to allow customization of the "More" button's tooltip and Aria labels
- `moonstone/VideoPlayer` property `moreButtonDisabled` to disable the "More" button
- `moonstone/Picker` and `moonstone/RangePicker` prop `aria-valuetext` to support reading custom text instead of value

- `moonstone/VideoPlayer` methods `showControls` and `hideControls` to allow external interaction with the player
- `moonstone/Scroller` support for Page Up/Page Down keys in pointer mode when no item has focus

### Changed

- `moonstone/VideoPlayer` to handle play, pause, stop, fast forward and rewind on remote controller
- `moonstone/Marquee` to also start when hovered if `marqueeOnRender` is set
- `spotlight` containers using a `restrict` value of `'self-only'` will ignore `leaveFor` directives when attempting to leave the container via 5-way

### Fixed

- `moonstone/IconButton` to fit image source within `IconButton`
- `moonstone` icon font sizes for wide icons
- `moonstone/ContextualPopupDecorator` to prefer setting focus to the appropriate popup instead of other underlying controls when using 5-way from the activating control
- `moonstone/Scroller` not scrolled via 5 way when `moonstone/ExpandableList` is opened
- `moonstone/VirtualList` no not let the focus move outside of container even if there are children left when navigating with 5way
- `moonstone/Scrollable` to update disability of paging controls when the scrollbar is set to `visible` and the content becomes shorter
- `moonstone/VideoPlayer` to focus on hover over play/pause button when video is loading
- `moonstone/VideoPlayer` to update and display proper time while moving knob when video is paused
- `moonstone/VideoPlayer` long title overlap issues
- `moonstone/Panels.Header` to apply `marqueeOn` prop to `subTitleBelow` and `titleBelow`
- `moonstone/Picker` wheeling in `moonstone/Scroller`
- `moonstone/IncrementSlider` and `moonstone/Picker` to read value changes when selecting buttons
- `spotlight` to not blur and re-focus an element that is already focused
- `ui/PlaceholderDecorator` to update bounds of `Scroller` when the `visible` state changed

## [1.5.0] - 2017-07-19

### Added

- `moonstone/Slider` and `moonstone/IncrementSlider` prop `aria-valuetext` to support reading custom text instead of value
- `moonstone/TooltipDecorator` property `tooltipProps` to attach props to tooltip component
- `moonstone/Scroller` and `moonstone/VirtualList` ability to scroll via page up and page down keys
- `moonstone/VideoPlayer` tooltip-thumbnail support with the `thumbnailSrc` prop and the `onScrub` callback to fire when the knob moves and a new thumbnail is needed
- `moonstone/VirtualList` ability to navigate via 5way when there are disabled items
- `moonstone/ContextualPopupDecorator` property `popupContainerId` to support configuration of the popup's spotlight container
- `moonstone/ContextualPopupDecorator` property `onOpen` to notify containers when the popup has been opened
- `moonstone/ContextualPopupDecorator` config option `openProp` to support mapping the value of `open` property to the chosen property of wrapped component

### Changed

- `moonstone/ExpandableList` to use 'radio' as the default, and adapt 'single' mode to render as a `moonstone/RadioItem` instead of a `moonstone/CheckboxItem`
- `moonstone/VideoPlayer` to not hide pause icon when it appears
- `moonstone/ContextualPopupDecorator` to set accessibility-related props onto the container node rather than the popup node
- `moonstone/ExpandableItem`, `moonstone/ExpandableList`, `moonstone/ExpandablePicker`, `moonstone/DatePicker`, and `moonstone/TimePicker` to pause spotlight when animating in 5-way mode
- `moonstone/Spinner` to position the text content under the spinner, rather than to the right side
- `moonstone/VideoPlayer` to include hour when announcing the time while scrubbing
- `spotlight` 5-way target selection to ignore empty containers
- `spotlight` containers to support an array of selectors for `defaultElement`

### Fixed

- `moonstone/Input` ellipsis to show if placeholder is changed dynamically and is too long
- `moonstone/Marquee` to re-evaluate RTL orientation when its content changes
- `moonstone/VirtualList` to restore focus on short lists
- `moonstone/ExpandableInput` to expand the width of its contained `moonstone/Input`
- `moonstone/Input` support for `dismissOnEnter`
- `moonstone/Input` focus management to prevent stealing focus when programmatically moved elsewhere
- `moonstone/Input` 5-way spot behavior
- `moonstone` international fonts to always be used, even when unsupported font-weights or font-styles are requested
- `moonstone/Panels.Panel` support for selecting components with `.spottable-default` as the default focus target
- `moonstone/Panels` layout in RTL locales
- `moonstone` spottable components to support `onSpotlightDown`, `onSpotlightLeft`, `onSpotlightRight`, and `onSpotlightUp` event property
- `moonstone/VirtualList` losing spotlight when the list is empty
- `moonstone/FormCheckbox` in focused state to have the correct "check" color
- `moonstone/Scrollable` bug in `navigableFilter` when passed a container id
- `ui/Cancelable` warning for string type cancel handler
- `webos/pmloglib` isomorphic compatibility with logging in non-browser environments

## [1.4.1] - 2017-07-05

### Changed

- `moonstone/Popup` to only call `onKeyDown` when there is a focused item in the `Popup`
- `moonstone/Scroller`, `moonstone/Picker`, and `moonstone/IncrementSlider` to automatically move focus when the currently focused `moonstone/IconButton` becomes disabled
- `spotlight/Spottable` to remove focus from a component when it becomes disabled and move it to another component if not explicitly moved during the `onSpotlightDisappear` event callback

### Fixed

- `moonstone/ContextualPopupDecorator` close button to account for large text size
- `moonstone/ContextualPopupDecorator` to not spot controls other than its activator when navigating out via 5-way
- `moonstone/Panels.Header` to set the value of `marqueeOn` for all types of headers

## [1.4.0] - 2017-06-29

### Deprecated

- `moonstone/Input` prop `noDecorator` is being replaced by `autoFocus` in 2.0.0

### Added

- `moonstone/styles/text.less` mixin `.locale-japanese-line-break()` to apply the correct  Japanese language line-break rules for the following multi-line components: `moonstone/BodyText`, `moonstone/Dialog`, `moonstone/Notification`, `moonstone/Popup`, and `moonstone/Tooltip`
- `moonstone/ContextualPopupDecorator` property `popupProps` to attach props to popup component
- `moonstone/VideoPlayer` property `pauseAtEnd` to control forward/backward seeking
- `spotlight` handlers for window focus events
- `moonstone/Panels/Header` prop `marqueeOn` to control marquee of header

### Changed

- `moonstone/Panels/Header` to expose its `marqueeOn` prop
- `moonstone/VideoPlayer` to automatically adjust the width of the allocated space for the side components so the media controls have more space to appear on smaller screens
- `moonstone/VideoPlayer` properties `autoCloseTimeout` and `titleHideDelay` default value to `5000`
- `moonstone/VirtualList` to support restoring focus to the last focused item
- `moonstone/Scrollable` to call `onScrollStop` before unmounting if a scroll is in progress
- `moonstone/Scroller` to reveal non-spottable content when navigating out of a scroller

### Fixed

- `moonstone/Dialog` to properly focus via pointer on child components
- `moonstone/VirtualList`, `moonstone/VirtualGridList`, and `moonstone/Scroller` not to be slower when scrolled to the first or the last position by wheeling
- `moonstone` component hold delay time
- `moonstone/VideoPlayer` to show its controls when pressing down the first time
- `moonstone/Panel` autoFocus logic to only focus on initial render
- `moonstone/Input` text colors
- `moonstone/ExpandableInput` to focus its decorator when leaving by 5-way left/right
- `spotlight` navigation through spottable components while holding down a directional key
- `spotlight` support for preventing 5-way navigation out of a container using an empty selector
- `spotlight` container support for default elements within subcontainers

## [1.3.1] - 2017-06-14

### Fixed

- `moonstone/Picker` support for large text
- `moonstone/Scroller` support for focusing paging controls with the pointer
- `moonstone` CSS rules for unskinned spottable components
- `spotlight` incorrectly focusing components within spotlight containers with `data-container-disabled` set to `false`
- `spotlight` failing to focus the default element configured for a container

## [1.3.0] - 2017-06-12

### Deprecated

- `moonstone/Scroller` props `horizontal` and `vertical`. Deprecated props are replaced with `direction` prop. `horizontal` and `vertical` will be removed in 2.0.0.
- `moonstone/Panel` prop `noAutoFocus` in favor of `autoFocus="none"`

### Added

- `core/platform` to support platform detection across multiple browsers
- `moonstone/Image` support for `children` prop inside images
- `moonstone/Scroller` prop `direction` which replaces `horizontal` and `vertical` props
- `moonstone/VideoPlayer` property `tooltipHideDelay` to hide tooltip with a given amount of time
- `moonstone/VideoPlayer` methods `fastForward`, `getMediaState`, `jump`, `pause`, `play`, `rewind`, and `seek` to allow external interaction with the player. See docs for example usage.
- `spotlight/styles/mixins.less` mixins which allow state-selector-rules (muted, spottable, focus, disabled) to be applied to the parent instead of the component's self. This provides much more flexibility without extra mixins to memorize.
- `ui/ViewManager` prop `childProps` to pass static props to each child

### Changed

- `moonstone/Skinnable` to support context and allow it to be added to any component to be individually skinned. This includes a further optimization in skinning which consolidates all color assignments into a single block, so non-color rules aren't unnecessarily duplicated.
- `moonstone/Skinnable` light and dark skin names ("moonstone-light" and "moonstone") to "light" and "dark", respectively
- `moonstone/VideoPlayer` to set play/pause icon to display "play" when rewinding or fast forwarding
- `moonstone/VideoPlayer` to rewind or fast forward when previous command is slow-forward or slow-rewind respectively
- `moonstone/VideoPlayer` to fast forward when previous command is slow-forward and it reaches the last of its play rate
- `moonstone/VideoPlayer` to not play video on reload when `noAutoPlay` is `true`
- `moonstone/VideoPlayer` property `feedbackHideDelay`'s default value to `3000`
- `moonstone/Notification` to break line in characters in ja and zh locale
- `moonstone/Notification` to align texts left in LTR locale and right in RTL locale
- `moonstone/VideoPlayer` to simulate rewind functionality on non-webOS platforms only
- `spotlight` submodules to significantly improve testability

### Fixed

- `moonstone/ExpandableItem` to correct the `titleIcon` when using `open` and `disabled`
- `moonstone/GridListImageItem` to center its selection icon on the image instead of the item
- `moonstone/Input` to have correct `Tooltip` position in `RTL`
- `moonstone/SwitchItem` to not unintentionally overflow `Scroller` containers, causing them to jump to the side when focusing
- `moonstone/VideoPlayer` to fast forward properly when video is at paused state
- `moonstone/VideoPlayer` to correctly change sources
- `moonstone/VideoPlayer` to show or hide feedback tooltip properly
- `moonstone/DateTimeDecorator` to work properly with `RadioControllerDecorator`
- `moonstone/Picker` in joined, large text mode so the arrows are properly aligned and sized
- `moonstone/Icon` to reflect the same proportion in relation to its size in large-text mode
- `spotlight` submodules to significantly improve testability
- `ui/ViewManager` to have a view count of 0 specifically for `noAnimation` cases. This helps things like `spotlight` restore `focus` properly.
- `ui/Cancelable` to run modal handlers on `window` object and correctly store handlers in LIFO order


## [1.2.2] - 2017-05-31

### Added

- Localization support to various `moonstone` components

## [1.2.1] - 2017-05-25

### Fixed

- `moonstone/MoonstoneDecorator` `fontGenerator` invalidly using `console`

## [1.2.0] - 2017-05-17

### Deprecated

- `moonstone/Scroller.Scrollable` option `indexToFocus` in `scrollTo` method to be removed in 2.0.0
- `spotlight/SpotlightRootDecorator.spotlightRootContainerName` to be removed in 2.0.0

### Added

- `core/handle.oneOf` to support branching event handlers
- `moonstone/Slider` and `moonstone/IncrementSlider` prop `noFill` to support a style without the fill
- `moonstone/Marquee` property `rtl` to set directionality to right-to-left
- `moonstone/VirtualList.GridListImageItem` property `selectionOverlay` to add custom component for selection overlay
- `moonstone/MoonstoneDecorator` property `skin` to let an app choose its skin: "moonstone" and "moonstone-light" are now available
- `moonstone/FormCheckboxItem`
- `moonstone/FormCheckbox`, a standalone checkbox, to support `moonstone/FormCheckboxItem`
- `moonstone/Input` props `invalid` and `invalidMessage` to display a tooltip when input value is invalid
- `moonstone/Scroller.Scrollable` option `focus` in `scrollTo()` method
- `moonstone/Scroller.Scrollable` property `spottableScrollbar`
- `moonstone/Icon.IconList` icons: `arrowshrinkleft` and `arrowshrinkright`
- `spotlight/styles/mixins.less` which includes several mixins (`.focus`, `.disabled`, `.muted`, and `.mutedFocus`) to make it a little easier to target specific spotlight states
- `ui/transition` callback prop `onShow` that fires when transitioning into view completes

### Changed

- `moonstone/Picker` arrow icon for `joined` picker: small when not spotted, hidden when it reaches the end of the picker
- `moonstone/Checkbox` and `moonstone/CheckboxItem` to reflect the latest design
- `moonstone/MoonstoneDecorator/fontGenerator` was refactored to use the browser's FontFace API to dynamically load locale fonts
- `moonstone/VideoPlayer` space allotment on both sides of the playback controls to support 4 buttons; consequently the "more" controls area has shrunk by the same amount
- `moonstone/VideoPlayer` to not disable media button (play/pause)
- `moonstone/Scroller.Scrollable` so that paging controls are not spottable by default with 5-way
- `moonstone/VideoPlayer`'s more/less button to use updated arrow icon
- `spotlight/SpotlightContainerDecorator` config property, `enterTo`, default value to be `null` rather than `'last-focused'`
- `spotlight` container handling to address known issues and improve testability
-`ui/View` to prevent re-renders on views leaving the `ViewManager`

### Fixed

- `moonstone/MarqueeDecorator` to properly stop marquee on items with `'marqueeOnHover'`
- `moonstone/ExpandableList` to work properly with object-based children
- `moonstone/styles/fonts.less` to restore the Moonstone Icon font to request the local system font by default. Remember to update your webOS build to get the latest version of the font so you don't see empty boxes for your icons.
- `moonstone/Picker` and `moonstone/RangePicker` to now use the correct size from Enyo (60px v.s. 84px) for icon buttons
- `moonstone/Scrollable` to apply ri.scale properly
- `moonstone/Panel` to not cover a `Panels`'s `ApplicationCloseButton` when not using a `Header`
- `moonstone/IncrementSlider` to show tooltip when buttons focused

## [1.1.0] - 2017-04-21

> Note: We have updated Enact to support React 15.5.  This version of React has deprecated accessing
> PropTypes from the `react` import.  Existing apps should update to import from the `prop-types` module.
> `enact-dev` has also been updated to the new release.

### Deprecated

- `moonstone/ExpandableInput` property `onInputChange`

### Added

- `core/util` documentation
- `i18n/Uppercase` prop `casing` to control how the component should be uppercased
- `i18n/util` methods `toCapitalized` and `toWordCase` to locale-aware uppercase strings
- `moonstone/Panels.Panel` prop and `moonstone/MoonstoneDecorator` config option: `noAutoFocus` to support prevention of setting automatic focus after render
- `moonstone/VideoPlayer` props: `backwardIcon`, `forwardIcon`, `jumpBackwardIcon`, `jumpForwardIcon`, `pauseIcon`, and `playIcon` to support icon customization of the player
- `moonstone/VideoPlayer` props `jumpButtonsDisabled` and `rateButtonsDisabled` for disabling the pairs of buttons when it's inappropriate for the playing media
- `moonstone/VideoPlayer` property `playbackRateHash` to support custom playback rates
- `moonstone/VideoPlayer` callback prop `onControlsAvailable` which fires when the players controls show or hide
- `moonstone/Image` support for `onLoad` and `onError` events
- `moonstone/VirtualList.GridListImageItem` prop `placeholder`
- `moonstone/Divider` property `preserveCase` to display text without capitalizing it
- `spotlight/SpotlightRootDecorator` config option: `noAutoFocus` to support prevention of setting automatic focus after render
- `spotlight/Spotlight` method `getSpottableDescendants()`

### Changed

- `moonstone/Slider` colors and sizing to match the latest designs
- `moonstone/ProgressBar` to position correctly with other components nearby
- `moonstone/Panels` breadcrumb to no longer have a horizontal line above it
- `moonstone/Transition` to measure itself when the CPU is idle
- style for disabled opacity from 0.4 to 0.3
- `moonstone/Button` colors for transparent and translucent background opacity when disabled
- `moonstone/ExpandableInput` property `onInputChange` to fire along with `onChange`. `onInputChange` is deprecated and will be removed in a future update.
- `Moonstone.ttf` font to include new icons
- `moonstone/Icon` to reference additional icons
- `spotlight/SpotlightContainerDecorator` to have no default for `spotlightRestrict`
- `ui/Slottable` to support slot-candidate tags that have multiple props, which are now forwarded directly instead of just their children

### Fixed

- `core/util.childrenEquals` to work with mixed components and text
- `moonstone/Popup` and `moonstone/ContextualPopupDecorator` 5-way navigation behavior
- `moonstone/Input` to not spot its own input decorator on 5-way out
- `moonstone/VideoPlayer` to no longer render its `children` in multiple places
- `moonstone/Button` text color when used on a neutral (light) background in some cases
- `moonstone/Popup` background opacity
- `moonstone/Marquee` to recalculate properly when its contents change
- `moonstone/TimePicker` to display time in correct order
- `moonstone/Scroller` to prefer spotlight navigation to its internal components
- `spotlight/Spotlight` to consider nested containers when adjusting focus
- `ui/Cancelable` to run modal handlers in the right order

## [1.0.0] - 2017-03-31

> NOTE: This version includes a breaking change to the way modules are organized. This change was necessary to prevent further API breakage following the 1.0.0 release and to facilitate changes we want to make in the future. We understand that this will require some work on the part of developers to update their code. Below you will find details about the changes:
>
> #### Moved/renamed modules:
> * `core/jobs` -> `core/util/Job`
> * `core/Accelerator` -> `spotlight/Accelerator`
> * `i18n.$L` -> `i18n/$L`
> * `i18n.toIString` -> `i18n/$L.toIString`
> * `spotlight.Spottable` -> `spotlight/Spottable`
> * `spotlight.spottableClass` -> `spotlight/Spottable.spottableClass`
> * `spotlight.SpotlightContainerDecorator` -> `spotlight/SpotlightContainerDecorator`
> * `spotlight.spotlightDefaultClass` -> `spotlight/SpotlightContainerDecorator.spotlightDefaultClass`
> * `spotlight.SpotlightRootDecorator` -> `spotlight/SpotlightRootDecorator`
>
> #### Removed modules:
> * `core/selection`
> * `core/fetch`
> * `ui/validators`
>
> #### Removed aliases:
> * `core.hoc` - Use `core/hoc`
> * `core.kind` - Use `core/kind`
>
> We have also modified most form components to be usable in a controlled (app manages component
> state) or uncontrolled (Enact manages component state) manner. To put a component into a
> controlled state, pass in `value` (or other appropriate state property such as `selected` or
> `open`) at component creation and then respond to events and update the value as needed. To put a
> component into an uncontrolled state, do not set `value` (or equivalent), at creation. From this
> point on, Enact will manage the state and events will be sent when the state is updated. To
> specify an initial value, use the `defaultValue` (or, `defaultSelected, `defaultOpen, etc.)
> property.  See the documentation for individual components for more information.
>
> Additionally, we no longer export a `version` with the root import. If you need a version number, import from `package.json` instead.

### Added

- `moonstone/Button` property `icon` to support a built-in icon next to the text content. The Icon supports everything that `moonstone/Icon` supports, as well as a custom icon.
- `moonstone/MoonstoneDecorator` property `textSize` to resize several components to requested CMR sizes. Simply add `textSize="large"` to your `App` and the new sizes will automatically take effect.
- `ui/Placeholder` module with `PlaceholderControllerDecorator` and `PlaceholderDecorator` HOCs which facilitate rendering placeholder components until the wrapped component would scroll into the viewport

### Changed

- `i18n` iLib dependency to 20151019-build-12.0-002-04
- `moonstone/Slider` to use the property `tooltip` instead of `noTooltip`, so the built-in tooltip is not enabled by default
- `moonstone/IncrementSlider` to include tooltip documentation
- `moonstone/ExpandableList` to accept an array of objects as children which are spread onto the generated components
- `moonstone/CheckboxItem` style to match the latest designs, with support for the `moonstone/Checkbox` to be on either the left or the right side by using the `iconPosition` property
- `moonstone/VideoPlayer` to supply every event callback-method with an object representing the VideoPlayer's current state, including: `currentTime`, `duration`, `paused`, `proportionLoaded`, and `proportionPlayed`
- `ui/Repeater` to accept an array of objects as children which are spread onto the generated components

### Fixed

- `moonstone/Panels.Panel` behavior for remembering focus on unmount and setting focus after render
- `moonstone/VirtualList.VirtualGridList` showing empty items when items are continuously added dynamically
- `moonstone/Picker` to marquee on focus once again
- `spotlight/Spotlight` `set()` to properly update the container config
- `spotlight/Spotlight` to properly save the last-focused element for nested containers

## [1.0.0-beta.4] - 2017-03-10

### Added

- `core/kind` support for `contextTypes`
- `core/utils` function `extractAriaProps()` for redirecting ARIA props when the root node of a component isn't focusable
- `moonstone/VirtualList` `indexToFocus` option to `scrollTo` method to focus on item with specified index
- `moonstone/IconButton` and `moonstone/Button` `color` property to add a remote control key color to the button
- `moonstone/Scrollbar` property `disabled` to disable both paging controls when it is true
- `moonstone/VirtualList` parameter `moreInfo` to pass `firstVisibleIndex` and `lastVisibleIndex` when scroll events are firing
- Accessibility support to UI components
- `moonstone/VideoPlayer` property `onUMSMediaInfo` to support the custom webOS “umsmediainfo” event
- `moonstone/Region` component which encourages wrapping components for improved accessibility rather than only preceding the components with a `moonstone/Divider`
- `moonstone/Slider` tooltip. It's enabled by default and comes with options like `noTooltip`, `tooltipAsPercent`, and `tooltipSide`. See the component docs for more details.
- `moonstone/Spinner` properties `blockClickOn` and `scrim` to block click events behind spinner
- `ui/A11yDecorator` to facilitate adding pre/post hints to components
- `ui/AnnounceDecorator` to facilitate announcing actions for accessibility
- `webos/pmloglib` logging method `perfLog` which calls `PmLogInfoWithClock`

### Changed

- `core/handle` to allow binding to components. This also introduces a breaking change in the return value of handle methods.
- `moonstone/VirtualGridImageItem` styles to reduce redundant style code app side
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to add essential CSS for list items automatically
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to not add `data-index` to their item DOM elements directly, but to pass `data-index` as the parameter of their `component` prop like the `key` parameter of their `component` prop
- `moonstone/ExpandableItem` and derivatives to defer focusing the contents until animation completes
- `moonstone/LabeledItem`, `moonstone/ExpandableItem`, `moonstone/ExpandableList` to each support the `node` type in their `label` property. Best used with `ui/Slottable`.
- `spotlight.Spottable` to prevent emulating mouse events for repeated key events

### Fixed

- `moonstone/VirtualList.GridListImageItem` to have proper padding size according to the existence of caption/subcaption
- `moonstone/Scrollable` to display scrollbars with proper size
- `moonstone/VirtualGridList` to not be truncated
- `webos/LS2Request` to return failure in isomorphic mode

## [1.0.0-beta.3] - 2017-02-21

> **NOTE** - The change to support caching of iLib locales requires an update to the `enact-dev` tool. This change is not backwards compatible with 1.0.0-beta.2.  Be sure to update both at the same time and reinstall/re-bootstrap the modules.

### Added

- `ui/Resizable` Higher-order Component to facilitate notification of resized components
- `core/handle` function `forEventProp` to test properties on an event
- localStorage caching support for ilib resource files
- Support for 5-way operation of `moonstone/Slider` and `moonstone/VideoPlayer.MediaSlider`
- `moonstone/Slider` now supports `children` which are added to the `Slider`'s knob, and follow it as it moves
- `moonstone/ExpandableInput` properties `iconAfter` and `iconBefore` to display icons after and before the input, respectively
- `moonstone/Dialog` property `preserveCase`, which affects `title` text

### Changed

- `moonstone/Marquee` to allow disabled marquees to animate
- `moonstone/Dialog` to marquee `title` and `titleBelow`
- `moonstone/Marquee.MarqueeController` config option `startOnFocus` to `marqueeOnFocus`. `startOnFocus` is deprecated and will be removed in a future update.
- `moonstone/Button`, `moonstone/IconButton`, `moonstone/Item` to not forward `onClick` when `disabled`

### Fixed

- `moonstone/Scroller` to recalculate when an expandable child opens
- `moonstone/Popup` and `moonstone/ContextualPopupDecorator` so that when the popup is closed, spotlight focus returns to the control that had focus prior to the popup opening
- `moonstone/Input` to not get focus when disabled
- `spotlight.Spotlight` behavior to follow container config rules when navigating between containers
- `spotlight.Spotlight` behavior to not set focus on spottable components animating past the pointer when not in pointer-mode
- `spotlight.Spotlight` 5-way behavior where selecting a spottable component may require multiple attempts before performing actions
- `spotlight.Spotlight` to not unfocus elements on scroll
- `spotlightDisabled` property support for spottable moonstone components

## [1.0.0-beta.2] - 2017-01-30

### Added

- Support for a new `handlers` block for components created with `core/kind` to allow cached event handlers
- `core/handle` handler `forKey`
- `core/keymap` module to abstract keyboard key codes behind common names (e.g. 'up' and 'down')
- `moonstone/Panels.Panel` property `showChildren` to support deferring rendering the panel body until animation completes
- `moonstone/MarqueeDecorator` property `invalidateProps` that specifies which props cause the marquee distance to be invalidated
- developer-mode warnings to several components to warn when values are out-of-range
- `moonstone/Divider` property `spacing` which adjusts the amount of empty space above and below the `Divider`. `'normal'`, `'small'`, `'medium'`, `'large'`, and `'none'` are available.
- `moonstone/Picker` when `joined` the ability to be incremented and decremented by arrow keys
- `onSpotlightDisappear` event property support for spottable moonstone components
- `spotlight.SpotlightContainerDecorator` support for `spotlightDisabled` prop
- `spotlight.Spottable` support for `onSpotlightDown`, `onSpotlightLeft`, `onSpotlightRight`, and `onSpotlightUp` properties
- `spotlight.Spotlight` method `getDirection` to replace `spotlightDirections`
- `ui/ViewManager` properties `enteringDelay` and `enteringProp` to aid deferred rendering of views
- `ui/resolution` function `scaleToRem` for those times when you have a size in pixels that you want to convert directly to `rem` to support automatic dynamic resizing

### Changed

- `moonstone/Panels.Panels` and variations to defer rendering the children of contained `Panel` instances until animation completes
- `moonstone/ProgressBar` properties `progress` and `backgroundProgress` to accept a number between 0 and 1
- `moonstone/Slider` and `moonstone/IncrementSlider` property `backgroundPercent` to `backgroundProgress` which now accepts a number between 0 and 1
- `moonstone/Slider` to not ignore `value` prop when it is the same as the previous value
- `moonstone/Picker` component's buttons to reverse their operation such that 'up' selects the previous item and 'down' the next
- `moonstone/Picker` and derivatives may now use numeric width, which represents the amount of characters to use for sizing. `width={4}` represents four characters, `2` for two characters, etc. `width` still accepts the size-name strings.
- `moonstone/Divider` to now behave as a simple horizontal line when no text content is provided
- `moonstone/Scrollable` to not display scrollbar controls by default
- `moonstone/DatePicker` and `moonstone/TimePicker` to emit `onChange` event whenever the value is changed, not just when the component is closed

### Removed

- `core/handle.withArgs` helper function which is no longer needed with the addition of the `handlers` support in `kind()`
- `moonstone/ProgressBar` properties `min` and `max`
- `spotlight` `spotlightDirections`

### Fixed

- `moonstone/IncrementSlider` so that the knob is spottable via pointer, and 5-way navigation between the knob and the increment/decrement buttons is functional
- `moonstone/Slider` and `moonstone/IncrementSlider` to not fire `onChange` for value changes from props

## [1.0.0-beta.1] - 2016-12-30

### Added

- `core/factory` which provides the means to support design-time customization of components
- `Moonstone/VideoPlayer` and `moonstone/TooltipDecorator` components
- `moonstone/Panels.Panels` property `onBack` to support `ui/Cancelable`
- `moonstone/VirtualFlexList` Work-In-Progress component (with sample) to support variably sized rows or columns
- `moonstone/ExpandableItem` properties `autoClose` and `lockBottom`
- `moonstone/ExpandableList` properties `noAutoClose` and `noLockBottom`
- `moonstone/ContextualPopup` property `noAutoDismiss`
- `moonstone/Dialog` property `scrimType`
- `moonstone/Popup` property `spotlightRestrict`
- `spotlight.Spotlight` methods `isPaused()`, `isSpottable()`, `getCurrent()`, and `isMuted()`
- `spotlight.SpotlightContainerDecorator` property `spotlightMuted`
- `spotlight.spotlightDirections` export
- `ui/RadioDecorator` and `ui/RadioControllerDecorator` to support radio group-style management of components
- `ui/Holdable` Higher-order Component
- `ui/ViewManager` events `onAppear`, `onEnter`, `onLeave`, `onStay`, `onTransition`, and `onWillTransition`
- `ui/FloatingLayer` `scrimType` prop value `none`
- `ui/Pressable` config option `onMouseLeave`

### Changed

- `moonstone/Panels.Routable` to require a `navigate` configuration property indicating the event callback for back or cancel actions
- `moonstone/MarqueeController` focus/blur handling to start and stop synchronized `moonstone/Marquee` components
- `moonstone/ExpandableList` property `autoClose` to `closeOnSelect` to disambiguate it from the added `autoClose` on 5-way up
- `moonstone/ContextualPopupDecorator.ContextualPopupDecorator` component's `onCloseButtonClick` property to `onClose`
- `moonstone/Spinner` component's `center` and `middle` properties to a single `centered` property
	that applies both horizontal and vertical centering
- `moonstone/Popup.PopupBase` component's `onCloseButtonClicked` property to `onCloseButtonClick`
- `moonstone/Item.ItemOverlay` component's `autoHide` property to remove the `'no'` option. The same
	effect can be achieved by omitting the property or passing `null`.
- `moonstone/VirtualGridList` to be scrolled by page when navigating with a 5-way direction key
- `moonstone/Scroller`, `moonstone/VirtualList`, `moonstone/VirtualGridList`, and `moonstone/Scrollable` to no longer respond to mouse down/move/up events
- all Expandables to include a state arrow UI element
- `moonstone/LabeledItem` to support a `titleIcon` property which positions just after the title text
- `moonstone/Button` to include `moonstone/TooltipDecorator`
- `moonstone/Expandable` to support being managed, radio group-style, by a component wrapped with `RadioControllerDecorator` from `ui/RadioDecorator`
- `moonstone/Picker` to animate `moonstone/Marquee` children when any part of the `moonstone/Picker` is focused
- `moonstone/VirtualList` to mute its container instead of disabling it during scroll events
- `moonstone/VirtualList`, `moonstone/VirtualGridList`, and `moonstone/Scroller` to continue scrolling when holding down the paging controls
- `moonstone/VirtualList` to require a `component` prop and not have a default value
- `moonstone/Picker` to continuously change when a button is held down by adding `ui/Holdable`.
- `ui/FloatingLayer` property `autoDismiss` to handle both ESC key and click events

### Removed

- `ui/Transition` prop `fit` in favor of using `className`

### Fixed

- `i18n/I18nDecorator` issue causing multiple requests for ilibmanifest.
- `moonstone/Popup` and `moonstone/ContextualPopup` 5-way navigation behavior using spotlight.
- Bug where a synchronized marquee whose content fit the available space would prevent restarting of the marquees
- `moonstone/Input` to show an ellipsis on the correct side based on the text directionality of the `value` or `placeholder` content.
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to prevent unwanted scrolling when focused with the pointer
- `moonstone/Picker` to remove fingernail when a the pointer is held down, but the pointer is moved off the `joined` picker.
- `moonstone/LabeledItem` to include marquee on both `title` and `label`, and be synchronized

## [1.0.0-alpha.5] - 2016-12-16

### Fixed

- `core/dispatcher` to support pre-rendering

## [1.0.0-alpha.4] - 2016-12-2

> NOTE: The framework was updated to support React 15.4

### Added

- `moonstone/Popup`, `moonstone/ContextualPopupDecorator`, `moonstone/Notification`, `moonstone/Dialog`, `moonstone/ExpandableInput`, `moonstone/Item.ItemOverlay`, `ui/FloatingLayer` and `ui/FloatingLayer.FloatingLayerDecorator` components
- `moonstone/Popup`, `moonstone/ContextualPopupDecorator`, `moonstone/Notification`, `moonstone/Dialog`, `moonstone/Item.ItemOverlay`, `moonstone/ExpandableInput` and `ui/Group` samples
- `marqueeCentered` prop to `moonstone/MarqueeDecorator` and `moonstone/MarqueeText`
- `placeholder` prop to `moonstone/Image`
- `moonstone/MarqueeController` component to synchronize multiple `moonstone/Marquee` components
- Non-latin locale support to all existing Moonstone components
- Language-specific font support
- `setPointerMode()` and `setActiveContainer()` methods to `@enact/spotlight` export
- `fit`, `noAnimation` props to `ui/TransitionBase`
- `onHide` prop to `ui/Transition`

### Changed

- `moonstone/Input` component's `iconStart` and `iconEnd` properties to be `iconBefore` and `iconAfter`, respectively, for consistency with `moonstone/Item.ItemOverlay` naming
- `moonstone/Icon` and `moonstone/IconButton` so the `children` property supports both font-based icons and images. This removes support for the `src` property.
- the `checked` property to `selected` for consistency across the whole framework. This allows better interoperability when switching between various components.  Affects the following: `CheckboxItem`, `RadioItem`, `SelectableItem`, `Switch`, `SwitchItem`, and `ToggleItem`. Additionally, these now use `moonstone/Item.ItemOverlay` to position and handle their Icons.
- documentation to support our doc generation tool
- `moonstone/Slider` and `moonstone/IncrementSlider` to be more performant. No changes were made to
	the public API.
- `moonstone/GridListImageItem` so that a placeholder image displays while loading the image, and the caption and subcaption support marqueeing
- `moonstone/MoonstoneDecorator` to add `FloatingLayerDecorator`

### Removed

- the `src` property from `moonstone/Icon` and `moonston/IconButton`. Use the support for URLs in
	the `children` property as noted above.

### Fixed

- Addressed many bugs and performance issues

## [1.0.0-alpha.3] - 2016-11-8

> Note: For those who are using `eslint-config-enact` for in-editor linting, there have been some important changes and reinstallation is necessary. Refer to [https://github.com/enactjs/eslint-config-enact/](https://github.com/enactjs/eslint-config-enact/) for install instructions or reinstall via:
>
> ```
> npm install -g eslint eslint-plugin-react eslint-plugin-babel babel-eslint enactjs/eslint-plugin-enact enactjs/eslint-config-enact
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
