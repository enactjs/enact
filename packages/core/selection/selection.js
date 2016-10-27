import R from 'ramda';

/**
 * Determines if `item` is selected
 *
 * @param	{*}			item		Usually a number but could be anything within the `selected` list
 * @param	{*|Array}	selected	One or many selected items
 *
 * @returns	{Boolean}				`true` if item is equal to or contained in `selected`
 * @public
 */
const isSelected = R.curry(function (item, selected) {
	return item === selected || Array.isArray(selected) && selected.indexOf(item) >= 0;
});

/**
 * Selects or deselects an `item` based on the `mode` and returns a copy of `selected` with the new
 * selected state.
 *
 * `single` - Toggles the selection state of `item`. Always returns either `item` or null.
 * `radio` - Always selects `item`
 * `multiple` - Toggles the selection state `item` like `single` but doesn't replace other selected
 * items.
 *
 * @param	{String}	mode		Selection mode (`single`, `radio`, or `multiple`)
 * @param	{*}			item		The selected item
 * @param	{*|Array}	selected	The current selection
 *
 * @returns {*|Array}				The updated selection
 * @public
 */
const select = R.curry(function (mode, item, selected) {
	if (mode === 'radio' || (mode === 'multiple' && selected == null)) {
		// When selection is disabled, when selecting only 1, or when selecting the
		// first of multiple, we can forward the source event as is.
		return item;
	} else if (mode === 'single') {
		// When selecting 0 or 1, we have to unselect it if selected
		return isSelected(item, selected) ? null : item;
	} else {
		// Otherwise we're selecting multiple so we have to either deselect it if
		// already selected or select it if not.
		let updated = Array.isArray(selected) ? selected.slice() : [selected];
		const index = updated.indexOf(item);
		if (index >= 0) {
			updated.splice(index, 1);
		} else {
			// insert and sort
			updated.push(item);
			updated = updated.sort((a, b) => a - b);
		}

		return updated;
	}
});

export {
	isSelected,
	select
};
