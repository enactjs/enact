---
title: i18n (Internationalization)
---

* [Overview](#1)
* [Using I18nDecorator](#2)
* [Updating Locale](./update-locale.md)
* [iLib](./ilib.md)

<a name="1"></a>
## Overview

This guide details how to use some of i18n library's features. For an overview of the modules supplied with the library please see [I18nDecorator](../../modules/i18n/I18nDecorator/) and [Uppercase](../../modules/i18n/Uppercase/). This library incorporates the [iLib](https://github.com/iLib-js/iLib) internationalization library.

<a name="2"></a>
## Using I18nDecorator

`I18nDecorator` is a Higher-order Component (HOC) that provides easy access to locale information. Applications wishing to receive locale information can wrap the root component with the HOC. It is not necessary to use `I18nDecorator` directly for applications using `MoonstoneDecorator`.

The HOC works by passing locale information to the app through `context` and CSS classes. It also has a function to update the locale through `context`.

## More Docs

If you wish to learn about more specific things like string translationm, string/number formatting, CSS, etc. Please checkout [iLib Docs](./ilib.md).

If you wish to learn about updating locales please checkout our [Updating Locale Docs](./update-locale.md).


