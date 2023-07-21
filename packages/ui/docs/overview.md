# UI

Enact ui library is a set of reusable behaviors and a library of headless("unstyled") components for creating Enact themes.

This library contains a set of unstyled components as well as a number of Higher Order Components (HOCs) that implement various usage patterns and behaviors (`Pickable`, `Pressable`, etc.).

## Example

One of the components supplied is `Repeater`. A repeater stamps out copies of a component (the `childComponent` prop) using the elements of an array provided as its `children`:
```
import kind from '@enact/core/kind';
import Repeater from '@enact/ui/Repeater';

const MyApp = kind({
	name: 'MyApp',
	render: () => (
		<Repeater childComponent="div">
			{['One', 'Two', 'Three']}
		</Repeater>
	)
});

export default MyApp;
```

See the documentation for each component for more information.

## Install

```
npm install --save @enact/ui
```
