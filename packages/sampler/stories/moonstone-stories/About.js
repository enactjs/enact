import kind from '@enact/core/kind';
import BodyText from '@enact/moonstone/BodyText';
import Button from '@enact/moonstone/Button';
import Icon from '@enact/moonstone/Icon';
import React from 'react';
import PropTypes from 'prop-types';
import ri from '@enact/ui/resolution';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean} from '../../src/enact-knobs';

import css from './About.less';

const riSafe = (style) => {
	switch (typeof style) {
		case 'object':
			for (let rule in style) {
				if (typeof style[rule] === 'number') {
					style[rule] = ri.unit(ri.scale(style[rule]), 'rem');
				}
			}
			return style;
		default:
			return ri.unit(ri.scale(style), 'rem');
	}
};

const Pointer = kind({
	name: 'Pointer',

	propTypes: {
		angle: PropTypes.string,
		length: PropTypes.number
	},

	render: ({angle, length, style}) => (
		<div
			className={css.pointer}
			style={{...style,
				height: riSafe(length),
				transform: 'rotate(' + angle + ')'
			}}
		>
			<Icon className={css.pointerIcon}>circle</Icon>
		</div>
	)
});

storiesOf('About', module)
	.add(
		'A Tour of Sampler',
		withInfo('A Tour of Sampler')(() => (
			<div>
				<BodyText
					centered={boolean('text centered', BodyText)}
				>
					Welcome to the Enact sampler! Explore Enact components.
				</BodyText>
				<Button onClick={action('onClick')} selected={boolean('button selected', Button)}>
					Click me
				</Button>
				<aside className={css.hintDialog} style={{top: riSafe(48), right: 30}}>
					<Pointer length={12} angle="180deg" style={riSafe({top: 0, right: 6})} />
					<div className={css.text}>
						Click <b>Show Info</b> to see the live source code for the sample
					</div>
				</aside>
				<aside className={css.hintDialog} style={riSafe({position: 'relative', top: 60, left: 30})}>
					<Pointer length={30} angle="90deg" style={riSafe({left: 0, top: 9})} />
					<div className={css.text}>
						Select any component from the <b>sidebar</b> to see how it works
					</div>
				</aside>
				<aside className={css.hintDialog} style={{bottom: riSafe(120), left: 54}}>
					<Pointer length={108} style={riSafe({left: 9, bottom: -108})} />
					<div className={css.text}>
						<b>ACTION LOGGER</b> Logs events generated by components <b>
							<Icon small className={css.icon}>arrowsmallup</Icon>
							Click the button above
						</b>
					</div>
				</aside>
				{/* <aside className={css.hintDialog} style={{bottom: riSafe(120), left: 192}}>
					<Pointer length={108} style={riSafe({left: 9, bottom: -108})} />
					<div className={css.text}>
						<b>BACKGROUNDS</b> Change background for visual reference
					</div>
				</aside> */}
				<aside className={css.hintDialog} style={{bottom: riSafe(42), left: 165}}>
					<Pointer length={30} style={riSafe({left: 9, bottom: -30})} />
					<div className={css.text}>
						<b>KNOBS</b> Adjust component properties
					</div>
				</aside>
			</div>
		))
	);
