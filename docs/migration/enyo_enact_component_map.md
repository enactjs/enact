---
title: Enyo to Enact Component Map
---

> **Enact version**: beta-1

### Utilities
|Enyo   |Enact  |Notes  |
|:----: |:----: |------:|
| `animation` | use `@enact/ui/Transition` | |
| `dispatcher` | use React state management/Redux | |
| `dom` | | not required |
| `hooks` | | not required |
| `jobs` | `jobs` | provided in `@enact/core` module |
| `json` | | not required |
| `resolution` | `resolution` | provided in `@enact/ui` module |
| `utils` | various | spread among `@enact/core` and `@enact/i18n` modules |

### Core Components

|Enyo   |Enact  |Notes  |
|:----: |:----: |------:|
| `Application` | | not required (index.js + root element = application) |
| `Animator` | use `@enact/ui/Transition` | |
| `Audio` | * | under development |
| `Collection` | use React state management/Redux | |
| `DataRepeater` | `Repeater` | |
| `Model` | use React state management/Redux | |
| `NewDataList` | `VirtualList` | |
| `Signals` | use React state management/Redux | |

### Layout Components

|Enyo   |Enact  |Notes  |
|:----: |:----: |------:|
| `Fittable*` | use CSS (i.e. flexbox) | |

### Moonstone Components

> **Note**: `@enact/moonstone` is not an identical match to Enyo Moonstone, and we are not aiming for 100% feature equivalence.
We are trying to make smart decisions about the features and components that were not used (or rarely used) and are easily
implemented at the application level.  Please refer to the documentation for each `@enact/moonstone` component to get details on
how to use it.

