import Button, {ButtonBase} from '@enact/moonstone/Button';
import Item from '@enact/moonstone/Item';
import {SpotlightContainerDecorator} from '@enact/spotlight';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs} from '@kadira/storybook-addon-knobs';

Button.propTypes = Object.assign({}, ButtonBase.propTypes, Button.propTypes);
Button.defaultProps = Object.assign({}, ButtonBase.defaultProps, Button.defaultProps);
Button.displayName = 'Button';

const Container = SpotlightContainerDecorator('div');
const style = {
	container: {
		height: ri.scale(300) + 'px',
		width: ri.scale(300) + 'px'
	}
};

storiesOf('Spotlight')
	.addDecorator(withKnobs)
	.addWithInfo(
		'Multiple Buttons',
		() => (
			<div>
				<Button onClick={action('onClick')}>
					One
				</Button>
				<Button onClick={action('onClick')}>
					Two
				</Button>
				<Button onClick={action('onClick')}>
					Three
				</Button>
			</div>
		)
	)
	.addWithInfo(
		'Multiple Containers',
		() => (
			<div>
				<p>
					The containers below will spot the last-focused element. Keep track of the
					last-focused element in the container when testing and ensure that the correct
					element is spotted when re-entering the container.
				</p>
				<div style={{display: 'flex'}}>
					<Container style={style.container}>
						<Item>1</Item>
						<Item>2</Item>
						<Item>3</Item>
						<div>Non-spottable content 1</div>
						<div>Non-spottable content 2</div>
						<div>Non-spottable content 3</div>
					</Container>
					<Container style={style.container}>
						<div>Non-spottable content A</div>
						<div>Non-spottable content B</div>
						<div>Non-spottable content C</div>
						<Item>A</Item>
						<Item>B</Item>
						<Item>C</Item>
					</Container>
				</div>
			</div>
		)
	);

