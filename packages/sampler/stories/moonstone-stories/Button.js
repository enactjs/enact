import kind from '@enact/core/kind';
import Button, {ButtonBase} from '@enact/moonstone/Button';
import Item from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

Button.propTypes = Object.assign({}, ButtonBase.propTypes, Button.propTypes);
Button.defaultProps = Object.assign({}, ButtonBase.defaultProps, Button.defaultProps);
Button.displayName = 'Button';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['opaque', 'translucent', 'transparent']
};

window.myCollection = [
	kind({render: () => <li>Item</li>})
];

window.myList = [
	{render: () => <li>Item1</li>},
	{render: () => <li>Item2</li>},
	{render: () => <li>Item3</li>}
];

window.myObjects = [
	{
		active: true,
		value: 'off',
		visible: true
	},
	{
		active: false,
		value: 'smooth',
		visible: true
	},
	{
		// active: false,
		value: 'clear',
		visible: true
	},
	{
		active: false,
		value: 'clearPlus',
		visible: true
	},
	{
		active: true,
		value: 'user',
		visible: true
	}
];

window.myObjects2 = [
	{
		active: true,
		value: 'off',
		visible: true
	},
	{
		active: false,
		value: 'smooth',
		visible: true
	},
	{
		// active: false,
		value: 'clear',
		visible: true
	},
	{
		// active: false,
		value: 'clearPlus',
		visible: true
	},
	{
		active: true,
		value: 'user'
		// visible: false
	}
];

const LivingBase = class extends React.Component {
	static displayName = 'LivingBase'

	render () {
		const {kids, ...rest} = this.props;

		const myKids = kids.map((x, i) => {
			if (!x.visible) return null;
			return <Item key={i} disabled={!x.active}>{x.value}</Item>;
		});

		return (
			<ol {...rest}>
				{myKids}
			</ol>
		);
	}
};

const LivingKind = kind({
	name: 'LivingKind',
	computed: {
		// children: ({kids}) => kids.map((x, i) => {
		children: ({children}) => React.children.map(children, (x, i) => {
			if (!x.visible) return null;
			console.log('status:', i, x.active, (x.active === false));
			return <Item key={i} disabled={(x.active === false)}>{x.value}</Item>;
		})
	},
	render: ({children, ...rest}) => {
		// delete rest.kids;
		return (
			<ol {...rest}>
				{children}
			</ol>
		);
	}
});

storiesOf('Button')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic Button',
		() => (<div>
			<LivingKind>
				{boolean('some disabled', true) ? window.myObjects : window.myObjects2}
			</LivingKind>
		</div>)
	);
			// <LivingBase
			// 	kids={boolean('some disabled', true) ? window.myObjects : window.myObjects2}
			// />
			// <Button
			// 	onClick={action('onClick')}
			// 	small={boolean('small', Button.defaultProps.small)}
			// />
				// {text('children', 'Click Me')}
				// backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				// disabled={boolean('disabled', Button.defaultProps.disabled)}
				// minWidth={boolean('minWidth', Button.defaultProps.minWidth)}
				// preserveCase={boolean('preserveCase', Button.defaultProps.preserveCase)}
				// selected={boolean('selected', Button.defaultProps.selected)}
				// {window.myObjects.map((x, i) => {
				// 	// const X = kind(x);
				// 	if (!x.visible) return null;
				// 	return <Item key={i} disabled={!x.active}>{x.value}</Item>;
				// })}
				// {window.myList.map((x, i) => {
				// 	const X = kind(x);
				// 	return <X key={i} />;
				// })}
				// {window.myCollection.map((X, i) => <X key={i}>Button {i + 1}</X>)}
				// {[...Array(10)].map((x, i) => <li key={i}>Button {i + 1}</li>)}
