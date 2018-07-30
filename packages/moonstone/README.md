# @enact/moonstone [![npm (scoped)](https://img.shields.io/npm/v/@enact/moonstone.svg?style=flat-square)](https://www.npmjs.com/package/@enact/moonstone)

> The set of components for an Enact-based application targeting smart TVs.

## Usage

```
import kind from '@enact/core/kind';
import Button from '@enact/moonstone/Button';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';

const MyApp = kind({
    name: 'MyApp',
    render: () => (<Button>Hello, Enact!</Button>);
});
const MyMoonstoneApp = MoonstoneDecorator(MyApp);
```

> Note: The moonstone decorator must be applied to the base component. This decorator also applies
`@enact/i18n/I18nDecorator`, `@enact/spotlight` and `@enact/ui/resolution` decorators.

## Install

```
npm install --save @enact/moonstone
```

## Test

Tests are implemented in mocha and are run with the Karma runner.

```
npm test
```

## Copyright and License Information

Unless otherwise specified, all content, including all source code files and documentation files in this repository are:

Copyright (c) 2012-2018 LG Electronics

Unless otherwise specified or set forth in the NOTICE file, all content, including all source code files and documentation files in this repository are: Licensed under the Apache License, Version 2.0 (the "License"); you may not use this content except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
