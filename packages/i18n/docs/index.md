---
title: i18n (Internationalization)
---

* [Overview](#1)
* [Using I18nDecorator](#2)
* [I18n Classes](#3)
* [Translating Strings](#4)
* [Updating Locale](./UpdateLocale.md)
* [iLib](./ilib.md)

<a name="1"></a>
## Overview

This guide details how to use some of i18n library's features. For an overview of the modules supplied with the library please see [I18nDecorator](../../modules/i18n/I18nDecorator/) and [Uppercase](../../modules/i18n/Uppercase/). This library incorporates the [iLib](https://github.com/iLib-js/iLib) internationalization library.

<a name="2"></a>
## Using I18nDecorator

`I18nDecorator` is a Higher-order Component (HOC) that provides easy access to locale information. Applications wishing to receive locale information can wrap the root component with the HOC. It is not necessary to use `I18nDecorator` directly for applications using `MoonstoneDecorator`.

The HOC works by passing locale information to the app through `context` and CSS classes. It also has a function to update the locale through `context`.

<a name="3"></a>
## I18n Classes

`I18nDecorator` will apply CSS classes at the root element of your app. For example, if your locale was `en-US` for "English - United States", your classes would contain `enact-locale-en enact-locale-en-US enact-locale-US`. Using these classes allows for adapting the app to use specific layout or fonts depending upon locale.

Additionally, a class is applied if a language is rendered right-to-left. For example, if the locale were `ur-PK`, the root element would have the following classes: `enact-locale-non-latin enact-locale-non-italic enact-locale-right-to-left enact-locale-ur enact-locale-ur-PK enact-locale-PK`.

<a name="4"></a>
## Translating Strings

Once you have `i18nDecorator` on your app you now have access to internationalization inside your app. Use the `$L` library to translate strings.

`$L` is a very simple and powerful function that, with the appopriate translation files, translate your string or key/value object to the current locale.

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
