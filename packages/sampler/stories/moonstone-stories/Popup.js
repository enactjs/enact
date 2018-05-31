import Popup from '@enact/moonstone/Popup';
import BodyText from '@enact/moonstone/BodyText';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

storiesOf('Moonstone', module)
	.add(
		'Popup',
		withInfo({
			propTablesExclude: [Popup],
			text: 'Basic usage of Popup'
		})(() => (
			<div>
				<Popup
					open={boolean('open', false)}
					noAnimation={boolean('noAnimation', false)}
					noAutoDismiss={boolean('noAutoDismiss', false)}
					onClose={action('onClose')}
					onHide={action('onHide')}
					onShow={action('onShow')}
					scrimType={select('scrimType', ['none', 'translucent', 'transparent'], 'translucent')}
					showCloseButton={boolean('showCloseButton', false)}
					spotlightRestrict={select('spotlightRestrict', ['self-first', 'self-only'], 'self-only')}
				>
					<div>{text('children', 'Hello Popup')}</div>
				</Popup>
				<BodyText centered>Use KNOBS to interact with Popup.</BodyText>
			</div>
		))
	);
