# Change Log

The following is a curated list of changes in the Enact moonstone module, newest changes on the top.

## [unreleased]

### Fixed

- `moonstone/Header` with `Input` to not have a distracting white background color
- `moonstone/Input` caret color to match the designs (black bar on white background, white bar on black background, standard inversion)

## [3.0.0-alpha.1] - 2019-05-15

### Removed

- `moonstone/Button` and `moonstone/Panels.Header` prop `casing` which is no longer supported
- `moonstone/Input.InputBase` prop `focused` which was used to indicate when the internal input field had focused but was replaced by the `:focus-within` pseudo-selector
- `moonstone/VirtualList` and `moonstone/VirtualList.VirtualGridList` property `isItemDisabled`

### Added

- `moonstone/BodyText` prop `size` to offer a new "small" size
- `moonstone/Button` prop `iconPosition`
- `moonstone/ContextualPopup` config `noArrow`
- `moonstone/Dropdown` component
- `moonstone/Header` prop `centered` to support immersive apps with a completely centered design
- `moonstone/Heading` component, an improved version of `moonstone/Divider` with additional features
- `moonstone/Panels` slot `<controls>` to easily add custom controls next to the Panels' "close" button
- `moonstone/Spinner` prop `size` to support a new "small" size for use inside `SlotItem` components
- `moonstone/TooltipDecorator` prop `tooltipRelative` and `moonstone/TooltipDecorator.Tooltip` prop `relative` to support relative positioning. This is an advanced feature and requires a container with specific rules. See documentation for details.

### Changed

- `moonstone/Button.ButtonDecorator` to remove `i18n/Uppercase` HOC
- `moonstone/Button`, `moonstone/Checkbox`, `moonstone/CheckboxItem`, `moonstone/ContextualPopupDecorator`, `moonstone/FormCheckbox`, `moonstone/FormCheckboxItem`, `moonstone/Header`, `moonstone/Notification`, `moonstone/RadioItem`, and `moonstone/Tooltip` appearance to match the latest designs
- `moonstone/Button`, `moonstone/Dropdown`, `moonstone/Icon`, `moonstone/IconButton`, `moonstone/Input`, and `moonstone/ToggleButton` default size to "small", which unifies their initial heights
- `moonstone/DaySelector` to have squared check boxes to match the rest of the checkmark components
- `moonstone/LabeledIcon` and `moonstone/LabeledIconButton` text size to be smaller
- `moonstone/Panel` and `moonstone/Panels` now allocate slightly more screen edge space for a cleaner look
- `moonstone/Scroller.Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` scrollbar button to gain focus when pressing a page up or down key if `focusableScrollbar` is true
- global styling rules affecting standard font-weight, disabled opacity, and LESS color variable definitions

### Fixed

- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to scroll by page up/down keys without focus in pointer mode

## [2.6.0] - ???

### Deprecated

- `moonstone/Divider` which will be replaced by `moonstone/Heading`
- `moonstone/Input.InputBase` prop `focused` which will be handled by CSS in 3.0
- `small` prop in `moonstone/Input` and `moonstone/ToggleButton`, which will be replaced by `size="small"` in 3.0

### Added

- `moonstone/Input` and `moonstone/ToggleButton` prop `size`
- `moonstone/Button`, `moonstone/IconButton`, and `moonstone/LabeledIconButton` public class name `large` to support customizing the style for the new `size` prop on `ui/Button`

### Fixed

- `moonstone/ContextualPopupDecorator` imperative methods to be correctly bound to the instance
- `moonstone/EditableIntegerPicker`, `moonstone/Picker`, and `moonstone/RangePicker` to not error when the `min` prop exceeds the `max` prop
- `moonstone/Input` refocusing on touch on iOS
- `moonstone/VideoPlayer` to correctly handle touch events while moving slider knobs
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to change spotlight focus due to touch events
- `moonstone/Slider` to not scroll the viewport when dragging on touch platforms
- `moonstone/VirtualList` and `moonstone/Scroller` to animate with 5-way navigation by default

## [2.5.2] - 2019-04-23

### Fixed

- `moonstone/EditableIntegerPicker` text alignment when not editing the value
- `moonstone/Scroller` to scroll via dragging when the platform has touch support
- `moonstone/VideoPlayer` to continue to display the thumbnail image while the slider is focused

## [2.5.1] - 2019-04-09

### Fixed

- `moonstone/ExpandableInput` to close on touch platforms when tapping another component

## [2.5.0] - 2019-04-01

### Fixed

- `moonstone/ContextualPopupDecorator` method `positionContextualPopup()` to correctly reposition the popup when invoked from app code
- `moonstone/Tooltip` to better support long tooltips
- `moonstone/Popup` to resume spotlight pauses when closing with animation
- `moonstone/Panels` to correctly ignore `null` children

## [2.4.1] - 2019-03-11

### Changed

- `moonstone/Picker` to display more of the selected value in wide instances

### Fixed

- `moonstone/Checkbox`, `moonstone/FormCheckbox`, `moonstone/RadioItem`, `moonstone/SelectableIcon`, and `moonstone/Slider` spotlight muted colors
- `moonstone/Spinner` animation synchronization after a rerender
- `moonstone/TooltipDecorator` to position `Tooltip` correctly when the wrapped component moves or resizes
- `moonstone/VideoPlayer` to continue to show thumbnail when playback control keys are pressed
- `moonstone/VideoPlayer` to stop seeking by remote key when it loses focus
- `moonstone/VirtualList` to only resume spotlight pauses it initiated
- `moonstone/ExpandableItem` to be better optimized on mount

## [2.4.0] - 2019-03-04

### Added

- `line-height` rule to base text CSS for both latin and non-latin locales
- Support for high contrast colors in dark and light `moonstone`
- `moonstone/BodyText` prop `noWrap` which automatically adds `moonstone/Marquee` support as well as limits the content to only display one line of text

### Changed

- `moonstone/Spinner` visuals from 3 spinning balls to an energetic flexing line

### Fixed

- `moonstone/Panels` to set child's `autoFocus` prop to `default-element` when `index` increases
- `moonstone/Slider` to prevent gaining focus when clicked when disabled
- `moonstone/Slider` to prevent default browser scroll behavior when 5-way directional key is pressed on an active knob
- `moonstone/DatePicker` and `moonstone/TimePicker` to close with back/ESC
- `moonstone/DatePicker` and `moonstone/TimePicker` value handling when open on mount
- `moonstone/ContextualPopupDecorator` to correctly focus on popup content when opened

## [2.3.0] - 2019-02-11

### Added

- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` property `childProps` to support additional props included in the object passed to the `itemsRenderer` callback
- `moonstone/Skinnable` support for `skinVariants`, to enable features like high contrast mode and large text mode
- Support for 8k (UHD2) displays

### Changed

- All content-containing LESS stylesheets (not within a `styles` directory) extensions to be `*.module.less` to retain modular context with CLI 2.x.

### Fixed

- `moonstone/VirtualList` to focus an item properly by `scrollTo` API immediately after a prior call to the same position
- `moonstone/Popup` to close floating layer when the popup closes without animation

## [2.2.9] - 2019-01-11

### Fixed

- `moonstone/Scroller` scrolling to boundary behavior for short scrollers

## [2.2.8] - 2018-12-06

### Fixed

- `moonstone/ExpandableInput` to focus labeled item on close
- `moonstone/ExpandableItem` to disable its spotlight container when the component is disabled
- `moonstone/Scroller` to correctly handle scrolling focused elements and containers into view

## [2.2.7] - 2018-11-21

### Fixed

- `moonstone/Picker`, `moonstone/ExpandablePicker`, `moonstone/ExpandableList`, `moonstone/IncrementSlider` to support disabling voice control

## [2.2.6] - 2018-11-15

### Fixed

- `moonstone/VideoPlayer` to blur slider when hiding media controls
- `moonstone/VideoPlayer` to disable pointer mode when hiding media controls via 5-way
- `moonstone/VirtualList` and `moonstone/Scroller` to not to animate with 5-way navigation by default

## [2.2.5] - 2018-11-05

### Fixed

- `moonstone/ExpandableItem` to not steal focus after closing

## [2.2.4] - 2018-10-29

### Fixed

- `moonstone/MoonstoneDecorator` to apply both Latin and non-Latin rules to the root element so all children inherit the correct default font rules.
- `moonstone/Marquee`, `moonstone/MediaOverlay` to display locale-based font
- `moonstone/DayPicker` separator character used between selected days in the label in fa-IR locale
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` scrolling by voice commands in RTL locales

## [2.2.3] - 2018-10-22

### Fixed

- `moonstone/Scroller` to respect the disabled spotlight container status when handling pointer events
- `moonstone/Scroller` to scroll to the boundary when focusing the first or last element with a minimal margin in 5-way mode
- `moonstone/VideoPlayer` to position the slider knob correctly when beyond the left or right edge of the slider

## [2.2.2] - 2018-10-15

### Fixed

