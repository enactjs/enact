import {call, forProp, forward, handle, oneOf, returnsTrue, stop} from '@enact/core/handle';

import {hasPointerMoved} from '../src/pointer';
import Spotlight from '../src/spotlight';

const isNewPointerPosition = (ev) => hasPointerMoved(ev.clientX, ev.clientY);
const not = (fn) => function () {
	return !fn.apply(this, arguments);
};
const releaseContainer = ({preserveId, id}) => {
	if (preserveId) {
		Spotlight.unmount(id);
	} else {
		Spotlight.remove(id);
	}
};

class SpotlightContainer {
	constructor ({containerConfig, navigableFilter, state, ...rest}) {
		this.props = rest;
		this.context = {
			...this.context,
			navigableFilter
		};

		// Used to indicate that we want to stop propagation on blur events that occur as a
		// result of this component imperatively blurring itself on focus when spotlightDisabled
		this.shouldPreventBlur = false;

		const cfg = {
			...containerConfig,
			navigableFilter: this.navigableFilter
		};

		Spotlight.set(state.current.id, cfg);
	}

	setPropsAndContext (props, context) {
		const {preserveId, state, stateFromProps} = context;

		this.props = props;
		this.context.state = state;

		const {spotlightId: id, spotlightRestrict} = props;
		const {id: prevId, spotlightRestrict: prevSpotlightRestrict} = state.current;
		// prevId will only be undefined the first render so this prevents releasing the
		// container after initially creating it
		const isIdChanged = prevId && id && prevId !== id;

		if (isIdChanged) {
			releaseContainer(state.current);
		}

		if (isIdChanged || spotlightRestrict !== prevSpotlightRestrict) {
			state.current = stateFromProps({preserveId, spotlightId: prevId, spotlightRestrict: prevSpotlightRestrict});
		}
	}

	unload () {
		releaseContainer(this.context.state.current);
	}

	navigableFilter = (elem) => {
		const {navigableFilter} = this.context;

		// If the component to which this was applied specified a navigableFilter, run it
		if (typeof navigableFilter === 'function') {
			if (navigableFilter(elem, this.props, this.context) === false) {
				return false;
			}
		}

		return true;
	}

	silentBlur = ({target}) => {
		this.shouldPreventBlur = true;
		target.blur();
		this.shouldPreventBlur = false;
	}

	handle = handle.bind(this)

	handleBlur = oneOf(
		[() => this.shouldPreventBlur, stop],
		[returnsTrue, forward('onBlurCapture')]
	).bindAs(this, 'handleBlur')

	handleFocus = oneOf(
		[forProp('spotlightDisabled', true), handle(
			stop,
			call('silentBlur')
		)],
		[returnsTrue, forward('onFocusCapture')]
	).bindAs(this, 'handleFocus')

	handleMouseEnter = this.handle(
		forward('onMouseEnter'),
		isNewPointerPosition,
		() => Spotlight.setActiveContainer(this.context.state.current.id)
	)

	handleMouseLeave = this.handle(
		forward('onMouseLeave'),
		not(forProp('spotlightRestrict', 'self-only')),
		isNewPointerPosition,
		(ev) => {
			const parentContainer = ev.currentTarget.parentNode.closest('[data-spotlight-container]');
			let activeContainer = Spotlight.getActiveContainer();

			// if this container is wrapped by another and this is the currently active
			// container, move the active container to the parent
			if (parentContainer && activeContainer === this.context.state.current.id) {
				activeContainer = parentContainer.dataset.spotlightId;
				Spotlight.setActiveContainer(activeContainer);
			}
		}
	)
}

export default SpotlightContainer;
export {
	SpotlightContainer
};
