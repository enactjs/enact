import {action} from '@enact/storybook-utils/addons/actions';
import BodyText from '@enact/moonstone/BodyText';
import {boolean, select, text} from '@enact/storybook-utils/addons/knobs';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import Popup from '@enact/moonstone/Popup';
import React from 'react';
import {storiesOf} from '@storybook/react';

const Config = mergeComponentMetadata('Popup', Popup);

storiesOf('Moonstone', module)
	.add(
		'Popup',
		() => (
			<div>
				<Popup
					open={boolean('open', Config)}
					noAnimation={boolean('noAnimation', Config)}
					noAutoDismiss={boolean('noAutoDismiss', Config)}
					onClose={action('onClose')}
					onHide={action('onHide')}
					onShow={action('onShow')}
					scrimType={select('scrimType', ['none', 'translucent', 'transparent'], Config, 'translucent')}
					showCloseButton={boolean('showCloseButton', Config)}
					spotlightRestrict={select('spotlightRestrict', ['self-first', 'self-only'], Config, 'self-only')}
				>
					<div>{text('children', Config, 'Hello Popup')}</div>
				</Popup>
				<BodyText centered>Use KNOBS to interact with Popup.</BodyText>
			</div>
		),
		{
			info: {
				text: 'Basic usage of Popup'
			}
		}
	);
