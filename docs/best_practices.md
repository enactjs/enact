---
title: Enact Best Practices
---

## Applications

Developers are encouraged to write applications that follow these practices:

*   For boolean props, the presence of the prop indicates `true`, and the absence of the prop indicates `false`
*   String prop values do not need to be evaluated as an expression.  For example, use `<MyComponent stringProp="My String" />` and not `...stringProp={"My String"}...`
*   Application components should be split up into container and presentational components.  Presentational components should, by and large, be stateless functional components that receive their props from the container components.
*   Do not directly mutate application state.  Use Redux or setState() when state needs to be changed.
*   For webOS applications using Redux and LS2Request: <a href="https://github.com/enyojs/enact/tree/develop/docs/redux">https://github.com/enyojs/enact/tree/develop/docs/redux</a>
*   When developing an application, use `npm shrinkwrap` (<a href="https://docs.npmjs.com/cli/shrinkwrap">https://docs.npmjs.com/cli/shrinkwrap</a>) to lock the versions of the applications' dependencies (and all of those dependencies' dependencies, and so on).  <a href="http://javascript.tutorialhorizon.com/2015/03/21/what-is-npm-shrinkwrap-and-when-is-it-needed/">http://javascript.tutorialhorizon.com/2015/03/21/what-is-npm-shrinkwrap-and-when-is-it-needed/</a> presents a brief article explaining why and when to use it.

## Framework

These practices are for developers working on Enact framework components:

*   Boolean props should always have a `defaultValue` of `false`.  This may require renaming the prop to be a negative (e.g. `noAnimation`).
*   Framework components should only ever manage UI state.  Applications should be responsible for managing other state.
*   If a stateful component is required, a 'Base' stateless version should be created where possible to allow developers to manage UI state if needed.
*   Naming is hard.  Think well about how the name will be used.  Properties should be adjectives, as the describe how the component will be rendered.  Some examples:
    *   Use `centered` not `center` (a verb)
    *   Use `justified` not `justify` (you're asking for text to be justified, not invoking an action that justifies it)
    *   Callback handlers should be in the present tense:  `onClick` vs. `onClicked`