- `moonstone/Scroller` stuttering when page up/down key is pressed

## [2.2.1] - 2018-10-09

### Fixed

- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to notify user when scrolling is not possible via voice command
- `moonstone/TimePicker` to not read out meridiem label when changing the value

## [2.2.0] - 2018-10-02

### Added

- `moonstone/GridListImageItem` voice control feature support

### Fixed

- `moonstone/DayPicker` to prevent closing when selecting days via voice control
- `moonstone/VideoPlayer` to unfocus media controls when hidden
- `moonstone/Scroller` to set correct scroll position when an expandable child is closed
- `moonstone/Scroller` to prevent focusing children while scrolling

## [2.1.4] - 2018-09-17

### Fixed

- `moonstone/Button` and `moonstone/IconButton` to style image-based icons correctly when focused and disabled
- `moonstone/FormCheckboxItem` styling when focused and disabled
- `moonstone/Panels` to always blur breadcrumbs when transitioning to a new panel
- `moonstone/Scroller` to correctly set scroll position when nested item is focused
- `moonstone/Scroller` to not adjust `scrollTop` when nested item is focused
- `moonstone/VideoPlayer` to show correct playback rate feedback on play or pause
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` to handle 5way navigation properly when `focusableScrollbar` is true

## [2.1.3] - 2018-09-10

### Fixed

- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to show overscroll effects properly on repeating wheel input
- `moonstone/TooltipDecorator` to handle runtime error when setting `tooltipText` to an empty string
- `moonstone/VideoPlayer` timing to read out `infoComponents` accessibility value when `moreButton` or `moreButtonColor` is pressed

## [2.1.2] - 2018-09-04

### Fixed

- `moonstone/ExpandableItem` to prevent default browser scroll behavior when 5-way key is pressed on the first item or the last item
- `moonstone/Scroller` scrolling behavior for focused items in 5-way mode
- `moonstone/Scroller` to scroll container elements into view
- `moonstone/TooltipDecorator` to update position when `tooltipText` is changed
- `moonstone/VideoPlayer` to prevent default browser scroll behavior when navigating via 5-way
- `moonstone/VirtuaList` to allow `onKeyDown` events to bubble
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` scrolling via page up or down keys

## [2.1.1] - 2018-08-27

### Changed

- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to show overscroll effects only by wheel input

### Fixed

- `moonstone/VideoPlayer` so that activity is detected and the `autoCloseTimeout` timer is reset when using 5-way to navigate from the media slider

### Fixed

- `moonstone/Picker` to fire onChange events, due to a hold, consistently across pointer and 5-way navigation

## [2.1.0] - 2018-08-20

### Added

- `moonstone/VideoPlayer` property `noMediaSliderFeedback`
- `moonstone/VideoPlayer.MediaControls` property `playPauseButtonDisabled`

### Changed

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

## [2.0.1] - 2018-08-01

### Fixed

- `moonstone/Dialog` read order of dialog contents
- `moonstone/Scroller` to go to next page properly via page up/down keys

## [2.0.0] - 2018-07-30

### Added

- `moonstone/LabeledIcon` and `moonstone/LabeledIconButton` components for a lightweight `Icon` or `IconButton` with a label
- `moonstone/VideoPlayer` property `noAutoShowMediaControls`

### Fixed

- `moonstone/Scroller` to prevent scrolling via page up/down keys if there is no spottable component in that direction
- `moonstone/Dialog` to hide `titleBelow` when `title` is not set
- `moonstone/Image` to suppress drag and drop support by default
- `moonstone/VideoPlayer` audio guidance behavior of More button
- `moonstone/VirtualList.VirtualGridList` and `moonstone/VirtualList.VirtualList` to handle focus properly via page up/down keys when switching to 5-way mode
- `moonstone/Popup` to spot the content after it's mounted
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to scroll properly via voice control in RTL locales

## [2.0.0-rc.3] - 2018-07-23

### Changed

- `moonstone/Scroller.Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` overscroll effect color more recognizable on the focused element

### Fixed

- `moonstone/ContextualPopup` to refocus its activator on close when the popup lacks spottable children
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to scroll properly when holding down paging control buttons
- `moonstone/ExpandableItem` spotlight behavior when leaving the component via 5-way
- `moonstone/RadioItem` circle thickness to be 2px, matching the design
- `moonstone/Slider` to correctly prevent 5-way actions when activated
- `moonstone/ExpandableItem` and other expandable components to spotlight correctly when switching from pointer mode to 5-way with `closeOnSelect`

## [2.0.0-rc.2] - 2018-07-16

### Fixed

- `moonstone/Input` to not focus by *tab* key
- `moonstone/Picker` to properly set focus when navigating between buttons
- `moonstone/Popup` to set correct open state while transitioning
- `moonstone/ProgressBar.ProgressBarTooltip` unknown props warning
- `moonstone/Scrollable` to disable spotlight container during flick events only when contents can scroll
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to scroll properly when `animate` is false via `scrollTo`
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` page controls to stop propagating an event when the event is handled
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to hide overscroll effect when focus is moved from a disabled paging control button to the opposite button
- `moonstone/Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to show overscroll effect when reaching the edge for the first time by wheel
- `moonstone/VideoPlayer` to display feedback tooltip when pointer leaves slider while playing
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to restore focus on items focused by pointer

## [2.0.0-rc.1] - 2018-07-09

### Added

- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` support `data-webos-voice-focused` and `data-webos-voice-group-label`

### Removed

- `moonstone/Button` built-in support for tooltips

### Changed

- `moonstone/Spinner` to blur Spotlight when the spinner is active

### Fixed

- `moonstone/Scroller.Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to handle direction, page up, and page down keys properly on page controls them when `focusableScrollbar` is false
- `moonstone/Scroller.Scroller`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/VirtualList.VirtualList` to handle a page up or down key in pointer mode
- `moonstone/VideoPlayer.MediaControls` to correctly handle more button color when the prop is not specified
- `VirtualList.VirtualList` to handle focus properly when switching to 5-way mode

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

## [2.0.0-beta.7] - 2018-06-11

### Removed

- `moonstone/Dialog` properties `preserveCase` and `showDivider`, replaced by `casing` and `noDivider` respectively
- `moonstone/Divider` property `preserveCase`, replaced by `casing`
- `moonstone/ExpandableInput` property `onInputChange`, replaced by `onChange`
- `moonstone/MoonstoneDecorator.TextSizeDecorator`, replaced by `moonstone/MoonstoneDecorator.AccessibilityDecorator`
- `moonstone/Panels.Header` property `preserveCase`, replaced by `casing`
- `moonstone/Panels.Panel` property `noAutoFocus`, replaced by `autoFocus`
- `moonstone/TooltipDecorator` property `tooltipPreserveCase`, replaced by `tooltipCasing`

### Changed

- `moonstone/VideoPlayer` to allow spotlight focus to move left and right from `MediaControls`
- `moonstone/VideoPlayer` to disable bottom controls when loading until it's playable

### Fixed

- `moonstone/EditableIntegerPicker` to disable itself when on a range consisting of a single static value
- `moonstone/Picker` to disable itself when containing fewer than two items
- `moonstone/Popup` to spot its content correctly when `open` by default
- `moonstone/RangePicker` to disable itself when on a range consisting of a single static value
- `moonstone/TooltipDecorator` to hide when `onDismiss` has been invoked
- `moonstone/VideoPlayer` to show media controls when pressing down in pointer mode
- `moonstone/VideoPlayer` to provide a more natural 5-way focus behavior
- `moonstone/VideoPlayer.MediaControls` to handle left and right key to jump when `moonstone/VideoPlayer` is focused

## [2.0.0-beta.6] - 2018-06-04

### Removed

- `moonstone/IncrementSlider` prop `children` which was no longer supported for setting the tooltip (since 2.0.0-beta.1)

### Fixed

- `moonstone/ContextualPopupDecorator` to allow focusing components under a popup without any focusable components
- `moonstone/Scroller` ordering of logic for Scroller focus to check focus possibilities first then go to fallback at the top of the container
- `moonstone/Scroller` to check focus possibilities first then go to fallback at the top of the container of focused item
- `moonstone/Scroller` to scroll by page when focus was at the edge of the viewport
- `moonstone/ToggleButton` padding and orientation for RTL
- `moonstone/VideoPlayer` to not hide title and info section when showing more components
- `moonstone/VideoPlayer` to select a position in slider to seek in 5-way mode
- `moonstone/VideoPlayer` to show thumbnail only when focused on slider

## [2.0.0-beta.5] - 2018-05-29

### Removed

- `moonstone/Popup`, `moonstone/Dialog` and `moonstone/Notification` property `spotlightRestrict` option `'none'`
- `moonstone/VideoPlayer` prop `preloadSource`, to be replaced by `moonstone/VideoPlayer.Video` prop `preloadSource`
- `moonstone/Button` and `moonstone/IconButton` allowed value `'opaque'` from prop `backgroundOpacity` which was the default and therefore has the same effect as omitting the prop

### Added

- `moonstone/VideoPlayer` props `selection` and `onSeekOutsideRange` to support selecting a range and notification of interactions outside of that range
- `moonstone/VideoPlayer.Video` component to support preloading video sources

### Changed

- `moonstone/VideoPlayer.videoComponent` prop to default to `ui/Media.Media` instead of `'video'`. As a result, to use a custom video element, one must pass an instance of `ui/Media` with its `mediaComponent` prop set to the desired element.

### Fixed

- `moonstone/ContextualPopupDecorator` to properly stop propagating keydown event if fired from the popup container
- `moonstone/Slider` to read when knob gains focus or for a change in value
- `moonstone/Scroller` to not cut off Expandables when scrollbar appears
- `moonstone/VideoPlayer` to correctly read out when play button is pressed
- `moonstone/Divider` to always use a fixed height, regardless of locale

## [2.0.0-beta.4] - 2018-05-21

### Added

- `moonstone/Button` and `moonstone/IconButton` class name `small` to the list of allowed `css` overrides
- `moonstone/VideoPlayer.MediaControls` property `onClose` to handle back key
- `moonstone/ProgressBar` prop `highlighted` for when the UX needs to call special attention to a progress bar

### Changed

- `moonstone/VideoPlayer` to disable media slider when source is unavailable

### Fixed

- `moonstone/ContextualPopupDecorator` to not set focus to activator when closing if focus was set elsewhere
- `moonstone/IconButton` to allow external customization of vertical alignment of its `Icon` by setting `line-height`
- `moonstone/Marquee.MarqueeController` to not cancel valid animations
- `moonstone/VideoPlayer` feedback and feedback icon to hide properly on play/pause/fast forward/rewind
- `moonstone/VideoPlayer` to correctly focus to default media controls component
- `moonstone/VideoPlayer` to close opened popup components when media controls hide
- `moonstone/VideoPlayer` to show controls on mount and when playing next preload video

## [2.0.0-beta.3] - 2018-05-14

### Added

- `moonstone/SelectableItem.SelectableItemDecorator`

### Changed

- `moonstone/ToggleItem` to forward native events on `onFocus` and `onBlur`
- `moonstone/Input` and `moonstone/ExpandableInput` to support forwarding valid `<input>` props to the contained `<input>` node
- `moonstone/ToggleButton` to fire `onToggle` when toggled

### Fixed

- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` to scroll properly with all enabled items via a page up or down key
- `moonstone/VirtualList.VirtualList`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/Scroller.Scroller` to ignore any user key events in pointer mode
- `moonstone/VirtualList.VirtualList`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/Scroller.Scroller` to pass `data-spotlight-container-disabled` prop to their outer DOM element
- `moonstone/Image` so it automatically swaps the `src` to the appropriate resolution dynamically as the screen resizes
- `moonstone/Popup` to support all `spotlightRestrict` options
- `moonstone` component `disabled` colors to match the most recent design guidelines (from 30% to 60% opacity)
- `moonstone/ExpandableInput` spotlight behavior when leaving the component via 5-way

