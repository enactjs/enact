---
title: Introduction to Redux
order: 1
---

### Overview

This document provides a high-level overview of Redux and how it is used.

### What is Redux?

Redux is a library that allows you to manage application state. It closely follows React's Flux data flow model and works well with React, though it does not require it. State management has become more complicated due to a mixing of mutability and asynchronicity, and redux tries to resolve this issue by make state mutation **predictable**.

#### Three Principles of Redux

##### Single source of truth

The entire **[state](http://redux.js.org/docs/Glossary.html#state)** of the application will be represented by one JavaScript object, a **[store](http://redux.js.org/docs/Glossary.html#store)**.

##### State is read-only

If you want to change the state, you have to **dispatch** an **[action](http://redux.js.org/docs/Glossary.html#action)**, an object describing the change.

##### Changes are made with pure functions

To describe state mutations you have to write a function that takes the previous state of the app and the action being dispatched, then returns the next state of the app. This function is called the [Reducer](http://redux.js.org/docs/Glossary.html#reducer).

#### What You Need

*   Actions - what your app can do
*   Reducer(s) - actions to return a new state
*   Store - the singular location and authoritative source of app state

##### Actions

An action is just a POJO (unless you use middleware as described) that contains data you want to send from your application to the store. They are the sole sources of information for the store (i.e., the only way you can change app state). An action only describes that something happened. We follow the Flux Standard Action (FSA, [https://github.com/acdlite/flux-standard-action](https://github.com/acdlite/flux-standard-action)) model for constructing actions. An action creator is a function that creates an action.

```javascript
// A simple action
{
	type: 'INCREMENT',
} 

// A basic Flux Standard Action (FSA): 
{
  type: 'ADD_TODO',
  payload: {
    text: 'Do something.'  
  }
}

// An FSA that represents an error
{
  type: 'ADD_TODO',
  payload: new Error(),
  error: true
}
```

##### Reducers

A reducing function (reducer) returns the next state tree, given the current state tree and an action to handle. Reducers are run in response to actions that are made against the store. Reducing functions should be pure (given the same arguments, they should always return the same value) and perform no side effects (API calls, routing transitions, etc.) or call other non-pure functions (i.e. `Date.now()` or `Math.random()`).

```javascript
// counter reducer
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// todo reducer (ES6 style)
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
}
```

##### Store

The store is where the state tree is stored. It is configured with a reducer. It can also be given an optional initial state tree and optional enhancer functions. We use the enhancer functions to be able to handle async actions through `applyMiddleware` (provided by Redux). The store is created via the [`createStore()`](http://redux.js.org/docs/api/createStore.html) method of the Redux module. The store allows access to the state via [`getState()`](http://redux.js.org/docs/api/Store.html#getState) method. It only allows updates to the state by using the [`dispatch()`](http://redux.js.org/docs/api/Store.html#dispatch) method (i.e. `dispatch(action)`). It can register listeners via [`subscribe(listener)`](http://redux.js.org/docs/api/Store.html#subscribe) and handles unregistering of listeners with the function returned by `subscribe()`.

### Redux Data Flow

The Redux architecture revolves around a strict _**unidirectional data flow**_.

1.  An action is executed by calling `store.dispatch(action)`
2.  The store calls the reducer function with the current state tree and the dispatched action
3.  If you have multiple, combined reducers, they will all be run and a combined state tree will be returned by the root reducer
4.  The returned state tree is now saved as the new app state and any registered listeners will be called. Listeners may call `store.getState()` to get the current state. If using React Redux module (as suggested), then this is when `component.setState(newState)` is called.

**Note:** when using the React Redux module, steps 2-4 are handled automatically. If not, then the developer is responsible for implementing step 4.

### Examples

#### Vanilla

```javascript
import {createStore} from 'redux';

// reducer
function counter (state = 0, action) {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1;
		default:
			return state;
	}
}

const store = createStore(counter);
function render () {
	document.body.innerText = store.getState();
}

store.subscribe(render);
render();

document.addEventListener('click', () => {
	// dispatch 'INCREMENT` action on click
	store.dispatch({type: 'INCREMENT'});
});
```

Live demo: [http://jsbin.com/keyahus/edit?html,js,output](http://jsbin.com/keyahus/edit?html,js,output)

#### React

```javascript
import {createStore} from 'redux';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
// reducer
function counter (state = 0, action) {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1;
		default:
			return state;
	}
}
class Counter extends Component {
	render () {
		const {value, onIncrement} = this.props;
		return (
			<p>
				Clicked: {value} times
				{' '}
				<button onClick={onIncrement}>
					+
				</button>
			</p>
		);
	}
}
Counter.propTypes = {
	onIncrement: PropTypes.func.isRequired,
	value: PropTypes.number.isRequired
};
const store = createStore(counter);
function render () {
	ReactDOM.render(
		<Counter
			value={store.getState()}
			onIncrement={() => store.dispatch({type: 'INCREMENT'})}
		/>,
		document.getElementById('root')
	);
}
render();
store.subscribe(render);
```

Live Demo: [http://jsbin.com/nemofa/edit?html,js,output](http://jsbin.com/nemofa/edit?html,js,output)

### Redux and React

As mentioned above Redux can be used without React. React bindings for redux is available from [react-redux](https://github.com/reactjs/react-redux), which is a generic library that connects React components to a Redux store. More on how to use it is available [here](http://redux.js.org/docs/basics/UsageWithReact.html).

#### Presentational and Container Components

There's a simple and very useful pattern in React apps called **presentational and container components**. The idea is to separate concerns of **_how components should look_** and _**what components should do**_. By following this pattern, you get better separation of concerns, better reusability, and you can handle UI more easily. See [here](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.6j9fz9g5j) to find out more about it. (STRONGLY SUGGESTED!)

Redux embraces the separation of presentational and container components idea and it's easy to do with `react-redux`. Essentially, presentational components don't know about Redux. They get their data through standard React props and emit changed data by invoking callbacks passed in through props. Container components are where the hook-up to Redux and app state is done and where Redux actions are dispatched. In other words, you would normally create components as a presentational component, and when you find you need to hook up to data, you would then need to create a container component for it.

#### What `react-redux` does

`react-redux` allows you to specify how react components get data from the redux store and how they behave by specifying props and the actions to dispatch. We use `react-redux` module's [connect()](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) method to connect the relevant container component to its presentational one.

An optional `mapStateToProps()` method will map a key of the state tree to the connected presentational component's props (i.e. when you do `connect(mapStateToProps)(PresentationalComponent)`). Container components can also dispatch actions by using the `mapDispatchToProps()` method. It allows you to pass callback props to the presentational component.

Container components need access to the Redux store so they can subscribe to it. This can be cumbersome as your number of components grows and you have to manually pass store around. `react-redux` incorporates [context](https://facebook.github.io/react/docs/context.html) in React and provides a [`<Provider />`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store) component to make store available to all container components without passings stores around by hand. You only need to use it once at the `render()` of root component.

#### Example

```javascript
import {createStore} from 'redux';
import {connect, Provider} from 'react-redux';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {render} from 'react-dom';
// reducer
function counter (state = 0, action) {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1;
		default:
			return state;
	}
}
// presentational counter component
class Counter extends Component {
	render () {
		const {value, onIncrement} = this.props;
		return (
			<p>
				Clicked: {value} times
				{' '}
				<button onClick={onIncrement}>
					+
				</button>
			</p>
		);
	}
}
const mapStateToProps = (state) => {
	return {value: state};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onIncrement: () => dispatch({type: 'INCREMENT'})
	};
};
// creates a connected container component with `connect`
const EnhancedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter);
const store = createStore(counter);
class App extends Component {
	render () {
		return (
			<Provider store={store}>
				<EnhancedCounter />
			</Provider>
		);
	}
}
render(<App />, document.getElementById('root'));
```

Live Demo: [http://jsbin.com/zukojok/1/edit?html,js,output](http://jsbin.com/zukojok/1/edit?html,js,output)

### Resources

[Official Redux documentation](http://redux.js.org/)

[Egghead tutorial - Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux)

[Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.6j9fz9g5j)
