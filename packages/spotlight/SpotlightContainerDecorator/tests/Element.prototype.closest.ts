type LifecycleHook = (fn: () => void) => void;

export default function (set: LifecycleHook, remove: LifecycleHook): void {
	let polyfilled = false;

	set(() => {
		if (!Element.prototype.closest) {
			polyfilled = true;

			// we're using detached nodes so we have to find the root node rather than the document
			function findRoot (n: Node): ParentNode {
				while (n.parentNode) {
					n = n.parentNode;
				}

				return n as ParentNode;
			}

			Element.prototype.closest = function (this: Element, s: string): Element | null {
				const root = findRoot(this);
				let matches = root.querySelectorAll(s),
					i,
					el: Element | null = this;

				do {
					i = matches.length;
					while (--i >= 0 && matches.item(i) !== el) {
						// nothing
					}
				} while ((i < 0) && (el = el.parentElement));

				return el;
			};
		}
	});

	remove(() => {
		if (polyfilled) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete (Element.prototype as Partial<Element>).closest;
		}
	});
}
