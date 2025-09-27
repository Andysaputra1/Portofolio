// src/hook/useScrollReveal.ts
import { useEffect, useRef } from "react";

type Opts = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;          // default: false → bisa replay
  toggleClass?: string;    // default: "is-inview"
};

export default function useScrollReveal<T extends HTMLElement>(opts: Opts = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cls  = opts.toggleClass ?? "is-inview";
    const once = opts.once ?? false;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add(cls);
            if (once) io.unobserve(target);
          } else {
            // penting untuk replay: lepas kelas saat elemen keluar viewport
            if (!once) target.classList.remove(cls);
          }
        });
      },
      {
        threshold: opts.threshold ?? 0.12,
        rootMargin: opts.rootMargin ?? "0px",
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [opts.threshold, opts.rootMargin, opts.once, opts.toggleClass]);

  return ref;
}
