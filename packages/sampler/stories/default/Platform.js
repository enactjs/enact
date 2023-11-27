import platform from '@enact/core/platform';
import webosPlatform from '@enact/webos/platform';
import {Scroller} from '@enact/ui/Scroller';

function logObject (object) {
	return Object.keys(object)
		.filter((key) => object[key] != null)
		.map((key) => {
			let value = object[key];
			if (value === false) {
				value = 'false';
			} else if (value === true) {
				value = 'true';
			}
			return (
				<div key={key}>
					{key}: {value}
				</div>
			);
		});
}

export default {
	title: 'Core/Platform',
	component: 'Platform'
};

export const _Platform = () => (
	<Scroller>
		<h3>Platform:</h3>
		{logObject(platform)}
		<h3>webOS:</h3>
		{logObject(webosPlatform)}
	</Scroller>
);

_Platform.parameters = {
	controls: {
		hideNoControlsWarning: true
	}
};
