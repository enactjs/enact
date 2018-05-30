import Button from '@enact/moonstone/Button';
import Popup from '@enact/moonstone/Popup';
import React from 'react';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text, select} from '@storybook/addon-knobs';

const Container = SpotlightContainerDecorator('div');

storiesOf('Popup', module)
	.add(
		'using spotlightRestrict',
		() => (
			<div>
				<p>
					The contents of the popup below should contain the only controls that can be
					navigated to using 5-way. This is because the popup is using a `spotlightRestrict`
					value of `self-only`. If the value changes to `self-first`, the other panel controls
					can receive focus, but priority will be given to controls within the popup first.
				</p>
				<Button>Button</Button>
				<Popup
					open={boolean('open', true)}
					noAnimation={boolean('noAnimation', false)}
					noAutoDismiss={boolean('noAutoDismiss', false)}
					onClose={action('onClose')}
					showCloseButton={boolean('showCloseButton', true)}
					spotlightRestrict={select('spotlightRestrict', ['self-first', 'self-only'], 'self-only')}
				>
					<div>{text('children', 'Hello Popup')}</div>
					<br />
					<Container>
						<Button>Button</Button>
					</Container>
				</Popup>
			</div>
		)
	);
