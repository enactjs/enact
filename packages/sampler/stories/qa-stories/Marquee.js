import {MarqueeText} from '@enact/moonstone/Marquee';
import Item from '@enact/moonstone/Item';
import {Spottable} from '@enact/spotlight';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, number, select, text} from '@kadira/storybook-addon-knobs';

const SpottableMarquee = Spottable(MarqueeText);

const LTR = [
	'The quick brown fox jumped over the lazy dog.  The bean bird flies at sundown.',
	'Η γρήγορη καφέ αλεπού πήδηξε πάνω από το μεσημέρι. Το πουλί πετά σε φασολιών δύση του ηλίου.',
	'ਤੁਰੰਤ ਭੂਰਾ Fox ਆਲਸੀ ਕੁੱਤੇ ਨੂੰ ਵੱਧ ਗਈ. ਬੀਨ ਪੰਛੀ ਸੂਰਜ ਡੁੱਬਣ \'ਤੇ ਉਡਾਣ ਭਰਦੀ ਹੈ.',
	'速い茶色のキツネは、怠け者の犬を飛び越えた。豆の鳥は日没で飛ぶ。',
	'那只敏捷的棕色狐狸跃过那只懒狗。豆鸟飞日落。',
	'빠른 갈색 여우가 게으른 개를 뛰어 넘었다.콩 조류 일몰에 파리.'
];
const RTL = [
	'שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקיעה.',
	'قفز الثعلب البني السريع فوق الكلب الكسول. الطيور تطير في الفول عند غروب الشمس.',
	'فوری بھوری لومڑی سست کتے پر چھلانگ لگا. بین پرندوں سوریاست میں پرواز.'
];

storiesOf('Marquee')
	.addDecorator(withKnobs)
	.addWithInfo(
		'LTR',
		() => (
			<MarqueeText
				style={{width: '400px'}}
				disabled={boolean('disabled', false)}
				marqueeDelay={number('marqueeDelay', 1000)}
				marqueeDisabled={boolean('marqueeDisabled', false)}
				marqueeOn={select('marqueeOn', ['hover', 'render'], 'render')}
				marqueeOnRenderDelay={number('marqueeOnRenderDelay', 1000)}
				marqueeResetDelay={number('marqueeResetDelay', 1000)}
				marqueeSpeed={number('marqueeSpeed', 60)}
			>
				{select('children', LTR, 'The quick brown fox jumped over the lazy dog.  The bean bird flies at sundown.')}
			</MarqueeText>
		)
	)
	.addWithInfo(
		'RTL',
		() => (
			<MarqueeText
				style={{width: '400px'}}
				disabled={boolean('disabled', false)}
				marqueeDelay={number('marqueeDelay', 1000)}
				marqueeDisabled={boolean('marqueeDisabled', false)}
				marqueeOn={select('marqueeOn', ['hover', 'render'], 'render')}
				marqueeOnRenderDelay={number('marqueeOnRenderDelay', 1000)}
				marqueeResetDelay={number('marqueeResetDelay', 1000)}
				marqueeSpeed={number('marqueeSpeed', 60)}
			>
				{select('children', RTL, 'שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקיעה.')}
			</MarqueeText>
		)
	)

	.addWithInfo(
		'On Focus',
		() => (
			<div>
				<Item
					style={{width: '400px'}}
					marqueeOn={'focus'}
				>
					The quick brown fox jumped over the lazy dog.  The bean bird flies at sundown.
				</Item>
				<SpottableMarquee
					style={{width: '400px'}}
					marqueeOn={'focus'}
				>
					The quick brown fox jumped over the lazy dog.  The bean bird flies at sundown.
				</SpottableMarquee>
			</div>
		)
	);
