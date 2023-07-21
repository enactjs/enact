# I18N

Enact i18n is a Internationalization library based on [iLib](http://github.com/iLib-js/iLib).

`@enact/i18n` provides a decorator that can be used to wrap a root component in a React (or Enact) application.
This decorator provides a context to child components that can be used to determine locale text directionality
and to update the current locale.

## Usage

```
import {I18nContextDecorator, I18nDecorator} from '@enact/i18n/I18nDecorator';

const MyComponent = I18nContextDecorator(
	{rtlProp: 'rtl'},
	(props) => (
		<div>{props.rtl ? 'right to left' : 'left to right'}</div>
	)
);

const MyApp = () => (
	<div>
		<MyComponent />
	</div>
);

const MyI18nApp = I18nDecorator(MyApp);

export default MyI18nApp;
```
**Note**: The `@enact/i18n` module will attempt to determine the locale automatically.  Pass a `locale` prop (`"en-US"` for example) to this component where it is rendered to test.

## Install

```
npm install --save @enact/i18n
```
