import Popup, {PopupBase} from '@enact/moonstone/Popup';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

Popup.propTypes = Object.assign({}, PopupBase.propTypes, Popup.propTypes);
Popup.defaultProps = Object.assign({}, PopupBase.defaultProps, Popup.defaultProps);

storiesOf('Popup')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Popup',
		() => (

			<Popup
				open={boolean('open', true)}
				showCloseButton={boolean('showCloseButton', false)}
			>
				<div>{text('children', 'Hello Popup')}</div>
			</Popup>
		));
