import React from 'react';
import PropsTypes from 'prop-types';
import hoc from '@enact/core/hoc';

import {contextTypes} from '../ApplicationCloseDecorator';

import css from './ActivityPanelsCloseButtonDecorator.less';

/**
 * Higher-order Component that checks for ApplicationCloseButton for ActivityPanels
 *
 * @class ActivityPanelsCloseButtonDecorator
 * @type {Function}
 * @hoc
 * @private
 * @memberof moonstone/Panels
 */
const ActivityPanelsCloseButtonDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {

		static displayName = 'ActivityPanelsCloseButtonDecorator'

		static propTypes = /** @lends moonstone/Panels.BreadcrumbDecorator.prototype */ {
			/**
			 * Index of the active panel
			 *
			 * @type {Number}
			 * @default 0
			 */
			index: PropsTypes.number
		}

		static contextTypes = contextTypes

		static defaultProps = {
			index: 0
		}

		constructor (props) {
			super(props);
			this.closeButton = null;
		}

		componentDidMount () {
			this.closeButton = document.querySelector(`#${this.context.closeButtonId}`);
			this.updateCloseButton(this.props.index);
		}

		componentWillReceiveProps (nextProps) {
			this.updateCloseButton(nextProps.index);
		}

		componentWillUnmount () {
			this.closeButton.classList.remove(css.activityPanelsCloseButton);
			this.closeButton = null;
		}

		updateCloseButton (index) {
			if (this.closeButton) {
				if (index > 0) {
					if (this.closeButton.className.indexOf(css.activityPanelsCloseButton) < 0) {
						this.closeButton.classList.add(css.activityPanelsCloseButton);
					}
				} else {
					this.closeButton.classList.remove(css.activityPanelsCloseButton);
				}
			}
		}

		render () {
			return (
				<Wrapped {...this.props} />
			);
		}
	};
});

export default ActivityPanelsCloseButtonDecorator;
