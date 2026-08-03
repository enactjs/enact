/*
 * Prerendering support for FloatingLayer.
 *
 * Portals are not supported by the server renderer, so, by default, a FloatingLayer renders `null`
 * during a `renderToString` prerender pass. The `prerender` prop opts into rendering the content
 * inline on the first render (server pass + initial client render) and relocating it into the
 * floating layer via a portal once mounted on the client
 */

/* eslint-disable testing-library/render-result-naming-convention */
import '@testing-library/jest-dom';
import {act} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';

import {FloatingLayerBase} from '../FloatingLayer';
import FloatingLayerDecorator from '../FloatingLayerDecorator';

describe('FloatingLayer prerender support', () => {
	const Root = FloatingLayerDecorator('div');

	const tree = (props) => (
		<Root>
			<FloatingLayerBase open {...props}><p>Prerendered popup</p></FloatingLayerBase>
		</Root>
	);

	test('should NOT prerender content without the prerender prop (server portal yields null)', () => {
		const html = renderToString(tree());

		expect(html).not.toContain('Prerendered popup');
	});

	test('should prerender content inline when prerender is enabled', () => {
		const html = renderToString(tree({prerender: true}));

		expect(html).toContain('Prerendered popup');
	});

	test('should hydrate prerendered content without mismatch and relocate it into the floating layer', async () => {
		const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

		// 1. Server prerender pass -> inline content captured in HTML.
		const html = renderToString(tree({prerender: true}));
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.appendChild(container);

		// 2. Client hydration. The first client render is also inline (readyToRender is still false),
		// so it matches the server markup; the portal move happens later, after mount.
		await act(async () => {
			hydrateRoot(container, tree({prerender: true}));
		});

		// No hydration mismatch was reported.
		const hydrationErrors = errorSpy.mock.calls.filter(([msg]) => typeof msg === 'string' && /hydrat/i.test(msg));
		expect(hydrationErrors).toEqual([]);

		// 3. After mounting, the content has been relocated into the floating layer node via the portal.
		const floatLayer = container.querySelector('#floatLayer');
		expect(floatLayer).toBeInTheDocument();
		expect(floatLayer).toHaveTextContent('Prerendered popup');

		errorSpy.mockRestore();
		document.body.removeChild(container);
	});
});
