import React from 'react';
import ReactDOM from 'react-dom';

class Portal extends React.Component {
	static displayName = 'Portal'

	constructor (props) {
		super(props);
		this.node = null;
		this.portal = null;
	}

	static propTypes = {
		open: React.PropTypes.bool,
		portalClassName: React.PropTypes.string
	}

	static defaultProps = {
		open: false,
		portalClassName: 'enact-fit enact-untouchable'
	}

	componentDidMount () {
		// TODO: addEventlisteners for autoDismiss

		if (this.props.open) {
			this.renderPortal(this.props);
		}
	}

	componentWillReceiveProps (newProps) {
		if (typeof newProps.open !== 'undefined') {
			if (newProps.open) {
				this.renderPortal(newProps);
			} else {
				this.closePortal();
			}
		}
	}

	componentWillUnmount () {
		// TODO: removeEventlisteners for autoDismiss

		this.closePortal();
	}

	closePortal () {
		const resetPortalState = () => {
			if (this.node) {
				ReactDOM.unmountComponentAtNode(this.node);
				document.body.removeChild(this.node);
			}
			this.portal = null;
			this.node = null;
		};

		resetPortalState();
	}

	renderPortal (props) {
		if (!this.node) {
			this.node = document.createElement('div');
			this.node.className = this.props.portalClassName;
			document.body.appendChild(this.node);
		}

		this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(this, props.children, this.node);
	}

	render () {
		return null;
	}
}

export default Portal;
