---
title: Introduction to Redux
order: 1
---

### Overview

This document provides a high-level overview of Redux and how it is used.

### What is Redux?

Redux is a library that allows you to manage application state. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test. On top of that, it provides a great developer experience, such as [live code editing combined with a time traveling debugger](https://github.com/reduxjs/redux-devtools). 
State management has become more complicated due to a mixing of mutability and asynchronicity, and redux tries to resolve this issue by make state mutation **predictable**.

We recommend using the most recent version of Redux. To see which version of Redux is appropriate, refer to the [Redux Installation Instructions](https://react-redux.js.org/introduction/quick-start#installation).

#### Three Principles of Redux

##### Single source of truth

The entire **[state](https://redux.js.org/understanding/thinking-in-redux/glossary#state)** of the application will be represented by one JavaScript object, a **[store](https://redux.js.org/understanding/thinking-in-redux/glossary#store)**.

This makes it easy to create universal apps, as the state from your server can be serialized and hydrated into the client with no extra coding effort. A single state tree also makes it easier to debug or inspect an application; it also enables you to persist your app's state in development, for a faster development cycle. Some functionality which has been traditionally difficult to implement - Undo/Redo, for example - can suddenly become trivial to implement, if all of your state is stored in a single tree.


```js
console.log(store.getState())

/* Prints
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
*/
```

##### State is read-only

If you want to change the state, you have to **dispatch** an **[action](https://redux.js.org/understanding/thinking-in-redux/glossary#action)**, an object describing the change.

This ensures that neither the views nor the network callbacks will ever write directly to the state. Instead, they express an intent to transform the state. Because all changes are centralized and happen one by one in a strict order, there are no subtle race conditions to watch out for. As actions are just plain objects, they can be logged, serialized, stored, and later replayed for debugging or testing purposes.

```js
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```

##### Changes are made with pure functions

To describe state mutations you have to write a function that takes the previous state of the app and the action being dispatched, then returns the next state of the app. This function is called the [Reducer](https://redux.js.org/understanding/thinking-in-redux/glossary#reducer).

Reducers are just pure functions that take the previous state and an action, and return the next state. Remember to return new state objects, instead of mutating the previous state. You can start with a single reducer, and as your app grows, split it off into smaller reducers that manage specific parts of the state tree. Because reducers are just functions, you can control the order in which they are called, pass additional data, or even make reusable reducers for common tasks such as pagination.

```js
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}

import { combineReducers, createStore } from 'redux'
const reducer = combineReducers({ visibilityFilter, todos })
const store = createStore(reducer)
```

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

Live demo: [http://jsbin.com/keyahus/edit?html,js,output](http://jsbin.com/keyahus/edit?html,js,output)

#### React

```js
import {createStore} from 'redux';
import PropTypes from 'prop-types';
import {Component} from 'react';
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
const Counter = ({value, onIncrement}) =>  {
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
Counter.propTypes = {
	onIncrement: PropTypes.func.isRequired,
	value: PropTypes.number.isRequired
};
const store = createStore(counter);
const render = () => {
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

Live Demo: [https://jsbin.com/pudurig/edit?html,js,output](https://jsbin.com/pudurig/edit?html,js,output)

## Redux Toolkit

### What is Redux Toolkit?
[Redux Toolkit](https://redux-toolkit.js.org/) is React official, opinionated, batteries-included toolset for efficient Redux development. It is intended to be the standard way to write Redux logic, and React team strongly recommends using it.

It includes several utility functions that simplify the most common Redux use cases, including store setup, defining reducers, immutable update logic, and even creating entire "slices" of state at once without writing any action creators or action types by hand. It also includes the most widely used Redux addons, like Redux Thunk for async logic and Reselect for writing selector functions, so that you can use them right away.

Redux Toolkit includes:

* [configureStore()](https://redux-toolkit.js.org/api/configureStore): wraps createStore to provide simplified configuration options and good defaults. It can automatically combine your slice reducers, adds whatever Redux middleware you supply, includes redux-thunk by default, and enables use of the Redux DevTools Extension.
* [createReducer()](https://redux-toolkit.js.org/api/createReducer): that lets you supply a lookup table of action types to case reducer functions, rather than writing switch statements. In addition, it automatically uses the immer library to let you write simpler immutable updates with normal mutative code, like state.todos[3].completed = true.
* [createAction()](https://redux-toolkit.js.org/api/createAction): generates an action creator function for the given action type string. The function itself has `toString()` defined, so that it can be used in place of the type constant.
* [createSlice()](https://redux-toolkit.js.org/api/createSlice): accepts an object of reducer functions, a slice name, and an initial state value, and automatically generates a slice reducer with corresponding action creators and action types.
* [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk): accepts an action type string and a function that returns a promise, and generates a thunk that dispatches `pending/fulfilled/rejected` action types based on that promise
* [createEntityAdapter](https://redux-toolkit.js.org/api/createEntityAdapter): generates a set of reusable reducers and selectors to manage normalized data in the store
* The [createSelector](https://redux-toolkit.js.org/api/createSelector) utility from the [Reselect](https://github.com/reduxjs/reselect) library, re-exported for ease of use.

### Redux and React

As mentioned above Redux can be used without React. React bindings for redux is available from [react-redux](https://github.com/reduxjs/react-redux), which is a generic library that connects React components to a Redux store. More on how to use it is available [here](https://redux.js.org/tutorials/fundamentals/part-5-ui-react).

We will focus on just how to set up a Redux application with Redux Toolkit and the main APIs we'll use.

#### Creating a Redux Store

To create a redux store we just have to import the `configureStore` API from Redux Toolkit.

`app/store.js`
```js
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {},
})
```
This creates a Redux store, and also automatically configure the Redux DevTools extension so that you can inspect the store while developing.

#### Provide the Redux Store to React

Once the store is created, we can make it available to our React components by putting a React Redux `<Provider>` around our application in src/index.js. Import the Redux store we just created, wrap the `<App>` component with the `<Provider>` and pass the store as props:

`index.js`
```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

#### Create a Redux State Slice

Add a new file named `src/features/counter/counterSlice.js`. In that file, we have to import the `createSlice` API from Redux Toolkit.

Creating a slice requires a string name to identify the slice, an initial state value, and one or more reducer functions to define how the state can be updated. Once a slice is created, we can export the generated Redux action creators and the reducer function for the whole slice.

Redux requires that [we write all state updates immutably, by making copies of data and updating the copies](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#immutability). However, Redux Toolkit's `createSlice` and `createReducer` APIs use [Immer](https://immerjs.github.io/immer/) inside to allow us to [write "mutating" update logic that becomes correct immutable updates](https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#immutable-updates-with-immer).

`features/counter/counterSlice.js`
```js
import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer
```

#### Add Slice Reducers to the Store

Next, we need to import the reducer function from the counter slice and add it to our store. By defining a field inside the reducers parameter, we tell the store to use this slice reducer function to handle all updates to that state.

`app/store.js`
```js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
})
```

#### Use Redux State and Actions in React Components

Now we can use the React Redux hooks to let React components interact with the Redux store. We can read data from the store with `useSelector`, and `dispatch` actions using useDispatch. Let's create a `src/features/counter/Counter.js` file with a `<Counter>` component inside, then import that component into` App.js` and render it inside of `<App>`.

`features/counter/Counter.js`
```js
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}
```
Now, any time we click the "Increment" and "Decrement buttons:

* The corresponding Redux action will be dispatched to the store
* The counter slice reducer will see the actions and update its state
* The `<Counter>` component will see the new state value from the store and re-render itself with the new data

### The full counter App example can be found [here](https://codesandbox.io/s/github/reduxjs/redux-essentials-counter-example/tree/master/?from-embed)
- - - -
### Resources

[Official Redux documentation](http://redux.js.org/)

[Official React Redux documentation](https://react-redux.js.org/tutorials/quick-start)

[Egghead tutorial - Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux)