|Enyo   |Enact  |Notes  |
|:----: |:----: |------:|
| `Accordion` | `ExpandableItem` | |
| `AnimatedButton` | | deprecated |
| `ApplicationCloseButton` | `ApplicationCloseButton` | provided in `@enact/moonstone/Panels` |
| `AudioPlayback` | | previously work-in-progress (WIP)/unused |
| `BodyText` | `BodyText` | |
| `BreadCrumbArranger` | `BreadCrumbArranger` | provided in `@enact/moonstone/Panels` |
| `Button` | `Button` | |
| `Calendar` | | unused<sup>1</sup> |
| `CaptionDecorator` | | unused<sup>1</sup> |
| `ChannelInfo` | | deprecated |
| `Checkbox` | use `@enact/ui/Toggleable` HoC or `@enact/moonstone/CheckboxItem` | |
| `CheckboxItem` | `CheckboxItem` | |
| `ClampedText` | | unused<sup>1</sup> |
| `Clock` | * | under review |
| `ContextualPopup` | `ContextualPopup` | provided in `@enact/moonstone/ContextualPopupDecorator` |
| `ContextualPopupButton` | | deprecated |
| `ContextualPopupDecorator` | `ContextualPopupDecorator` | |
| `DataGridList` | `VirtualGridList` | |
| `DataList` | `VirtualList` | |
| `DataTable` | | unused<sup>1</sup> |
| `DatePicker` | `DatePicker` | |
| `DateTimePickerBase` | `Picker`s will have separate base components | |
| `DayPicker` | `DayPicker` | |
| `Dialog` | `Dialog` | |
| `Divider` | `Divider` | |
| `Drawers` | * | under review |
| `ExpandableDataPicker` | `ExpandableList` | |
| `ExpandableInput` | `ExpandableInput` | |
| `ExpandableIntegerPicker` | `ExpandablePicker` | |
| `ExpandableListItem` | `ExpandableItem` | |
| `ExpandablePicker` | `ExpandableList` | |
| `ExpandableText` | | unused<sup>1</sup> |
| `FormCheckbox` | * | under review |
| `GridListImageItem` | `GridListImageItem` | provided in `@enact/moonstone/VirtualList` |
| `Header` | `Header` | provided in `@enact/moonstone/Panels` |
| `HighlightText` | | unused<sup>1</sup> |
| `History` | use `@enact/ui/Cancelable` HoC for history-type activities | |
| `HistorySupport` | use `@enact/ui/Cancelable` HoC for history-type activities | |
| `Icon` | `Icon` | |
| `IconButton` | `IconButton` | |
| `Image` | `Image` | |
| `ImageItem` | | unused<sup>1</sup> |
| `Input` | `Input` | |
| `InputDecorator` | | deprecated; decorator functionality is now part of `@enact/moonstone/Input` |
| `IntegerPicker` | `RangePicker` with `orientation: vertical` and `vertical: true` | internal usage<sup>2</sup> |
| `Item` | `Item` | |
| `ItemOverlay` | `ItemOverlay` | provided in `@enact/moonstone/Item` |
| `LabeledTextItem` | `LabeledItem` | |
| `LightPanels` | `ViewManager` | |
| `ListActions` | * | under development |
| `Marquee` | `Marquee` | |
| `MoonAnimator` | | unwanted<sup>3</sup> |
| `MoonArranger` | | unwanted<sup>3</sup> |
| `NewPagingControl` | | see `PagingControl` |
| `ObjectActionDecorator` | | unwanted<sup>3</sup> |
| `Overlay` | use `@enact/ui/Layerable` HoC | under review |
| `PagingControl` | use `@enact/moonstone/IconButton` and custom handlers | |
| `Panel` | `Panel` | provided in `@enact/moonstone/Panels` |
| `Panels` | `Panels` | |
| `PlaylistSupport` | | unused<sup>1</sup> |
| `Popup` | `Popup` | |
| `ProgressBar` | `ProgressBar` | |
| `ProgressButton` | | unused<sup>1</sup> |
| `RadioItem` | `RadioItem` | |
| `RadioItemGroup` | use `@enact/ui/Group` HoC with `@enact/moonstone/RadioItem`s | |
| `RichText` | | unused<sup>1</sup> |
| `Scrim` | `Scrim` | provided in `@enact/ui/FloatingLayer` |
| `Scrollable` | `Scrollable` | HoC provided in `@enact/moonstone/Scroller` |
| `ScrollControls` | use `Scrollable` HoC | |
| `Scroller` | `Scroller` | |
| `ScrollStrategy` | use `Scrollable` HoC | |
| `ScrollThumb` | | internal usage<sup>2</sup> |
| `SelectableItem` | `SelectableItem` | |
| `SimpleIntegerPicker` | `RangePicker` | use `joined=true` |
| `SimplePicker` | `Picker` | |
| `Slider` | `Slider` (and `IncrementSlider` for jump buttons) | |
| `Spinner` | `Spinner` | |
| `StyleAnimator` | | unused<sup>1</sup> |
| `Table` | | unused<sup>1</sup> |
| `TextArea` | | unused<sup>1</sup> |
| `TimePicker` | `TimePicker` | |
| `ToggleButton` | `ToggleButton` | |
| `ToggleItem` | `SwitchItem` or `ToggleItem` | `@enact/moonstone/SwitchItem` is a specific extension of `@enact/moonstone/ToggleItem` |
| `ToggleSwitch` | `Switch` | |
| `ToggleText` | | unused<sup>1</sup> |
| `Tooltip` | `Tooltip` | |
| `TooltipDecorator` | n/a | deprecated |
| `VideoFeedback` | | unused<sup>1</sup> |
| `VideoFullscreenToggleButton` | | unused<sup>1</sup> |
| `VideoInfoBackground` | | unused<sup>1</sup> |
| `VideoInfoHeader` | | unused<sup>1</sup> |
| `VideoPlayer` | * | under review |
| `VideoTransportSlider` | | unused<sup>1</sup> |

<sup>1</sup>- Internal review of Moonstone applications revealed no usage of the
component.

<sup>2</sup>- The component is generally only used internally by the framework.

<sup>3</sup>- Internal review found dissatisfaction with the component.
