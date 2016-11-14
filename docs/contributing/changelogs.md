<section>

## Documenting Changes

Avid developers often wonder if they are doing the right thing when it comes to the CHANGELOG.md file. If this describes
you, fear not. This guide will help you understand this humble file and its use within the Enact framework.

### Locations

Each Enact library and tool has its own CHANGELOG.md file. This file is located in the corresponding base directory
(e.g. The CHANGELOG.md for Moonstone is located in `enact/packages/moonstone`). The Enact monorepo also has a root-level
CHANGELOG.md. Developers will primarily concern themselves with the versions located in the libraries and the tools as
the root level is only updated before releases.

### Etiquette

Developers making API changes, adding or removing components or changing user or developer visible functionality should
update the CHANGELOG.md file to call attention to the change. When deciding what to report, err on the side of too much
information rather than too little. Some examples may help illustrate this:

#### Should document

*   Changed the alignment of text within a control
*   Renamed a property
*   Deprecated a component

#### Probably do not need to document

*   Refactored code
*   Fixed a non-user-visible bug

Comments should be written as markdown and each should begin with a bullet `*`. Component names should be wrapped in ``  `  ``
and include the library name (\`moonstone/Component\`, for example).

### Sections

Each release has its own section within the CHANGELOG.md file. Unreleased changes appear in a section titled `unreleased`.
This section is where developers should insert new entries.

The following sub-sections are available:

#### Added

This section is used to call attention to new features, properties and components. In this section, it should be assumed
that the word 'Added' appears before the text. Example:

```
* `moonstone/NewComponent` Component
```

#### Changed

This section highlights changes to existing features, properties and components. Example:

```
* `moonstone/ChangedComponent` to no longer accept the `invalid` property
```

#### Fixed

This section is for highlighting bug fixes that affect developers and end users. If a bug fix actually changes the
functionality of a component, it should likely be listed in the Changed section. Example:

```
* Issue that caused mouse cursor to display upside down
```

</section>