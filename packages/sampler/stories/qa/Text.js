import BodyText from '@enact/moonstone/BodyText';
import Button from '@enact/moonstone/Button';
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import Divider from '@enact/moonstone/Divider';
import ExpandableInput from '@enact/moonstone/ExpandableInput';
import ExpandableList from '@enact/moonstone/ExpandableList';
import ExpandablePicker from '@enact/moonstone/ExpandablePicker';
import FormCheckboxItem from '@enact/moonstone/FormCheckboxItem';
import GridListImageItem from '@enact/moonstone/GridListImageItem';
import {Header} from '@enact/moonstone/Panels';
import Input from '@enact/moonstone/Input';
import Item from '@enact/moonstone/Item';
import LabeledItem from '@enact/moonstone/LabeledItem';
import Marquee from '@enact/moonstone/Marquee';
import RadioItem from '@enact/moonstone/RadioItem';
import Scroller from '@enact/moonstone/Scroller';
import SelectableItem from '@enact/moonstone/SelectableItem';
import SlotItem from '@enact/moonstone/SlotItem';
import SwitchItem from '@enact/moonstone/SwitchItem';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {select} from '../../src/enact-knobs';

const inputData = {
	english : 'We name themes after gemstones',
	arabic: 'نحن اسم المواضيع بعد الأحجار الكريمة',
	greek : 'Ονομάζουμε θέματα μετά από πολύτιμους λίθους',
	hebrew : 'אנו שם נושאים לאחר אבני חן',
	japanese : '宝石にちなんでテーマに名前を付けます',
	russian : 'Мы называем темы в честь драгоценных камней',
	thai : 'เราตั้งชื่อธีมตามอัญมณี',
	urdu: 'ہم گیسسٹون کے بعد موضوعات کا نام دیتے ہیں'
};

Divider.displayName = 'Divider';

const prop = {
	tallText: [
		'नरेंद्र मोदी',
		'ฟิ้  ไั  ஒ  து',
		'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'
	]
};

storiesOf('Text', module)
	.add(
		'Tall Glyphs as Non-Latin components',
		() => {
			const children = select('children', prop.tallText, 'नरेंद्र मोदी');

			return (
				<Scroller style={{height: '100%'}}>
					<Divider>Text controls (div, Divider, BodyText, Marquee)</Divider>
					<div>{children}</div>
					<Divider>{children}</Divider>
					<BodyText>{children}</BodyText>
					<Marquee>{children}</Marquee>

					<Divider>Basic Form controls (Button, Input)</Divider>
					<Button>{children}</Button>
					<Input placeholder={children} />
					<Input value={children} />

					<Divider>Simple Items (Item, LabeledItem, GridListImageItem)</Divider>
					<Item>{children}</Item>
					<LabeledItem label={children}>{children}</LabeledItem>
					<GridListImageItem caption={children} style={{height: 200}} />

					<Divider>Expandables (Input, List, Picker)</Divider>
					<ExpandableInput title={children} value={children} />
					<ExpandableList title={children}>{[children, children, children]}</ExpandableList>
					<ExpandablePicker title={children}>{[children, children, children]}</ExpandablePicker>

					<Divider>ToggleItems</Divider>
					<CheckboxItem>{children}</CheckboxItem>
					<FormCheckboxItem>{children}</FormCheckboxItem>
					<RadioItem>{children}</RadioItem>
					<SelectableItem>{children}</SelectableItem>
					<SwitchItem>{children}</SwitchItem>

					<Divider>Headers (Standard, Compact, Input)</Divider>
					<Header type="standard" title={children} titleBelow={children} subTitleBelow={children} />
					<br />
					<Header type="compact" title={children} titleBelow={children} subTitleBelow={children} />
					<br />
					<Header title={children} titleBelow={children} subTitleBelow={children}>
						<Input value={children} slot="headerInput" />
					</Header>

				</Scroller>
			);
		}
	)
	.add(
		'Languages',
		() => Object.keys(inputData).map(key =>
			<SlotItem key={key}>
				<slotBefore>
					<span style={{minWidth: '10ex', display: 'inline-block'}}>[ {key} ]</span>
				</slotBefore>
				{inputData[key]}
			</SlotItem>
		)
	);