## [2.0.0-beta.2] - 2018-05-07

### Fixed

- `moonstone/IconButton` to allow theme-style customization, like it claimed was possible
- `moonstone/ExpandableItem` and related expandables to deal with disabled items and the `autoClose`, `lockBottom` and `noLockBottom` props
- `moonstone/Slider` not to fire `onChange` event when 5-ways out of boundary
- `moonstone/ToggleButton` layout for RTL locales
- `moonstone/Item`, `moonstone/SlotItem`, `moonstone/ToggleItem` to not apply duplicate `className` values
- `moonstone/VirtualList.VirtualList`, `moonstone/VirtualList.VirtualGridList`, and `moonstone/Scroller.Scroller` scrollbar button's aria-label in RTL
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` to scroll properly with all disabled items
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` to not scroll on focus when jumping

## [2.0.0-beta.1] - 2018-04-29

### Removed

- `moonstone/IncrementSlider` and `moonstone/Slider` props `tooltipAsPercent`, `tooltipSide`, and `tooltipForceSide`, to be replaced by `moonstone/IncrementSlider.IncrementSliderTooltip` and `moonstone/Slider.SliderTooltip` props `percent`, and `side`
- `moonstone/IncrementSlider` props `detachedKnob`, `onDecrement`, `onIncrement`, and `scrubbing`
- `moonstone/ProgressBar` props `tooltipSide` and `tooltipForceSide`, to be replaced by `moonstone/ProgressBar.ProgressBarTooltip` prop `side`
- `moonstone/Slider` props `detachedKnob`, `onDecrement`, `onIncrement`, `scrubbing`, and `onKnobMove`
- `moonstone/VideoPlayer` property `tooltipHideDelay`
- `moonstone/VideoPlayer` props `backwardIcon`, `forwardIcon`, `initialJumpDelay`, `jumpBackwardIcon`, `jumpButtonsDisabled`, `jumpDelay`, `jumpForwadIcon`, `leftComponents`, `moreButtonCloseLabel`, `moreButtonColor`, `moreButtonDisabled`, `moreButtonLabel`, `no5WayJump`, `noJumpButtons`, `noRateButtons`, `pauseIcon`, `playIcon`, `rateButtonsDisabled`, and `rightComponents`, replaced by corresponding props on `moonstone/VideoPlayer.MediaControls`
- `moonstone/VideoPlayer` props `onBackwardButtonClick`, `onForwardButtonClick`, `onJumpBackwardButtonClick`, `onJumpForwardButtonClick`, and `onPlayButtonClick`, replaced by `onRewind`, `onFastForward`, `onJumpBackward`, `onJumpForward`, `onPause`, and `onPlay`, respectively

### Added

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

### Changed

- `moonstone/IncrementSlider` and `moonstone/Slider` prop `tooltip` to support either a boolean for the default tooltip or an element or component for a custom tooltip
- `moonstone/Input` to prevent pointer actions on other component when the input has focus
- `moonstone/ProgressBar.ProgressBarTooltip` prop `side` to support either locale-aware or locale-independent positioning
- `moonstone/ProgressBar.ProgressBarTooltip` prop `tooltip` to support custom tooltip components
- `moonstone/Scroller`, `moonstone/Picker`, and `moonstone/IncrementSlider` to retain focus on `moonstone/IconButton` when it becomes disabled

### Fixed

- `moonstone/ExpandableItem` and related expandable components to expand smoothly when used in a scroller
- `moonstone/GridListImageItem` to show proper `placeholder` and `selectionOverlay`
- `moonstone/MoonstoneDecorator` to optimize localized font loading performance
- `moonstone/Scroller` and `moonstone/VirtualList` navigation via 5-way from paging controls
- `moonstone/VideoPlayer` to render bottom controls at idle after mounting
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` to give initial focus
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` to have the default value for `dataSize`, `pageScroll`, and `spacing` props

## [2.0.0-alpha.8] - 2018-04-17

### Added

- `moonstone/Panels` property `closeButtonAriaLabel` to configure the label set on application close button

### Changed

- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` to set its ARIA `role` to `"list"`
- `moonstone/VideoPlayer` property `title` to accept node type

### Fixed

- `moonstone/TimePicker` to show `meridiem` correctly in all locales
- `moonstone/Scrollable` scroll buttons to read out out audio guidance when button pressed down
- `moonstone/ExpandableItem` to show label properly when open and disabled
- `moonstone/Notification` to position properly in RTL locales
- `moonstone/VideoPlayer` to show controls when pressing 5-way select

## [2.0.0-alpha.7] - 2018-04-03

### Removed

- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` prop `data` to eliminate the misunderstanding caused by the ambiguity of `data`

### Added

- `moonstone/VideoPlayer` property `noSpinner` to allow apps to show/hide spinner while loading video

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

## [2.0.0-alpha.6] - 2018-03-22

### Removed

- `moonstone/Slider` exports `SliderFactory` and `SliderBaseFactory`
- `moonstone/IncrementSlider` exports `IncrementSliderFactory` and `IncrementSliderBaseFactory`
- `moonstone/ProgressBar`, `moonstone/Slider`, `moonstone/Slider.SliderTooltip`, `moonstone/IncrementSlider` components' `vertical` property and replaced it with `orientation`

### Added

- `moonstone/VideoPlayer` property `component` to handle custom video element
- `moonstone/IncrementSlider` properties `incrementAriaLabel` and `decrementAriaLabel` to configure the label set on each button
- `moonstone/Input` support for `small` prop
- `moonstone/ProgressBar` support for `tooltip` and `tooltipForceSide`
- `moonstone/ProgressBar`, `moonstone/Slider`, `moonstone/Slider.SliderTooltip`, `moonstone/IncrementSlider` property `orientation` to accept orientation strings like "vertical" and "horizontal" (replaced old `vertical` prop)

### Changed

