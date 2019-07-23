---
title: Enact Best Practices
toc: 2
---

## Overview

This document lists some best practices that have been distilled by the Enact framework team.  It is incomplete and you
are encouraged to check for updates when you begin a new Enact project.

## Applications

Developers are strongly encouraged to use the [`enact cli` tools](https://github.com/enactjs/cli) to create a starting
application.

As part of the release of an application, use `npm shrinkwrap` (<a href="https://docs.npmjs.com/cli/shrinkwrap">https://docs.npmjs.com/cli/shrinkwrap</a>)
to lock the versions of the application's dependencies (and all of those dependencies' dependencies, and so on).

> <a href="http://javascript.tutorialhorizon.com/2015/03/21/what-is-npm-shrinkwrap-and-when-is-it-needed/">http://javascript.tutorialhorizon.com/2015/03/21/what-is-npm-shrinkwrap-and-when-is-it-needed/</a>
presents a brief article explaining why and when to use `npm shrinkwrap`.

## Code Conventions

An `enact cli`-created project also provides linting (`npm run lint`) to statically analyze your code.  Additionally, the Enact programming conventions are provided as a separate [module](https://github.com/enactjs/eslint-config-enact) (also included in `enact cli`-created projects).  Developers are encouraged to enable in-editor analysis of their code to catch potential issues as early as possible.  The module documentation details how to set up various editors.

## Components

Application components should be split into container and presentational components.  Presentational components should,
by and large, be stateless functional components (SFCs) that receive their properties from the container components.

## Properties

Naming is hard.  Property names should be adjectives, as they describe how a component will be rendered.  Some examples:
*   Use `centered` not `center` (a verb)
*   Use `justified` not `justify` (you're asking for text to be justified, not invoking an action that justifies it)
*   Callback handlers should be in the present tense:  `onClick` vs. `onClicked`

### Boolean

For a boolean property, its presence indicates `true` and its absence indicates `false`.
> `<MyComponent myBooleanProp />` // myBooleanProp === true; myOtherBooleanProp === false

Boolean properties should always have a `defaultValue` of `false`.  This may require renaming the prop to be a negative
(e.g. `noAnimation`).

### String

String properties do not need to be evaluated as an expression.
> `<MyComponent myStringProp="My String" />` // not `<MyComponent myStringProp={"My String"} />`

## State Management

Framework components should only ever manage UI state.  Applications should be responsible for managing other state using
`setState()` or Redux.
> **NOTE**: Do not directly mutate the `state` object.

If a stateful component is required, a 'Base' stateless version should be created where possible to allow management of
UI state if needed.

### Redux

For webOS applications using Redux and `@enact/webos/LS2Request`: <a href="https://github.com/enactjs/enact/tree/develop/docs/redux">https://github.com/enactjs/enact/tree/develop/docs/redux</a>
