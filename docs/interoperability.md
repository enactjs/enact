---
title: Using Enact with Third-party Libraries
---

## Overview

Enact is a fantastic way to build apps. However, you're not limited to developing your apps using
only Enact components, nor are you prevented from using pieces of Enact in other React apps.  You
can mix and match third-party libraries with Enact easily.

## Using Third-Party Components inside of Enact
When creating an app using `enact create`, it creates app boilerplate that is set up for a
`Moonstone` styled app. However, if you want to use another UI library like
[`material-ui`](https://material-ui.com/), [`reactstrap`](https://reactstrap.github.io/), or [`react-router`](https://reacttraining.com/react-router/), just use `npm install`.

You can include components just like you normally would by using `import`.

```JavaScript
import { Button } from 'reactstrap';

const App = kind({
	name: 'App',

	render: (props) => (
		<div>
			<Button color="primary">Danger!</Button>
		</div>
	)
});
```

For libraries like bootstrap, you can also import the css in your `App.less` file.

```less
@global-import 'bootstrap/dist/css/bootstrap.css';
```

The advantage of this is you get to use Enact's `cli` to develop, test, and build applications.

## Using Enact outside of Enact
If you're using something like `create-react-app`, it's pretty easy to use Enact as a module.

You can create a new application, as follows:
```
create-react-app react-add-enact
```

Then, add/install Enact dependencies like `@enact/core` and `@enact/ui` to `package.json`.

At this point you can use core Enact features (`kind` with computed props) and un-styled
components (`ui/Button`).


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

Enact also has support theming. This way you can take our components and style them to best fit
the platform you wish to target. You can learn about that in our
[`Theming`](../../developer-guide/theming/) section.
