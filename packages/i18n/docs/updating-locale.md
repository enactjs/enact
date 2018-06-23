---
title: Updating Locale
---

Locale may be explicitly set by setting `props` on the decorator or by calling the `updateLocale` function on `context`. Apps should use only one of these methods to set locale or conflicts could arise (for example, if a re-render of the root component caused the locale to be reset).

## Using context

Context is the easiest way to update the locale. Call the `updateLocale` function, passing the locale string (e.g. `context.updateLocale('en-US')`. Remember to use `contextTypes`:

```javascript
import {contextTypes} from '@enact/i18n/I18nDecorator';

class SomeComponent extends React.Component {
    ...
    static contextTypes = contextTypes;

    changeLocale = (locale) => {
        this.context.updateLocale(locale);
    }
    ...
```

## Updating locale via props

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

### Issue with context and Redux

Using `context` and Redux together has one major problem. When relying on using the `rtl` property from `context` to update a component, the `react-redux` `connect` method will suppress updates caused by context changes.

The reason is that `connect` only checks to see if `props` have changed, not `context`. If you only update `context` then the component will not re-render. To circumvent this you must use `connect` with the option `pure` set to `false` like this:

```javascript
export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(LocaleSwitch);
```

This will allow the `context` to flow through to the component, but it will also cause performance issues because your component will be re-rendering on every change. If you must use `context` with `react-redux`, please make the component as small as possible to reduce re-renders or use `shouldComponentUpdate`.
