---
title: Using Enact with Third-party Libraries
---

## Overview

Enact is a fantastic way to build apps. However, you're not limited to developing your apps using
only Enact components, nor are you prevented from using pieces of Enact in other React apps.  You
can mix and match third-party libraries with Enact easily.

## Using Third-Party Components Inside of Enact

When creating an app using `enact create`, it creates app boilerplate that is set up for a
`Sandstone` styled app. However, if you want to use another UI library like
[`material-ui`](https://material-ui.com/) (see: [Sandstone + material-ui example](https://codesandbox.io/s/enactsandstone-material-uicore-example-gjjl8)), [`reactstrap`](https://reactstrap.github.io/), or [`react-router`](https://reactrouter.com/), just use `npm install`.

You can include components just like you normally would by using `import`.

```js
import {Button} from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css"; // reactstrap needs to include Bootstrap CSS

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

```css
@global-import 'bootstrap/dist/css/bootstrap.css';
```

For bootstrap 4 or above, you need to import bootstrap's source Sass files in your `custom.scss`. Make sure you are using Enact CLI 5.0.0 or above.

```scss
@import '~bootstrap/scss/bootstrap.scss';
```

The advantage of this is you get to use Enact's `cli` to develop, test, and build applications.
If you need to configure Webpack plugin, you can use the [`eject` command](../../developer-tools/cli/ejecting-apps) to copy all the configuration options to the app directory such as the `npm run eject` of the CRA app. After doing that, you don't need `cli` and your application is fully under your control.

## Using Enact Outside of Enact
If you're using something like `create-react-app`, it's pretty easy to use Enact as a module.

You can create a new application, as follows:
```
create-react-app react-add-enact
```

Then, add/install Enact dependencies like `@enact/core` and `@enact/ui` to `package.json`.

At this point you can use core Enact features (`kind` with computed props) and un-styled
components (`ui/Button`).


```js
import kind from '@enact/core/kind';
import Button from '@enact/ui/Button';

const App = kind({
	name: 'App',

	render: (props) => (
		<Button>Hello Enact!</Button>
	)
});
```

You can even use `Sandstone` themed components after installing `@enact/sandstone`.

```js
import kind from '@enact/core/kind';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';

const App = kind({
	name: 'App',

	render: (props) => (
		<div {...props}>
			<BodyText centered>
				These are Enact Sandstone components in a CRA app
			</BodyText>
			<Button>Click me</Button>
		</div>
	)
});

export default ThemeDecorator(App);
```

There is also a [Sandstone starter template](https://codesandbox.io/s/enactsandstone-starter-drkcy) on CodeSandbox so that you could quickly test
how Enact can be used with the app that is created from CRA(create-react-app).

### Styling Enact Components Outside of Enact

Behind the scenes, Enact supports using CSS modules and most Enact components provide public class
names that can be overridden to easily change their style.

#### CRA Example

If you are using `react-scripts` version `2.0.0` or later, you can import style overrides by using
the `[component].module.css` filename convention.  For earlier versions, you will need to eject
the CRA app and modify the webpack configuration to enable CSS modules.  This [article](https://medium.com/nulogy/how-to-use-css-modules-with-create-react-app-9e44bec2b5c2)
is a good reference for enabling CSS modules prior to `2.0.0`. 

```css
/* Button.module.css */
.bg { /* public class name in Sandstone/Button */
    background-color: #a4939d !important;
}
```

```js
// App.js
import Button from '@enact/sandstone/Button';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';

import * as buttonCss from './Button.module.css';

function App() {
	return (
		<div>
			<Button css={buttonCss}>Click me</Button>
		</div>
	);
}

export default ThemeDecorator(App);
```

### Internationalization Outside of Enact

#### CRA Example
In order to use the [`@enact/i18n`](../../developer-guide/i18n) library for internationalization, you can [eject](https://create-react-app.dev/docs/available-scripts/#npm-run-eject)
your CRA app, install your required Enact libraries (plus, `@enact/dev-utils`), and update the webpack configuration.

```json
// package.json
...
"devDependencies" : {
  "@enact/dev-utils": "^4.1.1"
},
"dependencies": {
  ...
  "@enact/i18n": "^4.0.2",
  "@enact/sandstone": "^2.0.0",
  ...
}
...
```
```js
// webpack.config.js
...
const {GracefulFsPlugin, ILibPlugin} = require('@enact/dev-utils');
...
plugins: [
  // new GracefulFsPlugin(), // use on Windows OS if you run into filesystem handler problems
  new ILibPlugin()
]
...
```

## Theming

Enact also has support theming. This way you can take our components and style them to best fit
the platform you wish to target. You can learn about that in our
[`Theming`](../../developer-guide/theming/) section.
