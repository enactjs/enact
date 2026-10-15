const round2 = (value) => Math.round(value * 100) / 100;

const readLineHeight = (node) => {
	const style = window.getComputedStyle(node);
	const parsed = Number.parseFloat(style.lineHeight);
	const fontSize = Number.parseFloat(style.fontSize);
	let raw = 0;

	if (parsed > 0) {
		raw = parsed;
	} else if (fontSize > 0) {
		raw = fontSize * 1.2;
	}

	return round2(raw);
};

const stripIds = (node) => {
	if (!node || node.nodeType !== 1) return;

	node.removeAttribute('id');
	node.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
};

const cloneContentInto = (source, target) => {
	if (!source || !target) return;

	target.replaceChildren(...Array.from(source.childNodes, (child) => child.cloneNode(true)));
	stripIds(target);
};

/*
 * Group client rects into line boxes. Fragments of one line share a top edge.
 * A later line starts about one line-height lower, so half a line keeps them apart.
 */
const sameLine = (box, top, height) => {
	const lineHeight = box.bottom - box.top;
	return Math.abs(box.top - top) <= Math.min(lineHeight, height) / 2;
};

const lineBoxes = (node) => {
	const doc = node.ownerDocument;
	if (!doc || typeof doc.createRange !== 'function') return [];

	const range = doc.createRange();
	range.selectNodeContents(node);
	if (typeof range.getClientRects !== 'function') return [];

	const boxes = [];
	Array.from(range.getClientRects()).forEach((rect) => {
		if (!(rect.height > 0) || !(rect.width > 0)) return;

		const top = round2(rect.top);
		const bottom = round2(rect.bottom);
		const match = boxes.find((box) => sameLine(box, top, rect.height));

		if (match) {
			match.bottom = Math.max(match.bottom, bottom);
			return;
		}

		boxes.push({bottom, top});
	});

	boxes.sort((a, b) => a.top - b.top);
	return boxes;
};

/*
 * Glyph boxes omit the half-leading, or overhang the block when the line-height is tight.
 * The duplicate is placed after the laid-out block, so the cycle uses that height.
 * The clip is the distance from one line top to the next line top. Text that fits uses
 * the measurer's block height.
 */
const measureNode = (node, maxLines) => {
	const boxes = lineBoxes(node);
	const blockHeight = round2(node.getBoundingClientRect().height);

	if (boxes.length > 0) {
		const overflows = boxes.length > maxLines;
		const glyphHeight = round2(boxes[0].bottom - boxes[0].top);
		const gap = boxes.length > 1 ? round2(boxes[1].top - boxes[0].top) : 0;
		const lineHeight = gap > 0 ? gap : glyphHeight;
		let clipHeight = blockHeight;
		if (overflows) {
			const nextTop = boxes[maxLines] ? round2(boxes[maxLines].top - boxes[0].top) : 0;
			clipHeight = nextTop > 0 ? nextTop : round2(lineHeight * maxLines);
		}

		return {
			clipHeight,
			contentHeight: blockHeight,
			lineHeight,
			measured: clipHeight > 0,
			overflows
		};
	}

	const fallbackLineHeight = readLineHeight(node);
	const fallbackClipHeight = round2(fallbackLineHeight * maxLines);

	return {
		clipHeight: fallbackClipHeight,
		contentHeight: blockHeight,
		lineHeight: fallbackLineHeight,
		measured: fallbackLineHeight > 0,
		overflows: fallbackLineHeight > 0 && blockHeight > fallbackClipHeight + 1
	};
};

const prefersReducedMotion = () => (
	typeof window !== 'undefined' &&
	typeof window.matchMedia === 'function' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

export {
	cloneContentInto,
	measureNode,
	prefersReducedMotion,
	round2
};
