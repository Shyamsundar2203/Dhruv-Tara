"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = 0, y = 0;
    let ringX = 0, ringY = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      ringX += (x - ringX) * 0.12;
      ringY += (y - ringY) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 6}px, ${y - 6}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
      }
    };

    const onEnterLink = () => {
      dotRef.current?.classList.add("scale-150");
      ringRef.current?.classList.add("scale-75", "border-[var(--primary-400)]");
    };

    const onLeaveLink = () => {
      dotRef.current?.classList.remove("scale-150");
      ringRef.current?.classList.remove("scale-75", "border-[var(--primary-400)]");
    };

    window.addEventListener("mousemove", onMove);
    animate();

    document.querySelectorAll("a, button, [role='button']").forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    // Hide default cursor
    document.body.style.cursor = "none";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
