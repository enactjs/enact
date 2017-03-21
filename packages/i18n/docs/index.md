---
title: i18n (Internationalization)
---

This guide details how to use some of i18n library's features. For an overview of the modules supplied with the library please see [I18nDecorator](../../modules/i18n/I18nDecorator/) and [Uppercase](../../modules/i18n/Uppercase/). This library incorporates the [iLib](https://sourceforge.net/projects/i18nlib/) internationalization library.

## Using I18nDecorator

`I18nDecorator` is a Higher-order Component (HOC) that provides easy access to locale information. Applications wishing to receive locale information can wrap the root component with the HOC. It is not necessary to use `I18nDecorator` directly for applications using `MoonstoneDecorator`.

The HOC works by passing locale information and a utility method through `context`.

### Using I18nDecorator Context

As mentioned, `I18nDecorator` uses `context` to pass locale information to child components. In order to access `context` within a component, that component must use the exported `contextTypes`. For more information, please read the [context documentation](https://facebook.github.io/react/docs/context.html).

Two properties are supplied:

* `rtl` - a `boolean`, `true` if the locale is a right-to-left (RTL) language.

* `updateLocale` - a `function` which allows for changing the locale.

#### Setting up your component

The following example demonstrates using `contextTypes` with a component:

```javascript
import {contextTypes} from '@enact/i18n/I18nDecorator';

// Place them in your app like this.
const SomeComponent = (props, context) => (
	<div>Hello World</div>
);

// This works for class-based, stateless, and Enact `kind` components
SomeComponent.contextTypes = contextTypes;
```

Omitting `contextTypes` will prevent the component from receiving the passed `context`.

#### Using contextTypes

`context` is used very similarly to `props` in a component:

In a class component, access `this.context`

```javascript
this.context.rtl // true if locale is RTL
this.context.updateLocale('en-US') // updates locale
```

In a stateless component, `context` is the second argument:

```javascript
const SomeComponent = (props, context) => (
	<div>Hello World</div>
);

// Equivalent to the above.
context.rtl
context.updateLocale('en-US')
```

In a `kind` component, you can use context in `computed`, `handlers` or `render` the same way as a stateless component.

```javascript
const SomeComponent = kind({
	name: 'SomeComponent',
	computed: {
		computedProp: (props, context) => context.rtl ? 'left' : 'right'
	},
	render: ({computedProp}, context) => (
		<div>{computedProp}</div>
	)
});
```

### Setting locale

Locale may be explicitly set by setting `props` on the decorator or by calling the `updateLocale` function on `context`. Apps should use only one of these methods to set locale or conflicts could arise (for example, if a re-render of the root component caused the locale to be reset).

#### Using context

Context is the easiest way to update the locale. Call the `updateLocale` function, passing the locale string (e.g. `context.updateLocale('en-US')`. Remember to use `contextTypes` as mentioned above.

#### Updating locale via props

The other way to update locale is to send a prop down through the decorator (directly or through `moonstone/MoonstoneDecorator`).

A typical app looks like this:

```javascript
//Typically inside app.js
export default MoonstoneDecorator(App);

//Typically inside index.js
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'))
// or if you're using redux

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
```

The `<App />` component in `index.js` can receive props. The decorator accepts a `locale` prop, which accepts the desired locale string.

An example usage may look like this:

```javascript

const AppWrapped = (props) => (
	<App locale={props.locale}/>
)
```

In a deeply nested app, passing `props` back to the root element can get messy. State management libraries such as Redux can assist with this.

Using `redux`, a connected component can be used as shown below:

```javascript
// Inside app.js
const mapStateToProps = (state) => (
	{
		locale: state.locale
	}
)

export default connect(mapStateToProps)(MoonstoneDecorator(App));
```

This would allow you to control locale information through Redux. However, there are some issues with this approach, explained below.

#### Issue with context and Redux

Using `context` and Redux together has one major problem. When relying on using the `rtl` property from `context` to update a component, the `react-redux` `connect` method will suppress updates caused by context changes.

The reason is that `connect` only checks to see if `props` have changed, not `context`. If you only update `context` then the component will not re-render. To circumvent this you must use `connect` with the option `pure` set to `false` like this:

```javascript
export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(LocaleSwitch);
```

This will allow the `context` to flow through to the component, but it will also cause performance issues because your component will be re-rendering on every change. If you must use `context` with `react-redux`, please make the component as small as possible to reduce re-renders or use `shouldComponentUpdate`.

## Sample

A sample i18n app is available [here](https://github.com/enyojs/enact-samples/tree/master/pattern-locale-switching).
