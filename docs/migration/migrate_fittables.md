---
title: Migrating Enyo Fittables
---

Enact does not provide Enyo's **Fittable** components.  If you are porting an Enyo application that uses
Fittables (`FittableColumns`, `FittableRows`, `FittableLayout`, etc.) to Enact, you can use other methods,
such as the **CSS Flexible Box Layout Module** (flexbox).  Level 1 is currently a [W3C Last Call Working Draft](https://www.w3.org/Consortium/Process-20010208/tr.html#last-call) and is widely supported by modern browsers.

Using flexbox has some performance implications, so consider that a basic column layout can often be
obtained simply by applying the `display: inline-block` style to the children of a component.  Most Enact
components have `display: block` style (row layout) by default.

### Fittables

For a brief refresher, Fittables allowed you to specify how to fit child components by using either the
`FittableRowsLayout` or the `FittableColumnsLayout` as well as letting you specify a single child
component to 'fit' the available space after the other child components were rendered (or given a size).

#### Example

This example demonstrates a simple usage of Fittables.  Note that only one child component can have
`fit: true`.  The named `fitter` component will stretch to fill the space of `fittableColumn`.
```
...
components: [
	{name: 'fittableColumn', layoutKind: FittableColumnsLayout, components: [
		{style: 'width: 5em;'},
		{name: 'fitter', fit: true},
		{style: 'width: 5em;'}
	]}
]
...
```

### Flexbox Layout

Using flexbox allows you to take even finer-grained control over how and where child nodes are laid out.
A point to note between Fittables and flexbox is how you consider a **row** and a **column**.  In the
Fittable example, the `FittableColumnsLayout` component behaves as a row (the child components are the
'columns' for that row) similarly to specifying `flex-direction: row` style for a flex container.

#### Example

This is a simple example of creating a `FittableColumnsLayout` style with Enact and flexbox. This
example uses inline `style` tags, though using CSS classes would be preferable.
```
<div style={{display: "flex"}}>
	<div style="width: 5em;">A</div>
	<div style={{flexGrow: 1}}>B</div>
	<div style="width: 5em;">C</div>
</div>
```
Note: To keep other children from shrinking, you can apply `flexShrink: 0` style to them.

#### See Also
*   [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
