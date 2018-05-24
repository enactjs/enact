# @enact/i18n [![npm (scoped)](https://img.shields.io/npm/v/@enact/i18n.svg?style=flat-square)](https://www.npmjs.com/package/@enact/i18n)

> Internationalization library based on iLib.

`@enact/i18n` provides a decorator that can be used to wrap a root component in a React (or Enact) application.
This decorator provides a context to child components that can be used to determine locale text directionality
and to update the current locale. Additionally, it provides a locale-aware `Uppercase` Higher Order Component (HOC).

## Usage

```
import {I18nDecorator, contextTypes} from '@enact/i18n/I18nDecorator';

const MyComponent = (props, context) => (
    <div>{context.rtl ? "right to left" : "left to right"}</div>
);

// Without contextTypes, your component will not receive context!
MyComponent.contextTypes = contextTypes;

const MyApp = () => (
    <div>
        <MyComponent />
    </div>
);

const MyI18nApp = I18nDecorator(MyApp);
```

`Uppercase` may be used independently of the app decorator. By default, it uppercases the `children` property of
the wrapped component, provided it is a `string`.

```
import Uppercase from '@enact/i18n/Uppercase';

const MyComponent = (props) => (
    <div {...props} />
);

const MyUppercaseComponent = Uppercase(MyComponent);
```
Passing `preserveCase` in the props to `MyUppercaseComponent` will prevent uppercasing.

## Install

```
npm install --save @enact/i18n
```

## Acknowledgments

This module is built upon the [iLib](http://github.com/iLib-js/iLib) library.

## Copyright and License Information

Unless otherwise specified, all content, including all source code files and
documentation files in this repository are:

Copyright (c) 2016-2018 LG Electronics

Unless otherwise specified or set forth in the NOTICE file, all content,
including all source code files and documentation files in this repository are:
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this content except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

This work is based on the Apache-2.0 licensed [iLib](http://sourceforge.net/projects/i18nlib/)
from JEDLSoft.
