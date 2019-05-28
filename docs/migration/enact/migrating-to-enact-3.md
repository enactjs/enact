---
title: Migrating to Enact 3.0
---

## Overview
This document lists changes between Enact versions 2.x and 3.0 likely to affect most apps.  If you
are coming from Enact 1.x, please [migrate to 2.0](./migrating-to-enact-2.md) and then consult
this guide.

## General Changes

### spotlight
Apps can now use `spotlight` to focus disabled items.

### webOS TV
Enact 3.0 no longer supports the 2019 TV platform or earlier versions.

## moonstone

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