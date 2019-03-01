---
title: Using Enact with Third-party Libraries
---

## Overview

Enact is a fantastic way to build apps. However, you're not limited to developing your apps using
only Enact components, nor are you prevented from using pieces of Enact in other React apps.  You
can mix and match third-party libraries with Enact easily.

## Using Third-Party Components Inside of Enact

When creating an app using `enact create`, it creates app boilerplate that is set up for a
`Moonstone` styled app. However, if you want to use another UI library like
[`material-ui`](https://material-ui.com/) (see: [Moonstone + material-ui example](https://codesandbox.io/s/l5my52r299)), [`reactstrap`](https://reactstrap.github.io/), or [`react-router`](https://reacttraining.com/react-router/), just use `npm install`.

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

There is also a [Moonstone starter template](https://codesandbox.io/s/z2wnj3jznx) on CodeSandbox that can be used to quickly test
how third-party libraries and components can be used with Enact.

## Using Enact Outside of Enact
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

You can even use `Moonstone` themed components after installing `@enact/moonstone`.

```javascript
import BodyText from '@enact/moonstone/BodyText';
import Button from '@enact/moonstone/Button';
import { MoonstoneDecorator } from '@enact/moonstone/MoonstoneDecorator';
import React, { Component } from 'react';

class App extends Component {
	render() {
		return (
			<div>
				<BodyText centered>
					These are Enact Moonstone components in a CRA app
				</BodyText>
				<Button>Click me</Button>
			</div>
		);
	};
}

export default MoonstoneDecorator(App);
```

### Styling Enact Components Outside of Enact

Behind the scenes, Enact supports using CSS modules and most Enact components provide public class
names that can be overridden to easily change their style.

#### CRA Example

If you are using `react-scripts` version `2.0.0` or later, you can import style overrides by using
the `[component].module.css` filename convention.  For earlier versions, you will need to eject
the CRA app and modify the webpack configuration to enable CSS modules.  This [article](https://medium.com/nulogy/how-to-use-css-modules-with-create-react-app-9e44bec2b5c2)
is a good reference for enabling CSS modules prior to `2.0.0`. 

##### `Button.module.css`
```css
.bg { /* public class name in Moonstone/Button */
    background-color: #a4939d !important;
}
```

##### `App.js`
```javascript
import Button from '@enact/moonstone/Button';
import { MoonstoneDecorator } from '@enact/moonstone/MoonstoneDecorator';
import React, { Component } from 'react';

import buttonCss from './Button.module.css';

class App extends Component {
	render() {
		return (
			<div>
				<Button css={buttonCss}>Click me</Button>
			</div>
		);
	};
}

export default MoonstoneDecorator(App);
```

### Internationalization Outside of Enact

#### CRA
In order to use the [`@enact/i18n`](../../developer-guide/i18n) library for internationalization, you can [eject](https://facebook.github.io/create-react-app/docs/available-scripts#npm-run-eject)
your CRA app, install your required Enact libraries (plus, `@enact/dev-utils`), and update the webpack configuration.

```
// package.json

...
"devDependencies" : {
  "@enact/dev-utils": "2.0.0"
},
"dependencies": {
  ...
  "@enact/i18n": "2.3.0",
  "@enact/moonstone": "2.3.0",
  ...
}
...

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
