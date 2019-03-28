import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import {FloatingLayerBase} from '@enact/ui/FloatingLayer';

import EnactPropTypes from '@enact/core/internal/prop-types';
import {forward, handle} from '@enact/core/handle';
import {Job} from '@enact/core/util';

import IconButton from '../IconButton/IconButton';

import css from './MediaButton.module.less';

const MARGIN_BUTTOM = 15;

class MediaButton extends React.Component {
	static propTypes = {
		/**
			 * Disables the component
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
		disabled: PropTypes.bool,

		tooltipComponent: EnactPropTypes.componentOverride,

		/**
		 * Time to wait (in milliseconds) before showing image item tooltip on hover.
		 *
		 * @type {Number}
		 * @default 500
		 * @public
		 */
		tooltipDelay: PropTypes.number
	}

	static defaultProps = {
		disabled: false,
		tooltipDelay: 500
	}

	constructor (props) {
		super(props);

		this.state = {
			showing: false,
			position: {top: 0, left: 0}
		};
		this.tooltipRef = null;
		this.iconButtonRef = null;
	}

	componentDidUpdate (prevProps) {
		if (this.state.showing && prevProps.tooltipComponent !== this.props.tooltipComponent) {
			this.setPosition(this.iconButtonRef, this.iconButtonRef);
		}
	}

	showTooltipJob = new Job(() => {
		if (!this.state.showing) {
			this.setState({
				showing: true
			});
		}
	})

	getTooltipRef = (node) => {
		this.tooltipRef = ReactDOM.findDOMNode(node); // eslint-disable-line react/no-find-dom-node
		if (this.tooltipRef) {
			this.setPosition(this.tooltipRef, this.iconButtonRef);
		}
	}

	getIconButtonRef = (node) => {
		this.iconButtonRef = ReactDOM.findDOMNode(node); // eslint-disable-line react/no-find-dom-node
	}

	setPosition (tooltipNode, clientNode) {
		if (!tooltipNode || !clientNode) return;

		const tooltipDimension  = tooltipNode.getBoundingClientRect();
		const buttonDimension = clientNode.getBoundingClientRect();
		this.setState({
			position: {
				top: buttonDimension.top - tooltipDimension.height - MARGIN_BUTTOM,
				left: buttonDimension.left - ((tooltipDimension.width - buttonDimension.width) / 2)
			}
		});
	}

	showTooltip = () => {
		const {tooltipDelay, tooltipComponent} = this.props;

		if (tooltipComponent) {
			this.showTooltipJob.startAfter(tooltipDelay);
		}
	}

	hideTooltip = () => {
		if (this.props.tooltipComponent) {
			this.showTooltipJob.stop();

			if (this.state.showing) {
				this.setState({showing: false});
			}
		}
	}

	handle = handle.bind(this)

	handleFocus = this.handle(
		forward('onFocus'),
		this.showTooltip
	)

	handleBlur = this.handle(
		forward('onBlur'),
		this.hideTooltip
	)

	/**
	 * Conditionally creates the FloatingLayer and Tooltip based on the presence of
	 * `tooltipText` and returns a property bag to pass onto the Wrapped component
	 *
	 * @returns {Object} Prop object
	 * @private
	 */
	renderImageTooltip () {
		const {tooltipComponent} = this.props;

		if (tooltipComponent) {
			const Component = tooltipComponent;
			const props = {
				ref: this.getTooltipRef,
				className: css.imageItemTooltip,
				style: {top: this.state.position.top, left: this.state.position.left}
			};
			return (
				<FloatingLayerBase open={this.state.showing} noAutoDismiss onDismiss={this.hideTooltip} scrimType="none" key="mediaButtonFloatingLayer">
					{
						(typeof Component === 'function' || typeof Component === 'string') && (
							<Component {...props} />
						) || React.isValidElement(Component) && (
							React.cloneElement(Component, props)
						)
					}
				</FloatingLayerBase>
			);
		}

		return null;
	}

	render () {
		const props = Object.assign(
			{},
			this.props,
			{
				onBlur: this.handleBlur,
				onFocus: this.handleFocus
			}
		);

		delete props.tooltipDelay;
		delete props.tooltipComponent;

		return (
			<React.Fragment>
				{this.renderImageTooltip()}
				<IconButton {...props} ref={this.getIconButtonRef} />
			</React.Fragment>
		);
	}
}

export default MediaButton;
export {MediaButton};
