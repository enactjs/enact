---
title: Migrating to Enact 3.0
toc: 2
---

## Overview
This document lists changes between Enact versions 2.x and 3.0 likely to affect most apps.  If you
are coming from Enact 1.x, please [migrate to 2.0](./migrating-to-enact-2.md) and then consult
this guide.

## General Changes

### cli
`cli` must be upgraded to version `2.4.1` or newer.

### i18n
Apps that use `@enact/i18n` must install `ilib` as a dependency.  This includes apps that do not require `@enact/i18n` directly, but use themes or modules that do (list may or may not be complete, check module requirements):
* `@enact/analytics`
* `@enact/i18n` (of course!)
* `@enact/moonstone`

#### Example
```bash
npm install ilib@^14.4.0 --save
```
webOS TV developers can optionally use an alias for `ilib` that will provide the webOS-specific locale data for local development.  It is not required as the webOS build tools will automatically provide the correct locale data at build time.  Alias support is in `npm` version `6.9.0` or greater.

#### Example
```bash
npm install ilib@ilib-webos-tv@^14.4.0-webostv.1 --save
```

Import references using `@enact/i18n/ilib` must be updated to use `ilib`.

#### Example
##### 2.x
```js
import DateFactory from '@enact/i18n/ilib/lib/DateFactory';
import ilib from '@enact/i18n/ilib/lib/ilib';
```
##### 3.0
```js
import DateFactory from 'ilib/lib/DateFactory';
import ilib from 'ilib/lib/ilib';
```

### spotlight
`spotlight` will now focus disabled items.  You can use the `spotlightDisabled` prop on `spotlight/Spottable`
and `spotlight/SpotlightContainerDecorator` instances if focus absolutely must be prevented.

### webOS TV
Enact 3.0 no longer supports the 2019 TV platform or earlier versions.

## moonstone

### General
Many of the Moonstone components are affected by the change from using the `small` boolean prop to the `size` text prop.  Most of them are `size="small"` by default and have larger versions when using `size="large"`.

### Style
Various styling changes have been made to support new UI/UX designs for the webOS TV platform.  In
addition, some LESS variables have been changed or removed.  If you were importing `moonstone/styles/*.less`
files, you may need to address these changes.

#### colors
* `@moon-button-translucent-opacity` has been removed
* `@moon-button-letter-spacing` has been removed
* `@moon-checkbox-check-color` has been renamed to `@moon-checkbox-text-color`
* `@moon-checkbox-spotlight-bg-color` (`@moon-checkbox-bg-spotlight-color` in `colors-light.less`) has been renamed to `@moon-checkbox-focus-bg-color`
* `@moon-checkbox-spotlight-color` has been renamed to `@moon-checkbox-focus-text-color`
* `@moon-divider-border-color` has been removed
* `@moon-divider-text-color` has been removed
* `@moon-header-input-bg-color` has been removed
* `@moon-header-input-text-color` has been removed
* `@moon-input-border-active-outline-color` has been renamed to `@moon-input-border-active-shadow`
* `@moon-radio-item-indicator-border-color` has been removed
* `@moon-radio-item-spotlight-indicator-bg-color` has been renamed to `@moon-radio-item-focus-indicator-bg-color`
* `@moon-radio-item-spotlight-indicator-border-color` has been removed
* `@moon-radio-item-selected-indicator-border-color` has been removed
* `@moon-radio-item-selected-spotlight-indicator-color` has been renamed to `@moon-radio-item-selected-focus-indicator-color`
* `@moon-radio-item-selected-spotlight-indicator-bg-color` has been renamed to `@moon-radio-item-selected-focus-indicator-bg-color`
* `@moon-radio-item-selected-spotlight-indicator-border-color` has been removed
* `@moon-slider-nofocus-bg-color` has been renamed to `@moon-slider-bar-bg-color`
* `@moon-slider-focus-bg-color` has been renamed to `@moon-slider-focus-bar-bg-color`
* `@moon-slider-spotlight-bar-color` has been renamed to `@moon-slider-focus-bar-bg-color`
* `@moon-slider-spotlight-knob-color` has been renamed to `@moon-slider-focus-knob-bg-color`
* `@moon-slider-knob-active-bg-color` has been renamed to `@moon-slider-active-knob-bg-color`

