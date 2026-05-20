import '@testing-library/jest-dom';
import {act, render, screen} from '@testing-library/react';
import {createRef} from 'react';

import VirtualList, {VirtualListBasic} from '../VirtualList';

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
});

describe('VirtualListBasic scrollBounds consistency after item margin detection', () => {
	let originalGetComputedStyle;

	const nop = () => {};

	function renderVirtualListBasic ({direction = 'vertical', ...rest} = {}) {
		const scrollContentRef = createRef();
		const itemRefs = createRef();
		itemRefs.current = [];

		const ref = createRef();

		render(
			<VirtualListBasic
				clientSize={{clientWidth: 1280, clientHeight: 720}}
				dataSize={100}
				direction={direction}
				getAffordance={() => 0}
				itemRefs={itemRefs}
				itemRenderer={({index, ...rest2}) => <div {...rest2} data-index={index} />}
				itemSize={30}
				overhang={3}
				placeholderRenderer={nop}
				role="list"
				scrollContentRef={scrollContentRef}
				scrollMode="native"
				spacing={0}
				cbScrollTo={nop}
				ref={ref}
				{...rest}
			/>
		);

		return {ref};
	}

	beforeEach(() => {
		originalGetComputedStyle = window.getComputedStyle;
	});

	afterEach(() => {
		window.getComputedStyle = originalGetComputedStyle;
	});

	test('should increment scrollHeight and maxTop by the same margin sum when vertical item margins are detected, and not re-apply on subsequent updates', () => {
		const {ref} = renderVirtualListBasic();
		const instance = ref.current;

		const marginTop = 10;
		const marginBottom = 5;

		window.getComputedStyle = (el) => {
			if (el === instance.props.itemRefs.current[0]) {
				return {
					getPropertyValue: (prop) => {
						if (prop === 'margin-top') return `${marginTop}px`;
						if (prop === 'margin-bottom') return `${marginBottom}px`;
						if (prop === 'margin-left') return '0px';
						if (prop === 'margin-right') return '0px';
						return '0px';
					}
				};
			}
			return originalGetComputedStyle(el);
		};

		instance.itemMarginTop = null;
		act(() => {
			instance.forceUpdate();
		});

		const scrollHeightAfterFirst = instance.scrollBounds.scrollHeight;
		const maxTopAfterFirst = instance.scrollBounds.maxTop;
		expect(scrollHeightAfterFirst - maxTopAfterFirst).toBe(instance.props.clientSize.clientHeight);
		expect(instance.scrollBounds.maxTop).toBe(instance.scrollBounds.scrollHeight - instance.props.clientSize.clientHeight);

		// guard prevents re-applying on subsequent updates
		act(() => {
			instance.forceUpdate();
		});
		expect(instance.scrollBounds.scrollHeight).toBe(scrollHeightAfterFirst);
		expect(instance.scrollBounds.maxTop).toBe(maxTopAfterFirst);
	});

	test('should increment scrollWidth and maxLeft by the same margin sum when horizontal item margins are detected', () => {
		const {ref} = renderVirtualListBasic({direction: 'horizontal'});
		const instance = ref.current;

		const marginLeft = 8;
		const marginRight = 8;

		window.getComputedStyle = (el) => {
			if (el === instance.props.itemRefs.current[0]) {
				return {
					getPropertyValue: (prop) => {
						if (prop === 'margin-top') return '0px';
						if (prop === 'margin-bottom') return '0px';
						if (prop === 'margin-left') return `${marginLeft}px`;
						if (prop === 'margin-right') return `${marginRight}px`;
						return '0px';
					}
				};
			}
			return originalGetComputedStyle(el);
		};

		instance.itemMarginTop = null;
		act(() => {
			instance.forceUpdate();
		});

		expect(instance.scrollBounds.scrollWidth - instance.scrollBounds.maxLeft).toBe(instance.props.clientSize.clientWidth);
	});
});
