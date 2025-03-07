import {boolean, select, text} from '@enact/storybook-utils/addons/controls';
import Card from '@enact/ui/Card';
import ri from '@enact/ui/resolution';

Card.displayName = 'Card';

export default {
	title: 'UI/Card',
	component: 'Card'
};

export const _Card = (args) => (
	<Card
		orientation={args['orientation']}
		src={args['src']}
		textOverlay={args['textOverlay']}
		style={{
			width: ri.scaleToRem(180),
			height: ri.scaleToRem(120)
		}}
	>
		Card
	</Card>
);

select('orientation', _Card, ['horizontal', 'vertical'], Card, 'vertical');
boolean('textOverlay', _Card, Card);
text('src', _Card, Card, "https://placehold.co/300x300/69cdff/ffffff/png?text=Image");

_Card.parameters = {
	info: {
		text: 'Basic usage of Card'
	}
};
