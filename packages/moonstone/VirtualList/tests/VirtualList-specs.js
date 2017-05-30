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
		renderItem = ({data, index, ...rest}) => {	// eslint-disable-line enact/display-name, enact/prop-types
			return (
				<Item {...rest}>
					{data[index].name}
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

	describe('Set props Specs', () => {
		it('should render a list item of \'items\'', () => {
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
			const actual = subject.find('VirtualListCore').children().at(0).text();

			expect(actual).to.equal(expected);
		});

		it('should render a list \'overhang\' items', () => {
			const subject = mount(
				<VirtualList
					clientSize={clientSize}
					component={renderItem}
					data={items}
					dataSize={dataSize}
					itemSize={30}
				/>
			);

			const expected = 27;
			const actual = subject.find('VirtualListCore').children().length;

			expect(actual).to.equal(expected);
		});

		it('should render scrollbar only one', () => {
			const subject = mount(
				<VirtualList
					clientSize={clientSize}
					component={renderItem}
					data={items}
					dataSize={dataSize}
					direction={'horizontal'}
					itemSize={30}
				/>
			);

			const expected = 1;
			const actual = subject.find('Scrollbar').length;

			expect(actual).to.equal(expected);
		});

		describe('cbScrollTo', () => {
			it('should scroll with cbScrollTo prop (itemIndex)', () => {
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

			it('should scroll with cbScrollTo prop (direction - horizontal)', () => {
				mount(
					<VirtualList
						cbScrollTo={getScrollTo}
						clientSize={clientSize}
						component={renderItem}
						data={items}
						dataSize={dataSize}
						direction={'horizontal'}
						itemSize={30}
						onScrollStop={handlerOnScrollStop}
					/>
				);

				myScrollTo({position: {x: 100}, animate: false});

				const expected = 100;
				const actual = resultScrollLeft;

				expect(actual).to.equal(expected);
			});

			it('should scroll with cbScrollTo prop (direction - vertical)', () => {
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
		});

		describe('callback', () => {
			it('should only be called once onScrollStart callback function', () => {
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

			it('should only be called once onScroll callback function', () => {
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

			it('should only be called once onScrollStop callback function', () => {
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

	describe('Change props Specs', () => {
		it('should change value of the prop \'data\' to \'Password 0\'', (done) => {
			const subject = mount(
				<VirtualList
					clientSize={clientSize}
					component={renderItem}
					data={items}
					dataSize={dataSize}
					itemSize={30}
				/>
			);

			items = [{name: 'Password 0'}];
			subject.setProps({data: items, dataSize: items.length});

			setTimeout(() => {
				const expected = items[0].name;
				const actual = subject.find('VirtualListCore').children().at(0).text();

				expect(actual).to.equal(expected);
				done();
			}, 1);
		});

		it('should change value of the prop \'dataSize\' to \'5\'', (done) => {
			const subject = mount(
				<VirtualList
					clientSize={clientSize}
					component={renderItem}
					data={items}
					dataSize={dataSize}
					itemSize={30}
				/>
			);

			dataSize = 10;
			subject.setProps({dataSize: dataSize});

			setTimeout(() => {
				const expected = dataSize;
				const actual = subject.find('VirtualListCore').children().length;

				expect(actual).to.equal(expected);
				done();
			}, 1);
		});
	});
});
