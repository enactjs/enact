---
title: Async Actions
order: 2
---

Most complex apps rely heavily on fetching data asynchronously. In this document, we present techniques used in Redux to handle an asynchronous data flow.

### Introduction to Middleware and `redux-thunk`

When using an API, you are probably dealing with asynchronous actions. However, the Redux store only supports synchronous actions without using [middleware](http://redux.js.org/docs/advanced/Middleware.html) (more on that later). To use middleware in Redux, we use the [`applyMiddleware()`](http://redux.js.org/docs/api/applyMiddleware.html) store enhancer from Redux. `redux-thunk` middleware is the standard way to handle asynchronous actions.

We use `redux-thunk` middleware to enable asynchronous requests to work with synchronous action creators. It allows an action creator to return a function instead of an object (action) and executes that function when it is returned. This allows non-pure actions (i.e. ones that can call APIs that might have different data each time). These action creators can dispatch other actions, so, for example, you can dispatch a `REQUEST_BEGIN` action, then fetch remote data asynchronously and, after it returns, dispatch the `REQUEST_SUCCESS` or `REQUEST_ERROR` actions.

For example, you can create an async incrementer as follows:

```javascript
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

function incrementAsync() {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, 1000);
  };
}
```

### LS2Request Example

A combination of `redux-thunk` and `LS2Request` allows us to fetch and display data in a React component. `LS2Request` is a wrapper component for `PalmServiceBridge` and is available from `@enact/webos/LS2Request`. The following example shows a simple fetch routine.

At the root level, we use `<Provider />` to pass store down the component hierarchy.

```javascript
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store';
import App from './containers/App';

const store = configureStore();
render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
```

Store is configured to accept thunk middleware

```javascript
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import systemSettingsReducer from '../reducers';

export default function configureStore (initialState) {
	const store = createStore(
		systemSettingsReducer,
		initialState,
		applyMiddleware(thunkMiddleware) // lets us dispatch functions
	);
	return store;
}
```

Here we create a thunk action creator which returns a function instead of a plain object. It is also possible to dispatch an action or request at the beginning.

```javascript
import LS2Request from '@enact/webos/LS2Request';
function receiveSystemSettings (res) {
	return {
		type: 'RECEIVE_SYSTEM_SETTINGS',
		payload: res
	};
}
// function returning function!
export const getSystemSettings = params => dispatch => {
	// possible to dispatch an action at the start of fetching
	// dispatch({type: 'FETCH_SYSETEM_SETTINGS'});
	return new LS2Request().send({
		service: 'luna://com.webos.settingsservice/',
		method: 'getSystemSettings',
		parameters: params,
		onSuccess: (res) => {
			// dispatches action on success callback with payload
			dispatch(receiveSystemSettings(res));
		}
	});
};
```

Reducer receives a payload and creates a new state.

```javascript
export default function systemSettingsReducer (state = {}, action) {
	switch (action.type) {
		case 'RECEIVE_SYSTEM_SETTINGS':
			return Object.assign({}, state, action.payload.settings);
		default:
			return state;
	}
}
```

Connected container dispatches ``getSystemSettings`` on componentDidMount and renders a ``pictureMode`` prop that's been hooked up with a redux store.

```javascript
import React from 'react';
import {connect} from 'react-redux';
import {getSystemSettings} from '../actions';

class App extends React.Component {
	componentDidMount () {
		this.props.dispatch(getSystemSettings({
			category: 'picture',
			key: 'pictureMode',
			subscribe: true
		}));
	}
	render () {
		return <p>{this.props.pictureMode}</p>;
	}
}

export default connect()(App);
```
