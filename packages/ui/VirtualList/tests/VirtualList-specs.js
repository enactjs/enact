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
		resultScrollTop;

	beforeEach(() => {
		clientSize = {clientWidth: 1280, clientHeight: 720};
		dataSize = 100;
		items = [];
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
			resultScrollLeft = e.scrollLeft;
			resultScrollTop = e.scrollTop;

			testCase();
			done();
		};
		renderItem = ({index, ...rest}) => {	// eslint-disable-line enact/display-name, enact/prop-types
			return (
				<div {...rest} id={'item' + index}>
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
		const actual = subject.find('#item0').text();

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
		const actual = subject.childAt(0).text().split('Account').length - 1;

		expect(actual).to.equal(expected);
	});

	describe('ScrollTo', () => {
		it('should scroll to the specific item of a given index with scrollTo', (done) => {
			const onScrollStop = handlerOnScrollStop(done, () => {
				const expected = 300;
				const actual = resultScrollTop;

				expect(actual).to.equal(expected);

			});

			mount(
				<VirtualList
					cbScrollTo={getScrollTo}
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={30}
					onScrollStop={onScrollStop}
				/>
			);

			myScrollTo({index: 10, animate: false});
		});

		it('should scroll to the given \'x\' position with scrollTo', (done) => {
			const onScrollStop = handlerOnScrollStop(done, () => {
				const expected = 1;
				const actual = onScrollStopCount;

				expect(actual).to.equal(expected);
			});

			mount(
				<VirtualList
					cbScrollTo={getScrollTo}
					clientSize={clientSize}
					dataSize={dataSize}
					direction="horizontal"
					itemRenderer={renderItem}
					itemSize={30}
					onScrollStop={onScrollStop}
				/>
			);

			myScrollTo({position: {x: 100}, animate: false});
		});

		it('should scroll to the given \'y\' position with scrollTo', (done) => {
			const onScrollStop = handlerOnScrollStop(done, () => {
				const expected = 100;
				const actual = resultScrollTop;

				expect(actual).to.equal(expected);
			});

			mount(
				<VirtualList
					cbScrollTo={getScrollTo}
					clientSize={clientSize}
					dataSize={dataSize}
					itemRenderer={renderItem}
					itemSize={30}
					onScrollStop={onScrollStop}
				/>
			);

			myScrollTo({position: {y: 100}, animate: false});
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

			it('should call onScrollStop once', (done) => {
				const onScrollStop = handlerOnScrollStop(done, () => {
					const expected = 1;
					const actual = onScrollStopCount;

					expect(actual).to.equal(expected);
				});

				mount(
					<VirtualList
						cbScrollTo={getScrollTo}
						clientSize={clientSize}
						dataSize={dataSize}
						itemRenderer={renderItem}
						itemSize={30}
						onScrollStop={onScrollStop}
					/>
				);

				myScrollTo({position: {y: 100}, animate: false});
			});
		});
	});

	describe('Adding an item', () => {
		it('should render an added item named \'Password 0\' as the first item', (done) => {
			const itemArray = [{name: 'A'}, {name: 'B'}, {name: 'C'}];
			const renderItemArray = ({index, ...rest}) => { // eslint-disable-line enact/display-name, enact/prop-types
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
				const actual = subject.find('#item0').text();

				expect(actual).to.equal(expected);
				done();
			}, 0);
		});
	});
});
