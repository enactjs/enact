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
		noAutoDismiss: React.PropTypes.bool,
		onClose: React.PropTypes.func,
		open: React.PropTypes.bool,
		portalClassName: React.PropTypes.string,
		portalId: React.PropTypes.string
	}

	static defaultProps = {
		noAutoDismiss: false,
		open: false,
		portalClassName: 'enact-fit enact-untouchable',
		portalId: 'portal'
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
			if (this.props.onClose) {
				this.props.onClose();
			}
		}
	}

	closePortal () {
		if (this.node) {
			ReactDOM.unmountComponentAtNode(this.node);
			document.getElementById(this.props.portalId).removeChild(this.node);
		}
		this.portal = null;
		this.node = null;
	}

	renderPortal (props) {
		if (!this.node) {
			this.node = document.createElement('div');
			this.node.className = this.props.portalClassName;
			document.getElementById(this.props.portalId).appendChild(this.node);
		} else {
			this.node.className = this.props.portalClassName;
		}

		this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(this, React.cloneElement(props.children, {open: props.open}), this.node);
	}

	render () {
		return null;
	}
}

export default Portal;
