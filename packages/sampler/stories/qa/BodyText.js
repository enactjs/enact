import BodyText from '@enact/moonstone/BodyText';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, text} from '../../src/enact-knobs';


BodyText.displayName = 'BodyText';

storiesOf('BodyText', module)
	.add(
		'with long string',
		() => (
			<BodyText
				centered={boolean('centered', BodyText)}
				noWrap={boolean('noWrap', BodyText)}
			>
				{text('children', BodyText, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac tellus in velit ornare commodo. Nam dignissim fringilla nulla, sit amet hendrerit sapien laoreet quis. Praesent quis tellus non diam viverra feugiat. In quis mattis purus, quis tristique mi. Mauris vitae tellus tempus, convallis ligula id, laoreet eros. Nullam eu tempus odio, non mollis tellus. Phasellus vitae iaculis nisl. Sed ipsum felis, suscipit vel est quis, interdum pretium dolor. Curabitur sit amet purus ac massa ullamcorper egestas ornare vel lectus. Nullam quis velit sed ex finibus cursus. Duis porttitor congue cursus.')}
			</BodyText>
		)
	);
