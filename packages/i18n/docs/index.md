---
title: i18n (internationalization)
---

This is a guide detailing how to use some i18n features. If you want an overview of the modules please go here for [i18nDecorator](../../modules/i18n/I18nDecorator/) or here for [Uppercase](../../modules/i18n/Uppercase/).

## Using i18nDecorator

If you want i18n capabilities out of the box without any hard setup we provide `i18nDecorator`. This is included by default when you include `MoonstoneDecorator`. This will configure your app to use the system `locale`. For a majority of apps this is enough for `i18n`.

## Using i18n Context

Enact contains some ways for App developers to use `i18n` beyond just `i18nDecorator`. You can access them through `context`. If you don't know how to use `context` please read the  [documentation](https://facebook.github.io/react/docs/context.html) from `React`. Like `React` we do not encourage the use of context in your app unless you absolutely need to.

We provide two `context` properties that you can access. 

`rtl` - a `boolean` if the locale is an RTL language.

`updateLocale` - a `function` which allows you to set the locale of your app, to another one if you wish.

## Setting up your component

To access our these properties you can import our `contextTypes` using 

```javascript
import {contextTypes} from '@enact/i18n/I18nDecorator';

// Place them in your app like this.
const SomeComponent = (props, context) => (
	<div>Hello World</div>
);

// This works for Class, Stateless, and Kind components
SomeComponent.contextTypes = contextTypes;
```

This will import our types giving your component access to the `context`. If you don't set up `contextTypes` for your components they will just return `undefined`.

Once you have this you're ready to go.

## How to use the context types.

To access `context` it's very similar to `props`

In a class component you call `this.context`
```javascript
this.context.rtl // returns true if locale is rtl
this.context.updateLocale('en-US') // updates locale
```

In a stateless component, you can get `context` from the second argument.
```javascript
const SomeComponent = (props, context) => (
	<div>{Hello World}</div>
);

// Equivalent to the above.
context.rtl
context.updateLocale('en-US') 
```
In a `kind` component, you can use context in computed the same way as a stateless component. You can also call `context` in `render`.
```javascript
const SomeComponent = kind({
	name: 'SomeComponent',
	computed : {
		computedProp: (props, context) => context.rtl
	},
	render: (props, context) => (
		<div>Hello World</div>
	)
});
```

## Getting Locale Direction

To get the local direction simply call `rtl` using `this.context.rtl` or `context.rtl` and it will return a `boolean`. See the examples above. This will tell you the text direction for the locale.

## Updating The Locale

There are actually 2 ways to update your locale inside of `Enact`. One through `props` and the other through `context`.

#### Using Context

Context is the easiest way to `updateLocale`. If you wish to update the locale of an app using context, just call `this.context.updateLocale` or `context.updateLocale` with the locale string you wish (e.g. `context.updateLocale('en-US')`). As long as you include the `contextTypes` as mentioned above this should work without any problems.

#### Updating through props

The other way to update locale is through to send a prop down through `MoonstoneDecorator` or `I18nDecorator`.

Typically you have an app that looks like this:

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

The `<App />` component in index.js can actually have props pass through it. For our purpose we can use `locale`.

You would just have to add a wrapper around the App component, and then use any variable or `String` to update locale.
```javascript

const AppWrapped = (props) => (
	<App locale={props.locale}/>
)
```

If you have a pretty nested app, this can get pretty messy. You have to pass things all the way up the react tree, so we don't recommend doing this without the help of a state management library like `redux`.

If you are using `redux`, you can use it in a connected component as shown below.

```javascript
// Inside app.js
const mapStateToProps = (state) => (
	{
		locale: state.locale
	}
)

export default connect(mapStateToProps)(MoonstoneDecorator(App));
```

This would allow you to control locale information through `redux`. This has some issues which we will explain how to circumvent below.

## Issue when using context and redux

Using `context` and `redux` together has one major problem. For example, if you're relying on using the `rtl` property from `context` changing it will not cause a re-render to components using `react-redux`'s `connect`.

The reason is because `connect` does a check to see if `props` are changed, but not `context`. If you only update `context` then the component will not re-render. To circumvent this you must use `connect` with the option `pure` set to `false` like this:

```javascript
export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(LocaleSwitch);
``` 

This will allow the context flow through to the component, but it will also cause performance issues because your component will be re-rendering on every change. If you must use it, please make sure to make the component small as possible to reduce the number of re-renders or use `shouldComponentUpdate`.

## Sample
If you want to see some i18n in a sample go [here](https://github.com/enyojs/enact-samples/tree/master/pattern-locale-switching)