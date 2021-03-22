import {mount} from 'enzyme';
import {FloatingLayerBase} from '../FloatingLayer';
import {useFloatingLayerDecorator} from '../FloatingLayerDecorator';

describe('FloatingLayer Specs', () => {
	function Root (props) {
		const hook = useFloatingLayerDecorator();

		return hook.provideFloatingLayer(
			<div key="floatWrapped" {...props} />
		);
	}

	test('should not render if FloatingLayer is not open', () => {
		const subject = mount(
			<Root>
				<FloatingLayerBase><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		const expected = null;
		const actual = subject.find('FloatingLayer').instance().node;
		expect(actual).toBe(expected);
	});

	test('should render if FloatingLayer is open', () => {
		const subject = mount(
			<Root>
				<FloatingLayerBase open><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		const expected = 1;
		const actual = subject.find('FloatingLayer').instance().node.querySelectorAll('p').length;
		expect(actual).toBe(expected);
	});
});
