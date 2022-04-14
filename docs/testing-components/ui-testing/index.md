---
title: UI Testing
---

## What is the UI Testing
Manual tests are time consuming and sometimes error occurs. A more efficient approach is to create UI tests so that user tasks are executed in an automated test. With UI test, tests can be executed quickly and reliably in a repeatable way. Simply stated, first priority considering is two things.
* how component handles user actions performed via used input devices.
* whether elements correctly work as intended.

## Prerequisites
Created a enact project using the enact cli.

## Setting up a UI Library
1. Add @enact/ui-test-utils as a devDependency: npm i --save-dev @enact/ui-test-utils.

2. Create the tests/ui folder structure within the UI library.

3. Add apps and specs folders to tests/ui.

4. Add local WebDriver configuration files within tests/ui:

	- wdio.conf.js 
	```JS
	module.exports = require('@enact/ui-test-utils/ui/wdio.conf.js');
	```

	- wdio.docker.conf.js
	```JS
	module.exports = require('@enact/ui-test-utils/ui/wdio.docker.conf.js');
	```

	- wdio.tv.conf.js
	```JS
	module.exports = require('@enact/ui-test-utils/ui/wdio.tv.conf.js');
	```

5. Add npm scripts for each of the above configuration files. There are likely other scripts already defined so these will be added to the existing scripts.
```JSON
   "scripts": {
	  "test-ui": "start-tests tests/ui/wdio.conf.js",
	  "test-ui-docker": "start-tests tests/ui/wdio.docker.conf.js",
   }
```

## Creating Tests
Within the UI Library, create an app for testing in `./tests/ui/apps` and create a corresponding test in `./tests/ui/specs`.

	+ src
		+ test
			+ ui
				+ apps
					+testComponent
						testComponent-View.js		<-- create app here
				+ specs
					+ testComponent
						testComponent-specs.js		<-- create spec file here

The Page component from `@enact/ui-test-utils/utils/` Page contains useful methods for loading tests.

## Running Tests
For a single-run, execute `npm run test-ui`. 

* Filtering UI by Component:

	`npm run test-ui -- --spec <name-of-component>`

* Re-run tests without building:

	`npm run test-ui -- --skip-build`

* Running with visible browser:

	`npm run test-ui -- --visible`

* Running with filtering by component and without building:

	`npm run test-ui -- --spec <name-of-component> --skip-build`

## Viewing Test Results
By default, Test result display on console whether pass or fail.
If fail occurs, fail log display in console and you can see the screenshot about fail in `./test/ui/errorShots/`.
Also, you can see the view you made on chrome. This requires that a server be running on port 5000. If you have globally installed the serve command with npm install -g serve you can start the server like this `serve ./test/ui/dist/`.
To open a specific test app, open the URL path for the test. A specific app display as directory in this page. You can see the app as click the app you wanted.