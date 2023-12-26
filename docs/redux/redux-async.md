---
title: Async Actions
order: 2
---

Most complex apps rely heavily on fetching data asynchronously. In this document, we present techniques used in Redux to handle an asynchronous data flow.

### Introduction to Middleware and `redux-thunk`

When using an API, you are probably dealing with asynchronous actions. However, the Redux store only supports synchronous actions without using [middleware](https://redux.js.org/tutorials/fundamentals/part-4-store#middleware) (more on that later). To use middleware in Redux, we use the [`applyMiddleware()`](https://redux.js.org/api/applymiddleware) store enhancer from Redux. `redux-thunk` middleware is the standard way to handle asynchronous actions. If you are using [Redux Toolkit](https://redux-toolkit.js.org), you don't need to install `redux-thunk` and call `applyMiddleware()` directly since Redux Toolkit provides `configureStore()` which includes `redux-thunk` middleware by default.

We use `redux-thunk` middleware to enable asynchronous requests to work with synchronous action creators. It allows an action creator to return a function instead of an object (action) and executes that function when it is returned. This allows non-pure actions (i.e. ones that can call APIs that might have different data each time). These action creators can dispatch other actions, so, for example, you can dispatch a `REQUEST_BEGIN` action, then fetch remote data asynchronously and, after it returns, dispatch the `REQUEST_SUCCESS` or `REQUEST_ERROR` actions.

For example, you can create an async incrementer as follows:

```js
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

A combination of `redux-thunk` and `LS2Request` allows us to fetch and display data in a React component. `LS2Request` is a wrapper component for `WebOSServiceBridge` and is available from `@enact/webos/LS2Request`. The following example shows a simple fetch routine.

At the root level, we use `<Provider />` to pass store down the component hierarchy.

```js
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';

import App from './App';
import store from './store';

let appElement = () => (
	<Provider store={store}>
		<App />
	</Provider>
);

createRoot(document.getElementById('root')).render(appElement);
```

Store is configured to accept thunk middleware by `configureStore()` from Redux Toolkit.

```js
import {configureStore} from '@reduxjs/toolkit';
import rootSlice from '../reducers';

const initialState = {};
const store = configureStore({
	reducer: rootSlice.reducer,
	initialState
});

export default store;
```

Here we create a thunk action creator which returns a function instead of a plain object. It is also possible to dispatch an action or request at the beginning.

```js
import LS2Request from '@enact/webos/LS2Request';
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

```js
import {configureStore} from '@reduxjs/toolkit';

const rootSlice = createSlice({
	name: 'systemReducer',
	initialState: {},
	reducers: {
		receiveSystemSettings: (state, action) =>  {
			return Object.assign({}, state, action.payload.settings);
		},
		updateSystemSettings: (state, action) => {
			return Object.assign({}, state, action.payload.settings);
		}
	}
});

export const {receiveSystemSettings, updateSystemSettings} = rootSlice.actions;
export default rootSlice;
```

Component dispatches ``getSystemSettings`` on component mount and renders a ``pictureMode`` prop that's been got from a redux store.

```js
import {useDispatch, useSelector} from 'react-redux';
import {getSystemSettings} from '../reducers';

const App = () => {
	const pictureMode = useSelector(store => store.pictureMode);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getSystemSettings({
			category: 'picture',
			key: 'pictureMode',
			subscribe: true
		}));
	}, []);

	return <p>{pictureMode}</p>;
}

export default App;
```
