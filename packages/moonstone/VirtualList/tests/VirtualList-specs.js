import {mount} from 'enzyme';
import React, {PropTypes} from 'react';

import Item from '../../Item';
import VirtualList from '../VirtualList';

describe('VirtualList Specs', () => {
	describe('Set and change props Specs', () => {
		let
			myScrollTo,
			resultScrollLeft;

		const
			dataSize = 100,
			items = [],
			getScrollTo = (scrollTo) => {
				myScrollTo = scrollTo;
			},
			handlerOnScrollStop = (e) => {
				resultScrollLeft = e.scrollLeft;
			},
			renderItem = ({data, index, key}) => {
				return (
					<Item key={key}>
						{data[index].name}
					</Item>
				);
			};

		renderItem.propTypes = {
			data: PropTypes.any,
			index: PropTypes.number,
			key: PropTypes.any
		};

		for (let i = 0; i < dataSize; i++) {
			items.push({name: 'Account ' + i});
		}

		const subject = mount(
			<VirtualList
				cbScrollTo={getScrollTo}
				component={renderItem}
				data={items}
				dataSize={dataSize}
				direction={'horizontal'}
				itemSize={30}
				onScrollStop={handlerOnScrollStop}
				style={{backgroundColor: 'red', width: '500px', height: '700px'}}
			/>
		);

		describe('Set props Specs', () => {
			it('should render a list item of \'items\'', function () {
				const expected = 'Account 0';
				const actual = subject.find('VirtualListCore').children().at(0).text();

				expect(actual).to.equal(expected);
			});

			it('should have the prop \'dataSize\' of 100', function () {
				const expected = 100;
				const actual = subject.find('VirtualListCore').prop('dataSize');

				expect(actual).to.equal(expected);
			});

			it('should have the prop \'direction\' of \'horizontal\'', function () {
				const expected = 'horizontal';
				const actual = subject.find('VirtualListCore').prop('direction');

				expect(actual).to.equal(expected);
			});

			it('should apply list size', function () {
				const expectedHeight = '700px';
				const expectedWidth = '500px';
				const actualHeight = subject.prop('style').height;
				const actualWidth = subject.prop('style').width;

				expect(actualHeight).to.equal(expectedHeight);
				expect(actualWidth).to.equal(expectedWidth);
			});

			it('should apply background color', function () {
				const expected = 'red';
				const actual = subject.prop('style').backgroundColor;

				expect(actual).to.equal(expected);
			});

			it('should scroll with cbScrollTo prop', function () {
				myScrollTo({position: {x: 10}, animate: false});

				const expected = 10;
				const actual = resultScrollLeft;

				expect(actual).to.equal(expected);
			});
		});

		describe('Change props Specs', () => {
			it('should change value of the prop \'data\' to \'Password 0\'', function () {
				items[0] = {name: 'Password 0'};
				subject.setProps({data: items});

				setTimeout(() => {
					const expected = 'Password 0';
					const actual = subject.find('VirtualListCore').children().at(0).text();

					expect(actual).to.equal(expected);
				}, 0);
			});

			it('should change value of the prop \'direction\' to \'vertical\'', function () {
				subject.setProps({direction: 'vertical'});

				const expected = 'vertical';
				const actual = subject.find('VirtualListCore').prop('direction');

				expect(actual).to.equal(expected);
			});

			it('should change value of the prop \'spacing\' to 5', function () {
				subject.setProps({spacing: 5});

				const expected = 5;
				const actual = subject.find('VirtualListCore').prop('spacing');

				expect(actual).to.equal(expected);
			});

			it('should change value of the props \'style\' to \'backgroundColor\', \'height\', and \'width\'', function () {
				subject.setProps({style: {backgroundColor: 'blue', height: '600px', width: '400px'}});

				const expectedBackgroundColor = 'blue';
				const expectedHeight = '600px';
				const expectedWidth = '400px';
				const actualBackgroundColor = subject.prop('style').backgroundColor;
				const actualHeight = subject.prop('style').height;
				const actualWidth = subject.prop('style').width;

				expect(actualBackgroundColor).to.equal(expectedBackgroundColor);
				expect(actualHeight).to.equal(expectedHeight);
				expect(actualWidth).to.equal(expectedWidth);
			});
		});
	});
});
