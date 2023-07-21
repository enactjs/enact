# Core

Enact core library is the set of essential building blocks for an Enact-based application.

Enact core provides several abstractions to be used with React-based applications.  These include `core/kind`, a
factory for stateless functional components (SFC's), `core/jobs`, a smart wrapper for `window.setTimeout`,
`core/hoc`, a Higher Order Component (HOC) factory, and more.

## Install

```
npm install --save @enact/core
```

## Test

Unit tests are implemented in Testing Library and are run with Jest. To execute them:

```
npm test
```