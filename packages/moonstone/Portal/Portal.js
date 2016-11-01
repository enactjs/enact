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
		onClose: React.PropTypes.func,
		noAutoDismiss: React.PropTypes.bool,
		portalClassName: React.PropTypes.string
	}

	static defaultProps = {
		open: false,
		noAutoDismiss: false,
		portalClassName: 'enact-fit enact-untouchable'
	}

	componentDidMount () {
		if (!this.props.noAutoDismiss) {
			document.addEventListener('keydown', this.handleKeydown);
		}

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
		if (!this.props.noAutoDismiss) {
			document.removeEventListener('keydown', this.handleKeydown);
		}
		this.closePortal();
	}

	handleKeydown = (ev) => {
		if (ev.keyCode === 27) {
			ev.preventDefault();
			this.props.onClose && this.props.onClose();
		}
	}

	closePortal () {
		if (this.node) {
			ReactDOM.unmountComponentAtNode(this.node);
			document.body.removeChild(this.node);
		}
		this.portal = null;
		this.node = null;
	}

	renderPortal (props) {
		if (!this.node) {
			this.node = document.createElement('div');
			this.node.className = this.props.portalClassName;
			document.body.appendChild(this.node);
		} else {
			this.node.className = this.props.portalClassName;
		}

		this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(this, props.children, this.node);
	}

	render () {
		return null;
	}
}

export default Portal;
