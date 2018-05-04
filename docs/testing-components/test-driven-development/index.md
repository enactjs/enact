---
title: Test Driven Development(TDD)
---

## Before Getting Started

Please refer to our document [Unit Testing](../unit-testing/index.md), it gives 
the basic information on what unit testing is and how to start unit testing.

## Overview

This document describes the test-first methodology we aspire to on the Enact team.  The concept behind Test Driven
Development (TDD) is that you write tests before you begin implementation.  The theory is that testing helps you think
through the problem and serves as a sort of design for the forthcoming code.  Additionally, the tests serve as a validation
that refactoring has not broken the code.

## Introduction to TDD

TDD is one of the Agile programing tools. As described above, it involves writing tests (which fail) and then writing code
that makes those tests pass.  These tests are unit tests and seek to test individual bits of functionality.  Such tests
usually describe the functionality of the component being created. For a good overview of TDD that balances exigence and
an understanding of how it impacts the development process, check out [this gentle introduction](http://jrsinclair.com/articles/2016/one-weird-trick-that-will-change-the-way-you-code-forever-javascript-tdd/).

## Sample TDD Scenario

Imagine we're going to create the `@enact/moonstone/IconButton` component and that the only requirements we have so far
are that it will have a `<Button>` containing an `<Icon>` as its children and that all properties assigned to the IconButton
should be applied to the Button child except `minWidth`, which should always be `false`.

In this scenario, we would create an empty IconButton component that has no functionality.  Then, we might write a test to
verify that an IconButton with `minWidth={true}` does not change the child component's property.

```js
describe('IconButton Specs', () => {
	
	it('should always maintain minWidth=false for its <Button> child', function () {
		const iconButton = mount(
			<IconButton minWidth>star</IconButton>
		);
		const button = iconButton.find('Button');
		const expected = false;
		const actual = (button.prop('minWidth'));
	
		expect(actual).to.equal(expected);
	});
});
```

If we execute the test at this point it will fail.  We have not implemented any functionality in our IconButton so we
should expect this will fail.  TDD suggests we should write the minimal amount of code that will allow this test to pass.
So, we might write the following code in `IconButton.js`:

```js
const IconButton = () => {
	return (
		<Button minWidth={false}>
			<Icon>star</Icon>
		</Button>
	);
};
```

This will make the test pass, but it's not a very useful IconButton.  Let's add a test to check the requirement that other
properties are applied to the Button child.

```js
it('should apply same prop to <Button> child', function () {
	const iconButton = mount(
		<IconButton small>star</IconButton>
	);
	const button = iconButton.find('Button');
	const expected = true;
	const actual = button.prop('small');
	
	expect(actual).to.equal(expected);
});
```

When we run this test, it will fail.  Now, we can wire up the property correctly and verify our component works.  We can
then add a test for each new piece of functionality and then write the corresponding code to allow the test to pass.

While this process may seem a little naive, it does allow us to focus on writing the minimal amount of code that will solve
the problem at hand.  It serves as a reminder of the YAGNI principle: You Ain't Gonna Need It.  Don't overengineer the
solution.

## Test Method Introduction

We use Mocha and Chai together for our assertions. Chai provides fluent assertions we can use within our tests. While
there are quite a few comparisons it can help to stick to `.to.equal()` and `.to.not.equal()`.  These methods come after
the `expect()` call.

We use Enzyme to render our components for testing. Enzyme can render a component in one of three different ways.  Each
has its benefits and drawbacks.  A summary of the methods follows.

### Shallow Rendering - `shallow()`

[Shallow](https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md) rendering renders the component specified but does not render any of its children.  This can be useful when you
only want to test the output of the single object.  If you need to be able to test that properties get passed to children,
then you will need to use Mount rendering.  Once a component is rendered a number of methods are available to inspect the
output.  These include:

*   `find()` - Returns nodes that match the passed-in selector.  For custom components, usually you can use the name of the control
*   `contains()` - Returns true if a node or array of nodes exist in the render
*   `hasClass()` - Returns true if the component has the specified className
*   `children()` - Returns the children of the component, wrapped so that these methods can be applied. (Note: In shallow render, the children will not be complete)
*   `props()` - Returns the props of the component
*   `prop()` - Returns the value of the specified prop
*   `simulate()` - Simulates an event
*   `instance()` - Returns the instance of the root component
*   `setState()` - Sets the state of the component to the passed-in state
*   `setProps()` - Manually sets the props of the component

### Full Rendering - `mount()`

Full rendering or [mount](https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md) renders the component specified as well as all children.  This can be useful when you need to be able to
test that properties get passed to children. Mount rendering uses the same methods as Shallow rendering listed above.

### Static Rendering - `render()`

Static rendering or [render](https://github.com/airbnb/enzyme/blob/master/docs/api/render.md), generates the HTML output from the specified component.  Static rendering has several utility methods including:

*   `text()` - Returns the text of the selected node
*   `html()` - Returns the raw HTML of the selected node
*   `children()` - Returns the children of the selected node
*   `find()` - searches the node for the passed-in selector