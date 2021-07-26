// eslint-disable no-unused-vars

import { createElement, forwardRef } from "react";

export let Component = forwardRef(({as, props, ...deconstructedProps}, ref) => {
	return createElement(as, {...deconstructedProps, ...props, ref});
});

Component.displayName = 'Component';
