import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {I18nDecorator} from '../../I18nDecorator';
import {clearResBundle, getResBundle} from '../../src/resBundle';

import {$L} from '../$L';

describe('$L', () => {
	test('should get the key string when there is no translated value', () => {
		const expected = 'hello';
		const Component = (props) => (
			<div className={props.className}>{$L(expected)}</div>
		);

		const Wrapped = I18nDecorator({sync: true}, Component);
		render(<Wrapped />);

		const actual = screen.getByText(expected);

		expect(actual).toBeInTheDocument();
	});

	test('should clear ResBundle with calling `clearResBundle`', () => {
		const expected = null;
		const Component = (props) => (
			<div className={props.className}>{$L('hello')}</div>
		);

		const Wrapped = I18nDecorator({sync: true}, Component);
		render(<Wrapped />);

		clearResBundle();

		const actual = getResBundle();

		expect(actual).toEqual(expected);
	});
});
