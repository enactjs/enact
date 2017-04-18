import Popup, {PopupBase} from '@enact/moonstone/Popup';
import BodyText from '@enact/moonstone/BodyText';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select, text, withKnobs} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Popup', PopupBase, Popup);

storiesOf('Popup')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Popup',
		() => (
			<div>
				<Popup
					disabled={nullify(boolean('disabled', false))}
					noAnimation={boolean('noAnimation', false)}
					noAutoDismiss={boolean('noAutoDismiss', false)}
					onClose={action('onClose')}
					open={boolean('open', false)}
					showCloseButton={boolean('showCloseButton', false)}
					spotlightRestrict={select('spotlightRestrict', ['none', 'self-first', 'self-only'], 'self-only')}
				>
					<div>{text('children', 'Hello Popup')}</div>
				</Popup>
				<BodyText centered>Use KNOBS to interact with Popup.</BodyText>
			</div>
		),
		{propTables: [Config]}
	);
