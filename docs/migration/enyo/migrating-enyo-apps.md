---
title: Enyo Application Migration Guide
---

## Overview

Migrating from Enyo to Enact can be a challenge. There are many new concepts to learn and, while many of the same
Moonstone components exist, their APIs have changes. Given this, you can look at this as an opportunity to
aggressively refactor your app.

>***Please do not attempt to directly port your application. Enact is a wholly different approach to application structure
which is incompatible with the older techniques.***

This guide serves as a basic checklist of things to consider before you begin and is separated into **General Considerations**
(developer tools, Spotlight, data management, etc.) and **webOS Platform Support** (platform APIs, services, etc.).

## General Considerations

This section highlights some of the generic things that should be reviewed when moving an Enyo application to Enact,
regardless of platform.

### Application Structure

>***The framework team strongly encourages the use of the [`enact cli`](https://github.com/enactjs/cli) tools to
create, test, and deploy Enact applications.***

Source files are generally arranged in the project like so:
```
project_root/   (package.json lives here)
  assets/       (images and other non-source content)
  resources/    (ilibmanifest.json lives here)
  src/          (this directory may be important)
  webos-meta/   (helpful companion files for packaging webOS applications)
```

#### Component Usage

While many Moonstone components retain the same names they have in Enyo, some have changed. We have prepared
the [Enyo to Enact Component Map](./enyo-enact-component-map.md) to help with the transition.

In general, the `content` property is now handled by the implicit `children` property of components. Boolean
properties can be shortened to just the property name.  For example, `moonstone/Button` in Enyo was configured
like this:

```
    { name: 'MyButton', kind: Button, small: true, content: 'Click Me!'}
```

In Enact, the same effect is achieved like this:

```
    <Button small>Click Me!</Button>
```

Enact declarations are similar yet simpler than their Enyo counterparts. Further, some options and components
that were not used have been removed in Enact. Please refer to [module documentation](../../../modules/)
to see the exact APIs for each component.

##### `components` Block to `render()` Method

With Enyo, you can declare which components are contained in a given kind or component.  This is done by specifying
them in the `components` property of the kind.
```javascript
...
var InnerComponent = kind({
	name: 'InnerComponent',
	kind: enyo.Control,
	content: 'This is just a &lt;div&gt; with some text'
});
...
var OuterComponent = kind({
	name: 'OuterComponent',
	kind: enyo.Control,
	components: [
		{kind: InnerComponent}
	]
});
...
```

In Enact, a component can contain other components just as easily, but you use the `render()` method to declare them.
```jsx harmony
...
const InnerComponent = kind({
	name: 'InnerComponent',
	render: () => (
		<div>This is just a &lt;div&gt; with some text</div>
	)
});

const OuterComponent = kind({
	name: 'OuterComponent',
	render: () => {
		<div>
			<InnerComponent />
		</div>
	}
});
...
```

##### Getters/Setters

Enyo provides the ability to `set` or `get` any arbitrary property on a component:
```javascript
...
var bar = '';
MyComponent.set('foo', 'bar');
bar = MyComponent.get('foo');  // bar === "bar"
...
```

This is further enhanced by allowing you to specify 'published' (or 'public' in later Enyo versions) properties and mapping
individual `set[Property]()` and `get[Property]()` methods:
```javascript
...
name: 'MyControl',
kind: enyo.Control,
published: {
	foo: 'bar'
}
...
var bar = '';
MyControl.setFoo('nobar');
bar = MyControl.getFoo();  // bar === "nobar"
...
```

In Enact, you 'set' properties by providing them to the rendered component(s):
```jsx harmony
...
import PropTypes from 'prop-types';
...
const MyComponent = kind({
	name: 'MyComponent',
	propTypes: {
		foo: PropTypes.string
	},
	defaultProps: {
		foo: 'bar'
	},
	render: ({foo}) => (
		<div>{foo}</div>
	)
});
...
// (another component that renders an instance of MyComponent)
...
	render: () => (
		<MyComponent foo="nobar" />
	)
```

Due to the one-way nature of data-flow in Enact, 'get' functionality is unnecessary.  You will know the value from either
the data state or store, depending on how you have implemented your component and application.

##### Computed Properties

Computed properties are almost identical in Enyo and Enact with one major difference.  In Enyo, any computed property of
a kind can access any other computed property of that kind.  In Enact, computed properties are isolated from other computed
properties.

##### Event Handling

Enyo has several different ways to handle events (`enyo.Signals`, the `handlers` property of a component, the `onClick`
property of `UiComponents`, etc.).  In Enact, event handling is a bit different.

To handle an event, use `@enact/core/handle` to create a handler.  It accepts one or more input functions that will process
or filter the event.  The input functions will be processed in order until one returns `false` (or any falsy value).

```jsx harmony
...
const myHandler = handle(
	preventDefault, // imported from `@enact/core/handle`; convenience method for preventing default event; returns `true`
	(ev, props) => { // custom handling
		console.log('handling event');
	}
);
```

`handle` returns a function (MyHandler) that accepts an event, a properties object, and a context object.  To use it,
specify it as the value for an event property, such as `onClick`.

```jsx harmony
...
render: () => (
	<div>
		<Item onClick={myHandler} />
	</div>
)
```

The `@enact/core/handle` module exports some input methods designed to be used with `handle`, such as `forward` and
`preventDefault`.  Please see the [module documentation](../../../modules/core/handle/) for a complete list.

#### `enact cli` vs. `enyo-dev`

The Enact developer tools simplify, yet remain similar to, the Enyo developer tools.

| Activity | `enact cli` | `enyo-dev` |
| -------- | ----------- | ---------- |
| Create a new project | `enact create` | `enyo init` |
| Create a development build | `npm run pack` | `enyo pack` |
| Create a production build | `npm run pack-p` | `enyo pack -P` |
| Serve a local version of your project for testing | `npm run serve` | `enyo pack`; `enyo serve` |

### Spotlight

Refactoring an Enyo application to Enact affords an opportunity to reevaluate the application's Spotlight usage.  Here
are some things to consider:
*   Does this application use Spotlight containers?
*   Are there any custom Spotlight components?
*   Does the application listen for Spotlight events?
*   Can the overall structure of Spotlight components/navigation be simplified (for example, does the application handle
a majority of the Spotlight navigation events or are there multiple levels of nested containers)?

#### Spotlight Containers

If your application uses Spotlight containers, be sure to review the [Spotlight container documentation](../../spotlight/#containers).

#### Custom Spotlight Components

If you have created custom Spotlight components in your application, make sure to review the [Spottable documentation](../../spotlight/#spottable).

#### Spotlight Events

Spotlight now uses native DOM events and does not dispatch synthetic events to the currently spotted control.  Please review
the [Spotlight event documentation](../../spotlight/#events).

### Data Management

If an application makes use of `enyo.Model` or `enyo.Collection`, it will need to be adapted to some changes in Enact.
Notably, there are no framework-provided collections or models.  Enact relies on its underlying Flux architecture to
provide state and property updates through its component hierarchy.  Therefore, it is necessary to manage application
and/or component state to affect logic or UI changes.

A typical Enyo application pattern is to create a model and a collection to hold instances of the model.  So that every
view can have access to the collection, it can be made 'public'.  Finally, using bindings, a view can map the collection
based on its requirements.  All that remains is to add models to the collection, usually as the result of an asynchronous
operation.

```javascript
// MyModel.js
...
name: 'MyModel',
kind: enyo.Model,
...
// MyCollection.js
...
name: 'MyCollection',
kind: enyo.Collection,
model: MyModel,
...
// App.js
...
components: [
	{name: 'allData', kind: MyCollection, public: true}
],
view: MainView
...
// MainView.js
...
components: [
	{name: 'list', kind: enyo.DataList, ...}
],
bindings: [
	{from: 'app.allData', to: '$.list.collection'}
],
...
```

The above example is quite simplistic, so it can be re-implemented in Enact without using additional libraries.  For
complex data management and application state management, third-party solutions (such as [Redux](../../redux/)) exist.

```jsx harmony
// App.js
...
class App extends React.Component {
	...
	constructor (props) => {
		super(props);
		this.state = {
			recentData: props.data || []
		};
	}
	// response handler from some async request (not shown)
	dataFetched = ({data}) => {
		this.setState({recentData: (data && data.length) ? data : []});
	}
	render () {
		<div>
			<MainView data={this.state.recentData} />
		</div>
	}
}
// MainView.js
...
const MainView = kind({
	name: 'MainView',
	...
	render: ({data}) => (
		<VirtualList
			...
			data={data}
			...
		/>
	)
});
...
```

### View Management

Enact provides `@enact/moonstone/Panels`, which is sufficient for most existing Enyo applications to use.  However, it extends
a more generic `@enact/ui/ViewManager` component that might offer the opportunity to improve an application's overall UX.

## webOS Platform Support

The `@enact/webos` module provides many useful utilities and methods to interact with the webOS platform.

*   `@enact/webos/application` - provides information about the application metadata
*   `@enact/webos/deviceinfo` - returns various details about the webOS device where the application is running
*   `@enact/webos/keyboard` - use to see if the keyboard is currently visible
*   `@enact/webos/LS2Request` - without this, your application cannot use the myriad webOS services that are available!
Almost every Enyo webOS application utilizes service calls.
    *    [Luna Service API](../../webos/luna-service-api/) example
*   `@enact/webos/platform` - returns various details about the webOS platform where the application is running (SmartTV, Open webOS, legacy devices (Palm, HP), etc.)
*   `@enact/webos/pmloglib` - system-level logging for your application
*   `@enact/webos/VoiceReadout` - reads alert text when accessibility VoiceReadout enabled
