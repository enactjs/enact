import Popup, {PopupBase} from '@enact/moonstone/Popup';
import BodyText from '@enact/moonstone/BodyText';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text, select} from '@kadira/storybook-addon-knobs';

Popup.propTypes = Object.assign({}, PopupBase.propTypes, Popup.propTypes);
Popup.defaultProps = Object.assign({}, PopupBase.defaultProps, Popup.defaultProps);

storiesOf('Popup')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Popup',
		() => (
			<div>
				<Popup
					open={boolean('open', false)}
					noAnimation={boolean('noAnimation', false)}
					noAutoDismiss={boolean('noAutoDismiss', false)}
					onClose={action('onClose')}
					showCloseButton={boolean('showCloseButton', false)}
					spotlightRestrict={select('spotlightRestrict', ['none', 'self-first', 'self-only'], 'self-only')}
					onHide={(action('onHide'))}
				>
					<div>{text('children', 'Hello Popup')}</div>
				</Popup>
				<BodyText centered>Use KNOBS to interact with Popup.</BodyText>
			</div>
		));
