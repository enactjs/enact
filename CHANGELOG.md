# Change Log

The following is a curated list of changes in the Enact project, newest changes on the top.

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
- `moonstone/Header` to use a slightly smaller font size for `title` in non-latin locales and a line-height for `titleBelow` and `subTitleBelow` that better meets the needs of tall-glyph languages like Tamil and Thai, as well as latin locales
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
- `moonstone/Header` to layout `titleBelow` and `subTitleBelow` correctly
- `moonstone/Header` to use correct font-weight for `subTitleBelow`
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
- `moonstone/Header` to layout header row correctly in `standard` type
- `moonstone/Input` to not dismiss on-screen keyboard when dragging cursor out of input box
- `moonstone/Header` RTL `line-height` issue
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
- `moonstone/Header` to apply `marqueeOn` prop to `subTitleBelow` and `titleBelow`
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
- `moonstone/Header` to set the value of `marqueeOn` for all types of headers

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
