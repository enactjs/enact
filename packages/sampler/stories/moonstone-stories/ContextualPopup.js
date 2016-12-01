import {ContextualPopupDecorator} from '@enact/moonstone/ContextualPopup';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text, select} from '@kadira/storybook-addon-knobs';

const ContextualButton = ContextualPopupDecorator(Button);
ContextualButton.displayName = 'ContextualButton';

storiesOf('ContextualPopup')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ContextualPopup',
		() => {
			const renderPopup = () => (
				<div>{text('popup string', 'Hello Contextual Popup')}</div>
			);
			return (
				<div style={{textAlign: 'center'}}>
					<ContextualButton
						direction={select('direction', ['up', 'down', 'left', 'right'], 'down')}
						onClick={action('onClick')}
						onCloseButtonClick={action('onCloseButtonClick')}
						open={boolean('open', false)}
						showCloseButton={boolean('showCloseButton', false)}
						popupComponent={renderPopup}
					>
						{text('button string', 'Hello Contextual Button')}
					</ContextualButton>
				</div>
			);
		});
