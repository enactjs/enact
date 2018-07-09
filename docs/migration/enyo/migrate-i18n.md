---
title: Migrating i18n
---

### Adding Base Internationalization Support

The `I18nDecorator` is usually applied at the root level of an application and provides basic internationalization support to your application. It adds locale and text directionality CSS classes, provides automatic re-rendering when the locale changes via the `onlanguagechange` event, and adds [`context`](https://facebook.github.io/react/docs/context.html "React Context") parameters for downstream components to [update the locale](#updating-the-locale) or [determine the current text directionality](#current-locale-text-directionality).

> **Note:** `MoonstoneDecorator` automatically applies `I18nDecorator` by default but can be disabled by settings its `i18n` config property to `false`.

### ilib Modules

`ilib` modules are supplied with the `i18n` library but can be imported using an `enact cli` provided shortcut:

**Previous:** `enyo-ilib/[MODULE_NAME]`

**Current:** `ilib/[MODULE_NAME]`

### String translation

**Previous:** `$L()`

**Current:** `$L()`

```
import $L from '@enact/i18n/$L';

const MyTranslatedString = $L('Hello World');
```

### String Translation - ilib string

**Previous:** `$L.rb()`

**Current:** `toIString()`

```
import {toIString} from '@enact/i18n/$L';

const MyIString = toIString('Hello IString');
const MyIStringText = MyIString.toString();
```

### Updating the locale

**Previous:** The `updateLocale()` method of the `enyo/i18n` library could be invoked

**Current:** The `updateLocale()` method is available for any component whose ancestor is wrapped with the `I18nDecorator`, which provides this method as part of the [Context API](https://reactjs.org/docs/context.html). `I18nDecorator` provides easy access via the `I18nContextDecorator` HOC which can provide the locale, rtl state, and `updateLocale` method via props by specifying the `localeProp`, `rtlProp`, and `updateLocaleProp` configuration options, respectively.

```
import Button from '@enact/moonstone/Button';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import React from 'react';

const MyComponent = I18nContextDecorator(
	{updateLocaleProp: 'updateLocale'},
	class extends React.Component {
		setLocale = (locale) => () => {
			const {updateLocale} = this.props;
			updateLocale(locale);
		}

		render () {
			return (
				<div>
					<Button onClick={this.setLocale('ar-SA')} small>ar-SA</Button>
					<Button onClick={this.setLocale('en-US')} small>en-US</Button>
					<Button onClick={this.setLocale('ko-KR')} small>ko-KR</Button>
					<Button onClick={this.setLocale('th-TH')} small>th-TH</Button>
				</div>
			);
		}
	}
);
```

### Current Locale Text Directionality

**Previous:** Components could check the value of `this.rtl`

**Current:** The `rtl` state method is available for any component whose ancestor is wrapped with the `I18nDecorator`, which provides this value as part of the [Context API](https://reactjs.org/docs/context.html). `I18nDecorator` provides easy access via the `I18nContextDecorator` HOC which can provide the locale, rtl state, and `updateLocale` method via props by specifying the `localeProp`, `rtlProp`, and `updateLocaleProp` configuration options, respectively.

```
import Button from '@enact/moonstone/Button';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import React from 'react';

const MyComponent = I18nContextDecorator(
	{rtlProp: 'rtl'},
	class extends React.Component {
		render () {
			const {rtl} = this.props;

			return (
				<Button>My {rtl ? 'RTL' : 'LTR'} button</Button>
			);
		}
	}
);
```

### Determine Text Directionality

**Previous:** `isRtl()` provided by `enyo/utils`

**Current:** `isRtlText()` provided by `@enact/i18n/util`

```
import {isRtlText} from '@enact/i18n/util';

const isHebrewRtl = isRtlText('שועל החום');
const isEnglishRtl = isRtlText('LTR Text');
```

### i18n Classes

**Previous:** `enyo-locale-...`

**Current:** `enact-locale-...`

```css
.div .enact-locale-non-latin {
    background-color: green;
}
```
