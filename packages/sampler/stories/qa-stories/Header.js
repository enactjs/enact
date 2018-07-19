import {Header} from '@enact/moonstone/Panels';
import Button from '@enact/moonstone/Button';
import Input from '@enact/moonstone/Input';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, text} from '../../src/enact-knobs';

Header.displayName = 'Header';

storiesOf('Header', module)
	.add(
		'with headerComponent',
		() => (
			<Header
				title={text('title', Header, 'Title')}
			>
				<Button small>On / Off</Button>
			</Header>
		)
	)
	.add(
		'with headerComponent, Compact',
		() => (
			<Header
				type="compact"
				title={text('title', Header, 'Title')}
			>
				<Button small>On / Off</Button>
			</Header>
		)
	)
	.add(
		'with titles below',
		() => (
			<Header
				title={text('title', Header, 'Title')}
				titleBelow={text('titleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			/>
		)
	)
	.add(
		'with titles below, Compact',
		() => (
			<Header
				type="compact"
				title={text('title', Header, 'Title')}
				titleBelow={text('titleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			/>
		)
	)
	.add(
		'with titles below and headerComponent',
		() => (
			<Header
				title={text('title', Header, 'Title')}
				titleBelow={text('titleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			>
				<Button small>On / Off</Button>
			</Header>
		)
	)
	.add(
		'with titles below and headerComponent, Compact',
		() => (
			<Header
				type="compact"
				title={text('title', Header, 'Title')}
				titleBelow={text('titleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			>
				<Button small>On / Off</Button>
			</Header>
		)
	)
	.add(
		'with RTL text',
		() => (
			<Header
				title={text('title', Header, 'Title')}
				titleBelow={text('titleBelow', Header, 'כתוביות למט')}
				subTitleBelow={text('subTitleBelow', Header, 'כתוביות למט')}
			/>
		)
	)
	.add(
		'with RTL text, Compact',
		() => (
			<Header
				type="compact"
				title={text('title', Header, 'Title')}
				titleBelow={text('titleBelow', Header, 'כתוביות למט')}
			/>
		)
	)
	.add(
		'with long text and headerComponent',
		() => (
			<Header
				title={text('title', Header, 'Title')}
				titleBelow={text('titleBelow', Header, 'This is a header sample with long titleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			>
				<Button small>On / Off</Button>
			</Header>
		)
	)
	.add(
		'with long text and headerComponent, Compact',
		() => (
			<Header
				type="compact"
				title={text('title', Header, 'Title')}
				titleBelow={text('titleBelow', Header, 'This is a header sample with long titleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			>
				<Button small>On / Off</Button>
			</Header>

		)
	)
	.add(
		'with Input, long text and headerComponent',
		() => {
			const input = boolean('Input Mode', Header, true) ? <Input dismissOnEnter={boolean('Input dismissOnEnter', Header, true)} /> : null;
			return (
				<Header
					title={text('title', Header, 'Title')}
					headerInput={input}
					titleBelow={text('titleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
					subTitleBelow={text('subTitleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				>
					<Button small>On / Off</Button>
				</Header>
			);
		}
	)
	.add(
		'with Input, tall-glyphs, and titles below',
		() => {
			const input = boolean('Input Mode', Header, true) ? <Input dismissOnEnter={boolean('Input dismissOnEnter', Header, true)} /> : null;
			return (
				<Header
					title={text('title', Header, 'ิ้  ไั  ஒ  து': 'ิ้  ไั  ஒ  த')}
					headerInput={input}
					titleBelow={text('titleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
					subTitleBelow={text('subTitleBelow', Header, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				/>
			);
		}
	);
