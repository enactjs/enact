import kind from '@enact/core/kind';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, number, select, text} from '@kadira/storybook-addon-knobs';

const prop = {
	alignContent: {'flex-start': 'flex-start', 'flex-end': 'flex-end', 'center': 'center', 'stretch': 'stretch', 'space-between': 'space-between', 'space-around': 'space-around'},
	alignItems: {'flex-start': 'flex-start', 'flex-end': 'flex-end', 'center': 'center', 'stretch': 'stretch', 'baseline': 'baseline'},
	alignSelf: {'auto': 'auto', 'flex-start': 'flex-start', 'flex-end': 'flex-end', 'center': 'center', 'stretch': 'stretch', 'baseline': 'baseline'},
	display: {'block': 'block', 'flex': 'flex'},
	flexDirection: {'row': 'row', 'row-reverse': 'row-reverse', 'column': 'column', 'column-reverse': 'column-reverse'},
	flexWrap: {'nowrap': 'nowrap', 'wrap': 'wrap', 'wrap-reverse': 'wrap-reverse'},
	justifyContent: {'flex-start': 'flex-start', 'flex-end': 'flex-end', 'center': 'center', 'space-between': 'space-between', 'space-around': 'space-around'}
};

const Tester = kind({
	name: 'Tester',
	render: ({children, ...rest}) => {
		return (
			<div {...rest}>
				{children}
			</div>
		);
	}
});

storiesOf('Flexbox')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		() => {
			const alignContent = select('container-alignContent', prop.alignContent, 'stretch');
			const alignItems = select('container-alignItems', prop.alignItems, 'stretch');
			const display = select('container-display', prop.display, 'flex');
			const flexDirection = select('container-flexDirection', prop.flexDirection, 'row');
			const flexWrap = select('container-flexWrap', prop.flexWrap, 'nowrap');
			const justifyContent = select('container-justifyContent', prop.justifyContent, 'flex-start');
			const alignSelf = select('item-alignSelf', prop.alignSelf, 'auto');
			const flexBasis = text('item-flexBasis', 'auto');
			const flexGrow = number('item-flexGrow', 0);
			const flexShrink = number('item-flexShrink', 1);

			const flexContainer = {alignContent, alignItems, display, flexDirection, flexWrap, justifyContent, backgroundColor: '#3d3d3d'};
			const flexItem = {alignSelf, flexBasis, flexGrow, flexShrink, backgroundColor: '#ffffff', color: '#000000', border: '1px solid #ff0000'};

			const numChildren = number('items', 10);
			const makeChildren = (num) => {
				const nodes = num ? [] : null;
				for (let i = 0, j = num; i < j; i += 1) {
					nodes.push(<Tester style={flexItem}>Item {i}</Tester>);
				}
				return nodes;
			};
			return (
				<Tester style={flexContainer}>
					{makeChildren(numChildren)}
				</Tester>
			)
		}
	)


