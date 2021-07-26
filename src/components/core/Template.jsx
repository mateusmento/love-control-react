import { forwardRef } from "../../util";

export let Template = forwardRef("Template", ({children}, ref) => {
	return children || null;
});