- `moonstone/Input` input `height`, `vertical-align`, and `margins`. Please verify your layouts to ensure everything lines up correctly; this change may require removal of old sizing and positioning CSS which is no longer necessary.
- `moonstone/FormCheckbox` to have a small border around the circle, according to new GUI designs
- `moonstone/RadioItem` dot size and added an inner-dot to selected-focused state, according to new GUI designs
- `moonstone/ContextualPopup` prop `popupContainerId` to `popupSpotlightId`
- `moonstone/Popup` prop `containerId` to `spotlightId`
- `moonstone/VideoPlayer` prop `containerId` to `spotlightId`
- `moonstone/VirtualList.VirtualList` and `moonstone/VirtualList.VirtualGridList` prop `component` to be replaced by `itemRenderer`

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

## [2.0.0-alpha.5] - 2018-03-07

### Removed

- `moonstone/Marquee.MarqueeText`, replaced by `moonstone/Marquee.Marquee`
- `moonstone/VirtualGridList.GridListImageItem`, replaced by `moonstone/GridListImageItem`

### Changed

- `moonstone/Marquee.Marquee` to be `moonstone/Marquee.MarqueeBase`
- `moonstone/ContextualPopupDecorator` to not restore last-focused child
- `moonstone/ExpandableList` to restore focus to the first selected item after opening

### Fixed

- `moonstone/Slider` to correctly show localized percentage value in tooltip when `tooltipAsPercent` is true
- `moonstone/VirtualGridList` to show or hide its scrollbars properly
- `moonstone/Button` text to be properly centered
- `moonstone/Input` to not clip some glyphs at the start of the value

## [2.0.0-alpha.4] - 2018-02-13

### Added

- `moonstone/SlotItem` replacing `moonstone/Item.ItemOverlay`

### Removed

- `moonstone/VirtualFlexList` to be replaced by `ui/VirtualFlexList`
- `moonstone/Button` and `moonstone/IconButton` prop `noAnimation`
- `moonstone/Item.OverlayDecorator`, `moonstone/Item.Overlay`, and `moonstone/Item.ItemOverlay` to be replaced by `moonstone/SlotItem`

### Changed

- `moonstone/Marquee` to do less-costly calculations during measurement and optimized the applied styles
- `moonstone/ExpandableList` to require a unique key for each object type data

### Fixed

- `moonstone/VirtualList` to render properly with fiber reconciler
- `moonstone/VirtualList` focus option in scrollTo api
- `moonstone/ExpandableSpotlightDecorator` to not spot the title upon collapse when in `pointerMode`
- `moonstone/Spinner` to not unpause Spotlight unless it was the one to pause it
- `moonstone/Marquee` to stop when becoming disabled
- `moonstone/Input`, `moonstone/MarqueeDecorator`, and `moonstone/Slider` to prevent unnecessary focus-based updates

## [2.0.0-alpha.3] - 2018-01-18

### Removed

- `moonstone/Scroller` and `moonstone/VirtualList` option `indexToFocus` in `scrollTo` method which is deprecated from 1.2.0
- `moonstone/Scroller` props `horizontal` and `vertical` which are deprecated from 1.3.0 and replaced with `direction` prop
- `moonstone/Button` exports `ButtonFactory` and `ButtonBaseFactory`
- `moonstone/IconButton` exports `IconButtonFactory` and `IconButtonBaseFactory`

### Fixed

- `moonstone/MoonstoneDecorator` root node to fill the entire space available, which simplifies positioning and sizing for child elements (previously always measured 0 in height)
- `moonstone/VirtualList` to prevent infinite function call when a size of contents is slightly longer than a client size without a scrollbar
- `moonstone/VirtualList` to sync scroll position when clientSize changed

## [2.0.0-alpha.2] - 2017-08-29

No significant changes.

## [2.0.0-alpha.1] - 2017-08-27

### Changed

- `moonstone/Button`, `moonstone/Checkbox`, `moonstone/FormCheckbox`, `moonstone/IconButton`, `moonstone/IncrementSlider`, `moonstone/Item`, `moonstone/Picker`, and `moonstone/RangePicker`, `moonstone/Switch` and `moonstone/VideoPlayer` to use `ui/Touchable`

## [1.15.0] - 2018-02-28

### Deprecated

- `moonstone/Marquee.Marquee`, to be moved to `moonstone/Marquee.MarqueeBase` in 2.0.0
- `moonstone/Marquee.MarqueeText`, to be moved to `moonstone/Marquee.Marquee` in 2.0.0

### Fixed

- `moonstone/GridListImageItem` to display correctly

## [1.14.0] - 2018-02-23

### Deprecated

- `moonstone/VirtualFlexList`, to be replaced by `ui/VirtualFlexList` in 2.0.0
- `moonstone/VirtualGridList.GridListImageItem`, to be replaced by `moonstone/GridListImageItem` in 2.0.0
- `moonstone/Button` and `moonstone/IconButton` prop `noAnimation`, to be removed in 2.0.0
- `moonstone/Button.ButtonFactory`, `moonstone/Button.ButtonBaseFactory`, `moonstone/IconButton.IconButtonFactory`, `moonstone/IconButton.IconButtonBaseFactory`, `moonstone/IncrementSlider.IncrementSliderFactory`, `moonstone/IncrementSlider.IncrementSliderBaseFactory`, `moonstone/Slider.SliderFactory`, and `moonstone/Slider.SliderBaseFactory`, to be removed in 2.0.0
- `moonstone/Item.ItemOverlay`, to be replaced by `ui/SlotItem` in 2.0.0
- `moonstone/Item.Overlay` and `moonstone/Item.OverlayDecorator`, to be removed in 2.0.0

### Added

- `moonstone/DaySelector` component
- `moonstone/EditableIntegerPicker` component
- `moonstone/GridListImageItem` component

## [1.13.4] - 2018-07-30

### Fixed

- `moonstone/DatePicker` to calculate min and max year in the current calender

## [1.13.3] - 2018-01-16

### Fixed

- `moonstone/TimePicker` to not read out meridiem label when meridiem picker gets a focus
- `moonstone/Scroller` to correctly update scrollbars when the scroller's contents change

## [1.13.2] - 2017-12-14

### Fixed

- `moonstone/Panels` to maintain spotlight focus when `noAnimation` is set
- `moonstone/Panels` to not accept back key presses during transition
- `moonstone/Panels` to revert 1.13.0 fix that blurred Spotlight when transitioning panels
- `moonstone/Scroller` and other scrolling components to not show scroll thumb when only child item is updated
- `moonstone/Scroller` and other scrolling components to not hide scroll thumb immediately after scroll position reaches the top or the bottom
- `moonstone/Scroller` and other scrolling components to show scroll thumb properly when scroll position reaches the top or the bottom by paging controls

## [1.13.1] - 2017-12-06

### Fixed

- `moonstone/Slider` to not unnecessarily fire `onChange` if the initial value has not changed

## [1.13.0] - 2017-11-28

### Added

- `moonstone/VideoPlayer` props `disabled`, `loading`, `miniFeedbackHideDelay`, and `thumbnailComponent` as well as new APIs: `areControlsVisible`, `getVideoNode`, `showFeedback`, and `toggleControls`

### Fixed

- `moonstone/VirtualList` to render items from a correct index on edge cases at the top of a list
- `moonstone/VirtualList` to handle focus properly via page up at the first page and via page down at the last page
- `moonstone/Expandable` and derivatives to use the new `ease-out-quart` animation timing function to better match the aesthetic of Enyo's Expandables
- `moonstone/TooltipDecorator` to correctly display tooltip direction when locale changes
- `moonstone/Marquee` to restart animation on every resize update
- `moonstone/LabeledItem` to start marquee when hovering while disabled
- `moonstone/Marquee` to correctly start when hovering on disabled spottable components
- `moonstone/Marquee.MarqueeController` to not abort marquee when moving among components
- `moonstone/Picker` marquee issues with disabled buttons or Picker
- `moonstone/Panels` to prevent loss of spotlight issue when moving between panels
- `moonstone/VideoPlayer` to bring it in line with real-world use-cases
- `moonstone/Slider` by removing unnecessary repaints to the screen
- `moonstone/Slider` to fire `onChange` events when the knob is pressed near the boundaries
- `moonstone/VideoPlayer` to correctly position knob when interacting with media slider
- `moonstone/VideoPlayer` to not read out the focused button when the media controls hide
- `moonstone/MarqueeDecorator` to stop when unhovering a disabled component using `marqueeOn` `'focus'`
- `moonstone/Slider` to not forward `onChange` when `disabled` on `mouseUp/click`
- `moonstone/VideoPlayer` to defer rendering playback controls until needed

## [1.12.2] - 2017-11-15

### Fixed