#### variables
* `@moon-breadcrumb-text-size` has been replaced by `@moon-panels-breadcrumb-text-size`
* `@moon-breadcrumb-width` has been replaced by `@moon-panels-breadcrumb-width`
* `@moon-button-icon-end-margin` has been renamed to `@moon-button-icon-margin-end`
* `@moon-button-icon-end-margin` has been renamed to `@moon-button-icon-margin-end`
* `@moon-button-icon-position-after-end-margin` has been renamed to `@moon-button-icon-position-after-margin-end`
* `@moon-button-icon-position-after-end-margin` has been renamed to `@moon-button-icon-position-after-margin-end`
* `@moon-button-icon-position-after-small-end-margin` has been renamed to `@moon-button-icon-position-after-small-margin-end`
* `@moon-button-icon-position-after-small-end-margin` has been renamed to `@moon-button-icon-position-after-small-margin-end`
* `@moon-button-icon-position-after-small-start-margin` has been renamed to `@moon-button-icon-position-after-small-margin-start`
* `@moon-button-icon-position-after-small-start-margin` has been renamed to `@moon-button-icon-position-after-small-margin-start`
* `@moon-button-icon-position-after-start-margin` has been renamed to `@moon-button-icon-position-after-margin-start`
* `@moon-button-icon-position-after-start-margin` has been renamed to `@moon-button-icon-position-after-margin-start`
* `@moon-button-icon-small-end-margin` has been renamed to `@moon-button-icon-small-margin-end`
* `@moon-button-icon-small-end-margin` has been renamed to `@moon-button-icon-small-margin-end`
* `@moon-button-icon-small-start-margin` has been renamed to `@moon-button-icon-small-margin-start`
* `@moon-button-icon-small-start-margin` has been renamed to `@moon-button-icon-small-margin-start`
* `@moon-button-icon-start-margin` has been renamed to `@moon-button-icon-margin-start`
* `@moon-button-icon-start-margin` has been renamed to `@moon-button-icon-margin-start`
* `@moon-button-large-font-size-large` has been renamed to `@moon-button-font-size-large`
* `@moon-button-large-font-size` has been renamed to `@moon-button-font-size`
* `@moon-button-large-min-width` has been renamed to `@moon-button-min-width`
* `@moon-button-large-min-width` has been renamed to `@moon-button-min-width`
* `@moon-button-large-text-size` has been removed
* `@moon-button-small-text-size` has been removed
* `@moon-divider-border-width` has been removed
* `@moon-divider-font-family` has been removed
* `@moon-divider-font-size` has been removed
* `@moon-divider-font-style` has been removed
* `@moon-divider-font-weight` has been removed
* `@moon-divider-height` has been removed
* `@moon-divider-letter-spacing` has been removed
* `@moon-header-border-top-width` has been removed
* `@moon-header-height-large` has been removed
* `@moon-header-height-medium` has been replaced by `@moon-header-standard-height`
* `@moon-header-height-small` has been replaced by `@moon-header-compact-height`
* `@moon-header-sub-title-color` has been replaced by `@moon-header-title-below-text-color`
* `@moon-icon-button-size-large` has been removed
* `@moon-icon-button-size` has been removed
* `@moon-icon-button-small-size-large` has been removed
* `@moon-icon-button-small-size` has been removed
* `@moon-medium-header-line-height` has been replaced by `@moon-header-standard-title-line-height`
* `@moon-non-latin-divider-font-size` has been removed
* `@moon-non-latin-header-text-line-height` has been replaced by `@moon-non-latin-header-line-height`
* `@moon-non-latin-medium-header-line-height` has been replaced by `@moon-non-latin-header-standard-title-line-height`
* `@moon-non-latin-small-header-line-height` has been replaced by `@moon-non-latin-header-compact-title-line-height`
* `@moon-non-latin-sub-header-font-size` has been replaced by `@moon-non-latin-header-title-below-font-size`
* `@moon-non-latin-super-header-font-size` has been removed
* `@moon-notification-button-gap` has been removed
* `@moon-notification-out-border-radius` has been removed
* `@moon-small-header-font-size` has been replaced by `@moon-header-compact-font-size`
* `@moon-small-header-line-height` has been replaced by `@moon-header-compact-title-line-height`
* `@moon-small-header-sub-header-font-size` has been replaced by `@moon-header-compact-title-below-font-size`
* `@moon-sub-header-below-font-family` has been replaced by `@moon-header-sub-title-below-font-family`
* `@moon-sub-header-below-font-size` has been replaced by `@moon-header-sub-title-below-font-size`
* `@moon-sub-header-below-font-weight` has been replaced by `@moon-header-sub-title-below-font-weight`
* `@moon-sub-header-font-family` has been replaced by `@moon-header-title-below-font-family`
* `@moon-sub-header-font-size` has been replaced by `@moon-header-title-below-font-size`
* `@moon-sub-header-font-style` has been replaced by `@moon-header-title-below-font-style`
* `@moon-sub-header-font-weight` has been replaced by `@moon-header-title-below-font-weight`
* `@moon-sub-header-letter-spacing` has been replaced by `@moon-header-title-below-letter-spacing`
* `@moon-sub-header-line-height` has been removed
* `@moon-sub-header-text-color` has been replaced by `@moon-header-title-below-text-color`
* `@moon-sup-header-text-color` has been removed
* `@moon-super-header-font-family` has been replaced by `@moon-panels-breadcrumb-font-family`
* `@moon-super-header-font-size` has been removed
* `@moon-super-header-font-style` has been removed
* `@moon-super-header-font-weight` has been removed
* `@moon-super-header-letter-spacing` has been removed
* `@moon-super-header-line-height` has been removed
* `@moon-tooltip-h-padding` has been replaced by `@moon-tooltip-padding`

