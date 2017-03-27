---
title: i18n (Internationalization)
---

* [Overview](#1)
* [Using I18nDecorator](#2)
* [Locale-Specific CSS](#3)
* [Translating Strings using $L()](#4)
* [Updating Locale](./update-locale.md)
* [iLib](./ilib.md)

<a name="1"></a>
## Overview

This guide details how to use some of i18n library's features. For an overview of the modules supplied with the library please see [I18nDecorator](../../modules/i18n/I18nDecorator/) and [Uppercase](../../modules/i18n/Uppercase/). This library incorporates the [iLib](https://github.com/iLib-js/iLib) internationalization library.

<a name="2"></a>
## Using I18nDecorator

`I18nDecorator` is a Higher-order Component (HOC) that provides easy access to locale information. Applications wishing to receive locale information can wrap the root component with the HOC. It is not necessary to use `I18nDecorator` directly for applications using `MoonstoneDecorator`.

The HOC works by passing locale information to the app through `context` and CSS classes. It contains two properties inside it's `context`. 

`rtl` -  if true then the location is an rtl language.
`updateLocale` - a function to update the locale of the app.

<a name="3"></a>
## Locale-Specific CSS

When the `ilib` library is loaded into your app, it automatically applies
some CSS classes to the root of your.  You can use these to write
locale-specific CSS override classes using the `global` specifier.  These classes
may indicate things such as whether the locale uses a right-to-left orientation
or whether it uses non-Latin fonts.

Classes added to the body are:

* `enact-locale-non-latin`, if the locale uses a non-Latin font

* `enact-locale-right-to-left`, if the locale is oriented right-to-left (in the
	absence of this class, the default orientation is left-to-right)

* `enact-locale-non-italic`, if the locale uses a script that is not typically
	italicized, such as Chinese or Thai.  (You may also use this in your own
	classes to enable or disable italicization.)

The following classes allow you to switch functionality based on the language,
script, or region of the current UI locale:

* `enact-locale-<language>`
* `enact-locale-<script>`
* `enact-locale-<region>`
* `enact-locale-<language>-<script>`
* `enact-locale-<language>-<region>`
* `enact-locale-<language>-<script>-<region>`

So for the United States you would see this `enact-locale-en enact-locale-en-US enact-locale-US`.

Here's an example from the Moonstone package in which locale-specific CSS is
used to turn on right-to-left orientation for a widget:

```css
	:global(.enact-locale-right-to-left) & {
		flex-direction: row-reverse;
	}
```

<a name="4"></a>
## Translating Strings using $L()

`$L()` is a convenience function wrapping `ilib/ResBundle` that is exported by the
main Enact library. When the decorator is applied, it will update this method to support
`ResBundle`.

It can be used as follows:

```javascript
import {$L} from '@enact/i18n';

const translatedString = $L('Some String');

// You can also use it inside jsx
<Panel title={$L('Some Title')}>
	<div>{$L('Some Children')}</div>
	<div>{translatedString}</div>
</Panel>
```

In order for the translations to be successful, a locale-specific translation file must be available. If a suitable translation cannot be found, the original string will be returned.

Each translatable string in your application should be wrapped in a call to
`$L()`.  For example:

You will need to extract the strings inside the `$L()` calls in your source
code and write them out to a `strings.json` file for each locale.  (Most likely
you'll want to create a script to do this.)

The `strings.json` files should contain the translations in JSON format, i.e.:

```javascript
	{
		"source string1": "translated string1",
		"source string2": "translated string2",
		...
	} 
```

Many localization houses are able to provide translations in this format.

The string returned from a call to `$L()` will be the translated string for the
current UI locale. If a different locale or a bundle with a different name is
needed, use `ResBundle` directly instead of `$L()`.

## More Docs

If you wish to learn about more specific things like string translation, string/number formatting, CSS, etc. Please checkout [iLib Docs](./ilib.md).

If you wish to learn about updating locales please checkout our [Updating Locale Docs](./update-locale.md).
