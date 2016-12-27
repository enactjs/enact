---
title: Migrating i18n
---

### Adding Base Internationalization Support

The `I18nDecorator` is usually applied at the root level of an application and provides basic internationalization support to your application. It adds locale and text directionality CSS classes, provides automatic re-rendering when the locale changes via the `onlanguagechange` event, and adds [`context`](https://facebook.github.io/react/docs/context.html "React Context") parameters for downstream components to [update the locale](#updating-the-locale) or [determine the current text directionality](#current-locale-text-directionality).

> **Note:** `MoonstoneDecorator` automatically applies `I18nDecorator` by default but can be disabled by settings its `i18n` config property to `false`.

### ilib Modules

`ilib` modules can be accessed via different paths.

Previous: `enyo-ilib/[MODULE_NAME]`

Current: `@enact/i18n/ilib/lib/[MODULE_NAME]`

### String translation

Previous: `$L()`

Current: `$L()`

```
import {$L} from '@enact/i18n';

const MyTranslatedString = $L('Hello World');
```

### String Translation - ilib string

Previous: `$L.rb()`

Current: `toIString()`.

```
import {toIString} from '@enact/i18n';

const MyIString = toIString('Hello IString');
const MyIStringText = MyIString.toString();
```

### Updating the locale

Previous: The `updateLocale()` method of the `enyo/i18n` library could be invoked

Current: The `updateLocale()` method is available for any component whose ancestor is wrapped with the `I18nDecorator`, which provides this method as part of the 

```
import Button from '@enact/moonstone/Button';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import React from 'react';

class MyComponent extends React.Component {
	static contextTypes = contextTypes

	setLocale = () => (locale) => {
		const {updateLocale} = this.context;
		updateLocale(locale);
	}

	render () {
		const {updateLocale} = this.context;

		return (
			<div>
				<Button onClick={setLocale('ar-SA')} small>ar-SA</Button>
				<Button onClick={setLocale('en-US')} small>en-US</Button>
				<Button onClick={setLocale('ko-KR')} small>ko-KR</Button>
				<Button onClick={setLocale('th-TH')} small>th-TH</Button>
			</div>
		);
	}
}
```

### Current Locale Text Directionality

Previous: Components could check the value of `this.rtl`

Current: Using `context`, any component whose ancestor is wrapped with `I18nDecorator` can check the value of `rtl`. Additionally, the value of `context.rtl` can be updated by any intermediary component, which will affect all descendants.

```
import Button from '@enact/moonstone/Button';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import React from 'react';

class MyComponent extends React.Component {
	static contextTypes = contextTypes

	render () {
		const {rtl} = this.context;

		return (
			<Button>My {rtl ? 'RTL' : 'LTR'} button</Button>
		);
	}
}
```

### Determine Text Directionality

Previous: `isRtl()` provided by `enyo/utils`

Current: `isRtlText()` provided by `@enact/i18n`

```
import {isRtlText} from '@enact/i18n';

const isHebrewRtl = isRtlText('שועל החום');
const isEnglishRtl = isRtlText('LTR Text');
```
