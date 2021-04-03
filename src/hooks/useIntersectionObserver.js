import { useMemo } from "react";

export function useIntersectionObserver(subscription, deps) {
  return useMemo(() => {
    let observer;

    function setupObserver(el) {
      if (observer)
        observer.disconnect();
  
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          subscription();
          observer.disconnect();
        }
      }, { root: el });;
    }
  
    function rootRef(el) {
      if (!el) return;
      setupObserver(el);
    }
    
    function targetRef(el) {
      if (!el) return;
      if (!observer) setupObserver(document);
      observer.observe(el);
    }
  
    return {observer, rootRef, targetRef};
  }, deps);
}
