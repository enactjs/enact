import {render} from '@testing-library/react';

import AnnounceDecorator from '../AnnounceDecorator';

describe('AnnounceDecorator', () => {
	let announceProps;

	// no-op wrapper
	const Div = (props) => {
		announceProps = props;

		return <div />;
	};

	test('should pass a function in the announce prop', () => {
		const Component = AnnounceDecorator(Div);
		render(<Component />);

		const expected = 'function';
		const actual = typeof announceProps.announce;

		expect(actual).toBe(expected);
	});

	test('should allow prop to be configured for announce function', () => {
		const prop = '__NOTIFY__';
		const Component = AnnounceDecorator({prop}, Div);
		render(<Component />);

		const expected = 'function';
		const actual = typeof announceProps[prop];

		expect(actual).toBe(expected);
	});
});
