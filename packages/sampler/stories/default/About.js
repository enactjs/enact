import kind from '@enact/core/kind';
import BodyText from '@enact/moonstone/BodyText';
import Button from '@enact/moonstone/Button';
import Icon from '@enact/moonstone/Icon';
import React from 'react';
import PropTypes from 'prop-types';
import ri from '@enact/ui/resolution';
import {storiesOf} from '@storybook/react';

import {boolean} from '../../src/enact-knobs';
import {action} from '../../src/utils';

import css from './About.module.less';

const edgeDotKeepout = 6;

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

const HintDialog = kind({
	name: 'HintDialog',

	propTypes: {
		length: PropTypes.number,
		pointerPosition: PropTypes.string
	},
	defaultProps: {
		pointerPosition: 'below'
	},
	styles: {
		css,
		className: 'hintDialog'
	},
	computed: {
		className: ({pointerPosition, styler}) => styler.append(pointerPosition),
		style: ({length, style}) => ({
			...style,
			'--pointer-length': riSafe(length)
		})
	},
	render: ({children, ...rest}) => {
		delete rest.length;
		delete rest.pointerPosition;

		return (
			<aside {...rest}>
				<div className={css.pointer}>
					<Icon className={css.pointerIcon}>circle</Icon>
				</div>
				<div className={css.text}>
					{children}
				</div>
			</aside>
		);
	}
});

storiesOf('About', module)
	.add(
		'A Tour of Sampler',
		() => (
			<div style={{overflow: 'hidden', height: '100%'}}>
				<BodyText
					style={{margin: `0 ${riSafe(12)} 0.8em`}}
					centered={boolean('text centered', BodyText)}
				>
					Welcome to the Enact sampler! Explore Enact components.
				</BodyText>
				<Button onClick={action('onClick')} selected={boolean('button selected', Button)}>
					Click me
				</Button>
				<HintDialog
					style={{top: 36, right: 48}}
					length={24}
					pointerPosition="above"
				>
					Click <b>Show Info</b> to see the live source code for the sample
				</HintDialog>
				<HintDialog
					style={riSafe({position: 'relative', top: 60, left: 0})}
					length={30}
					pointerPosition="left"
				>
					Select any component from the <b>sidebar</b> to see how it works
				</HintDialog>
				<HintDialog
					style={{bottom: riSafe(edgeDotKeepout), left: 39}}
					length={120}
				>
					<b>Actions</b> tab logs events generated by components <b>
						<Icon size="small" className={css.icon}>arrowsmallup</Icon>
						Click the button above
					</b> for a demonstration
				</HintDialog>
				<HintDialog
					style={{bottom: riSafe(edgeDotKeepout), left: 114}}
					length={30}
				>
					<b>Knobs</b> tab lets you adjust component properties
				</HintDialog>
			</div>
		)
	);