#### mixins
* `.moon-divider-text` has been removed
* `.moon-header-sub-title-below` has been replaced by `.moon-header-sub-title-below-text`
* `.moon-popup-header-text` has been removed
* `.moon-sub-header-text` has been replaced by `.moon-header-title-below-text`
* `.moon-super-header-text` has been removed

### `Button`
The `casing` prop has been removed.

### `Divider`
This component is replaced by `moonstone/Heading`.

### `Input`
The `small` boolean prop has been replaced by the `size` prop.

#### Example
##### 2.x
```js
<Input small />
```
##### 3.0
```js
<Input size="small" />
```

### `Input.InputBase`
The `focused` prop (used to indicate when the internal `<input>` had focus) has been removed.  If you
need to change the style of a `moonstone/Input` when this focus occurs, you can use the `:focus-within`
pseudo-selector.

#### Example
##### 2.x
`CustomInput.js`
```js
...
import {Input} from '@enact/moonstone';
import kind from '@enact/core/kind';

import * as css from './CustomInput.less';

const CustomInput = kind({
...
    styles: {
        className: 'customInput',
        css
    },
    computed: {
        className: ({focused, styler}) => styler.append('inputFocused')
    },
    render: (props) => (
        <InputBase {...props} />
    )

});
```
`CustomInput.less`
```css
.customInput {
    &.inputFocused {
        border: 10px solid pink;
    }
}
```
##### 3.0
`CustomInput.js`
```js
...
import {Input} from '@enact/moonstone';
import kind from '@enact/core/kind';

import * as css from './CustomInput.less';

const CustomInput = kind({
...
    styles: {
        className: 'customInput',
        css
    },
    render: (props) => (
        <InputBase {...props} />
    )

});
```
`CustomInput.less`
```css
.customInput {
    & :focus-within {
        border: 10px solid pink;
    }
}
```

### `Panels.Header`
The `casing` prop has been removed.

### `ToggleButton`
The `small` boolean prop has been replaced by the `size` prop.

#### Example
##### 2.x
```js
<ToggleButton small />
```
##### 3.0
```js
<ToggleButton size="small" />
```

### `VirtualList`
The `isItemDisabled` prop has been removed.

### `VirtualList.VirtualGridList`
The `isItemDisabled` prop has been removed.

## ui

### `Button.ButtonBase`
The `small` boolean prop has been replaced by the `size` prop.

#### Example
##### 2.x
```js
...
import {ButtonBase as Button} from '@enact/ui/Button';
...
<Button small />
...
```
##### 3.0
```js
...
import {ButtonBase as Button} from '@enact/ui/Button';
...
<Button size="small" />
...
```

### `Icon.IconBase`
The `small` boolean prop has been replaced by the `size` prop.

#### Example
##### 2.x
```js
...
import {IconBase as Icon} from '@enact/ui/Icon';
...
<Icon small />
...
```
##### 3.0
```js
...
import {IconBase as Icon} from '@enact/ui/Icon';
...
<Icon size="small" />
...
```

### `IconButton.IconButtonBase`
The `small` boolean prop has been replaced by the `size` prop.

#### Example
##### 2.x
```js
...
import {IconButtonBase as IconButton} from '@enact/ui/IconButton';
...
<IconButton small />
...
```
##### 3.0
```js
...
import {IconButtonBase as IconButton} from '@enact/ui/IconButton';
...
<IconButton size="small" />
...
```

### `LabeledIcon.LabeledIconBase`
The `small` boolean prop has been replaced by the `size` prop.

#### Example
##### 2.x
```js
...
import {LabeledIconBase as LabeledIcon} from '@enact/ui/LabeledIcon';
...
<LabeledIcon small />
...
```
##### 3.0
```js
...
import {LabeledIconBase as LabeledIcon} from '@enact/ui/LabeledIcon';
...
<LabeledIcon size="small" />
...
```
