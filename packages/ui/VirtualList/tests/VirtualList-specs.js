import {mount} from 'enzyme';
import React from 'react';

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
		renderItem = ({data, index, ...rest}) => {	// eslint-disable-line enact/display-name, enact/prop-types
			return (
				<div {...rest} id={'item' + index}>
					{data[index].name}
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
				component={renderItem}
				data={items}
				dataSize={dataSize}
				itemSize={30}
			/>
		);

		const expected = 'Account 0';
		const actual = subject.find('#item0').text();

		expect(actual).to.equal(expected);
	});

	it('should render (clientHeight / itemHeight + overhang) items', () => {
		const subject = mount(
			<VirtualList
				clientSize={clientSize}
				component={renderItem}
				data={items}
				dataSize={dataSize}
				itemSize={30}
			/>
		);

		const expected = 27; // 720 / 30 + 3
		const actual = subject.childAt(0).text().split('Account').length - 1;

		expect(actual).to.equal(expected);
	});

	describe('ScrollTo', () => {
		it('should scroll to the specific item of a given index with scrollTo', () => {
			mount(
				<VirtualList
					cbScrollTo={getScrollTo}
					clientSize={clientSize}
					component={renderItem}
					data={items}
					dataSize={dataSize}
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
					component={renderItem}
					data={items}
					dataSize={dataSize}
					direction="horizontal"
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
					component={renderItem}
					data={items}
					dataSize={dataSize}
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
						component={renderItem}
						data={items}
						dataSize={dataSize}
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
						component={renderItem}
						data={items}
						dataSize={dataSize}
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
						component={renderItem}
						data={items}
						dataSize={dataSize}
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

			const subject = mount(
				<VirtualList
					clientSize={clientSize}
					component={renderItem}
					data={itemArray}
					dataSize={itemArray.length}
					itemSize={30}
				/>
			);

			itemArray.unshift({name: 'Password 0'});
			subject.setProps({data: itemArray, dataSize: itemArray.length});

			setTimeout(() => {
				const expected = itemArray[0].name;
				const actual = subject.find('#item0').text();

				expect(actual).to.equal(expected);
				done();
			}, 0);
		});
	});
});
