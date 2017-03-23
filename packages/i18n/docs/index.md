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

The HOC works by passing locale information like fonts and styling. It also has a function to update the locale through `context`.

<a name="3"></a>
## I18n Classes

`I18nDecorator` will apply CSS classes at the top of your app. For example, if your locale was `en-US` for "English - United States", your classes would contain `enact-locale-en enact-locale-en-US enact-locale-US`. This will make sure your CSS matches the locale your user is in.

If we updated the local to something like `ur-PK` the classes we previously had would be replaced with `enact-locale-non-latin enact-locale-non-italic enact-locale-right-to-left enact-locale-ur enact-locale-ur-PK enact-locale-PK`. This updates our app to have the correct look and feel.

<a name="4"></a>
## Translating Strings

Once you have `i18nDecorator` on your app you now have access to internationalization, inside your app. If you wish to translate your strings we provide you with `$L`. 

`$L` is a very simple and powerful function that will translate your string or key/value object to the current locale.

It's just a javascript function so you can import it and use it anywhere inside your app.

```javascript
import {$L} from '@enact/i18n';

const translatedString = $L('Some String');

// You can also use it inside jsx
<Panel title={$L('Some Title')}>
    <div>{$L('Some Children')}</div>
    <div>{translatedString}</div>
</Panel>
```
