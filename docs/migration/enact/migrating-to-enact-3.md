---
title: Migrating to Enact 3.0
---

## Overview
This document lists changes between Enact versions 2.x and 3.0 likely to affect most apps.  If you
are coming from Enact 1.x, please [migrate to 2.0](./migrating-to-enact-2.md) and then consult
this guide.

## General Changes

### spotlight
`spotlight` will now focus disabled items.  You can use the `spotlightDisabled` prop on `spotlight/Spottable`
and `spotlight/SpotlightContainerDecorator` instances if focus absolutely must be prevented.

### webOS TV
Enact 3.0 no longer supports the 2019 TV platform or earlier versions.

## moonstone

### Style
Various styling changes have been made to support new UI/UX designs for the webOS TV platform.  In
addition, some LESS variables have been changed or removed.  If you were importing `moonstone/styles/*.less`
files, you may need to address these changes.

#### colors
* `@moon-button-translucent-opacity` has been removed
* `@moon-checkbox-check-color` has been renamed to `@moon-checkbox-text-color`
* `@moon-checkbox-spotlight-bg-color` (`@moon-checkbox-bg-spotlight-color` in `colors-light.less`) has been renamed to `@moon-checkbox-focus-bg-color`
* `@moon-checkbox-spotlight-color` has been renamed to `@moon-checkbox-focus-text-color`
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

#### variables
* `@moon-button-large-font-size` has been renamed to `@moon-button-font-size`
* `@moon-button-large-font-size-large` has been renamed to `@moon-button-font-size-large`
* `@moon-header-border-top-width` has been removed
* `@moon-button-large-text-size` has been removed
* `@moon-button-small-text-size` has been removed
* `@moon-button-large-min-width` has been renamed to `@moon-button-min-width`
* `@moon-icon-button-size` has been removed
* `@moon-icon-button-size-large` has been removed
* `@moon-icon-button-small-size` has been removed
* `@moon-icon-button-small-size-large` has been removed
* `@moon-notification-out-border-radius` has been removed
* `@moon-notification-button-gap` has been removed
* `@moon-tooltip-h-padding` has been replaced by `@moon-tooltip-padding`

### `Button`
The `casing` prop has been removed.

### `Divider`
This component is replaced by `moonstone/Heading`.

### `Input`
The `small` boolean prop has been replaced by the `size` prop.

#### Example
##### 2.x
```
<Input small />
```
##### 3.0
```
<Input size="small" />
```

### `Input.InputBase`
The `focused` prop (used to indicate when the internal `<input>` had focus) has been removed.  If you
need to change the style of a `moonstone/Input` when this focus occurs, you can use the `:focus-within`
pseudo-selector.

#### Example
##### 2.x
`CustomInput.js`
```
...
import {Input} from '@enact/moonstone';
import kind from '@enact/core/kind';

import css from './CustomInput.less';

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
```
.customInput {
    &.inputFocused {
        border: 10px solid pink;
    }
}
```
##### 3.0
`CustomInput.js`
```
...
import {Input} from '@enact/moonstone';
import kind from '@enact/core/kind';

import css from './CustomInput.less';

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
```
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
```
<ToggleButton small />
```
##### 3.0
```
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
```
...
import {ButtonBase as Button} from '@enact/ui/Button';
...
<Button small />
...
```
##### 3.0
```
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
```
...
import {IconBase as Icon} from '@enact/ui/Icon';
...
<Icon small />
...
```
##### 3.0
```
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
```
...
import {IconButtonBase as IconButton} from '@enact/ui/IconButton';
...
<IconButton small />
...
```
##### 3.0
```
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
```
...
import {LabeledIconBase as LabeledIcon} from '@enact/ui/LabeledIcon';
...
<LabeledIcon small />
...
```
##### 3.0
```
...
import {LabeledIconBase as LabeledIcon} from '@enact/ui/LabeledIcon';
...
<LabeledIcon size="small" />
...
```