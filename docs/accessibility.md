---
title: Accessibility Support in Enact
---

We recognize that applications built using our framework should be usable by anyone regardless of ability. As a result, accessibility has been a key concern for Enact since inception.

## Roles

Many of our components replace native implementations with styled, feature-filled alternatives. In some cases, this means that we lose some of the native semantic meaning and accessibility. Fortunately, this can be solved by assigning [ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#Roles) to those custom components. When possible, we've assigned the relevant role to each of our custom components but that can be overridden by users, if needed.

```
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import React from 'react';

const App = (props) => {
    return (
        <div {...props}>
            /* Renders a CheckboxItem with the default role, checkbox */
            <CheckboxItem>Sign me up for Enact news!</CheckboxItem>
            /* Renders a CheckboxItem with the custom role, menuitemcheckbox */
            <CheckboxItem role="menuitemcheckbox">Sign me up for Enact news!</CheckboxItem>
        </div>
    );
};
```

## Attributes

There are also a set of ARIA attributes that reflect the current state of a component such as `aria-checked` for a checkbox or `aria-valuetext` for a slider. In these cases, Enact will map the public prop (e.g. `selected` or `value`) to the appropriate ARIA attribute.

> In `@enact/moonstone`, some components include additional ARIA configurations specific to webOS. Those may be (or may soon be) overridden by consumers to suit their own requirements.

## Custom Components

We've included a few custom components that may be useful to build accessible applications. None are required but provide some syntactic sugar ease development.

### moonstone/Region

[moonstone/Region](../../modules/moonstone/Region/) provides a labeled region to group components. The `title` is wrapped by a [moonstone/Divider](../../modules/moonstone/Divider/) to provide visual context to the `children`. The Divider and `children` are wrapped by a `<div role="region">` with its `aria-label` set to the `title` to provide aural context.

```
import Region from '@enact/moonstone/Region';
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import Group from '@enact/ui/Group';
import React from 'react';

const App = () => {
    return (
        <Region title="Select an Option">
            <Group childComponent={CheckboxItem} selectedProp="selected">
                {items}
            </Group>
        </Region>
    );
};
```

### ui/A11yDecorator

[ui/A11yDecorator](../../modules/ui/A11yDecorator/) is a Higher-Order Component that helps provide constant hint text to precede or follow the `aria-label` for a component. This is most useful in cases where the `aria-label` changes but the content before or after it is constant.

```
import A11yDecorator from '@enact/ui/A11yDecorator';

import CustomComponent from './components/CustomComponent';

const Component = A11yDecorator(CustomComponent);

const App = (props) => {
    return (
        /* 
         * passes aria-label to CustomComponent with accessibilityPreHint, props.label, and
         * accessibiltyHint joined together with spaces
         */
        <Component
            accessibilityPreHint="before text"
            aria-label={props.label}
            accessibilityHint="after text"
        />
    );
};
```

### ui/AnnounceDecorator

[ui/AnnounceDecorator](../../modules/ui/AnnounceDecorator/) provides a Higher-Order Component that adds the ability for the Wrapped component to notify the user of a state change. It provides a callback to the Wrapped component that can be called with a string which is inserted into a node with the [`alert` role](https://www.w3.org/TR/wai-aria/#alert) to notify the user.

```
import AnnounceDecorator from '@enact/ui/AnnounceDecorator';
import React from 'react';

const ExampleComponentBase = class extends React.Component {
    static propTypes = {
        // passed by AnnounceDecorator
        announce: PropTypes.func
    }

    notify = () => {
        const {announce} = this.props;
        announce('this text will be alerted to user by TTS');
    }

    render () {
        <div>
            <button onClick={this.notify}>Notify on Click</button>
        </div>
    }
};

const ExampleComponent = AnnounceDecorator(ExampleComponentBase);

const App = (props) => {
    return (
        /* when clicked, the user will be alerted with 'this text will be alerted to user by TTS' */
        <ExampleComponent />
    );
};
```
