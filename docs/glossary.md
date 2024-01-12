---
title: Glossary
toc: 0
---

## Terms

### 5-way mode
One of two `@enact/spotlight` modes.  In 5-way mode, the focused element can be changed with direction keys and an element will always have focus.
#### See also
*   [Spotlight](#spotlight)

### component
A small, reusable piece of code that that returns an element to render.
#### See also
*   [https://reactjs.org/docs/glossary.html#components](https://reactjs.org/docs/glossary.html#components)

### computed property
A feature of components created with `@enact/core/kind`.  Computed properties are functions that receive component `props` (but not other computed properties) and return a value.  These are then available in the `props` at render time.
#### See also
*  [enact/core/kind](../../modules/core/kind)

### Date
#### See also
*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

### element
Describes what you want to see on the screen, such as a heading DOM element with some text: `<h1>I'm an element!</h1>`.
#### See also
*   [https://reactjs.org/docs/glossary.html#elements](https://reactjs.org/docs/glossary.html#elements)

### event
React (and therefore Enact) uses `SyntheticEvents` to provide a cross-browser wrapper around native browser events.  The `@enact/core/handle` module simplifies writing consistent handlers for components created with `kind()` or as ES6 classes where the event properties can be sourced differently.
#### See also
*   [Synthetic Events - React](https://react.dev/reference/react-dom/components/common)
*   [Handling Events - React](https://react.dev/learn/responding-to-events)
*   [enact/core/handle](../../modules/core/handle)

### higher-order component
A higher-order component provides reusable logic that can be applied to other components.
#### See also
*    [Higher-Order Components - React](https://reactjs.org/docs/higher-order-components.html)

### HOC
An acronym for 'higher-order component'.
#### See also
*   [higher-order component](#higher-order-component)

### i18n
`i18n` is an abbreviation for 'internationalization' where the middle 18 letters are replaced with `18`.  Clever, no?
#### See also
*   [enact/i18n](../../modules/i18n/$L)

### JSX
A JavaScript syntax extension that enables mixing JavaScript code with HTML/XML-like tags.
#### See also
*   [Draft: JSX Specification](https://facebook.github.io/jsx/)

### kind
A kind is a component constructor created using the `@enact/core/kind` factory method.
#### See also
*   [enact/core/kind](../../modules/core/kind)

### layout
The arrangement of components on a page or view. The `@enact/ui/Layout` module provides a collection of components for managing layout.
#### See also
*   [enact/ui/Layout](../../modules/ui/Layout)

### LTR
An acronym for 'left to right' describing locale characteristics.

### Node
#### See also
*   [https://developer.mozilla.org/en-US/docs/Web/API/Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)

### pointer mode
One of two `@enact/spotlight` modes.  In pointer mode, an element will be highlight only if it is spottable and the pointer is hovering over it.
#### See also
*   [Spotlight](#spotlight)

### private
Methods and properties marked as private should not be used by developers. They may be changed or removed without notice and their particular implementations should not be relied upon.

### props
Properties that are passed to a component from its parent component.

### RTL
An acronym for 'right to left' describing locale characteristics.

### Spotlight
Spotlight is an extensible utility that enables users to navigate Enact applications using a keyboard or television remote control.  Focus is managed with a pointing device (pointer mode) or via keyboard/remote control keys (5-way mode).
#### See also
*   [enact/spotlight](../../modules/spotlight)

### Spottable
As a concept, 'spottable' refers to an element that is capable of receiving focus.  As a higher-order component (HOC), `enact/spotlight/Spottable` applies spottable behavior to a component.
#### See also
*   [higher-order component](#higher-order-component)
*   [Spotlight](#spotlight)

### state
Data that is associated with a component that changes over time.  A component manages its own state.
#### See also
*   [https://reactjs.org/docs/glossary.html#state](https://reactjs.org/docs/glossary.html#state)
