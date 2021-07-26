import { Page } from "../models/Page";
import { forwardRef, getters, mergePropElements } from "../../util";
import { Slot } from "../core/Slot";

export let List = forwardRef("List", ({items, labelBy, trackBy, flat, children, onSelect, ...props}, ref) => {
	let [labelOf, trackOf] = getters(labelBy, trackBy);

	if (items instanceof Page) items = items.results;

	return (
		<ul {...props} ref={ref}>{
			(() => {

				if (!items)	return children;

				if (items.length > 0)
					return items.map((item, i) =>
						<Slot
							key={trackOf(item)}
							$name="item"
							$type="li"
							$content={children}
							$data={{label: labelOf(item), item, index: i, items}}
							$multiple
							$filterable={[item, i, items]}
							$merge={mergePropElements}
							onMouseDown={(e) => onSelect && onSelect(item, i, e)}
						>
							{labelOf(item)}
						</Slot>
					);

				return <Slot $name="empty" $required $content={children}/>;

			})()
		}</ul>
	);
});
