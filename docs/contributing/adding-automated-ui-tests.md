---
title: Adding Automated UI Tests
---

Enact provides two ways to test the UI of components automatically powered by an in-house UI testing utility named [@enact/ui-test-utils](https://github.com/enactjs/ui-test-utils) that includes the common WebDriver configurations and some utility modules for executing automated UI tests.
The one is UI Testing, automating the user's input and testing if the Enact component functions correctly.
The other one is Screenshot Testing, testing the visual differences if any between reference screenshot images and given screenshot images  to verify whether the changes are intended or not.

Almost all components of Enact Theme Libraries(e.g. Sandstone, Moonstone, and Agate) have their own UI and Screenshot test cases to verify their functional and visual specifications.
Therefore, if you want to contribute to Enact, it is highly recommended to add proper UI and Screenshot tests as well in your pull request.

In this guide, we will walk you through how to add and run UI and Screenshot tests from Enact Theme Libraries.

## Prerequisites

To get started, clone Sandstone from GitHub, install dependencies:

```shell
# clone the repo!
git clone git@github.com:enactjs/sandstone.git
# move in
cd sandstone
# we're using git flow so develop is our working branch
git checkout develop
# install dependencies
npm install
```

## UI Testing

If you are adding or changing functions to an Enact component, you may need to add or change UI test cases of that component.
After adding or changing UI test cases, please make sure the result of running UI tests all passes.

### How to run UI tests

Let's take a look at how to run the UI tests first.
Run the following command from Sandstone directory:

```bash
npm run test-ui
```

It will start to run all the existing UI test cases in Sandstone.

If you run the tests of specific component(s), run the following command:

```bash
npm run test-ui -- --spec <pattern>
```

Check out [here](https://github.com/enactjs/ui-test-utils/blob/master/README.md#filtering-tests) for more options.

### Viewing Test Results

After a test runs, you can view the test results on the console. When a test fails, a screenshot will be captured showing the state when it failed. The screenshots are saved to `./tests/ui/errorShots/`. The test run will display the filename for a failed test:

Example:

```none
Screenshot location: ./tests/ui/errorShots/should-meet-initial-conditions.png
```

Also, you could open and inspect the built testing apps under `./tests/ui/dist`. If you have globally installed the `serve` command with `npm install -g serve` you can start the server like this:

```bash
serve tests/ui/dist
```

### How to add UI tests

If you want to change or add UI test cases of the existing component, you may edit `ComponentName-specs.js` file under `./tests/ui/specs/ComponentName` directory and `Component-View.js` under `./tests/ui/apps/ComponentName`.

But for adding a new component case, create an app for testing in `./tests/ui/apps` and a corresponding test file in `./tests/ui/specs`.

    + tests
        + ui
            + apps
                + testComponent
                    testComponent-View.js		<-- create an app here
            + specs
                + testComponent
                    testComponent-specs.js		<-- create a spec file here

Let's say you created a Button component. To test the component, you could write something like:

* Button-View.js

```JS
import Button from '../../../../Button';
import ThemeDecorator from '../../../../ThemeDecorator';

const app = (props) => <div {...props}>
	<div>
		<Button
			id="button"
		>
			Default Button
		</Button>
	</div>
</div>;

export default ThemeDecorator(app);
```

* Button-specs.js

```JS
const Page = require('@enact/ui-test-utils/utils');

describe('Button', function () {

	beforeEach(async function () {
		await Page.open();
	});
    
    const {buttonDefault} = Page.components;

	describe('pointer', function () {
		it('should focus first when hovered', async function () {
			await buttonDefault.hover();
			expect(await buttonDefault.self.isFocused()).to.be.true();
		});
	});
});
```

Please refer to the existing UI test cases of other Sandstone components. It should be a great example for you. Also, there are useful helper functions in [@enact/ui-test-utils/utils](https://github.com/enactjs/ui-test-utils/tree/master/utils).

## Screenshot Testing

When you are adding or changing Enact component in terms of visual appearance, you would want to add or change the Screenshot tests of that component.

Screenshot testing is a test that compares and assures two different outputs. For the first test without any reference, all results are saved in the `./tests/screenshot/dist/reference` and they become `reference` for later tests. In the second run, all results are saved in the `./tests/screenshot/dist/screen` and compare the `screen` with the `reference`.

### How to run Screenshot tests

To run the Screenshot testing from Sandstone directory, run the following command:

```bash
npm run test-ss
```

It will start to run all the existing Screenshot test cases in Sandstone.

If you run the tests of specific component(s), run the following command:

```bash
npm run test-ui -- --component <pattern>
```

Check out [here](https://github.com/enactjs/ui-test-utils/blob/master/README.md#filtering-screenshot-by-component) for more options.

### Viewing Test Results

After a test runs, if new screenshots are generated, a page is created with links to open each of the images. To open this file (on a Mac):

```bash
open tests/screenshot/dist/newFiles.html
```

If there are test failures, a failure log is created that contains links to the sets of images. To open this file (on a Mac):

```bash
open tests/screenshot/dist/failedTests.html
```

Images can be navigated using the keyboard arrow keys. Click on an image to zoom in.  Click out of the image to zoom out.

In the output, the **test case** button opens the sample app with the parameters that produced the output. This requires that a server be running on port 5000. If you have globally installed the `serve` command with `npm install -g serve` you can start the server like this:

```bash
serve tests/screenshot/dist
```

### How to add Screenshot tests

If you want to change or add Screenshot test cases of the existing component, you may edit `ComponentName.js` file under `./tests/screenshot/apps/components` directory.

But for adding a new component case, create an app for testing in `./tests/screenshot/apps/components` and add your component to the `./tests/screenshot/apps/SandstoneComponents.js`.

    + tests
        + screenshot
            + apps
                + components
                    NewComponent.js		    <-- create an app here
                SandstoneComponents.js		<-- add your component here

Let's say you created a Button component. To test the component, you could write something like:

* Button.js

```JS
import Button from '../../../../Button';

const ButtonTests = [
	<Button> Hello <Button>
];

export default ButtonTests;
```

And add your component to the `SandstoneComponents.js` and `importer.js` file like:

* importer.js

```JS
import Button from '../../../Button';

const components = {
	ActionGuide,
	Alert,
	BodyText,
	Button, // Added here!
	//...
};
```

* SandstoneComponents.js

```JS
import Button from './components/Button';

const components = {
	ActionGuide,
	Alert,
	BodyText,
	Button, // Added here!
	//...
};
```
Check out the existing Screenshot test cases of other Sandstone components. Also, there are useful helper functions in [utils](https://github.com/enactjs/sandstone/blob/master/tests/screenshot/apps/components/utils.js).


If you have any problem regarding automated UI tests, please let us know via [gitter channel](https://gitter.im/EnactJS/Lobby/~chat#share).
