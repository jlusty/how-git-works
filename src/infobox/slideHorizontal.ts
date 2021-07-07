import { cubicOut } from "svelte/easing";

export type EasingFunction = (t: number) => number;

export interface TransitionConfig {
  delay?: number;
  duration?: number;
  easing?: EasingFunction;
  css?: (t: number, u: number) => string;
  tick?: (t: number, u: number) => void;
}

export interface SlideParams {
  delay?: number;
  duration?: number;
  easing?: EasingFunction;
}

export function slideHoriz(
  node: Element,
  { delay = 0, duration = 400, easing = cubicOut }: SlideParams = {}
): TransitionConfig {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const width = parseFloat(style.width);
  const padding_left = parseFloat(style.paddingLeft);
  const padding_right = parseFloat(style.paddingRight);
  const margin_left = parseFloat(style.marginLeft);
  const margin_right = parseFloat(style.marginRight);
  const border_left_width = parseFloat(style.borderLeftWidth);
  const border_right_width = parseFloat(style.borderRightWidth);

  return {
    delay,
    duration,
    easing,
    css: (t) =>
      "overflow: hidden;" +
      `flex-basis: auto;` +
      `opacity: ${Math.min(t * 20, 1) * opacity};` +
      `width: ${t * width}px;` +
      `padding-left: ${t * padding_left}px;` +
      `padding-right: ${t * padding_right}px;` +
      `margin-left: ${t * margin_left}px;` +
      `margin-right: ${t * margin_right}px;` +
      `border-left-width: ${t * border_left_width}px;` +
      `border-right-width: ${t * border_right_width}px;`,
  };
}
