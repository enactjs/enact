import '@testing-library/jest-dom';
import {render} from '@testing-library/react';

import useId from '../useId';

describe('useId', () => {
	let data = [];

	function Base (props) {
		data.push(props);
		return <div
			id={data.id}
			generateid={data.generateId}
			generateprop={data.generateProp}
			idprop={data.idProp}
		/>;
	}

	function Component ({key, prefix, onUnmount, generateProp, idProp}) {
		const provider = useId({prefix});

		return <Base
			{...provider}
			id={provider.generateId(key, prefix, onUnmount)}
			generateProp={provider.generateId(generateProp)}
			idProp={provider.generateId(idProp)}
		/>;
	}

	afterEach(() => data.splice(0, data.length));

	test('should generate a prop', () => {
		render(<Component />);

		const expected = 'undefined1';
		const actual = data[0].generateProp;

		expect(actual).toBe(expected);
	});

	test('should generate an id prop', () => {
		render(<Component />);

		const expected = 'undefined2';
		const actual = data[0].idProp;

		expect(actual).toBe(expected);
	});

	test('should provide a generateId method', () => {
		render(<Component />);

		const expected = 'function';
		const actual = typeof data[0].generateId;

		expect(actual).toBe(expected);
	});

	test('should generate different ids for different instances of the same component', () => {
		render(
			<div>
				<Component />
				<Component />
			</div>
		);

		const firstID = data[0].id;
		const lastID = data[1].id;

		expect(firstID).not.toBe(lastID);
	});

	test('should maintain the same id across renders', () => {
		const {rerender} = render(<Component />);

		const expected = data[0].id;

		rerender(<Component />);

		const actual = data[1].id;

		expect(actual).toBe(expected);
	});

	test('should prefix the id with the provided value', () => {
		render(<Component prefix="my-id" />);
		const id = data[0].id;

		const expected = 'my-id';
		const actual = id.substring(0, 5);

		expect(actual).toBe(expected);
	});

	test('should call onUnmount callback', () => {
		const spy = jest.fn();
		const {unmount} = render(<Component onUnmount={spy} />);

		unmount();

		expect(spy).toHaveBeenCalledTimes(1);
	});
});
