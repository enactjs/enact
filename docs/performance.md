---
title: Enact Performance
---

## Overview

Performance is a critical portion of any application. With `Enact` you can use all the same tools as
you normally would for [`React`](https://reactjs.org/docs/optimizing-performance.html).

## Job

[`Job`](../../modules/core/Job/) is a `util` class that we have included inside our `core` module. It
is a useful wrapper for async things like `setTimeout` and `requestIdleCallback`. Along with those 
wrappers we also provide functionality like `throttling`. 

### Idle

In some modern browsers there is support for
[`requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback).
In `Job` we can access this through `idle`. This is really helpful for having a function call only
when the browser is in an idle state. This is great for functions that do not need to be called
immediately, and can be called asynchnously without blocking the main thread.

```
const importantButNotHighPriority = new Job(doSomething);

this.importantButNotHighPriority.idle();
```

### Throttle

Sometimes a function will fire off too often. For instance lets take something like an `onWheel` event.
This event may fire too often for out liking cauing a bad user experience. To throttle it we can do something like:

```
// We can set up Job like so this. The 2nd argument will set how often the event should fire in milliseconds
const throttleEvent = new Job(doSomething, 100);

// When we run the event we can do this. This will run the event every 100ms even if we fire it more often.
const handleWheel = () => {
	this.throttleWheelInc.throttle();
}

// render
<div onWheel={handleWheel}>Wheel Div</div>
```

## Virtual Lists

React recommends using virtualized lists for large amounts of data. This is for good reason. Virtual
lists drastically reduce the number of repainting and reflowing that normally cause browsers to slow
down. Enact contains our own implementation of a VirtualList that make it easy to achieve this
performane boost.