import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';

import Icon from 'enact-moonstone/Icon';

storiesOf('Icon')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'List of available icons',
		() => (
			<div>
				<Icon small={boolean('small')}>plus</Icon>
				<Icon>minus</Icon>
				<Icon>arrowhookleft</Icon>
				<Icon>arrowhookright</Icon>
				<Icon>ellipsis</Icon>
				<Icon>check</Icon>
				<Icon>circle</Icon>
				<Icon>stop</Icon>
				<Icon>play</Icon>
				<Icon>pause</Icon>
				<Icon>forward</Icon>
				<Icon>backward</Icon>
				<Icon>skipforward</Icon>
				<Icon>skipbackward</Icon>
				<Icon>pauseforward</Icon>
				<Icon>pausebackward</Icon>
				<Icon>pausejumpforward</Icon>
				<Icon>pausejumpbackward</Icon>
				<Icon>jumpforward</Icon>
				<Icon>jumpbackward</Icon>
				<Icon>denselist</Icon>
				<Icon>bulletlist</Icon>
				<Icon>list</Icon>
				<Icon>drawer</Icon>
				<Icon>arrowlargedown</Icon>
				<Icon>arrowlargeup</Icon>
				<Icon>arrowlargeleft</Icon>
				<Icon>arrowlargeright</Icon>
				<Icon>arrowsmallup</Icon>
				<Icon>arrowsmalldown</Icon>
				<Icon>arrowsmallleft</Icon>
				<Icon>arrowsmallright</Icon>
				<Icon>closex</Icon>
				<Icon>search</Icon>
				<Icon>rollforward</Icon>
				<Icon>rollbackward</Icon>
				<Icon>exitfullscreen</Icon>
				<Icon>fullscreen</Icon>
				<Icon>arrowextend</Icon>
				<Icon>arrowshrink</Icon>
				<Icon>flag</Icon>
				<Icon>funnel</Icon>
				<Icon>trash</Icon>
				<Icon>star</Icon>
				<Icon>hollowstar</Icon>
				<Icon>halfstar</Icon>
				<Icon>gear</Icon>
				<Icon>plug</Icon>
				<Icon>lock</Icon>
			</div>
		));
