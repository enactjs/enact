---
title: iLib
---

Our `i18n` library is based on the wonderful [iLib](https://github.com/iLib-js/iLib) library. It provides many useful tools for things like string translation, date/time formatting, number parsing, etc.

We provide `iLib` for use through our `i18n` module.

You can use it like this:
```javascript 
import DateFmt from '@enact/i18n/ilib/lib/DateFmt';

const formatter = new DateFmt({
		date: 'dmwy',
		length: 'full',
		timezone: 'local',
		useNative: false
});
```

If you wish to learn more about `ilib` checkout their [github](https://github.com/iLib-js/iLib) and [docs](https://github.com/iLib-js/iLib/blob/master/doc/index.md).
