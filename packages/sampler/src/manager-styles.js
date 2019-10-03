const styles = `
	body {
		position: fixed;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	button[title="Zoom in"],
	button[title="Zoom out"],
	button[title="Reset zoom"],
	button[title="Reset zoom"] ~ span,
	button[title="Toggle background grid"] {
		display: none;
	}

	button[title='Shortcuts']::after {
		display: none;
	}

	a[href$='/?path=/settings/about'] {
        display: none;
    }
`;

const e = document.createElement('style');
e.type = 'text/css';
e.appendChild(document.createTextNode(styles));
document.head.appendChild(e);
