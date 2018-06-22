---
title: Enact Performance
---

## Overview

Performance is a critical portion of any application. With `Enact` you can use all the same tools as
you normally would for [`React`](https://reactjs.org/docs/optimizing-performance.html). We recommend
reading this first to gain familiarity with performance testing in `React`.

Some important things to understand are how to use [React's performance timeline](https://reactjs.org/docs/optimizing-performance.html#profiling-components-with-the-chrome-performance-tab),
understand how to use `shouldComponentUpdate` to [avoid reconciliation](https://reactjs.org/docs/optimizing-performance.html#avoid-reconciliation), and learning to
[not mutate data](https://reactjs.org/docs/optimizing-performance.html#the-power-of-not-mutating-data)
if possible.

Inside of `Enact` we provide some useful tools to help you achieve faster performance.

## Job

[`Job`](../../modules/core/util#Job/) is a class that we have included inside our `core` module. It
is a useful wrapper for async things like `setTimeout` and `requestIdleCallback`. Along with those wrappers we also provide functionality like `throttling`. 

### Idle

In some modern browsers, there is support for
[`requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback).
In `Job` we can access this through `idle`. This is really helpful for having a function call only
when the browser is in an idle state. This is great for functions that do not need to be called
immediately and can be called asynchronously without blocking the main thread.

```JavaScript
import {Job} from '@enact/core/util';

const importantButNotHighPriority = new Job(doSomething);

this.importantButNotHighPriority.idle();
```

### Throttle

Sometimes a function will fire off too often. For instance, let's take something like an `onWheel` event.
This event may fire too often for out liking causing a bad user experience. To throttle it we can do something like:

```JavaScript
import {Job} from '@enact/core/util';

// We can set up Job like so this. The 2nd argument will set how often the event should fire in milliseconds
const throttleEvent = new Job(doSomething, 100);

// When we run the event we can do this. This will run the event every 100ms even if we fire it more often.
const handleWheel = () => {
    this.throttleWheelInc.throttle();
}

// render
<div onWheel={handleWheel}>Wheel Div</div>
```

## VirtualList

React recommends using 
[virtualized lists](https://reactjs.org/docs/optimizing-performance.html#virtualize-long-lists) for 
large amounts of data. This is for good reason. Virtual lists drastically reduce the number of
repainting and reflowing that normally cause browsers to slow down. Enact contains our own
implementation of a [`VirtualList`](../../modules/ui/VirtualList/) that make it easy to achieve this
performance boost.

## React Performance Timeline

Since Enact is built on top of React we can use 

This tool is especially helpful in visualizing slowness in a specific component. 

## Production Packing

Enact's `cli` tool provides a no config way to create, test, and build applications. When packing 
your application to production `cli` makes it very simple.

If you want to run your app in production mode run the command below. This will minify and uglify 
all of your code and bundle it into a single file.
```bash
enact pack --production
```

If you wish to generate a static version of the first page you can use. This will create an HTML
representation of your entry page allowing users to see the initial content much faster.

```bash
enact pack --production --isomorphic
```

## perfNow

[`perfNow`](../../modules/core/util#perfNow/) is a nice little wrapper around
[`window.performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) that 
will fall back to [`Date.now`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now). This is
useful for getting higher resolution timestamps to see how long a set of functions take.

```JavaScript
import {perfNow} from '@enact/core/util';

const firstTime = perfNow();

const secondTime = perfNow();

const difference = secondTime - firstTime;
```

## webOS

If you're developing for [`webOS`](http://webosose.org/) using enact we have some tools to help you with that as well. 

We can run a log to see how long an application took to launch with:
```
pmctl perflog-report
```

This will print out some logs that looks like this:

```
Type: AppLaunch
Group: com.webos.app.coolapp
Start time: 2578.59
Process                        MsgID                     Time(s)  +Diff(s)  Extra
surface-manager-starfish       IM_KEY_INPUT              0.0      +0.0      key_value:0 key_code:272
sam                            APP_LAUNCH                0.021    +0.021    status:start_prelaunching
sam                            APP_LAUNCH                0.03     +0.009    status:start_memory_checking
sam                            APP_LAUNCH                0.032    +0.002    status:start_launching
WebAppMgr                      APPLAUNCH_START           0.033    +0.001    APP_ID:com.webos.app.coolapp
WebAppMgr                      APPLOADED                 1.665    +1.632    APP_ID:com.webos.app.coolapp URL:file:///usr/webos/applications/com.webos.app.coolapp/index.html PID:24274
sam                            GET_FOREGROUND_APPINFO    1.838    +0.173
WebAppMgr                      WINDOW_FOCUSIN            1.84     +0.002    APP_ID:com.webos.app.coolapp
Elapsed time (s) : 1.840
```

While this is great, we may want to add some custom timestamps to this log. To achieve this we can
simply add `perfLog` from the `webos` library. It takes three arguments 
`perfLog(MsgID, Type, Group)`. 

We can use it like this.

```
import {perfLog} from '@enact/webos/pmloglib'

perfLog('APP_INTERACTIVE', 'AppLaunch', 'com.webos.app.coolapp');
```

This will now output the same thing we previously had, but with more info.

```
Process                        MsgID                     Time(s)  +Diff(s)  Extra
surface-manager-starfish       IM_KEY_INPUT              0.0      +0.0      key_value:0 key_code:272
sam                            APP_LAUNCH                0.009    +0.009    status:start_prelaunching
sam                            APP_LAUNCH                0.019    +0.01     status:start_memory_checking
sam                            APP_LAUNCH                0.021    +0.002    status:start_launching
WebAppMgr                      APPLAUNCH_START           0.022    +0.001    APP_ID:com.webos.app.coolapp
WebAppMgr                      APPLOADED                 0.6      +0.578    APP_ID:com.webos.app.coolapp URL:file:///usr/palm/applications/com.webos.app.coolapp/index.html PID:20509
sam                            GET_FOREGROUND_APPINFO    1.188    +0.588
WebAppMgr                      WINDOW_FOCUSIN            1.377    +0.189    APP_ID:com.webos.app.coolapp
WebAppMgr                      APP_INTERACTIVE           2.867    +1.49
Elapsed time (s) : 2.867
```