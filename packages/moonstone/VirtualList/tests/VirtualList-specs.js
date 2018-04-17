import {mount} from 'enzyme';
import React from 'react';

import Item from '../../Item';
import VirtualList from '../VirtualList';

describe('VirtualList', () => {
	let
		clientSize,
		dataSize,
		getScrollTo,
		handlerOnScroll,
		handlerOnScrollStart,
		handlerOnScrollStop,
		items,
		myScrollTo,
		onScrollCount,
		onScrollStartCount,
		onScrollStopCount,
		renderItem,
		resultScrollLeft,
		resultScrollTop;

	beforeEach(() => {
		clientSize = {clientWidth: 1280, clientHeight: 720};
		dataSize = 100;
		items = [];
		onScrollCount = 0;
		onScrollStartCount = 0;
		onScrollStopCount = 0;
		resultScrollLeft = 0;
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
		handlerOnScrollStop = (e) => {
			onScrollStopCount++;
			resultScrollLeft = e.scrollLeft;
			resultScrollTop = e.scrollTop;
		};
		renderItem = ({index, ...rest}) => { // eslint-disable-line enact/display-name, enact/prop-types
			return (
				<Item {...rest}>
					{items[index].name}
				</Item>
			);
		};

		for (let i = 0; i < dataSize; i++) {
			items.push({name: 'Account ' + i});
		}
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
		resultScrollLeft = null;
		resultScrollTop = null;
	});

	it('should render a list of \'items\'', () => {
		const subject = mount(
			<VirtualList
				clientSize={clientSize}
				dataSize={dataSize}
				itemRenderer={renderItem}
				itemSize={30}
			/>
		);

		const expected = 'Account 0';
		const actual = subject.find('[data-index]').at(0).text();

		expect(actual).to.equal(expected);
	});

	it('should render (clientHeight / itemHeight + overhang) items', () => {
		const subject = mount(
			<VirtualList
				clientSize={clientSize}
				dataSize={dataSize}
				itemRenderer={renderItem}
				itemSize={30}
			/>
		);

		const expected = 27; // 720 / 30 + 3
		const actual = subject.find('Item[data-index]').length;

		expect(actual).to.equal(expected);
	});

	it('should render only one scrollbar', () => {
		const subject = mount(
			<VirtualList
				clientSize={clientSize}
				dataSize={dataSize}
				direction="horizontal"
				itemRenderer={renderItem}
				itemSize={30}
			/>
		);

		const expected = 1;
		const actual = subject.find('Scrollbar').length;

		expect(actual).to.equal(expected);
	});

	describe('ScrollTo', () => {
		it('should scroll to the specific item of a given index with scrollTo', () => {
			mount(
				<VirtualList
					cbScrollTo={getScrollTo}
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={30}
					onScrollStop={handlerOnScrollStop}
				/>
			);

			myScrollTo({index: 10, animate: false});

			const expected = 300;
			const actual = resultScrollTop;

			expect(actual).to.equal(expected);
		});

		it('should scroll to the given \'x\' position with scrollTo', () => {
			mount(
				<VirtualList
					cbScrollTo={getScrollTo}
					clientSize={clientSize}
					dataSize={dataSize}
					direction="horizontal"
					itemRenderer={renderItem}
					itemSize={30}
					onScrollStop={handlerOnScrollStop}
				/>
			);

			myScrollTo({position: {x: 100}, animate: false});

			const expected = 100;
			const actual = resultScrollLeft;

			expect(actual).to.equal(expected);
		});

		it('should scroll to the given \'y\' position with scrollTo', () => {
			mount(
				<VirtualList
					cbScrollTo={getScrollTo}
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={30}
					onScrollStop={handlerOnScrollStop}
				/>
			);

			myScrollTo({position: {y: 100}, animate: false});

			const expected = 100;
			const actual = resultScrollTop;

			expect(actual).to.equal(expected);
		});

		describe('scroll events', () => {
			it('should call onScrollStart once', () => {
				mount(
					<VirtualList
						cbScrollTo={getScrollTo}
						clientSize={clientSize}
						dataSize={dataSize}
						itemRenderer={renderItem}
						itemSize={30}
						onScrollStart={handlerOnScrollStart}
					/>
				);

				myScrollTo({position: {y: 100}, animate: false});

				const expected = 1;
				const actual = onScrollStartCount;

				expect(actual).to.equal(expected);
			});

			it('should call onScroll once', () => {
				mount(
					<VirtualList
						cbScrollTo={getScrollTo}
						clientSize={clientSize}
						dataSize={dataSize}
						itemRenderer={renderItem}
						itemSize={30}
						onScroll={handlerOnScroll}
					/>
				);

				myScrollTo({position: {y: 100}, animate: false});

				const expected = 1;
				const actual = onScrollCount;

				expect(actual).to.equal(expected);
			});

			it('should call onScrollStop once', () => {
				mount(
					<VirtualList
						cbScrollTo={getScrollTo}
						clientSize={clientSize}
						dataSize={dataSize}
						itemRenderer={renderItem}
						itemSize={30}
						onScrollStop={handlerOnScrollStop}
					/>
				);

				myScrollTo({position: {y: 100}, animate: false});

				const expected = 1;
				const actual = onScrollStopCount;

				expect(actual).to.equal(expected);
			});
		});
	});

	describe('Adding an item', () => {
		it('should render an added item named \'Password 0\' as the first item', (done) => {
			const itemArray = [{name: 'A'}, {name: 'B'}, {name: 'C'}];
			const renderItemArray = ({index, ...rest}) => { // eslint-disable-line enact/display-name, enact/prop-types, react/jsx-no-bind
				return (
					<div {...rest} id={'item' + index}>
						{itemArray[index].name}
					</div>
				);
			};

			const subject = mount(
				<VirtualList
					clientSize={clientSize}
					dataSize={itemArray.length}
					itemRenderer={renderItemArray} // eslint-disable-line react/jsx-no-bind
					itemSize={30}
				/>
			);

			itemArray.unshift({name: 'Password 0'});
			subject.setProps({dataSize: itemArray.length});

			setTimeout(() => {
				const expected = itemArray[0].name;
				const actual = subject.find('[data-index]').at(0).text();

				expect(actual).to.equal(expected);
				done();
			}, 0);
		});
	});

	describe('Scrollbar accessibility', () => {
		it('should set "aria-label" to previous scroll button in the horizontal scrollbar', function () {
			const label = 'custom button aria label';
			const subject = mount(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					direction="horizontal"
					scrollLeftAriaLabel={label}
					itemRenderer={renderItem}
					itemSize={30}
				/>
			);

			const expected = label;
			const actual = subject.find('ScrollButton').at(0).prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should set "aria-label" to next scroll button in the horizontal scrollbar', function () {
			const label = 'custom button aria label';
			const subject = mount(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					direction="horizontal"
					scrollRightAriaLabel={label}
					itemRenderer={renderItem}
					itemSize={30}
				/>
			);

			const expected = label;
			const actual = subject.find('ScrollButton').at(1).prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should set "aria-label" to previous scroll button in the vertical scrollbar', function () {
			const label = 'custom button aria label';
			const subject = mount(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					direction="vertical"
					itemRenderer={renderItem}
					itemSize={30}
					scrollUpAriaLabel={label}
				/>
			);

			const expected = label;
			const actual = subject.find('ScrollButton').at(0).prop('aria-label');

			expect(actual).to.equal(expected);
		});

		it('should set "aria-label" to next scroll button in the vertical scrollbar', function () {
			const label = 'custom button aria label';
			const subject = mount(
				<VirtualList
					clientSize={clientSize}
					dataSize={dataSize}
					direction="vertical"
					itemRenderer={renderItem}
					itemSize={30}
					scrollDownAriaLabel={label}
				/>
			);

			const expected = label;
			const actual = subject.find('ScrollButton').at(1).prop('aria-label');

			expect(actual).to.equal(expected);
		});
	});
});
