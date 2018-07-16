import Popup from '@enact/moonstone/Popup';
import BodyText from '@enact/moonstone/BodyText';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Popup', Popup);

storiesOf('Moonstone', module)
	.add(
		'Popup',
		withInfo({
			propTablesExclude: [Popup],
			text: 'Basic usage of Popup'
		})(() => (
			<div>
				<Popup
					open={boolean('open', Config, false)}
					noAnimation={boolean('noAnimation', Config, false)}
					noAutoDismiss={boolean('noAutoDismiss', Config, false)}
					onClose={action('onClose')}
					onHide={action('onHide')}
					onShow={action('onShow')}
					scrimType={select('scrimType', ['none', 'translucent', 'transparent'], Config, 'translucent')}
					showCloseButton={boolean('showCloseButton', Config, false)}
					spotlightRestrict={select('spotlightRestrict', ['self-first', 'self-only'], Config, 'self-only')}
				>
					<div>{text('children', Config, 'Hello Popup')}</div>
				</Popup>
				<BodyText centered>Use KNOBS to interact with Popup.</BodyText>
			</div>
		))
	);
