---
title: Using webOS Features
---

## Built-in webOS Events

Included within the webOS system itself are the following custom document events:

*   `webOSLaunch`: Dispatched when the application launches and the launch parameters are received. The launch parameters are included within the event data. Note that this does not necessarily mean that the application has been loaded or rendered.
*   `webOSRelaunch`: Dispatched when an already-running application is launched, potentially with new launch parameters.
*   `webOSLocaleChange`: Dispatched when the system changes its language settings.

To listen for these events, you can use the global dispatcher's `on()` method.

```
import {off, on} from '@enact/core/dispatcher';
...
const handleLaunch = () => {
  console.log('APP LAUNCH');
};
on('webOSLaunch', handleLaunch, window);
...
```

## `@enact/webos`

The `@enact/webos` library has a number of features designed exclusively for the webOS platform, including service integration
with LS2Request and other useful platform APIs.

*   `@enact/webos/application` - provides information about the application metadata
*   `@enact/webos/deviceinfo` - returns various details about the webOS device where the application is running
*   `@enact/webos/keyboard` - use to see if the keyboard is currently visible
*   `@enact/webos/LS2Request` - without this, your application cannot use the myriad webOS services that are available!
    *    [Luna Service API](./luna-service-api.md) example
*   `@enact/webos/platform` - returns various details about the webOS platform where the application is running (SmartTV, Open webOS, legacy devices (Palm, HP), etc.)
*   `@enact/webos/pmloglib` - system-level logging for your application
*   `@enact/webos/speech` - working with webOS speech APIs