- `moonstone/VirtualList` to scroll and focus properly by pageUp and pageDown when disabled items are in it
- `moonstone/Button` to correctly specify minimum width when in large text mode
- `moonstone/Scroller` and other scrolling components to restore last focused index when panel is changed
- `moonstone/VideoPlayer` to display time correctly in RTL locale
- `moonstone/VirtualList` to scroll correctly using page down key with disabled items
- `moonstone/Scroller` and other scrolling components to not cause a script error when scrollbar is not rendered
- `moonstone/Picker` incrementer and decrementer to not change size when focused
- `moonstone/Header` to use a slightly smaller font size for `title` in non-latin locales and a line-height for `titleBelow` and `subTitleBelow` that better meets the needs of tall-glyph languages like Tamil and Thai, as well as latin locales
- `moonstone/Scroller` and `moonstone/VirtualList` to keep spotlight when pressing a 5-way control while scrolling
- `moonstone/Panels` to prevent user interaction with panel contents during transition
- `moonstone/Slider` and related components to correctly position knob for `detachedKnob` on mouse down and fire value where mouse was positioned on mouse up
- `moonstone/DayPicker` to update day names when changing locale
- `moonstone/ExpandableItem` and all other `Expandable` components to revert 1.12.1 change to pull down from the top

## [1.12.1] - 2017-11-07

### Fixed

- `moonstone/ExpandableItem` and all other `Expandable` components to now pull down from the top instead of being revealed from the bottom, matching Enyo's design
- `moonstone/VirtualListNative` to scroll properly with page up/down keys if there is a disabled item
- `moonstone/RangePicker` to display negative values correctly in RTL
- `moonstone/Scroller` and other scrolling components to not blur scroll buttons when wheeling
- `moonstone/Scrollbar` to hide scroll thumb immediately without delay after scroll position reaches min or max
- `moonstone/Divider` to pass `marqueeOn` prop
- `moonstone/Slider` to fire `onChange` on mouse up and key up
- `moonstone/VideoPlayer` to show knob when pressed
- `moonstone/Header` to layout `titleBelow` and `subTitleBelow` correctly
- `moonstone/Header` to use correct font-weight for `subTitleBelow`
- `moonstone/VirtualList` to restore focus correctly for lists only slightly larger than the viewport

## [1.12.0] - 2017-10-27

### Fixed

- `moonstone/Scroller` and other scrolling components to prevent focusing outside the viewport when pressing a 5-way key during wheeling
- `moonstone/Scroller` to called scrollToBoundary once when focus is moved using holding child item
- `moonstone/VideoPlayer` to apply skin correctly
- `moonstone/Popup` from `last-focused` to `default-element` in `SpotlightContainerDecorator` config
- `moonstone/Panels` to retain focus when back key is pressed on breadcrumb
- `moonstone/Input` to correctly hide VKB when dismissing

## [1.11.0] - 2017-10-24

### Added

- `moonstone/VideoPlayer` properties `seekDisabled` and `onSeekFailed` to disable seek function

### Changed

- `moonstone/ExpandableList` to become `disabled` if there are no children

### Fixed

- `moonstone/Picker` to read out customized accessibility value when picker prop has `joined` and `aria-valuetext`
- `moonstone/Scroller` to apply scroll position on vertical or horizontal Scroller when child gets a focus
- `moonstone/Scroller` and other scrolling components to scroll without animation when panel is changed
- `moonstone/ContextualPopup` padding to not overlap close button
- `moonstone/Scroller` and other scrolling components to change focus via page up/down only when the scrollbar is visible
- `moonstone/Picker` to only increment one value on hold
- `moonstone/ItemOverlay` to remeasure when focused

## [1.10.1] - 2017-10-16

### Fixed

- `moonstone/Scroller` and other scrolling components to scroll via page up/down when focus is inside a Spotlight container
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to scroll by 5-way keys right after wheeling
- `moonstone/VirtualList` not to move focus when a current item and the last item are located at the same line and pressing a page down key
- `moonstone/Slider` knob to follow while dragging for detached knob
- `moonstone/Header` to layout header row correctly in `standard` type
- `moonstone/Input` to not dismiss on-screen keyboard when dragging cursor out of input box
- `moonstone/Header` RTL `line-height` issue
- `moonstone/Panels` to render children on idle
- `moonstone/Scroller` and other scrolling components to limit muted spotlight container scrims to their bounds
- `moonstone/Input` to always forward `onKeyUp` event

## [1.10.0] - 2017-10-09

### Added

- `moonstone/VideoPlayer` support for designating components with `.spottable-default` as the default focus target when pressing 5-way down from the slider
- `moonstone/Slider` property `activateOnFocus` which when enabled, allows 5-way directional key interaction with the `Slider` value without pressing [Enter] first
- `moonstone/VideoPlayer` property `noMiniFeedback` to support controlling the visibility of mini feedback
- `ui/Layout`, which provides a technique for laying-out components on the screen using `Cells`, in rows or columns

### Changed

- `moonstone/Popup` to focus on mount if it’s initially opened and non-animating and to always pass an object to `onHide` and `onShow`
- `moonstone/VideoPlayer` to emit `onScrub` event and provide audio guidance when setting focus to slider

### Fixed

- `moonstone/ExpandableItem` and derivatives to restore focus to the Item if the contents were last focused when closed
- `moonstone/Slider` toggling activated state when holding enter/select key
- `moonstone/TimePicker` picker icons shifting slightly when focusing an adjacent picker
- `moonstone/Icon` so it handles color the same way generic text does, by inheriting from the parent's color. This applies to all instances of `Icon`, `IconButton`, and `Icon` inside `Button`.
- `moonstone/fonts` Museo Sans font to correct "Ti" kerning
- `moonstone/VideoPlayer` to correctly position knob on mouse click
- `moonstone/Panels.Header` to show an ellipsis for long titles with RTL text
- `moonstone/Marquee` to restart when invalidated by a prop change and managed by a `moonstone/Marquee.MarqueeController`
- `spotlight.Spotlight` method `focus()` to verify that the target element matches its container's selector rules prior to setting focus
- `moonstone/Picker` to only change picker values `onWheel` when spotted
- `moonstone/VideoPlayer` to hide descendant floating components (tooltips, contextual popups) when the media controls hide

## [1.9.3] - 2017-10-03

### Added

- `moonstone/Button` property value to `backgroundOpacity` called "lightTranslucent" to better serve colorful image backgrounds behind Buttons. This also affects `moonstone/IconButton` and `moonstone/Panels/ApplicationCloseButton`.
- `moonstone/Panels` property `closeButtonBackgroundOpacity` to support `moonstone/Panels/ApplicationCloseButton`'s `backgroundOpacity` prop

### Changed

- `Moonstone Icons` font file to include the latest designs for several icons
- `moonstone/Panels/ApplicationCloseButton` to expose its `backgroundOpacity` prop

### Fixed

- `moonstone/VirtualList` to apply "position: absolute" inline style to items
- `moonstone/Picker` to increment and decrement normally at the edges of joined picker
- `moonstone/Icon` not to read out image characters
- `moonstone/Scroller` and other scrolling components to not accumulate paging scroll by pressing page up/down in scrollbar
- `moonstone/Icon` to correctly display focused state when using external image
- `moonstone/Button` and `moonstone/IconButton` to be properly visually muted when in a muted container

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

### Changed

- `moonstone/TimePicker` to use "AM/PM" instead of "meridiem" for label under meridiem picker
- `moonstone/IconButton` default style to not animate on press. NOTE: This behavior will change back to its previous setting in release 2.0.0.
- `moonstone/Popup` to warn when using `scrimType` `'none'` and `spotlightRestrict` `'self-only'`
- `moonstone/Scroller` to block spotlight during scroll
- `moonstone/ExpandableItem` and derivatives to always pause spotlight before animation

### Fixed

- `moonstone/VirtualGridList` to not move focus to wrong column when scrolled from the bottom by holding the "up" key
- `moonstone/VirtualList` to focus an item properly when moving to a next or previous page
- `moonstone/Scroller` and other scrolling components to move focus toward first or last child when page up or down key is pressed if the number of children is small
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

## [1.8.0] - 2017-09-07

### Deprecated

- `moonstone/Dialog` property `showDivider`, will be replaced by `noDivider` property in 2.0.0

### Added

- `moonstone/Popup` callback property `onShow` which fires after popup appears for both animating and non-animating popups

### Changed

- `moonstone/Popup` callback property `onHide` to run on both animating and non-animating popups
- `moonstone/VideoPlayer` state `playbackRate` to media events
- `moonstone/VideoPlayer` support for `spotlightDisabled`
- `moonstone/VideoPlayer` thumbnail positioning and style
- `moonstone/VirtualList` to render when dataSize increased or decreased
- `moonstone/Dialog` style
- `moonstone/Popup`, `moonstone/Dialog`, and `moonstone/Notification` to support `node` type for children
- `moonstone/Scroller` to forward `onKeyDown` events

### Fixed

