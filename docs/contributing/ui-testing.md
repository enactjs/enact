---
title: Ui Testing
---
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
# link dependencies
enact link
```

## Creating tests
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
 In UI test, create apps to test view and specs. Please refer sample code.
* Button.js

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

	describe('5-way', function () {
		it('should focus disabled button on 5-way right', async function () {
			await Page.spotlightDown();
			await Page.spotlightSelect();
		});
	});
});
```

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

## Goal of Ui Testing
Manual tests are time-consuming and sometimes error occurs. A more efficient approach is to create UI tests so that user tasks are executed in an automated test. With UI test, tests can be executed quickly and reliably in a repeatable way. Simply stated, first priority considering is two things.
* how component handles user actions performed via input devices.
* whether elements correctly work as intended.