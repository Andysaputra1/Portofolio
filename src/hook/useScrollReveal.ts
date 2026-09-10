import { useEffect, useRef } from "react";

type Opts = { threshold?: number; rootMargin?: string; once?: boolean; toggleClass?: string };

export default function useScrollReveal<T extends HTMLElement>(opts: Opts = {}) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cls = opts.toggleClass ?? "is-inview";
    const once = opts.once ?? true;
    const group = el.classList.contains("reveal-stagger");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tracked = new Set<HTMLElement>();
    if (group) el.classList.add(cls);
    const show = (target: HTMLElement) => {
      target.dataset.scrollReveal = "shown";
      target.classList.add(cls);
    };
    const io = new IntersectionObserver((entries) => {
      let order = 0;
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          target.style.setProperty("--enter-delay", `${Math.min(order++, 3) * 85}ms`);
          show(target);
          if (once) io.unobserve(target);
        } else if (!once && !motion.matches) {
          target.dataset.scrollReveal = "pending";
          target.classList.remove(cls);
        }
      });
    }, { threshold: opts.threshold ?? 0, rootMargin: opts.rootMargin ?? "0px 0px -48px 0px" });
    const sync = () => {
      const targets = group ? Array.from(el.children).filter((child) => !child.classList.contains("reveal-stagger")) : [el];
      for (const child of targets) {
        if (!(child instanceof HTMLElement) || tracked.has(child)) continue;
        tracked.add(child);
        child.dataset.scrollReveal = "pending";
        if (motion.matches) show(child);
        else io.observe(child);
      }
      for (const target of tracked) {
        if (!el.contains(target)) { io.unobserve(target); tracked.delete(target); }
      }
    };
    const reduce = () => { if (motion.matches) { tracked.forEach(show); io.disconnect(); } };
    const focus = (event: FocusEvent) => {
      tracked.forEach((target) => { if (target.contains(event.target as Node)) show(target); });
    };
    sync();
    // Project filters and manager previews can insert fresh cards.
    const changes = new MutationObserver(sync);
    if (group) changes.observe(el, { childList: true });
    motion.addEventListener("change", reduce);
    el.addEventListener("focusin", focus);
    return () => {
      io.disconnect(); changes.disconnect();
      motion.removeEventListener("change", reduce);
      el.removeEventListener("focusin", focus);
      tracked.forEach((target) => { delete target.dataset.scrollReveal; target.style.removeProperty("--enter-delay"); });
    };
  }, [opts.threshold, opts.rootMargin, opts.once, opts.toggleClass]);
  return ref;
}
