import { useMemo, useRef } from "react";

export function useIntersectionObserver(subscription, deps, { offset = 0 } = {}) {
	let observer = useRef();

	return useMemo(() => {

		function setupObserver(el) {
			if (observer.current)
				observer.current.disconnect();

				observer.current = new IntersectionObserver((entries, observer) => {
        if (entries[0].isIntersecting)
          subscription(observer, entries[0]);
      }, { root: el });
    }

    function rootRef(el) {
      if (!el) return;
      setupObserver(el);
    }

    function targetRef(el) {
			if (!el) return;
      if (!observer.current) setupObserver(document);
      observer.current.observe(el);
    }

		return {observerRef: observer, rootRef, targetRef};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
}
