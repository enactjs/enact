import {Marquee, MarqueeController} from '@enact/moonstone/Marquee';
import Item from '@enact/moonstone/Item';
import ri from '@enact/ui/resolution';
import Spottable from '@enact/spotlight/Spottable';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, number, select} from '../../src/enact-knobs';

Marquee.displayName = 'Marquee';

const SpottableMarquee = Spottable(Marquee);
const Controller = MarqueeController('div');
const SpottableDiv = MarqueeController({marqueeOnFocus: true}, Spottable('div'));

const LTR = [
	'The quick brown fox jumped over the lazy dog. The bean bird flies at sundown.',
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

const disabledDisclaimer = (disabled) => (disabled ? <p style={{fontSize: '70%', fontStyle: 'italic'}}><sup>*</sup>Marquee does not visually respond to <code>disabled</code> state.</p> : <p />);

storiesOf('Marquee', module)
	.add(
		'LTR',
		() => {
			const disabled = boolean('disabled', Marquee, false);
			return (
				<section>
					<Marquee
						style={{width: ri.unit(399, 'rem')}}
						disabled={disabled}
						marqueeDelay={number('marqueeDelay', Marquee, 1000)}
						marqueeDisabled={boolean('marqueeDisabled', Marquee, false)}
						marqueeOn={select('marqueeOn', ['hover', 'render'], Marquee, 'render')}
						marqueeOnRenderDelay={1000}
						marqueeResetDelay={number('marqueeResetDelay', Marquee, 1000)}
						marqueeSpeed={number('marqueeSpeed', Marquee, 60)}
					>
						{select('children', LTR, Marquee, LTR[0])}
					</Marquee>
					{disabledDisclaimer(disabled)}
				</section>
			);
		}
	)

	.add(
		'RTL',
		() => {
			const disabled = boolean('disabled', Marquee, false);
			return (
				<section>
					<Marquee
						style={{width: ri.unit(399, 'rem')}}
						disabled={disabled}
						marqueeDelay={number('marqueeDelay', Marquee, 1000)}
						marqueeDisabled={boolean('marqueeDisabled', Marquee, false)}
						marqueeOn={select('marqueeOn', ['hover', 'render'], Marquee, 'render')}
						marqueeOnRenderDelay={1000}
						marqueeResetDelay={number('marqueeResetDelay', Marquee, 1000)}
						marqueeSpeed={number('marqueeSpeed', Marquee, 60)}
					>
						{select('children', RTL, Marquee, RTL[0])}
					</Marquee>
					{disabledDisclaimer(disabled)}
				</section>
			);
		}
	)

	.add(
		'Synchronized',
		() => {
			const disabled = boolean('disabled', Marquee, false);
			return (
				<Controller style={{width: ri.unit(399, 'rem')}}>
					{LTR.map((children, index) => (
						<Marquee
							disabled={disabled}
							key={index}
							marqueeDelay={number('marqueeDelay', Marquee, 1000)}
							marqueeDisabled={boolean('marqueeDisabled', Marquee, false)}
							marqueeOn={select('marqueeOn', ['hover', 'render'], Marquee, 'render')}
							marqueeOnRenderDelay={5000}
							marqueeResetDelay={number('marqueeResetDelay', Marquee, 1000)}
							marqueeSpeed={number('marqueeSpeed', Marquee, 60)}
						>
							{children}
						</Marquee>
					))}
					{disabledDisclaimer(disabled)}
				</Controller>
			);
		}
	)

	.add(
		'On Focus',
		() => (
			<div>
				<Item
					style={{width: ri.unit(399, 'rem')}}
					marqueeOn="focus"
				>
					{LTR[0]}
				</Item>
				<SpottableMarquee
					style={{width: ri.unit(399, 'rem')}}
					marqueeOn="focus"
				>
					{LTR[0]}
				</SpottableMarquee>
			</div>
		)
	)

	.add(
		'Restart Marquee when Marquee completes',
		() => (
			<SpottableDiv>
				<Marquee
					style={{width: ri.unit(399, 'rem')}}
					disabled={false}
					marqueeDelay={1000}
					marqueeDisabled={false}
					marqueeOn="focus"
					marqueeOnRenderDelay={1000}
					marqueeResetDelay={1000}
					marqueeSpeed={60}
				>
					{'The quick brown fox.'}
				</Marquee>
				<Marquee
					style={{width: ri.unit(399, 'rem')}}
					disabled={false}
					marqueeDelay={1000}
					marqueeDisabled={false}
					marqueeOn="focus"
					marqueeOnRenderDelay={1000}
					marqueeResetDelay={1000}
					marqueeSpeed={60}
				>
					{LTR[0]}
				</Marquee>
			</SpottableDiv>
		)
	);
