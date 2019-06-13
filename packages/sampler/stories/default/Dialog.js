import Dialog from '@enact/moonstone/Dialog';
import Popup from '@enact/moonstone/Popup';
import BodyText from '@enact/moonstone/BodyText';
import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Dialog', Popup, Dialog);
Dialog.displayName = 'Dialog';

storiesOf('Moonstone', module)
	.add(
		'Dialog',
		withInfo({
			text: 'Basic usage of Dialog'
		})(() => (
			<div>
				<Dialog
					casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], Config, 'upper')}
					// null issue
					noAnimation={boolean('noAnimation', Config)}
					// null issue
					noAutoDismiss={boolean('noAutoDismiss', Config)}
					// null issue
					noDivider={boolean('noDivider', Config)}
					onClose={action('onClose')}
					// null issue
					open={boolean('open', Config)}
					showCloseButton={boolean('showCloseButton', Config)}
				>
					<title>{text('title', Config, 'Hello Dialog')}</title>
					<titleBelow>{text('titleBelow', Config, 'This is an organized dialog')}</titleBelow>
					<span>This dialog has content in it and can be very useful for organizing information
							for the user.</span>
					<buttons>
						<Button>Ok</Button>
						<Button>Nevermind</Button>
					</buttons>
				</Dialog>
				<BodyText centered>Use KNOBS to interact with Dialog.</BodyText>
			</div>
		))
	);
