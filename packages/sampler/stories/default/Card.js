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
		captionOverlay={args['captionOverlay']}
		style={{
			width: ri.scaleToRem(180),
			height: ri.scaleToRem(120)
		}}
	>
		{args['children']}
	</Card>
);

text('children', _Card, Card, 'Card');
select('orientation', _Card, ['horizontal', 'vertical'], Card, 'vertical');
boolean('captionOverlay', _Card, Card);
text('src', _Card, Card, "https://placehold.co/300x300/69cdff/ffffff/png?text=Image");

_Card.parameters = {
	info: {
		text: 'Basic usage of Card'
	}
};
