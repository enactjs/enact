---
title: UI Testing
---
## What is UI Testing?
Enact supports automated UI interaction testing. It automates the user's input and tests if the component functions correctly. Enact has ui-test-utils package which includes the common WebDriver configurations and some utility modules for executing automated UI tests from Enact UI packages.

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
Within the UI Library, create an app for testing in `./tests/ui/apps` and create a corresponding test in `./tests/ui/specs`.

	+ src
		+ tests
			+ ui
				+ apps
					+testComponent
						testComponent-View.js		<-- create app here
				+ specs
					+ testComponent
						testComponent-specs.js		<-- create spec file here

Say you created the Button component. To test the component, we could write something like:

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

	describe('5-way', function () {
		it('should focus disabled button on 5-way right', async function () {
			await Page.spotlightDown();
			await Page.spotlightSelect();
		});
	});
});
```

For details on the relevant APIs or options, please see [ui-test-utils](https://github.com/enactjs/ui-test-utils).

## Running Tests
```bash
npm run test-ui
```

### Filtering UI by Component

```bash
npm run test-ui -- --spec <pattern>
```

### Re-run tests without building
```bash
npm run test-ui -- --skip-build
```

### Running with visible browser
```bash
npm run test-ui -- --visible
```

### Running with filtering by component and without building
```bash
npm run test-ui -- --spec <pattern> --skip-build
```

Note: `<pattern>` can also be a regex and may need to be in quotes to prevent expansion on the command line.

## Viewing Test Results
After a test runs, you can view the test results on the console. When a test fails, a screenshot will be captured showing the state when it failed. The screenshots are saved to `./test/ui/errorShots/`. The test run will display the filename for a failed test:

Example:

```none
	Screenshot location: ./tests/ui/errorShots/should-meet-initial-conditions.png
```
In the output, the **test case** button opens the sample app with the parameters that produced the output. This requires that a server be running on port 5000. If you have globally installed the `serve` command with `npm install -g serve` you can start the server like this:

```bash
serve tests/screenshot/dist
```