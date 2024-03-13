export default function (set, remove) {
	let polyfilled = false;

	set(() => {
		if (!Element.prototype.closest) {
			polyfilled = true;

			// we're using detached nodes so we have to find the root node rather than the document
			function findRoot (n) {
				while (n && n.parentNode) {
					n = n.parentNode;
				}

				return n;
			}

			Element.prototype.closest = function (s) {
				let matches = findRoot(this).querySelectorAll(s),
					i,
					el = this;

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
			delete Element.prototype.closest;
		}
	});
}