- `moonstone/Scroller` and other scrolling components to enable focus when wheel scroll is stopped
- `moonstone/VirtualList` to show scroll thumb when a preserved item is focused in a Panel
- `moonstone/Scroller` to navigate properly with 5-way when expandable child is opened
- `moonstone/VirtualList` to stop scrolling when focus is moved on an item from paging controls or outside
- `moonstone/VirtualList` to move out with 5-way navigation when the first or the last item is disabled
- `moonstone/IconButton` Tooltip position when disabled
- `moonstone/VideoPlayer` Tooltip time after unhovering
- `moonstone/VirtualList` to not show invisible items
- `moonstone/IconButton` Tooltip position when disabled
- `moonstone/VideoPlayer` to display feedback tooltip correctly when navigating in 5-way
- `moonstone/MarqueeDecorator` to work with synchronized `marqueeOn` `'render'` and hovering as well as `marqueOn` `'hover'` when moving rapidly among synchronized marquees
- `moonstone/Input` aria-label for translation
- `moonstone/Marquee` to recalculate inside `moonstone/Scroller` and `moonstone/SelectableItem` by bypassing `shouldComponentUpdate`
- `moonstone/Picker` to marquee when incrementing and decrementing values with the prop `noAnimation`

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

### Changed

- `moonstone/Scrollbar` to disable paging control down button properly at the bottom when a scroller size is a non-integer value
- `moonstone/VirtualList`, `moonstone/VirtualGridList`, and `moonstone/Scroller` to scroll on `keydown` event instead of `keyup` event of page up and page down keys
- `moonstone/VirtualGridList` to scroll by item via 5 way key
- `moonstone/VideoPlayer` to read target time when jump by left/right key
- `moonstone/IconButton` to not use `MarqueeDecorator` and `Uppercase`

### Fixed

- `moonstone/VirtualList` and `moonstone/VirtualGridList` to focus the correct item when page up and page down keys are pressed
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

### Fixed

- `moonstone/IconButton` to fit image source within `IconButton`
- `moonstone` icon font sizes for wide icons
- `moonstone/ContextualPopupDecorator` to prefer setting focus to the appropriate popup instead of other underlying controls when using 5-way from the activating control
- `moonstone/Scroller` not scrolled via 5 way when `moonstone/ExpandableList` is opened
- `moonstone/VirtualList` to not let the focus move outside of container even if there are children left when navigating with 5way
- `moonstone/Scroller` and other scrolling components to update disability of paging controls when the scrollbar is set to `visible` and the content becomes shorter
- `moonstone/VideoPlayer` to focus on hover over play/pause button when video is loading
- `moonstone/VideoPlayer` to update and display proper time while moving knob when video is paused
- `moonstone/VideoPlayer` long title overlap issues
- `moonstone/Header` to apply `marqueeOn` prop to `subTitleBelow` and `titleBelow`
- `moonstone/Picker` wheeling in `moonstone/Scroller`
- `moonstone/IncrementSlider` and `moonstone/Picker` to read value changes when selecting buttons

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
- `moonstone/GridListImageItem` to require a `source` prop and not have a default value

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
- `moonstone/Scroller` and other scrolling components' bug in `navigableFilter` when passed a container id

## [1.4.1] - 2017-07-05

### Changed

- `moonstone/Popup` to only call `onKeyDown` when there is a focused item in the `Popup`
- `moonstone/Scroller`, `moonstone/Picker`, and `moonstone/IncrementSlider` to automatically move focus when the currently focused `moonstone/IconButton` becomes disabled

### Fixed

- `moonstone/ContextualPopupDecorator` close button to account for large text size
- `moonstone/ContextualPopupDecorator` to not spot controls other than its activator when navigating out via 5-way
- `moonstone/Header` to set the value of `marqueeOn` for all types of headers

## [1.4.0] - 2017-06-29

### Deprecated

- `moonstone/Input` prop `noDecorator` is being replaced by `autoFocus` in 2.0.0

### Added

- `moonstone/Scrollbar` property `corner` to add the corner between vertical and horizontal scrollbars
- `moonstone/ScrollThumb` for a thumb of `moonstone/Scrollbar`
- `moonstone/styles/text.less` mixin `.locale-japanese-line-break()` to apply the correct  Japanese language line-break rules for the following multi-line components: `moonstone/BodyText`, `moonstone/Dialog`, `moonstone/Notification`, `moonstone/Popup`, and `moonstone/Tooltip`
- `moonstone/ContextualPopupDecorator` property `popupProps` to attach props to popup component
- `moonstone/VideoPlayer` property `pauseAtEnd` to control forward/backward seeking
- `moonstone/Panels/Header` prop `marqueeOn` to control marquee of header

### Changed

- `moonstone/Panels/Header` to expose its `marqueeOn` prop
- `moonstone/VideoPlayer` to automatically adjust the width of the allocated space for the side components so the media controls have more space to appear on smaller screens
- `moonstone/VideoPlayer` properties `autoCloseTimeout` and `titleHideDelay` default value to `5000`
- `moonstone/VirtualList` to support restoring focus to the last focused item
- `moonstone/Scroller` and other scrolling components to call `onScrollStop` before unmounting if a scroll is in progress
- `moonstone/Scroller` to reveal non-spottable content when navigating out of a scroller

### Fixed

- `moonstone/Dialog` to properly focus via pointer on child components
- `moonstone/VirtualList`, `moonstone/VirtualGridList`, and `moonstone/Scroller` not to be slower when scrolled to the first or the last position by wheeling
- `moonstone` component hold delay time
- `moonstone/VideoPlayer` to show its controls when pressing down the first time
- `moonstone/Panel` autoFocus logic to only focus on initial render
- `moonstone/Input` text colors
- `moonstone/ExpandableInput` to focus its decorator when leaving by 5-way left/right

## [1.3.1] - 2017-06-14

### Fixed

- `moonstone/Picker` support for large text
- `moonstone/Scroller` support for focusing paging controls with the pointer
- `moonstone` CSS rules for unskinned spottable components

## [1.3.0] - 2017-06-12

### Deprecated

- `moonstone/Scroller` props `horizontal` and `vertical`. Deprecated props are replaced with `direction` prop. `horizontal` and `vertical` will be removed in 2.0.0.
- `moonstone/Panel` prop `noAutoFocus` in favor of `autoFocus="none"`

### Added

- `moonstone/Image` support for `children` prop inside images
- `moonstone/Scroller` prop `direction` which replaces `horizontal` and `vertical` props
- `moonstone/VideoPlayer` property `tooltipHideDelay` to hide tooltip with a given amount of time
- `moonstone/VideoPlayer` property `pauseAtEnd` to pause when it reaches either the start or the end of the video
- `moonstone/VideoPlayer` methods `fastForward`, `getMediaState`, `jump`, `pause`, `play`, `rewind`, and `seek` to allow external interaction with the player. See docs for example usage.

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

## [1.2.0] - 2017-05-17

### Deprecated

- `moonstone/Scroller` and other scrolling components option `indexToFocus` in `scrollTo` method to be removed in 2.0.0

### Added

- `moonstone/Slider` and `moonstone/IncrementSlider` prop `noFill` to support a style without the fill
- `moonstone/Marquee` property `rtl` to set directionality to right-to-left
- `moonstone/VirtualList.GridListImageItem` property `selectionOverlay` to add custom component for selection overlay
- `moonstone/MoonstoneDecorator` property `skin` to let an app choose its skin: "moonstone" and "moonstone-light" are now available
- `moonstone/FormCheckboxItem`
- `moonstone/FormCheckbox`, a standalone checkbox, to support `moonstone/FormCheckboxItem`
- `moonstone/Input` props `invalid` and `invalidMessage` to display a tooltip when input value is invalid
- `moonstone/Scroller` and other scrolling components option `focus` in `scrollTo()` method
- `moonstone/Scroller` and other scrolling components property `spottableScrollbar`
- `moonstone/Icon.IconList` icons: `arrowshrinkleft` and `arrowshrinkright`

### Changed

- `moonstone/Picker` arrow icon for `joined` picker: small when not spotted, hidden when it reaches the end of the picker
- `moonstone/Checkbox` and `moonstone/CheckboxItem` to reflect the latest design
- `moonstone/MoonstoneDecorator/fontGenerator` was refactored to use the browser's FontFace API to dynamically load locale fonts
- `moonstone/VideoPlayer` space allotment on both sides of the playback controls to support 4 buttons; consequently the "more" controls area has shrunk by the same amount
- `moonstone/VideoPlayer` to not disable media button (play/pause)
- `moonstone/Scroller` and other scrolling components so that paging controls are not spottable by default with 5-way
- `moonstone/VideoPlayer`'s more/less button to use updated arrow icon

### Fixed

- `moonstone/MarqueeDecorator` to properly stop marquee on items with `'marqueeOnHover'`
- `moonstone/ExpandableList` to work properly with object-based children
- `moonstone/styles/fonts.less` to restore the Moonstone Icon font to request the local system font by default. Remember to update your webOS build to get the latest version of the font so you don't see empty boxes for your icons.
- `moonstone/Picker` and `moonstone/RangePicker` to now use the correct size from Enyo (60px v.s. 84px) for icon buttons
- `moonstone/Scroller` and other scrolling components to apply ri.scale properly
- `moonstone/Panel` to not cover a `Panels`'s `ApplicationCloseButton` when not using a `Header`
- `moonstone/IncrementSlider` to show tooltip when buttons focused

