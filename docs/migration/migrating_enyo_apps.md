---
title: Migrating Enyo Applications
---

## Overview

You may be attempting to migrate an Enyo application to Enact.  As there is no direct upgrade path, migrating an existing
application (Enyo or not) to Enact can be considered more as an opportunity to aggressively refactor.

>***Please do not attempt to directly port your application. Enact is a wholly different approach to application structure
which is incompatible with the older techniques.***

This guide serves as a basic checklist of things to consider before you begin and is separated into **General Considerations**
(developer tools, Spotlight, data management, etc.) and **webOS Platform Support** (platform APIs, services, etc.).

## General Considerations

This section highlights some of the generic things that should be reviewed when moving an Enyo application to Enact,
regardless of platform.

### Application Structure

>***The framework team strongly encourages developers to use the [`enact-dev`](https://github.com/enyojs/enact-dev) tools to create, test, and deploy your Enact
application.***

Source files are generally arranged in the project like so:
```
project_root/   (package.json lives here)
  resources/    (ilibmanifest.json lives here)
  src/          (this directory may be important)
  webos-meta/   (helpful companion files for packaging webOS applications)
```

#### `enact-dev` vs. `enyo-dev`

The Enact developer tools simplify, yet remain similar to, the Enyo developer tools.

| Activity | `enact-dev` | `enyo-dev` |
| -------- | ----------- | ---------- |
| Create a new project | `enact create` | `enyo init` |
| Create a development build | `npm run pack` | `enyo pack` |
| Create a production build | `npm run pack-p` | `enyo pack -P` |
| Serve a local version of your project for testing | `npm run serve` | `enyo pack`; `enyo serve` |

### Spotlight

Refactoring an Enyo application to Enact affords an opportunity to reevaluate the application's Spotlight usage.  Here
are some things to consider:
*   Does this application use Spotlight containers?
*   Are there any custom Spotlight components?
*   Does the application listen for Spotlight events?
*   Can the overall structure of Spotlight components/navigation be simplified (for example, does the application handle
a majority of the Spotlight navigation events or are there multiple levels of nested containers)?

#### Spotlight Containers

If your application uses Spotlight containers, be sure to review the [Spotlight container documentation](../spotlight/index.md).

#### Custom Spotlight Components

If you have created custom Spotlight components in your application, make sure to review the [Spottable documentation](../spotlight/index.md).

#### Spotlight Events

Spotlight now uses native DOM events and does not dispatch synthetic events to the currently spotted control.  Please review
the [Spotlight event documentation](../spotlight/index.md).

### Data Management

Enyo's `Collection` and `Model` do not have analogs in Enact.  All applications utilizing these components will need a
hefty refactoring of their usage and interactions.

Enact uses the [Flux application architecture](https://facebook.github.io/flux/docs/overview.html#content) paradigm.  For complex data
management and application state management, developers can use [Redux](../redux/index.md).

### View Management

Enact provides `@enact/moonstone/Panels`, which is sufficient for most existing Enyo applications to use.  However, it extends
a more generic `@enact/ui/ViewManager` component that might offer the opportunity to improve an application's overall UX.

## webOS Platform Support

The `@enact/webos` module provides many useful utilities and methods to interact with the webOS platform.

*   `@enact/webos/application` - provides information about the application metadata
*   `@enact/webos/deviceinfo` - returns various details about the webOS device where the application is running
*   `@enact/webos/keyboard` - use to see if the keyboard is currently visible
*   `@enact/webos/LS2Request` - without this, your application cannot use the myriad webOS services that are available!
Almost every Enyo webOS application utilizes service calls.
    *    [Luna Service API](../webos/luna_service_api.md) example
*   `@enact/webos/platform` - returns various details about the webOS platform where the application is running (SmartTV, Open webOS, legacy devices (Palm, HP), etc.)
*   `@enact/webos/pmloglib` - system-level logging for your application
*   `@enact/webos/VoiceReadout` - reads alert text when accessibility VoiceReadout enabled
