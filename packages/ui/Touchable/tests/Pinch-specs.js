import {defaultPinchConfig, Pinch} from '../Pinch';

describe('Pinch', () => {
	// A 200 x 200 container at the origin
	const node = {
		getBoundingClientRect: () => ({left: 0, top: 0, right: 200, bottom: 200})
	};

	// Two fingers `distance` px apart on a horizontal line
	const fingers = (distance) => [{x: 50, y: 100}, {x: 50 + distance, y: 100}];

	const begin = (pinch, handlers, config = {}, coords = fingers(50), target = node) => {
		pinch.begin({...defaultPinchConfig, ...config}, handlers, coords, target);
	};

	test('should not start pinching without any pinch handler', () => {
		const pinch = new Pinch();

		begin(pinch, {});

		expect(pinch.isPinching()).toBe(false);
	});

	test('should fire `onPinchStart` with the coordinates when it begins', () => {
		const pinch = new Pinch();
		const handlePinchStart = jest.fn();

		begin(pinch, {onPinchStart: handlePinchStart});

		expect(pinch.isPinching()).toBe(true);
		expect(handlePinchStart).toHaveBeenCalledWith({type: 'onPinchStart', coords: fingers(50)});
	});

	test('should fire `onPinch` with the scale when the fingers move apart beyond the tolerance', () => {
		const pinch = new Pinch();
		const handlePinch = jest.fn();
		begin(pinch, {onPinch: handlePinch});

		pinch.move(fingers(100));

		expect(handlePinch).toHaveBeenCalledWith({type: 'onPinch', scale: 2, coords: fingers(100)});
	});

	test('should not fire `onPinch` for a move within the tolerance', () => {
		const pinch = new Pinch();
		const handlePinch = jest.fn();
		begin(pinch, {onPinch: handlePinch});

		pinch.move(fingers(60));

		expect(handlePinch).not.toHaveBeenCalled();
	});

	test('should clamp the scale to `maxScale` and stop firing once it is reached', () => {
		const pinch = new Pinch();
		const handlePinch = jest.fn();
		begin(pinch, {onPinch: handlePinch}, {maxScale: 2, moveTolerance: 0}, fingers(20));

		pinch.move(fingers(100));
		pinch.move(fingers(140));

		expect(handlePinch).toHaveBeenCalledTimes(1);
		expect(handlePinch.mock.calls[0][0].scale).toBe(2);
	});

	test('should clamp the scale to `minScale`', () => {
		const pinch = new Pinch();
		const handlePinch = jest.fn();
		begin(pinch, {onPinch: handlePinch}, {minScale: 0.5, moveTolerance: 0}, fingers(100));

		pinch.move(fingers(10));

		expect(handlePinch.mock.calls[0][0].scale).toBe(0.5);
	});

	test('should measure the fingers only within the container', () => {
		const pinch = new Pinch();
		const handlePinch = jest.fn();
		begin(pinch, {onPinch: handlePinch}, {moveTolerance: 0}, fingers(50));

		// The second finger moves outside the 200px wide container, so it counts as being at its edge
		pinch.move([{x: 50, y: 100}, {x: 500, y: 100}]);

		expect(handlePinch.mock.calls[0][0].scale).toBe(3);
	});

	test('should measure the fingers within the window when `global`', () => {
		const pinch = new Pinch();
		const handlePinch = jest.fn();
		begin(pinch, {onPinch: handlePinch}, {global: true, maxScale: 10, moveTolerance: 0}, fingers(50));

		// The test environment window is 480 x 640, so the container bounds do not apply
		pinch.move([{x: 50, y: 100}, {x: 350, y: 100}]);

		expect(handlePinch.mock.calls[0][0].scale).toBe(6);
	});

	test('should exclude the padding of a `content-box` container', () => {
		const pinch = new Pinch();
		const handlePinch = jest.fn();
		const paddedNode = document.createElement('div');
		paddedNode.style.padding = '20px';
		paddedNode.getBoundingClientRect = node.getBoundingClientRect;
		document.body.appendChild(paddedNode);
		begin(pinch, {onPinch: handlePinch}, {boxSizing: 'content-box', moveTolerance: 0}, fingers(50), paddedNode);

		// The content box ends at 180px, so a finger at 500px counts as being at 180px
		pinch.move([{x: 50, y: 100}, {x: 500, y: 100}]);

		expect(handlePinch.mock.calls[0][0].scale).toBe(2.6);

		paddedNode.remove();
	});

	test('should continue from the previous scale when a new pinch begins', () => {
		const pinch = new Pinch();
		const handlePinch = jest.fn();
		begin(pinch, {onPinch: handlePinch}, {moveTolerance: 0});
		pinch.move(fingers(100));
		pinch.end();

		begin(pinch, {onPinch: handlePinch}, {moveTolerance: 0}, fingers(50));
		pinch.move(fingers(75));

		expect(handlePinch.mock.calls[1][0].scale).toBe(3);
	});

	test('should fire `onPinchEnd` and stop pinching when it ends', () => {
		const pinch = new Pinch();
		const handlePinch = jest.fn();
		const handlePinchEnd = jest.fn();
		begin(pinch, {onPinch: handlePinch, onPinchEnd: handlePinchEnd});

		pinch.end();
		pinch.move(fingers(150));

		expect(handlePinchEnd).toHaveBeenCalledWith({type: 'onPinchEnd'});
		expect(pinch.isPinching()).toBe(false);
		expect(handlePinch).not.toHaveBeenCalled();
	});

	test('should end a pinch on blur', () => {
		const pinch = new Pinch();
		const handlePinchEnd = jest.fn();
		begin(pinch, {onPinchEnd: handlePinchEnd});

		pinch.blur();

		expect(handlePinchEnd).toHaveBeenCalled();
		expect(pinch.isPinching()).toBe(false);
	});

	test('should keep a `global` pinch going on blur', () => {
		const pinch = new Pinch();
		const handlePinchEnd = jest.fn();
		begin(pinch, {onPinchEnd: handlePinchEnd}, {global: true});

		pinch.blur();

		expect(handlePinchEnd).not.toHaveBeenCalled();
		expect(pinch.isPinching()).toBe(true);
	});

	test('should use updated handlers for a pinch in progress', () => {
		const pinch = new Pinch();
		const firstHandlePinch = jest.fn();
		const latestHandlePinch = jest.fn();
		begin(pinch, {onPinch: firstHandlePinch}, {moveTolerance: 0});

		pinch.updateProps({onPinch: latestHandlePinch});
		pinch.move(fingers(100));

		expect(firstHandlePinch).not.toHaveBeenCalled();
		expect(latestHandlePinch).toHaveBeenCalled();
	});

	test('should ignore updated handlers when it is not pinching', () => {
		const pinch = new Pinch();
		const handlePinch = jest.fn();

		pinch.updateProps({onPinch: handlePinch});

		expect(pinch.isPinching()).toBe(false);
		expect(pinch.onPinch).toBeUndefined();
	});
});
