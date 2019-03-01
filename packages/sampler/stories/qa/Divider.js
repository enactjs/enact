import BodyText from '@enact/moonstone/BodyText';
import Divider from '@enact/moonstone/Divider';
import Item from '@enact/moonstone/Item';
import ri from '@enact/ui/resolution';
import Scroller from '@enact/moonstone/Scroller';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {select, text} from '../../src/enact-knobs';

import {Marquee} from '@enact/moonstone/Marquee';
import {Button} from '@enact/moonstone/Button';
import {CheckboxItem} from '@enact/moonstone/CheckboxItem';
import {ExpandableInput} from '@enact/moonstone/ExpandableInput';
import {ExpandableList} from '@enact/moonstone/ExpandableList';
import {FormCheckboxItem} from '@enact/moonstone/FormCheckboxItem';
import {GridListImageItem} from '@enact/moonstone/GridListImageItem';
import {Input} from '@enact/moonstone/Input';
import {LabeledItem} from '@enact/moonstone/LabeledItem';
import {SelectableItem} from '@enact/moonstone/SelectableItem';
import {SwitchItem} from '@enact/moonstone/SwitchItem';

Divider.displayName = 'Divider';

const
	prop = {
		tallText: {'नरेंद्र मोदी': 'नरेंद्र मोदी', 'ฟิ้  ไั  ஒ  து': 'ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ': 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'},
		marqueeOn: ['', 'hover', 'render']
	};

storiesOf('Divider', module)
	.add(
		'with long text',
		() => (
			<Divider
				marqueeOn={select('marqueeOn', prop.marqueeOn, Divider)}
			>
				{text('children', Divider, 'This long text is for the marquee test in divider component. This long text is for the marquee test in divider component. This long text is for the marquee test in divider component.')}
			</Divider>
		)
	)

	.add(
		'with tall characters',
		() => (
			<Divider>
				{select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}
			</Divider>
		)
	)

	.add(
		'with an element below',
		() => (
			<div>
				<BodyText>
					Adjust the spacing prop to see how the Divider is positioned with respect to the element below.
				</BodyText>
				<Divider
					spacing={select('spacing', ['normal', 'small', 'medium', 'large', 'none'], Divider)}
				>
					{text('children', Divider, 'Hello World')}
				</Divider>
				<Item>
					Some content below
				</Item>
			</div>
		)
	)

	.add(
		'Multiple',
		() => (
			<div>
				<Divider>First Divider</Divider>
				<Item>Item 11</Item>
				<Item>Item 12</Item>
				<Item>Item 13</Item>
				<Divider>Second Divider</Divider>
				<Item>Item 21</Item>
				<Item>Item 22</Item>
				<Item>Item 23</Item>
				<Divider>Third Divider</Divider>
				<Item>Item 31</Item>
				<Item>Item 32</Item>
				<Item>Item 33</Item>
				<Divider>Fourth Divider</Divider>
				<Item>Item 41</Item>
				<Item>Item 42</Item>
			</div>
		)
	)

	.add(
		'Multiple Scroller',
		() => (
			<Scroller
				horizontal="auto"
				style={{
					height: ri.unit(552, 'rem'),
					width: '100%'
				}}
				vertical="auto"
			>
				<div
					style={{
						height: ri.unit(1002, 'rem'),
						width: ri.unit(2001, 'rem')
					}}
				>
					<Divider>First Divider</Divider>
					<Item>Item 11</Item>
					<Item>Item 12</Item>
					<Item>Item 13</Item>
					<Divider>Second Divider</Divider>
					<Item>Item 21</Item>
					<Item>Item 22</Item>
					<Item>Item 23</Item>
					<Divider>Third Divider</Divider>
					<Item>Item 31</Item>
					<Item>Item 32</Item>
					<Item>Item 33</Item>
					<Divider>Fourth Divider</Divider>
					<Item>Item 41</Item>
					<Item>Item 42</Item>
				</div>
			</Scroller>
		)
	).add(
		'Tall Glyphs as Non-Latin components',
		() => (
			<Scroller style={{height: '100%'}}>
				<Divider>Problem</Divider>
				<Marquee>{select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}</Marquee>
				<GridListImageItem caption={select('children', prop.tallText, Divider, 'नरेंद्र मोदी')} style={{height: 200}} />
				<Divider>No Problem</Divider>
				<div>{select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}</div>
				<BodyText>{select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}</BodyText>
				<Button>{select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}</Button>
				<CheckboxItem>{select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}</CheckboxItem>
				<Divider>{select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}</Divider>
				<ExpandableInput title={select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}>{select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}</ExpandableInput>
				<ExpandableList title={select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}>{[select('children', prop.tallText, Divider, 'नरेंद्र मोदी')]}</ExpandableList>
				<FormCheckboxItem>{select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}</FormCheckboxItem>
				<Input value={select('children', prop.tallText, Divider, 'नरेंद्र मोदी')} />
				<LabeledItem label={select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}>{select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}</LabeledItem>
				<SelectableItem>{select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}</SelectableItem>
				<SwitchItem>{select('children', prop.tallText, Divider, 'नरेंद्र मोदी')}</SwitchItem>
			</Scroller>
		)
	);
