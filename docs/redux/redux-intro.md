---
title: Introduction to Redux
order: 1
---

### Overview

This document provides a high-level overview of Redux and how it is used.

### What is Redux?

Redux is a library that allows you to manage application state. It closely follows React's Flux data flow model and works well with React, though it does not require it. State management has become more complicated due to a mixing of mutability and asynchronicity, and redux tries to resolve this issue by make state mutation **predictable**.

We recommend using the most recent version of Redux. To see which version of Redux is appropriate, refer to the [Redux Installation Instructions](https://react-redux.js.org/introduction/quick-start#installation).

#### Three Principles of Redux

##### Single source of truth

The entire **[state](https://redux.js.org/understanding/thinking-in-redux/glossary#state)** of the application will be represented by one JavaScript object, a **[store](https://redux.js.org/understanding/thinking-in-redux/glossary#store)**.

##### State is read-only

If you want to change the state, you have to **dispatch** an **[action](https://redux.js.org/understanding/thinking-in-redux/glossary#action)**, an object describing the change.

##### Changes are made with pure functions

To describe state mutations you have to write a function that takes the previous state of the app and the action being dispatched, then returns the next state of the app. This function is called the [Reducer](https://redux.js.org/understanding/thinking-in-redux/glossary#reducer).

Please find more information [here](https://redux.js.org/understanding/thinking-in-redux/three-principles).

#### What You Need

*   Actions - what your app can do
*   Reducer(s) - actions to return a new state
*   Store - the singular location and authoritative source of app state

##### Actions

An action is just a POJO (unless you use middleware as described) that contains data you want to send from your application to the store. They are the sole sources of information for the store (i.e., the only way you can change app state). An action only describes that something happened. We follow the Flux Standard Action (FSA, [https://github.com/acdlite/flux-standard-action](https://github.com/acdlite/flux-standard-action)) model for constructing actions. An action creator is a function that creates an action.

```js
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

```js
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

The store is where the state tree is stored. It is configured with a reducer. It can also be given an optional initial state tree and optional enhancer functions. We use the enhancer functions to be able to handle async actions through `applyMiddleware` (provided by Redux). The store is created via the [`createStore()`](https://redux.js.org/api/createstore) method of the Redux module. The store allows access to the state via [`getState()`](https://redux.js.org/api/store#getstate) method. It only allows updates to the state by using the [`dispatch()`](https://redux.js.org/api/store#dispatchaction) method (i.e. `dispatch(action)`). It can register listeners via [`subscribe(listener)`](https://redux.js.org/api/store#subscribelistener) and handles unregistering of listeners with the function returned by `subscribe()`.

### Redux Data Flow

The Redux architecture revolves around a strict _**unidirectional data flow**_.

1.  An action is executed by calling `store.dispatch(action)`
2.  The store calls the reducer function with the current state tree and the dispatched action
3.  If you have multiple, combined reducers, they will all be run and a combined state tree will be returned by the root reducer
4.  The returned state tree is now saved as the new app state and any registered listeners will be called. Listeners may call `store.getState()` to get the current state. If using React Redux module (as suggested), then this is when `component.setState(newState)` is called.

**Note:** when using the React Redux module, steps 2-4 are handled automatically. If not, then the developer is responsible for implementing step 4.

### Examples

#### Vanilla

```js
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

Live demo: [https://codesandbox.io/s/bold-bas-zxofpj?file=/src/index.js](https://codesandbox.io/s/bold-bas-zxofpj?file=/src/index.js)

#### React

```js
import {useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {createStore} from 'redux';

// reducer
const counterReducer = (state = {counter: 0}, action) => {
	switch (action.type) {
		case 'INCREMENT':
			return {counter: state.counter + 1};
		default:
			return state;
	}
};

// store
const store = createStore(counterReducer);

// counter component
const Counter = () => {
	const value = useSelector((state) => state.counter);
	const dispatch = useDispatch();

	const incrementHandler = useCallback(() => {
		dispatch({type: 'INCREMENT'});
	}, [dispatch]);

	return (
		<p>
			Clicked: {value} times <button onClick={incrementHandler}>+</button>
		</p>
	);
};

const App = () => <Counter />;

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
	<Provider store={store}>
		<App />
	</Provider>
);
```

Live Demo: [https://codesandbox.io/s/thirsty-kowalevski-jfi9wm?file=/src/index.js](https://codesandbox.io/s/thirsty-kowalevski-jfi9wm?file=/src/index.js)

### Redux Toolkit

The patterns shown above, unfortunately, require lots of verbose and repetitive code. To make it easier to write Redux applications in general, Redux team introduced [Redux Toolkit](https://redux-toolkit.js.org/).
It is the official recommended approach for writing Redux logic as of now.

It includes utilities that help simplify many common use cases, including store setup, creating reducers and writing immutable update logic, and even creating entire "slices" of state at once. It also includes the most widely used Redux addons, like Redux Thunk for async logic and Reselect for writing selector functions, so that you can use them right away.

Redux Toolkit provides two key APIs that simplify the most common things you do in every Redux app.

* [configureStore](https://redux-toolkit.js.org/api/configureStore) sets up a well-configured Redux store with a sing function call, including combining reducers, adding the thunk middleware, and setting up the Redux DevTools integration.

* [createSlice](https://redux-toolkit.js.org/api/createSlice) helps you write reducers that use the [Immer](https://immerjs.github.io/immer) library to enable writing immutable updates using "mutating" JS syntax like `state.value = 123`, with no spreads needed. It also automatically generates action creator functions for each reducer, and generates action type strings internally based on your reducer's names.

Please see [here](https://redux.js.org/introduction/why-rtk-is-redux-today) to find out more about Redux Toolkit.
Also, see [here](https://react-redux.js.org/tutorials/quick-start) for a great tutorial.

### Redux and React

As mentioned above Redux can be used without React. React bindings for redux is available from [react-redux](https://github.com/reduxjs/react-redux), which is a generic library that connects React components to a Redux store. More on how to use it is available [here](https://redux.js.org/tutorials/fundamentals/part-5-ui-react).

#### What `react-redux` does

`react-redux` allows you to specify how react components get data from the redux store and how they behave by calling its own custom hooks. We use `react-redux` module's [useSelector()](https://github.com/reduxjs/react-redux/blob/master/docs/api/hooks.md#useselector) hook to let our React components read data from the Redux store.

Back in the days, we had [connect()](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md) and `mapStateToProps()` method to get data from the redux store. They are also available but we recommend using `useSelectors()` hook instead.

`useSelector()` accepts a single function, which we call a selector function. A selector is a function that takes the entire Redux store state as its argument, reads some value from the state, and returns that result.

Also, we use [useDispatch()](https://github.com/reduxjs/react-redux/blob/master/docs/api/hooks.md#usedispatch) hook to dispatch actions. It gives you the store's `dispatch` method as its result so that you can call it with some `action` to dispatch.

Our components need access to the Redux store so they can subscribe to it. This can be cumbersome as your number of components grows and you have to manually pass store around. `react-redux` incorporates [context](https://react.dev/learn/passing-data-deeply-with-context) in React and provides a [`<Provider />`](https://github.com/reduxjs/react-redux/blob/master/docs/api/Provider.md) component to make store available to all components without passing stores around by hand. You only need to use it once at the `render()` of root component.

#### Example

```js
import {configureStore, createSlice} from '@reduxjs/toolkit';
import {useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider, useDispatch, useSelector} from 'react-redux';

// reducer
const initialState = {counter: 0};
const counterReducer = createSlice({
	name: 'counterReducer',
	initialState,
	reducers: {
		increment: (state) => {
			return {counter: state.counter + 1};
		}
	}
});

// store
const store = configureStore({
	reducer: counterReducer.reducer,
	initialState
});

// counter component
const Counter = () => {
	const value = useSelector((state) => state.counter);
	const dispatch = useDispatch();
	const {increment} = counterReducer.actions;

	const incrementHandler = useCallback(() => {
		dispatch(increment());
	}, [dispatch, increment]);

	return (
		<p>
			Clicked: {value} times <button onClick={incrementHandler}>+</button>
		</p>
	);
};

const App = () => {
	return <Counter />;
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
	<Provider store={store}>
		<App />
	</Provider>
);
```

Live Demo: [https://codesandbox.io/s/charming-burnell-92or5q?file=/src/App.js](https://codesandbox.io/s/charming-burnell-92or5q?file=/src/App.js)

### Resources

[Official Redux documentation](http://redux.js.org/)

[Official React Redux documentation](https://react-redux.js.org/tutorials/quick-start)

[Egghead tutorial - Fundamentals of Redux Course from Dan Abramov](https://egghead.io/courses/fundamentals-of-redux-course-from-dan-abramov-bd5cc867)
