import '@testing-library/jest-dom';
import {act, render, screen} from '@testing-library/react';

import {VirtualGridList} from '../VirtualList';
import {ImageItem as UiImageItem} from '../../ImageItem';

describe('VirtualGridList', () => {
	let
		clientSize,
		dataSize,
		getScrollTo,
		handlerOnScroll,
		handlerOnScrollStart,
		handlerOnScrollStop,
		items,
		itemSize,
		myScrollTo,
		onScrollCount,
		onScrollStartCount,
		onScrollStopCount,
		renderItem,
		resultScrollTop,
		svgGenerator;

	beforeEach(() => {
		clientSize = {clientWidth: 1280, clientHeight: 720};
		dataSize = 100;
		items = [];
		itemSize = {minWidth: 180, minHeight: 270};
		onScrollCount = 0;
		onScrollStartCount = 0;
		onScrollStopCount = 0;
		resultScrollTop = 0;

		getScrollTo = (scrollTo) => {
			myScrollTo = scrollTo;
		};
		handlerOnScroll = () => {
			onScrollCount++;
		};
		handlerOnScrollStart = () => {
			onScrollStartCount++;
		};
		handlerOnScrollStop = (done, testCase) => (e) => {
			onScrollStopCount++;
			resultScrollTop = e.scrollTop;

			testCase();
			done();
		};

		renderItem = ({index, ...rest}) => {	// eslint-disable-line enact/display-name
			const {text, source} = items[index];
			return (
				<UiImageItem
					{...rest}
					src={source}
					style={{width: '100%'}}
				>
					{text}
				</UiImageItem>
			);
		};

		svgGenerator = (width, height, bgColor, textColor, customText) => (
			`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' width='${width}' height='${height}'%3E` +
			`%3Crect width='${width}' height='${height}' fill='%23${bgColor}'%3E%3C/rect%3E` +
			`%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='36px' fill='%23${textColor}'%3E${customText}%3C/text%3E%3C/svg%3E`
		);

		const itemNumberDigits = dataSize > 0 ? (dataSize - 1 + '').length : 0;
		const headingZeros = Array(itemNumberDigits).join('0');

		for (let i = 0; i < dataSize; i++) {
			const
				count = (headingZeros + i).slice(-itemNumberDigits),
				text = `Item ${count}`,
				color = Math.floor(Math.random() * (0x1000000 - 0x101010) + 0x101010).toString(16),
				source = svgGenerator(300, 300, color, 'ffffff', `Image ${i}`);

			items.push({text, source});
		}

		return dataSize;
	});

	afterEach(() => {
		clientSize = null;
		dataSize = null;
		getScrollTo = null;
		handlerOnScroll = null;
		handlerOnScrollStart = null;
		handlerOnScrollStop = null;
		items = null;
		myScrollTo = null;
		onScrollCount = null;
		onScrollStartCount = null;
		onScrollStopCount = null;
		renderItem = null;
		resultScrollTop = null;
	});

	test('should render a list of \'items\'', () => {
		render(
			<VirtualGridList
				clientSize={clientSize}
				dataSize={dataSize}
				itemRenderer={renderItem}
				itemSize={itemSize}
			/>
		);

		const expected = 'Item 00';
		const actual = screen.getByRole('list').children.item(0).textContent;

		expect(actual).toBe(expected);
	});

	test('should render (clientHeight / itemHeight + overhang) items', () => {
		render(
			<VirtualGridList
				clientSize={clientSize}
				dataSize={dataSize}
				itemRenderer={renderItem}
				itemSize={itemSize}
			/>
		);

		const expected = 42; // (7 * 3) + (7 * 3)
		const actual = screen.getByRole('list').children.length;

		expect(actual).toBe(expected);
	});

	test('should re-render clientHeight / itemHeight + overhang) items after changing client size', () => {
		const {rerender} = render(
			<VirtualGridList
				clientSize={clientSize}
				dataSize={dataSize}
				itemRenderer={renderItem}
				itemSize={itemSize}
			/>
		);

		const newClientSize = {clientWidth: 1280, clientHeight: 360};

		rerender(
			<VirtualGridList
				clientSize={newClientSize}
				dataSize={dataSize}
				itemRenderer={renderItem}
				itemSize={itemSize}
			/>
		);

		const expected = 35; // (7 * 2) + (7 * 3)
		const actual = screen.getByRole('list').children.length;

		expect(actual).toBe(expected);
	});

	describe('ScrollTo', () => {
		test('should scroll to the specific item of a given index with scrollTo', (done) => {
			const onScrollStop = handlerOnScrollStop(done, () => {
				const expected = 273; // 270 + 3
				const actual = resultScrollTop;

				expect(actual).toBe(expected);

			});

			render(
				<VirtualGridList
					cbScrollTo={getScrollTo}
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
					onScrollStop={onScrollStop}
				/>
			);

			act(() => myScrollTo({index: 8, animate: false}));
		});

		test('should scroll to the given \'x\' position with scrollTo', (done) => {
			const onScrollStop = handlerOnScrollStop(done, () => {
				const expected = 1;
				const actual = onScrollStopCount;

				expect(actual).toBe(expected);
			});

			render(
				<VirtualGridList
					cbScrollTo={getScrollTo}
					clientSize={clientSize}
					dataSize={dataSize}
					direction="horizontal"
					itemRenderer={renderItem}
					itemSize={itemSize}
					onScrollStop={onScrollStop}
				/>
			);

			act(() => myScrollTo({position: {x: 100}, animate: false}));
		});

		test('should scroll to the given \'y\' position with scrollTo', (done) => {
			const onScrollStop = handlerOnScrollStop(done, () => {
				const expected = 100;
				const actual = resultScrollTop;

				expect(actual).toBe(expected);
			});

			render(
				<VirtualGridList
					cbScrollTo={getScrollTo}
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={itemSize}
					onScrollStop={onScrollStop}
				/>
			);

			act(() => myScrollTo({position: {y: 100}, animate: false}));
		});

		describe('scroll events', () => {
			test('should call onScrollStart once', () => {
				render(
					<VirtualGridList
						cbScrollTo={getScrollTo}
						clientSize={clientSize}
						dataSize={dataSize}
						itemRenderer={renderItem}
						itemSize={itemSize}
						onScrollStart={handlerOnScrollStart}
					/>
				);

				act(() => myScrollTo({position: {y: 100}, animate: false}));

				const expected = 1;
				const actual = onScrollStartCount;

				expect(actual).toBe(expected);
			});

			test('should call onScroll once', () => {
				render(
					<VirtualGridList
						cbScrollTo={getScrollTo}
						clientSize={clientSize}
						dataSize={dataSize}
						itemRenderer={renderItem}
						itemSize={itemSize}
						onScroll={handlerOnScroll}
					/>
				);

				act(() => myScrollTo({position: {y: 100}, animate: false}));

				const expected = 1;
				const actual = onScrollCount;

				expect(actual).toBe(expected);
			});

			test('should call onScrollStop once', (done) => {
				const onScrollStop = handlerOnScrollStop(done, () => {
					const expected = 1;
					const actual = onScrollStopCount;

					expect(actual).toBe(expected);
				});

				render(
					<VirtualGridList
						cbScrollTo={getScrollTo}
						clientSize={clientSize}
						dataSize={dataSize}
						itemRenderer={renderItem}
						itemSize={itemSize}
						onScrollStop={onScrollStop}
					/>
				);

				act(() => myScrollTo({position: {y: 100}, animate: false}));
			});
		});
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
				<VirtualGridList
					clientSize={clientSize}
					dataSize={itemArray.length}
					itemRenderer={renderItemArray}
					itemSize={itemSize}
				/>
			);

			itemArray.unshift({name: 'Password 0'});
			rerender(
				<VirtualGridList
					clientSize={clientSize}
					dataSize={itemArray.length}
					itemRenderer={renderItemArray}
					itemSize={itemSize}
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
