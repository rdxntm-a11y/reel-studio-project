import { useEffect, useState } from "react";
import { continueRender, delayRender, useCurrentFrame } from "remotion";
import { DOC_HEIGHT, DOC_SAFE, DOC_WIDTH } from "../geometry";

type Issue = { type: string; el: string; detail: string };

const effectiveOpacity = (el: Element) => {
  let opacity = 1;
  for (let node: Element | null = el; node; node = node.parentElement) opacity *= parseFloat(getComputedStyle(node).opacity || "1");
  return opacity;
};

const measure = (frame: number) => {
  const issues: Issue[] = [];
  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-doc-el]")).filter((el) => effectiveOpacity(el) > 0.5);
  const transformed = Array.from(
    new Set(
      elements
        .filter((el) => el.dataset.docKeepTransform !== "true")
        .flatMap((el) => [el, ...Array.from(el.querySelectorAll<HTMLElement>("*"))]),
    ),
  );
  const saved = transformed.map((el) => el.style.transform);
  transformed.forEach((el) => (el.style.transform = "none"));
  const boxes = elements.map((el) => ({ el, name: el.dataset.docEl || "element", rect: el.getBoundingClientRect() }));
  const tolerance = 4;

  for (const { name, rect } of boxes) {
    const outside =
      rect.left < DOC_SAFE.left - tolerance ||
      rect.right > DOC_WIDTH - DOC_SAFE.right + tolerance ||
      rect.top < DOC_SAFE.top - tolerance ||
      rect.bottom > DOC_HEIGHT - DOC_SAFE.bottom + tolerance;
    if (outside) {
      issues.push({
        type: "safe-zone",
        el: name,
        detail: `box ${Math.round(rect.left)},${Math.round(rect.top)} to ${Math.round(rect.right)},${Math.round(rect.bottom)} leaves the 16:9 safe box`,
      });
    }
  }

  for (const { el, name } of boxes) {
    if (el.dataset.docOverflowOk === "true") continue;
    for (const node of [el, ...Array.from(el.querySelectorAll<HTMLElement>("*"))]) {
      if (node.clientWidth > 0 && node.scrollWidth > node.clientWidth + 3) {
        issues.push({ type: "overflow", el: name, detail: `content is ${node.scrollWidth}px wide in a ${node.clientWidth}px box` });
        break;
      }
      if (node.clientHeight > 0 && node.scrollHeight > node.clientHeight + 3 && getComputedStyle(node).overflow !== "visible") {
        issues.push({ type: "overflow", el: name, detail: `content is ${node.scrollHeight}px tall in a ${node.clientHeight}px box` });
        break;
      }
    }
  }

  transformed.forEach((el, index) => (el.style.transform = saved[index]));
  const scene = document.querySelector<HTMLElement>("[data-doc-scene]")?.dataset.docScene ?? "";
  const content = boxes.length || (document.querySelector("[data-doc-content]") ? 1 : 0);
  return { frame, scene, content, els: boxes.map((box) => box.name), issues };
};

export const DocProbe: React.FC<{ probe: boolean; debug: boolean }> = ({ probe, debug }) => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender("documentary probe"));

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (probe) console.log("REEL_PROBE " + JSON.stringify(measure(frame)));
      continueRender(handle);
    });
    return () => cancelAnimationFrame(id);
  }, [frame, handle, probe]);

  if (!debug) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: DOC_SAFE.left,
        right: DOC_SAFE.right,
        top: DOC_SAFE.top,
        bottom: DOC_SAFE.bottom,
        border: "2px dashed rgba(230, 170, 90, 0.5)",
      }}
    />
  );
};
