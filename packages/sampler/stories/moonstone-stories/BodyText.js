import BodyText, {BodyTextBase} from '@enact/moonstone/BodyText';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

BodyText.propTypes = Object.assign({}, BodyTextBase.propTypes, BodyText.propTypes);
BodyText.defaultProps = Object.assign({}, BodyTextBase.defaultProps, BodyText.defaultProps);
BodyText.displayName = 'BodyText';

// Set up some defaults for info and knobs
// const prop = {
// 	// backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
// 	centered : false
// };

storiesOf('BodyText')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic BodyText',
		() => (
			<BodyText
				onClick={action('onClick')}
				centered={boolean('centered', false)}
			>
				{text('children', 'This is Body Text')}
			</BodyText>
		)
	);
