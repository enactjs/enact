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

Imagine we're going to create the `@enact/ui/IconButton` component and that the only requirements we have so far
are that it will have a `<Button>` containing an `<Icon>` as its children and that all properties assigned to the IconButton
should be applied to the Button child except `minWidth`, which should always be `false`.

In this scenario, we would create an empty IconButton component that has no functionality.  Then, we might write a test to
verify that an IconButton with `minWidth={true}` does not change the child component's property.

```js
describe('IconButton Specs', () => {
	
	test('should always maintain minWidth=false for its <Button> child', () => {
		render(<IconButton minWidth>star</IconButton>);
		const button = screen.getByRole('button');

		const expected = 'minWidth';

		expect(button).toHaveClass(expected);
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
test('should apply same prop to <Button> child', function () {
	render(
		<IconButton size="small">star</IconButton>
	);
	const button = screen.getByRole('button');
	const expected = 'small'

	expect(button).toHaveProperty('size', expected);
});
```

When we run this test, it will fail.  Now, we can wire up the property correctly and verify our component works.  We can
then add a test for each new piece of functionality and then write the corresponding code to allow the test to pass.

While this process may seem a little naive, it does allow us to focus on writing the minimal amount of code that will solve
the problem at hand.  It serves as a reminder of the YAGNI principle: You Ain't Gonna Need It.  Don't overengineer the
solution.

## Test Method Introduction

We use `Jest` for our unit testing. While there are quite a few comparisons it can help to stick to `.toBe()` and `.not.toBe()`.  These methods come after
the `expect()` call.

We use React Testing Library to render our components for testing.

### Component Rendering - `render()`

The render method works like this:

```js
const {...Results} = render(<Component {...props} />, {...Options});
```

When we render the component we have a number of render options:

* `{container}` - By default, React Testing Library will create a div and append that div to the document.body and this is where your React component will be rendered. If you provide your own HTMLElement container via this option, it will not be appended to the document.body automatically
* `{baseElement}` - If the container is specified, then this defaults to that, otherwise this defaults to document.body. This is used as the base element for the queries as well as what is printed when you use debug()
* `{hydrate}` - If hydrate is set to true, then it will render with ReactDOM.hydrate. This may be useful if you are using server-side rendering and use ReactDOM.hydrate to mount your components.
* `{legacyRoot}` - Used for apps that requires rendering like in React 17 or older
* `{wrapper}` - Pass a React Component as the wrapper option to have it rendered around the inner elementReturns the props of the component
* `{queries}` - Queries to bind. Overrides the default set from DOM Testing Library unless merged.

There are also some render Results:

* `{queries}` -  The most important feature of render is that the queries from DOM Testing Library are automatically returned with their first argument bound to the baseElement, which defaults to document.body. See [Queries](https://testing-library.com/docs/queries/about/) for a complete list.
* `{container}` - The containing DOM node of your rendered React Element (rendered using ReactDOM.render)
* `{baseElement}` - If the container is specified, then this defaults to that, otherwise this defaults to document.body. This is used as the base element for the queries as well as what is printed when you use debug()
* `{hydrate}` - If hydrate is set to true, then it will render with ReactDOM.hydrate. This may be useful if you are using server-side rendering and use ReactDOM.hydrate to mount your components
* `{debug}` - This method is a shortcut for console.log(prettyDOM(baseElement))
* `{rerender}` - This function can be used to update props of the rendered component
* `{unmount}` - This will cause the rendered component to be unmounted
* `{asFragment}` - Returns a DocumentFragment of your rendered component

