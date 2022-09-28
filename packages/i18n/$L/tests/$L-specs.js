import '@testing-library/jest-dom';
import {render} from '@testing-library/react';

import {I18nDecorator} from '../../I18nDecorator';

import {$L} from '../$L';

describe('$L', () => {
	test('should get the key string when there is no translated value', () => {
		const expected = 'hello';
		const Component = (props) => (
			<div className={props.className}>{$L(expected)}</div>
		);

		const Wrapped = I18nDecorator({sync: true}, Component);
		render(<Wrapped />);

		expect(expected).toEqual(expected);
	});
});
