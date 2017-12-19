import {Header} from '@enact/moonstone/Panels';
import SwitchItem from '@enact/moonstone/SwitchItem';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {text} from '@kadira/storybook-addon-knobs';

storiesOf('Header')
	.addWithInfo(
		'with RTL text',
		() => (
			<Header
				casing="preserve"
				type="compact"
				title={text('title', 'Title')}
				titleBelow={text('titleBelow', 'כתוביות למט')}
			/>
		)
	)
	.addWithInfo(
		'Compact type with long text and headerComponent',
		() => (
			<Header
				casing="preserve"
				type="compact"
				title={text('title', 'Title')}
				titleBelow={text('titleBelow', 'This is a header sample with long titleBelow text and header components to test positioning of header components.')}
			>
				<SwitchItem>{'On / Off'}</SwitchItem>
			</Header>

		)
	)
	.addWithInfo(
		'Standard type with long text and headerComponent',
		() => (
			<Header
				casing="preserve"
				title={text('title', 'Title')}
				titleBelow={text('titleBelow', 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			>
				<SwitchItem>{'On / Off'}</SwitchItem>
			</Header>
		)
	);
