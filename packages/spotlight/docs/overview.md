# Spotlight 

Enact spotlight is an extensible library for 5-way navigation and focus control.

An extensible utility that enables users to navigate
applications using a keyboard or television remote control.  Responding to input
from the **UP**, **DOWN**, **LEFT**, **RIGHT**, and **RETURN** keys, Spotlight
provides a navigation experience that compares favorably to that of a
computer-with-mouse.

## Usage

```
import kind from '@enact/core/kind';
import SpotlightRootDecorator from '@enact/spotlight/SpotlightRootDecorator'
import Spottable from '@enact/spotlight/Spottable'

const MySpottableComponent = Spottable('div');

const MyApp = kind({
	name: 'MyApp',
	render: () => (<MySpottableComponent>Hello, Enact!</MySpottableComponent>)
});
const MySpotlightApp = SpotlightRootDecorator(MyApp);

export default MySpotlightApp;
```

## Additional Information

When using `@enact/sandstone`, the `SpotlightRootDecorator` is applied automatically by
`@enact/sandstone/ThemeDecorator`.