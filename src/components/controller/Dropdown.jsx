import { useMemo, useState } from "react";
import { childrenProcessing } from "../../functions/childrenProcessing";
import { useOutsideEventRef } from "../../hooks/useOutsideEventRef";
import { callable } from "../../util";
import { css } from "@emotion/css";
import { stateful } from "../../functions/stateful";

export let useDropdown = ({shown: initialShown = false}) => {
	let [shown, setShown] = useState(initialShown);

	let dropdown = useMemo(() => ({
		shown,
		open: () => setShown(true),
		close: () => setShown(false),
		toggle: () => setShown((shown) => !shown),
	}), [shown]);

	return { dropdown };
}

function makeEvents(events, func) {
	if (events instanceof Array)
		events = events.reduce((acc, event) => ({...acc, [event]: () => func()}), {});
	else if (typeof events === 'string')
		events = { [events]: () => func() };
	return events;
}

export let Dropdown = ({ dropdown, children, openOn = "onClick", closeOn = "onClick", toggleOn = "onClick" }) => {
	let { shown, open, close, toggle } = dropdown;

	let clickOutside = useOutsideEventRef("mousedown", (el) => dropdown.close(), [dropdown]);

	let process = childrenProcessing({
		"dropdown": {
			className: css`
				position: relative;
			`,
			ref: clickOutside,
		},
		"dropdown__opener": (value) => ({
			...makeEvents(value || openOn, open),
		}),
		"dropdown__closer": (value) => ({
			...makeEvents(value || closeOn, close),
		}),
		"dropdown__toggler": (value) => ({
			...makeEvents(value || toggleOn, toggle),
		}),
		"dropdown__content": shown && {
			className: css`
				position: absolute;
			`
		}
	});

	return process(callable(children)(dropdown, process));
}

Dropdown = stateful(useDropdown, Dropdown);
