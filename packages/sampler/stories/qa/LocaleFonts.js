import SlotItem from '@enact/moonstone/SlotItem';
import React from 'react';
import {storiesOf} from '@storybook/react';

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

storiesOf('Locale Fonts', module)
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
