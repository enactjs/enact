---
title: iLib
---

Our `i18n` library relies on the wonderful [iLib](https://github.com/iLib-js/iLib) library. It provides many useful tools for things like string translation, date/time formatting, number parsing, etc.

You must install [`iLib`](https://www.npmjs.com/package/ilib) as a dependency in your application to use the `i18n` module:

```bash
npm install ilib@^14.2.0
```

We will cover a good deal of how to use `iLib` inside your `Enact` app below, but we will not cover everything.

If you wish to learn more about `ilib` checkout their [github](https://github.com/iLib-js/iLib) and [docs](https://github.com/iLib-js/iLib/blob/master/doc/index.md).

## Accessing iLib from Enact

You can use iLib like this:

```javascript
import DateFmt from 'ilib/lib/DateFmt';

const formatter = new DateFmt({
	date: 'dmwy',
	length: 'full',
	timezone: 'local',
	useNative: false
});
```
## Translating Strings

### ResBundle

`ilib/ResBundle`, the resource bundle class, represents a set of translated
strings.  Each app has its own resource bundle.  These bundles are loaded
dynamically, with each one having a name and locale.

The locale may be specified as an option in the constructor.

```javascript
	import ResBundle from 'ilib/lib/ResBundle';
	...
	const rb = new ResBundle({locale: "ko-KR"});
```

In practical terms, `ResBundle`'s most important method is `getString()`.

```javascript
	const str = toIString("My Label");
```

The actual data contained in the bundle is stored under the application's
`resources` directory. Within `resources` is a hierarchy of subdirectories
named for locales. `iLib` reads translated strings from `strings.json` files
found in these directories.

In the layered structure of the locale directories, values from deeper levels
override those from nearer the surface, as in the following example:

```
resources/
	en/
		strings.json - shared strings for all English
		appinfo.json - application description
		CA/
			strings.json - only strings special to Canada
		GB/
			strings.json - only strings special to Great Britain
```

For the `en-GB` locale, if a string value is defined in both
`/resources/en/strings.json` and `/resources/en/GB/strings.json`, the value from
the latter (more-specific) file will override the value from the former file.

It's worth noting that, in addition to strings, other localized files (such as
`appinfo.json`) may also be placed in these hierarchical directories, with their
data following the same rules of precedence.  In the case of `appinfo.json`, the
locale-specific files will typically include values for "title", "keywords", and
"description".  The other properties will keep the values inherited from the
app's top-level `appinfo.json`.

`$L()` is a convience method for `ResBundle`, it is described in the main section of the `i18n` docs [here](../index.md)

## Using iLib for formatting

#### String Formatting

`ilib/IString` is used to format strings.  You will not generally need to require `IString`
directly to use it. Its `format()` method allows for
interpolation of named parameters into the string.  The following syntax is
recommended:

```javascript
	import {toIString} from 'i18n/$L'

	const template = toIString("There are {n} objects.");
	const str = template.format({n: 15});
```

`str` now has the value `"There are 15 objects."`

Note that we are populating `template` by calling `toIString()` on the
localized resource bundle `$L.rb`.  This is because `format()` accepts an
`ilib/IString` object, but not an intrinsic JavaScript string.  (A call to
`toIString()` on a resource bundle returns an instance of `ilib/IString`, while
a call to `$L()` returns an intrinsic JavaScript string.)

`ilib/IString` has the same methods as an intrinsic string, and in many cases may
be used as a substitute.  For those places that require an intrinsic string, you
must call the `toString()` method to convert the `ilib/IString` to an intrinsic
string.

#### Handling Plurals

`ilib/IString` uses the `formatChoice()` method to handle plurals.  This allows
translators to adjust strings to handle plurals properly for their respective
languages.

```javascript
	const number = 3;
	const template = toIString( "0#There are no objects.|1#There is 1 object.|#There are {n} objects.");
	const str = template.formatChoice(number, {n: number});
```

`str` now has the value `"There are 3 objects."`

`formatChoice()` also supports number classes ("zero", "one", "two", "few" and
"many") for languages with complex rules for pluralization, such as Russian or
Serbian.

```javascript
	const template = toIString( "0#There are no objects.|few#There are a few ({n}) objects.|#There are many objects. ({n})");
```

### Dates and Times

The formatting of dates and times can differ widely from one locale to the next:

```
------------------------------------
 Locale    Format
--------- --------------------------
 en-US     Mo 11/12/2012 2:30pm

 en-CA     Mo 12/11/2012 2:30 PM

 de-DE     14:30 Mo 12.11.2012

 zh-CN     2012-11-12周一下午2:30

 it-IT     Lu 12/11/2012 14.30
------------------------------------
```

In `iLib`, the `ilib/DateFmt` class is used to format dates and times.  The
constructor accepts various options, which control how the formatter behaves.
Once you create a `DateFmt` instance, you may call its `format()` method as many
times as you want to format dates according to the given set of options.

```javascript
	import DateFmt from 'ilib/lib/DateFmt';
	...
	const fmt = new DateFmt();
	const d = fmt.format(date);
```

Among the options you may specify are the following:

* Which locale to use
* Whether to format the date only, time only, or both date and time together
* Which components of the date or time to format (e.g., only format the month
	and year components of the date)
* Whether to use a 12-hour clock, a 24-hour clock, or the default clock for the
	locale
* Whether to use short, medium, long, or full-length text for components that
	use words (e.g., Sunday may be expressed as "S", "Su", "Sun", or "Sunday")
* Which time zone to format for

```javascript
	const fmt = new DateFmt({ locale: "tr-TR",
		type: "date", date: "dmy", timezone: "Europe/Istanbul"
	});
```

#### Calendar Dates

`iLib` also supports the formatting of dates in multiple calendaring systems,
with the default being the familiar Gregorian calendar.

To create a date, you may call the factory method or use the calendar date
directly, e.g.:

```javascript
	import HebrewDate from 'ilib/lib/HebrewDate';
	...
	const now = new HebrewDate();
```

This is equivalent to the following factory method call:

```javascript
	import dateFactory from 'ilib/lib/DateFactory';
	...
	const now = dateFactory({type: "hebrew"});
```

Dates may be converted between calendars via a "Julian Day" number.  A Julian
Day is the number of whole days and fractions of a day since the beginning of
the epoch on 24 November -4713 BCE (Gregorian):

```javascript
	const now = dateFactory();
	// now.year is currently 2013
	const jd = now.getJulianDay();
	const hebrewDate = new HebrewDate({julianday: jd});
	// hebrewDate.year is 5773
```

To format a date in a non-Gregorian Calendar, follow the pattern of creating a
`DateFmt` object and calling `format()` on it.

```javascript
	const fmt = new DateFmt({
		length: "full",
		locale: "en-US",
		calendar: "hebrew"
	});
	const d = fmt.format(date);
```

The value of `d` is `"Adar 27, 5773 11:47PM PDT"`.

Use `ilib/CalendarFactory` as a factory method to
create the other calendar types.

```javascript
	import calendarFactory from 'ilib/lib/CalendarFactory';
	const cal = calendarFactory({
		// looks up calendar for this locale
		locale: "nl-NL"
	});
	const days = cal.getMonLength(2, year);
```

`days` is `28` in regular years and `29` in leap years.

#### Ranges and Durations

`ilib/DateRngFmt` may be used to format a date/time range--a period of time with
a specific start point and end point.  As with the other formatter classes, the
final output (e.g., `'Mar 11-14, 2013'`) will depend on the options supplied to
the formatter.

Similarly, `ilib/DurationFmt` lets you format durations--how long things take to
happen.  Again, you may customize the output (e.g., `'36 hours, 24 minutes, and
37 seconds'`) by setting the formatter's options.

#### Time Zones

In many countries, the national government determines the time zone.  In some
countries, including the United States, this may be overridden by smaller
jurisdictions such as states/provinces, counties, towns, etc.  Time zones are
specified using the IANA convention of "continent/city" (e.g.,
`'America/Los_Angeles'` or `'Asia/Seoul'`).

`ilib/TimeZone` represents information about a particular time zone.  Instances
may be passed to other classes such as `ilib/DateFmt`, although the specifier
string itself is also accepted.

```javascript
	import TimeZone from 'ilib/lib/TimeZone';
	...
	const tz = new TimeZone({
		id: "America/Los_Angeles"
	});
	const offset = tz.getOffset(dateFactory());
```

`offset` is now `{h: -8, m: 0}`.

### Numeric Values

The formatting of numeric values--in numbers, currency, and percentages--is
another locale-sensitive process.

```
--------------------------------------------------------
 Locale    Float           Currency       Percentage
--------- --------------- -------------- ---------------
 en-US     1,234,567.89    $1,234.56      57.2%

 de-DE     1.234.567,89    1.234,56 €     57,2 %

 fr-FR     1 234 567,89    1 234,56 €     57,2%

 tr-TR     1.234.567,89    1.234,56 TL    % 57,2
--------------------------------------------------------
```

As shown in the following examples, `iLib` handles each of these cases using
`ilib/NumFmt`.

#### Numbers

```javascript
	import NumFmt from 'ilib/lib/NumFmt';
	...
	const fmt = new NumFmt({
		locale: "de-DE"
	});
	const str = fmt.format(1234567.89);
```

`str` is now `'1.234.567,89'`.

#### Currency

```javascript
	const fmt = new NumFmt({
		style: "currency",
		currency: "EUR",
		locale: "de-DE"
	});
	const amount = fmt.format(1234.56289);
```

`amount` is now `'1.234,56 €'`.

#### Percentages

```javascript
	const fmt = new NumFmt({
		style: "percentage",
		maxFractionDigits: 2,
		locale: "tr-TR"
	});
	const percentString = fmt.format(0.893453);
```

`percentString` is now `'% 89,34'`.