## [1.1.0] - 2017-04-21

### Deprecated

- `moonstone/ExpandableInput` property `onInputChange`

### Added

- `moonstone/Panels.Panel` prop and `moonstone/MoonstoneDecorator` config option: `noAutoFocus` to support prevention of setting automatic focus after render
- `moonstone/VideoPlayer` props: `backwardIcon`, `forwardIcon`, `jumpBackwardIcon`, `jumpForwardIcon`, `pauseIcon`, and `playIcon` to support icon customization of the player
- `moonstone/VideoPlayer` props `jumpButtonsDisabled` and `rateButtonsDisabled` for disabling the pairs of buttons when it's inappropriate for the playing media
- `moonstone/VideoPlayer` property `playbackRateHash` to support custom playback rates
- `moonstone/VideoPlayer` callback prop `onControlsAvailable` which fires when the players controls show or hide
- `moonstone/Image` support for `onLoad` and `onError` events
- `moonstone/VirtualList.GridListImageItem` prop `placeholder`
- `moonstone/Divider` property `preserveCase` to display text without capitalizing it

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

### Fixed

- `moonstone/Popup` and `moonstone/ContextualPopupDecorator` 5-way navigation behavior
- `moonstone/Input` to not spot its own input decorator on 5-way out
- `moonstone/VideoPlayer` to no longer render its `children` in multiple places
- `moonstone/Button` text color when used on a neutral (light) background in some cases
- `moonstone/Popup` background opacity
- `moonstone/Marquee` to recalculate properly when its contents change
- `moonstone/TimePicker` to display time in correct order
- `moonstone/Scroller` to prefer spotlight navigation to its internal components

## [1.0.0] - 2017-03-31

> NOTE: We have also modified most form components to be usable in a controlled (app manages component
> state) or uncontrolled (Enact manages component state) manner. To put a component into a
> controlled state, pass in `value` (or other appropriate state property such as `selected` or
> `open`) at component creation and then respond to events and update the value as needed. To put a
> component into an uncontrolled state, do not set `value` (or equivalent), at creation. From this
> point on, Enact will manage the state and events will be sent when the state is updated. To
> specify an initial value, use the `defaultValue` (or, `defaultSelected, `defaultOpen, etc.)
> property.  See the documentation for individual components for more information.

### Added

- `moonstone/Button` property `icon` to support a built-in icon next to the text content. The Icon supports everything that `moonstone/Icon` supports, as well as a custom icon.
- `moonstone/MoonstoneDecorator` property `textSize` to resize several components to requested CMR sizes. Simply add `textSize="large"` to your `App` and the new sizes will automatically take effect.

### Changed

- `moonstone/Slider` to use the property `tooltip` instead of `noTooltip`, so the built-in tooltip is not enabled by default
- `moonstone/IncrementSlider` to include tooltip documentation
- `moonstone/ExpandableList` to accept an array of objects as children which are spread onto the generated components
- `moonstone/CheckboxItem` style to match the latest designs, with support for the `moonstone/Checkbox` to be on either the left or the right side by using the `iconPosition` property
- `moonstone/VideoPlayer` to supply every event callback-method with an object representing the VideoPlayer's current state, including: `currentTime`, `duration`, `paused`, `proportionLoaded`, and `proportionPlayed`

### Fixed

- `moonstone/Panels.Panel` behavior for remembering focus on unmount and setting focus after render
- `moonstone/VirtualList.VirtualGridList` showing empty items when items are continuously added dynamically
- `moonstone/Picker` to marquee on focus once again

## [1.0.0-beta.4] - 2017-03-10

### Added

- `moonstone/VirtualList` `indexToFocus` option to `scrollTo` method to focus on item with specified index
- `moonstone/IconButton` and `moonstone/Button` `color` property to add a remote control key color to the button
- `moonstone/Scrollbar` property `disabled` to disable both paging controls when it is true
- `moonstone/VirtualList` parameter `moreInfo` to pass `firstVisibleIndex` and `lastVisibleIndex` when scroll events are firing
- Accessibility support to UI components
- `moonstone/VideoPlayer` property `onUMSMediaInfo` to support the custom webOS “umsmediainfo” event
- `moonstone/Region` component which encourages wrapping components for improved accessibility rather than only preceding the components with a `moonstone/Divider`
- `moonstone/Slider` tooltip. It's enabled by default and comes with options like `noTooltip`, `tooltipAsPercent`, and `tooltipSide`. See the component docs for more details.
- `moonstone/Panels.Panel` property `hideChildren` to defer rendering children
- `moonstone/Spinner` properties `blockClickOn` and `scrim` to block click events behind spinner
- `moonstone/VirtualList` property `clientSize` to specify item dimensions instead of measuring them

### Changed

- `moonstone/VirtualGridImageItem` styles to reduce redundant style code app side
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to add essential CSS for list items automatically
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to not add `data-index` to their item DOM elements directly, but to pass `data-index` as the parameter of their `component` prop like the `key` parameter of their `component` prop
- `moonstone/ExpandableItem` and derivatives to defer focusing the contents until animation completes
- `moonstone/LabeledItem`, `moonstone/ExpandableItem`, `moonstone/ExpandableList` to each support the `node` type in their `label` property. Best used with `ui/Slottable`.

### Fixed

- `moonstone/VirtualList.GridListImageItem` to have proper padding size according to the existence of caption/subcaption
- `moonstone/Scroller` and other scrolling components to display scrollbars with proper size
- `moonstone/VirtualGridList` to not be truncated

### Removed

- `moonstone/Scroller` and other scrolling components property `hideScrollbars` and replaced it with `horizontalScrollbar` and `verticalScrollbar`

## [1.0.0-beta.3] - 2017-02-21

### Added

- `moonstone/VideoPlayer` support for 5-way show/hide of media playback controls
- `moonstone/VideoPlayer` property `feedbackHideDelay`
- `moonstone/Slider` property `onKnobMove` to fire when the knob position changes, independently from the `moonstone/Slider` value
- `moonstone/Slider` properties `active`, `disabled`, `knobStep`, `onActivate`, `onDecrement`, and `onIncrement` as part of enabling 5-way support to `moonstone/Slider`, `moonstone/IncrementSlider` and the media slider for `moonstone/VideoPlayer`
- `moonstone/Slider` now supports `children` which are added to the `Slider`'s knob, and follow it as it moves
- `moonstone/ExpandableInput` properties `iconAfter` and `iconBefore` to display icons after and before the input, respectively
- `moonstone/Dialog` property `preserveCase`, which affects `title` text

### Changed

- `moonstone/IncrementSlider` to change when the buttons are held down
- `moonstone/Marquee` to allow disabled marquees to animate
- `moonstone/Dialog` to marquee `title` and `titleBelow`
- `moonstone/Marquee.MarqueeController` config option `startOnFocus` to `marqueeOnFocus`. `startOnFocus` is deprecated and will be removed in a future update.
- `moonstone/Button`, `moonstone/IconButton`, `moonstone/Item` to not forward `onClick` when `disabled`

### Fixed

- `moonstone/Marquee.MarqueeController` to start marquee on newly registered components when controller has focus and to restart synced marquees after completion
- `moonstone/Scroller` to recalculate when an expandable child opens
- `spotlightDisabled` property support for spottable moonstone components
- `moonstone/Popup` and `moonstone/ContextualPopupDecorator` so that when the popup is closed, spotlight focus returns to the control that had focus prior to the popup opening
- `moonstone/Input` to not get focus when disabled

## [1.0.0-beta.2] - 2017-01-30

### Added

- `moonstone/Panels.Panel` property `showChildren` to support deferring rendering the panel body until animation completes
- `moonstone/MarqueeDecorator` property `invalidateProps` that specifies which props cause the marquee distance to be invalidated
- developer-mode warnings to several components to warn when values are out-of-range
- `moonstone/Divider` property `spacing` which adjusts the amount of empty space above and below the `Divider`. `'normal'`, `'small'`, `'medium'`, `'large'`, and `'none'` are available.
- `moonstone/Picker` when `joined` the ability to be incremented and decremented by arrow keys
- `onSpotlightDisappear` event property support for spottable moonstone components
- `moonstone/VideoPlayer` property `titleHideDelay`

### Changed

