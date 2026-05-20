import '@testing-library/jest-dom';
import {act, render, screen} from '@testing-library/react';

import VirtualList, {VirtualListBasic} from '../VirtualList';

const mockPlatform = {};

jest.mock('@enact/core/platform', () => ({
	get platform () {
		return mockPlatform;
	}
}));

describe('VirtualList with native scrollMode', () => {
	let
		clientSize,
		dataSize,
		items,
		itemSize,
		renderItem;

	beforeEach(() => {
		clientSize = {clientWidth: 1280, clientHeight: 720};
		dataSize = 100;
		items = [];
		itemSize = 30;

		renderItem = ({index, ...rest}) => {	// eslint-disable-line enact/display-name
			return (
				<div {...rest} data-index={index} id={'item' + index}>
					{items[index].name}
				</div>
			);
		};

		for (let i = 0; i < dataSize; i++) {
			items.push({name: 'Account ' + i});
		}
	});

	afterEach(() => {
		clientSize = null;
		dataSize = null;
		items = null;
		itemSize = null;
		renderItem = null;
	});

	test('should render a list of \'items\'', () => {
		render(
			<VirtualList
				clientSize={clientSize}
				dataSize={dataSize}
				itemRenderer={renderItem}
				itemSize={itemSize}
				scrollMode="native"
			/>
		);

		const expected = 'Account 0';
		const actual = screen.getByRole('list').children.item(0).textContent;

		expect(actual).toBe(expected);
	});

	test('should render a list of \'items\' with horizontal direction', () => {
		render(
			<VirtualList
				clientSize={clientSize}
				dataSize={dataSize}
				direction="horizontal"
				itemRenderer={renderItem}
				itemSize={itemSize}
				scrollMode="native"
			/>
		);

		const expected = 'Account 0';
		const actual = screen.getByRole('list').children.item(0).textContent;

		expect(actual).toBe(expected);
	});

	test('should render overhang items when clientSize is not given', () => {
		render(
			<VirtualList
				dataSize={dataSize}
				itemRenderer={renderItem}
				itemSize={itemSize}
				scrollMode="native"
			/>
		);

		const expected = 3;
		const actual = screen.getByRole('list').children.length;

		expect(actual).toBe(expected);
	});

	test('should render (clientHeight / itemHeight + overhang) items', () => {
		render(
			<VirtualList
				clientSize={clientSize}
				dataSize={dataSize}
				itemRenderer={renderItem}
				itemSize={itemSize}
				scrollMode="native"
			/>
		);

		const expected = 27; // 720 / 30 + 3
		const actual = screen.getByRole('list').children.length;

		expect(actual).toBe(expected);
	});

	test('should re-render clientHeight / itemHeight + overhang) items after changing client size', () => {
		const {rerender} = render(
			<VirtualList
				clientSize={clientSize}
				dataSize={dataSize}
				itemRenderer={renderItem}
				itemSize={itemSize}
				scrollMode="native"
			/>
		);

		const newClientSize = {clientWidth: 1280, clientHeight: 360};

		rerender(
			<VirtualList
				clientSize={newClientSize}
				dataSize={dataSize}
				itemRenderer={renderItem}
				itemSize={itemSize}
				scrollMode="native"
			/>
		);

		const expected = 15; // 360 / 30 + 3
		const actual = screen.getByRole('list').children.length;

		expect(actual).toBe(expected);
	});

	describe('Adding an item', () => {
		test('should render an added item named \'Password 0\' as the first item', (done) => {
			const itemArray = [{name: 'A'}, {name: 'B'}, {name: 'C'}];
			const renderItemArray = ({index, ...rest}) => {
				return (
					<div {...rest} id={'item' + index}>
						{itemArray[index].name}
					</div>
				);
			};

			const {rerender} = render(
				<VirtualList
					clientSize={clientSize}
					dataSize={itemArray.length}
					itemRenderer={renderItemArray}
					itemSize={itemSize}
					scrollMode="native"
				/>
			);

			itemArray.unshift({name: 'Password 0'});
			rerender(
				<VirtualList
					clientSize={clientSize}
					dataSize={itemArray.length}
					itemRenderer={renderItemArray}
					itemSize={itemSize}
					scrollMode="native"
				/>
			);

			jest.useFakeTimers();

			act(() => jest.advanceTimersByTime(0));
			const expected = itemArray[0].name;
			const actual = screen.getByRole('list').children.item(0).textContent;

			expect(actual).toBe(expected);
			done();
			jest.useRealTimers();
		});
	});

	describe('Animating scroll', () => {
		let instance, node, scrollContentRef;

		beforeEach(() => {
			node = {
				scrollTo: jest.fn(),
				scrollBy: jest.fn(),
				scrollLeft: 0,
				scrollTop: 0
			};
			scrollContentRef = {current: node};
			instance = new VirtualListBasic({scrollContentRef, clientSize, itemSize, itemRenderer: renderItem, scrollMode: 'native'});

			jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
				instance.rafCallback = cb;
				return 123;
			});
			jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(jest.fn());
			jest.spyOn(performance, 'now').mockReturnValue(0);
		});

		test('should call native scrollTo when behavior is instant', () => {
			instance.scrollToPosition(0, 300, 'instant');

			expect(node.scrollTo).toHaveBeenCalledWith({left: 0, top: 300, behavior: 'instant'});
		});

		test('should call native scrollTo when NOT on Chrome and behavior is smooth', () => {
			mockPlatform.chrome = false;
			instance.scrollToPosition(0, 300, 'smooth');

			expect(node.scrollTo).toHaveBeenCalledWith({left: 0, top: 300, behavior: 'smooth'});
		});

		test('should call animateScroll when on Chrome and behavior is smooth', () => {
			mockPlatform.chrome = 88;
			instance.animateScroll = jest.fn();
			instance.scrollToPosition(0, 300, 'smooth');

			expect(instance.animateScroll).toHaveBeenCalledWith(0, 300, node);
		});

		test('should cancel animation when content is scrolled by pageKey', () => {
			instance.scrollToPosition(0, 600, 'smooth');
			node.lastInputType = 'pageKey';
			instance.scrollToPosition(0, 200, 'smooth');

			expect(window.cancelAnimationFrame).toHaveBeenCalled();
		});

		test('should initiate animation loop using requestAnimationFrame', () => {
			instance.animateScroll(0, 300, node);

			expect(window.requestAnimationFrame).toHaveBeenCalled();
		});

		test('should scroll incrementally on each frame', () => {
			instance.animateScroll(0, 300, node);
			instance.rafCallback();

			expect(node.scrollBy).toHaveBeenCalledWith(expect.objectContaining({behavior: 'instant'}));
			expect(node.scrolling).toBe(true);
		});

		test('should cancel animation and stop when target is reached', () => {
			node.scrollTop = 300;
			instance.animateScroll(0, 310, node);
			instance.rafCallback(600);

			expect(window.cancelAnimationFrame).toHaveBeenCalled();
			expect(node.scrolling).toBe(false);
		});

		test('should fallback to smooth scroll if animation exceeds duration (timeout)', () => {
			instance.animateScroll(0, 300, node);
			instance.rafCallback(600);
			node.scrollTop = 250;

			expect(node.scrollTo).toHaveBeenCalledWith({left: 0, top: 300, behavior: 'smooth'});
			expect(window.cancelAnimationFrame).toHaveBeenCalled();
		});
	});
});
