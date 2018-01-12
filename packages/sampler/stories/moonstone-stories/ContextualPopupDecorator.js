import {ContextualPopupDecorator} from '@enact/moonstone/ContextualPopupDecorator';
import BodyText from '@enact/moonstone/BodyText';
import Button from '@enact/moonstone/Button';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, text, select} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';

const ContextualButton = ContextualPopupDecorator(Button);
ContextualButton.displayName = 'ContextualButton';

const renderPopup = () => (
	<div>{text('popup string', 'Hello Contextual Popup')}</div>
);

storiesOf('ContextualPopupDecorator')
	.addWithInfo(
		' ',
		'Basic usage of ContextualPopupDecorator',
		() => (
			<div style={{textAlign: 'center', marginTop: ri.unit(99, 'rem')}}>
				<ContextualButton
					direction={select('direction', ['up', 'down', 'left', 'right'], 'down')}
					noAutoDismiss={nullify(boolean('noAutoDismiss', false))}
					onClose={action('onClose')}
					open={boolean('open', false)}
					popupComponent={renderPopup}
					showCloseButton={boolean('showCloseButton', false)}
					spotlightRestrict={select('spotlightRestrict', ['none', 'self-first', 'self-only'], 'self-first')}
				>
					{text('button string', 'Hello Contextual Button')}
				</ContextualButton>
				<BodyText centered>Use KNOBS to interact with the ContextualPopup.</BodyText>
			</div>
		)
	);
