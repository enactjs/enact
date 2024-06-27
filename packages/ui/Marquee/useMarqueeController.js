import {forward} from '@enact/core/handle';
import {Job} from '@enact/core/util';
import {createContext, useCallback, useMemo, useEffect, useRef} from 'react';

const STATE = {
	inactive: 0,	// Marquee is not necessary (render or focus not happened)
	active: 1,		// Marquee in progress, awaiting complete
	ready: 2		// Marquee completed or not needed, but state is active
};

const MarqueeControllerContext = createContext(null);

const forwardBlur = forward('onBlur');
const forwardFocus = forward('onFocus');

const useMarqueeController = (props) => {
	const mutableRef = useRef({
		controlled: [],
		isFocused: false,
		isHovered: false
	});

	/*
	 * Invokes the `action` handler for each synchronized component except the invoking
	 * `component`.
	 *
	 * @param	{String}	action		`'start'`, `'stop'`, or `'restartAnimation'`
	 * @param	{Object}	component	A previously registered component
	 *
	 * @returns	{undefined}
	 */
	const dispatch = useCallback((action, component) => {
		mutableRef.current.controlled.forEach((controlled) => {
			const {component: controlledComponent, [action]: handler} = controlled;
			if (component !== controlledComponent && typeof handler === 'function') {
				const complete = handler.call(controlledComponent);

				// Returning `true` from a start request means that the marqueeing is
				// unnecessary and is therefore not awaiting a finish
				if (action === 'start' && complete) {
					controlled.state = STATE.ready;
				} else if (action === 'start') {
					controlled.state = STATE.active;
				}
			} else if ((action === 'start') && (component === controlledComponent)) {
				controlled.state = STATE.active;
			}
		});
	}, []);

	/*
	 * Marks all components with the passed-in state
	 *
	 * @param	{Enum}	state	The state to set
	 *
	 * @returns	{undefined}
	 */
	const markAll = useCallback((state) => {
		mutableRef.current.controlled.forEach(c => {
			c.state = state;
		});
	}, []);

	/*
	 * Marks `component` as ready for next marquee action
	 *
	 * @param	{Object}	component	A previously registered component
	 *
	 * @returns	{Boolean}				`true` if no components are STATE.active
	 */
	const markReady = useCallback((component) => {
		let complete = true;
		mutableRef.current.controlled.forEach(c => {
			if (c.component === component) {
				c.state = STATE.ready;
			}
			complete = complete && (c.state !== STATE.active);
		});
		return complete;
	}, []);

	/*
	 * Checks that all components are inactive
	 *
	 * @returns {Boolean} `true` if any components should be running
	 */
	const allInactive = useCallback(() => {
		const activeOrReady = mutableRef.current.controlled.reduce((res, component) => {
			return res || !(component.state === STATE.inactive);
		}, false);
		return !activeOrReady;
	}, []);

	/*
	 * Checks for any components currently marqueeing
	 *
	 * @returns {Boolean} `true` if any component is marqueeing
	 */
	const anyRunning = useCallback(() => {
		return mutableRef.current.controlled.reduce((res, component) => {
			return res || (component.state === STATE.active);
		}, false);
	}, []);

	const doCancel = useCallback((retryStartingAnimation) => {
		if (mutableRef.current.isHovered || mutableRef.current.isFocused) {
			return;
		}
		markAll(STATE.inactive);
		dispatch('stop');
		if (retryStartingAnimation) {
			dispatch('restartAnimation');
		}
	}, [dispatch, markAll]);

	const cancelJob = useMemo(() => new Job((retryStartingAnimation = false) => doCancel(retryStartingAnimation), 30), [doCancel]);

	/*
	 * Registers `component` with a set of handlers for `start`, `stop`, and `restartAnimation`.
	 *
	 * @param	{Object}	component	A component, typically a React component instance, on
	 *									which handlers will be dispatched.
	 * @param	{Object}	handlers	An object containing `start`, `stop`, and `restartAnimation` functions
	 *
	 * @returns {undefined}
	 */
	const handleRegister = useCallback((component, handlers) => {
		const needStart = !allInactive() || mutableRef.current.isFocused;

		mutableRef.current.controlled.push({
			...handlers,
			state: STATE.inactive,
			component
		});

		if (needStart) {
			dispatch('start');
		}
	}, [allInactive, dispatch]);

	/*
	 * Unregisters `component` for synchronization
	 *
	 * @param	{Object}	component	A previously registered component
	 *
	 * @returns	{undefined}
	 */
	const handleUnregister = useCallback((component) => {
		let wasRunning = false;
		for (let i = 0; i < mutableRef.current.controlled.length; i++) {
			if (mutableRef.current.controlled[i].component === component) {
				wasRunning = mutableRef.current.controlled[i].state === STATE.active;
				mutableRef.current.controlled.splice(i, 1);
				break;
			}
		}
		if (wasRunning && !anyRunning()) {
			dispatch('start');
		}
	}, [anyRunning, dispatch]);

	/*
	 * Handler for the `start` context function
	 *
	 * @param	{Object}	component	A previously registered component
	 *
	 * @returns	{undefined}
	 */
	const handleStart = useCallback((component) => {
		cancelJob.stop();
		if (!anyRunning()) {
			markAll(STATE.ready);
			dispatch('start', component);
		}
	}, [anyRunning, cancelJob, dispatch, markAll]);

	/*
	 * Handler for the `cancel` context function
	 *
	 * @param	{Boolean}	retryStartingAnimation	If true, `restartAnimation` called after `cancelJob` completes
	 *
	 * @returns	{undefined}
	 */
	const handleCancel = useCallback((retryStartingAnimation) => {
		if (anyRunning()) {
			cancelJob.start(retryStartingAnimation);
		}
	}, [anyRunning, cancelJob]);

	/*
	 * Handler for the `complete` context function
	 *
	 * @param	{Object}	component	A previously registered component
	 *
	 * @returns	{undefined}
	 */
	const handleComplete = useCallback((component) => {
		const complete = markReady(component);
		if (complete && !component.contentFits) {
			markAll(STATE.ready);
			dispatch('start');
		}
	}, [dispatch, markAll, markReady]);

	const handleEnter = useCallback(() => {
		mutableRef.current.isHovered = true;
		if (!anyRunning()) {
			dispatch('start');
		}
		cancelJob.stop();
	}, [anyRunning, cancelJob, dispatch]);

	const handleLeave = useCallback(() => {
		mutableRef.current.isHovered = false;
		cancelJob.start();
	}, [cancelJob]);

	/*
	 * Handler for the focus event
	 */
	const handleFocus = useCallback((ev) => {
		mutableRef.current.isFocused = true;
		if (!anyRunning()) {
			dispatch('start');
		}
		cancelJob.stop();
		forwardFocus(ev, props);
	}, [anyRunning, cancelJob, dispatch, props]);

	/*
	 * Handler for the blur event
	 */
	const handleBlur = useCallback((ev) => {
		mutableRef.current.isFocused = false;
		if (anyRunning()) {
			cancelJob.start();
		}
		forwardBlur(ev, props);
	}, [anyRunning, cancelJob, props]);

	useEffect(() => {
		return () => {
			cancelJob.stop();
		};
	}, [cancelJob]);

	const value = useMemo(() => ({cancel: handleCancel, complete: handleComplete, enter: handleEnter, leave: handleLeave, register: handleRegister, start: handleStart, unregister: handleUnregister}),
		[handleCancel, handleComplete, handleEnter, handleLeave, handleRegister, handleStart, handleUnregister]);

	const provideMarqueeControllerContext = useCallback((children) => {
		return (
			<MarqueeControllerContext.Provider value={value}>
				{children}
			</MarqueeControllerContext.Provider>
		);
	}, [value]);

	return {
		handleBlur,
		handleFocus,
		provideMarqueeControllerContext
	};
};

export default useMarqueeController;
export {
	MarqueeControllerContext,
	useMarqueeController
};
