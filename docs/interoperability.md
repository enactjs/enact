---
title: Using Enact with third-party libaries
---

## Overview

`Enact` is a fantastic way to build apps. By default we give you a template using our `Moonstone`
library. `Moonstone` is a library designed for TVs. However, if you're not looking to create TV
apps, you can easily use `Enact` to build applications for desktop and mobile. You can mix and match
third-party libraries to use with `Enact` easily. Alternatively, it is also straightforward if you
just want to use `Enact` components in your own `React` app.

## Using Third-Party Components inside of Enact
When creating an app using `enact create`, it creates an `Enact` boilerplate that setups for a
`Moonstone` styled app. However if you want to use something outside of `Moonstone` like
`material-ui`, `reactstrap`, or `react-router` just use `npm install`.

You can include components just like you normally would by using import.

```JavaScript
import { Button as BSButton} from 'reactstrap';

const MainPanel = kind({
	name: 'MainPanel',

	render: (props) => (
		<Panel>
			<BSButton color="primary">Danger!</BSButton>
		</Panel>
	)
});
```

For libraries like bootstrap you can also import the css in our `.less` file.

```less
@global-import 'bootstrap/dist/css/bootstrap.css';
```

The advantage of this is we get to use `Enact`'s `cli` to develop, test, and build applications.

## Using Enact outside of Enact
If you're using something like `create-react-app` it's pretty easy to use `Enact` as a module.

You can run something like:
```
create-react-app react-add-enact
```

Add/install dependencies to `package.json` like `@enact/core` and `@enact/ui`.

At this point developers can use basic core `Enact` (kind with computed props) and un-styled
components (ui/Button).


```JavaScript
import kind from '@enact/core/kind';
import Button from '@enact/ui/Button';

const App = kind({
	name: 'App',

	render: (props) => (
		<Button>Hello Enact!</Button>
	)
});
```

## Theming

`Enact` also has support theming. This way you can take our components and just style them to best fit
your the platform you wish to target. You can learn about that in our
[`Theming`](../../developer-guide/theming/) section.