- `moonstone/Panels.Panels` and variations to defer rendering the children of contained `Panel` instances until animation completes
- `moonstone/ProgressBar` properties `progress` and `backgroundProgress` to accept a number between 0 and 1
- `moonstone/Slider` and `moonstone/IncrementSlider` property `backgroundPercent` to `backgroundProgress` which now accepts a number between 0 and 1
- `moonstone/Slider` to not ignore `value` prop when it is the same as the previous value
- `moonstone/Picker` component's buttons to reverse their operation such that 'up' selects the previous item and 'down' the next
- `moonstone/Picker` and derivatives may now use numeric width, which represents the amount of characters to use for sizing. `width={4}` represents four characters, `2` for two characters, etc. `width` still accepts the size-name strings.
- `moonstone/Divider` to now behave as a simple horizontal line when no text content is provided
- `moonstone/Scroller` and other scrolling components to not display scrollbar controls by default
- `moonstone/DatePicker` and `moonstone/TimePicker` to emit `onChange` event whenever the value is changed, not just when the component is closed

### Removed

- `moonstone/ProgressBar` properties `min` and `max`

### Fixed

- `moonstone/IncrementSlider` so that the knob is spottable via pointer, and 5-way navigation between the knob and the increment/decrement buttons is functional
- `moonstone/Slider` and `moonstone/IncrementSlider` to not fire `onChange` for value changes from props

## [1.0.0-beta.1] - 2016-12-30

### Added

- `moonstone/VideoPlayer` and `moonstone/TooltipDecorator` components and samples
- `moonstone/Panels.Panels` property `onBack` to support `ui/Cancelable`
- `moonstone/VirtualFlexList` Work-In-Progress component to support variably sized rows or columns
- `moonstone/ExpandableItem` properties `autoClose` and `lockBottom`
- `moonstone/ExpandableList` properties `noAutoClose` and `noLockBottom`
- `moonstone/Picker` property `reverse`
- `moonstone/ContextualPopup` property `noAutoDismiss`
- `moonstone/Dialog` property `scrimType`
- `moonstone/Popup` property `spotlightRestrict`

### Changed

- `moonstone/Panels.Routable` to require a `navigate` configuration property indicating the event callback for back or cancel actions
- `moonstone/MarqueeController` focus/blur handling to start and stop synchronized `moonstone/Marquee` components
- `moonstone/ExpandableList` property `autoClose` to `closeOnSelect` to disambiguate it from the added `autoClose` on 5-way up
- `moonstone/ContextualPopupDecorator.ContextualPopupDecorator` component's `onCloseButtonClick` property to `onClose`
- `moonstone/Dialog` component's `onCloseButtonClicked` property to `onClose`
- `moonstone/Spinner` component's `center` and `middle` properties to a single `centered` property
	that applies both horizontal and vertical centering
- `moonstone/Popup.PopupBase` component's `onCloseButtonClicked` property to `onCloseButtonClick`
- `moonstone/Item.ItemOverlay` component's `autoHide` property to remove the `'no'` option. The same
	effect can be achieved by omitting the property or passing `null`.
- `moonstone/VirtualGridList` to be scrolled by page when navigating with a 5-way direction key
- `moonstone/Scroller`, `moonstone/VirtualList`, `moonstone/VirtualGridList` to no longer respond to mouse down/move/up events
- all Expandables to include a state arrow UI element
- `moonstone/LabeledItem` to support a `titleIcon` property which positions just after the title text
- `moonstone/Button` to include `moonstone/TooltipDecorator`
- `moonstone/Expandable` to support being managed, radio group-style, by a component wrapped with `RadioControllerDecorator` from `ui/RadioDecorator`
- `moonstone/Picker` to animate `moonstone/Marquee` children when any part of the `moonstone/Picker` is focused
- `moonstone/VirtualList` to mute its container instead of disabling it during scroll events
- `moonstone/VirtualList`, `moonstone/VirtualGridList`, and `moonstone/Scroller` to continue scrolling when holding down the paging controls
- `moonstone/VirtualList` to require a `component` prop and not have a default value
- `moonstone/Picker` to continuously change when a button is held down by adding `ui/Holdable`.

### Fixed

- `moonstone/Popup` and `moonstone/ContextualPopup` 5-way navigation behavior using spotlight.
- Bug where a synchronized marquee whose content fit the available space would prevent restarting of the marquees
- `moonstone/Input` to show an ellipsis on the correct side based on the text directionality of the `value` or `placeholder` content.
- `moonstone/VirtualList` and `moonstone/VirtualGridList` to prevent unwanted scrolling when focused with the pointer
- `moonstone/Picker` to remove fingernail when a the pointer is held down, but the pointer is moved off the `joined` picker.
- `moonstone/LabeledItem` to include marquee on both `title` and `label`, and be synchronized

## [1.0.0-alpha.5] - 2016-12-16

No changes.

## [1.0.0-alpha.4] - 2016-12-2

### Added

- `moonstone/Popup`, `moonstone/ContextualPopupDecorator`, `moonstone/Notification`, `moonstone/Dialog` and `moonstone/ExpandableInput` components
- `ItemOverlay` component to `moonstone/Item` module
- `marqueeCentered` prop to `moonstone/MarqueeDecorator` and `moonstone/MarqueeText`
- `placeholder` prop to `moonstone/Image`
- `moonstone/MarqueeController` component to synchronize multiple `moonstone/Marquee` components
- Non-latin locale support to all existing Moonstone components
- Language-specific font support
- `moonstone/IncrementSlider` now accepts customizable increment and decrement icons, as well as `moonstone/Slider` being more responsive to external styling

### Changed

- `moonstone/Input` component's `iconStart` and `iconEnd` properties to be `iconBefore` and `iconAfter`, respectively, for consistency with `moonstone/Item.ItemOverlay` naming
- `moonstone/Icon` and `moonstone/IconButton` so the `children` property supports both font-based icons and images
- the `checked` property to `selected` for consistency across the whole framework. This allows better interoperability when switching between various components.  Affects the following: `CheckboxItem`, `RadioItem`, `SelectableItem`, `Switch`, `SwitchItem`, and `ToggleItem`. Additionally, these now use `moonstone/Item.ItemOverlay` to position and handle their Icons.
- `moonstone/Slider` and `moonstone/IncrementSlider` to be more performant. No changes were made to
	the public API.
- `moonstone/GridListImageItem` so that a placeholder image displays while loading the image, and the caption and subcaption support marqueeing
- `moonstone/MoonstoneDecorator` to add `FloatingLayerDecorator`
- `moonstone/IncrementSlider` in vertical mode looks and works as expected.

### Removed

- LESS mixins that belong in `@enact/ui`, so that only moonstone-specific mixins are contained in
this module. When authoring components and importing mixins, only the local mixins need to be
imported, as they already import the general mixins.
- the `src` property from `moonstone/Icon` and `moonston/IconButton`. Use the support for URLs in
	the `children` property as noted above.
- the `height` property from `moonstone/IncrementSlider` and `moonstone/Slider`

### Fixed

- Joined picker so that it now has correct animation when using the mouse wheel
- Bug in DatePicker/TimePicker that prevented setting of value earlier than 1969

## [1.0.0-alpha.3] - 2016-11-8

### Added

- `moonstone/BodyText`, `moonstone/DatePicker`, `moonstone/DayPicker`, `moonstone/ExpandableItem`, `moonstone/Image`, and `moonstone/TimePicker` components
- `fullBleed` prop to `moonstone/Panels/Header`. When `true`, the header content is indented and the header lines are removed.
- Application close button to `moonstone/Panels`. Fires `onApplicationClose` when clicked. Can be omitted with the `noCloseButton` prop.
- `marqueeDisabled` prop to `moonstone/Picker`
- `padded` prop to `moonstone/RangePicker`
- `forceDirection` prop to `moonstone/Marquee`. Forces the direction of `moonstone/Marquee`. Useful for when `RTL` content cannot be auto detected.

### Changed

- `data` parameter passed to `component` prop of `VirtualList`.
- `moonstone/Expandable` into a submodule of `moonstone/ExpandableItem`
- `ExpandableList` to properly support selection
- `moonstone/Divider`'s `children` property to be optional
- `moonstone/ToggleItem`'s `inline` version to have a `max-width` of `240px`
- `moonstone/Input` to use `<div>` instead of `<label>` for wrapping components. No change to
	functionality, only markup.

### Removed

- `moonstone/ExpandableCheckboxItemGroup` in favor of `ExpandableList`

## [1.0.0-alpha.2] - 2016-10-21

This version includes a lot of refactoring from the previous release. Developers need to switch to the new enact-dev command-line tool.

### Added

- New components and HOCs: `moonstone/Scroller`, `moonstone/VirtualList`, `moonstone/VirtualGridList`, `moonstone/MarqueeText`, `moonstone/Spinner`, `moonstone/ExpandableCheckboxItemGroup`, `moonstone/MarqueeDecorator`
- New options for `ui/Toggleable` HOC
- Marquee support to many components
- Image support to `moonstone/Icon` and `moonstone/IconButton`
- `dismissOnEnter` prop for `moonstone/Input`
- Many more unit tests

### Changed

- Some props for UI state were renamed to have `default` prefix where state was managed by the component. (e.g. `defaultOpen`)

### Fixed

- Many components were fixed, polished, updated and documented
- Inline docs updated to be more consistent and comprehensive
