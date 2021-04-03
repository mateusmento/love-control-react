// eslint-disable no-unused-vars

import { createElement, forwardRef } from "react";

export let Component = forwardRef(({as, flat, ...props}, ref) => {
	return createElement(as, {...props, ref});
});

Component.displayName = 'Component';
