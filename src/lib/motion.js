// Lightweight shim for framer-motion's `motion` API
// Provides basic components that ignore animation props so the app runs without the dependency.
import React from 'react';

function Motion(tag) {
  return React.forwardRef(function MotionTag(props, ref) {
    // Strip animation-related props to avoid React warnings
    // Keep className, style, onClick, etc. intact
    const {
      initial, animate, transition, whileInView, viewport,
      exit, variants, drag, layout,
      ...rest
    } = props;
    return React.createElement(tag, { ref, ...rest });
  });
}

export const motion = {
  div: Motion('div'),
  nav: Motion('nav'),
  footer: Motion('footer'),
  img: Motion('img'),
  section: Motion('section'),
  header: Motion('header'),
};
