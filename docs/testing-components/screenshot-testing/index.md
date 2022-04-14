---
title: Screenshot Testing
---
<nav role="navigation" class="page-toc">

- [What is the Screenshot Testing](#what-is-the-screenshot-testing)
- [Prerequisites](#prerequisites)
- [Setting up a UI Library](#setting-up-a-ui-library)
- [Creating tests](#creating-tests)
- [Running Tests](#running-tests)
- [Viewing Test Results](#viewing-test-results)
- [Reference and Screen](#reference-and-screen)

</nav>

## What is the Screenshot Testing
Screenshot test is visual test that takes a screenshot, then compares it to a reference screenshot file saved. When ui changes, one of the major considering is whether visual changes exist. Some changes may be easy to check, but some changes are hard to check due to very small change. With Screenshot test, very small changes can easily check due to compare pixel-by-pixel. Additionlally, Screenshot testing is the most reliable test for static images. If you want to test animated image or video, you should check result.

## Prerequisites
Created a enact project using the enact cli.

## Setting up a UI Library
1. Add @enact/ui-test-utils as a devDependency: npm i --save-dev @enact/ui-test-utils.

2. Create the tests/screenshot folder structure within the UI library.

3. Add apps and specs folders to tests/screenshot.

4. Add local WebDriver configuration files within tests/screenshot:

	- wdio.conf.js 
	```JS
	module.exports = require('@enact/ui-test-utils/screenshot/wdio.conf.js');
	```

	- wdio.docker.conf.js
	```JS
	module.exports = require('@enact/ui-test-utils/screenshot/wdio.docker.conf.js');
	```

	- wdio.tv.conf.js
	```JS
	module.exports = require('@enact/ui-test-utils/screenshot/wdio.tv.conf.js');
	```

5. Add npm scripts for each of the above configuration files. There are likely other scripts already defined so these will be added to the existing scripts.
```JSON
   "scripts": {
	  "test-ss": "start-tests tests/screenshot/wdio.conf.js",
	  "test-ss-docker": "start-tests tests/screenshot/wdio.docker.conf.js",
   }
```

## Creating tests
Within the UI Library, create an app for testing in `./tests/screenshot/apps` and create a corresponding test in `./tests/screenshot/specs`.

	+ src
		+ test
			+ screenshot
				+ apps
					+ component
						+ testComponent
							testComponent.js		<-- create app here
				+ specs
						testComponent-specs.js		<-- create spec file here

In screenshot test, create apps to test component. Please refer sample code.
* Button.js

```JS
import Button from '../../../../Button';

const ButtonTests = [
	<Button> Hello <Button>
];

export default ButtonTests;
```
And create spec to test additional specification. It is commonly used by all components. Please refer sample code.
* Common-spec.js

```JS
const {Page} = require('@enact/ui-test-utils/utils');
const {runTest} = require('@enact/ui-test-utils/utils');

runTest({
	testName: 'Common',
	Page: Page,
	skin: 'light'
});
```
The generateTestData and Page component from `@enact/ui-test-utils/utils/` generateTestData and Page contain useful methods for screenshot tests.

## Running Tests
For a single-run, execute `npm run test-ss`. 

* Filtering Screenshot by Component:

	`npm run test-ss -- --component <name-of-component>`

* Re-run tests without building:

	`npm run test-ss -- --skip-build`

* Running with filtering by component and without building:

	`npm run test-ss -- --component <name-of-component> --skip-build`

## Viewing Test Results
* After a test runs, if new screenshots are generated, a page is created with links to open each of the images. To open this file (on a Mac): `open tests/screenshot/dist/newFiles.html`
* If there are test failures, a failure log is created that contains links to the sets of images. To open this file (on a Mac): `open tests/screenshot/dist/failedTests.html`
Images can be navigated using the keyboard arrow keys. Click on an image to zoom in. Click out of the image to zoom out.
* In the output, the test case button opens the sample app with the parameters that produced the output. This requires that a server be running on port 5000. If you have globally installed the serve command with npm install -g serve you can start the server like this: `serve tests/screenshot/dist`

## Reference and Screen
Screenshot testing is a test that compares and assures two different outputs. For the first test without any criteria, all results are saved in the `tests/screenshot/dist/reference` and they become criteria for later tests. In Second run, all results are saved in the `tests/screenshot/dist/screen` and compares screen with reference.