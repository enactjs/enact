---
title: Screenshot Testing
---

## What is Screenshot Testing
Enact supports automated screenshot testing. It takes a screenshot of the component and compares it to a reference image. Enact has ui-test-utils package which includes the common WebDriver configurations and some utility modules for executing automated screenshot tests from Enact UI packages.

## Prerequisites
Clone sandstone from GitHub, install dependencies and connect the modules using Lerna:

```shell
# clone the repo!
git clone git@github.com:enactjs/sandstone.git
# move in
cd sandstone
# we're using git flow so develop is our working branch
git checkout develop
# install lerna
npm install
```

## Creating Tests
Within the UI Library, create an app for testing in `./tests/screenshot/apps` and add your component to the `./tests/screenshot/apps/SandstoneComponents.js`.

	+ src
		+ tests
			+ screenshot
				+ apps
					+ component
						+ testComponent
							testComponent.js		<-- create app here
					SandstoneComponents.js		<-- add your component here

Say you created the Button component. To test the component, we could write something like:

* Button.js

```JS
import Button from '../../../../Button';

const ButtonTests = [
	<Button> Hello <Button>
];

export default ButtonTests;
```

And add your component to the `SandstoneComponents.js` file like:

* SandstoneComponents.js

```JS
import Button from './components/Button';

const components = {
	ActionGuide,
	Alert,
	BodyText,
	Button,
	//...
};
```

For details on the relevant APIs or options, please see [ui-test-utils](https://github.com/enactjs/ui-test-utils).

## Running Tests
```bash
npm run test-ss
```

### Filtering Screenshot by Component:
```bash
npm run test-ss -- --component <pattern>
```

### Re-run tests without building:
```bash
npm run test-ss -- --skip-build
```

### Running with filtering by component and without building:
```bash
npm run test-ss -- --component <pattern> --skip-build
```

Note: `pattern` may need to be in quotes to prevent expansion on the command line if you use a regex.

## Viewing Test Results

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
