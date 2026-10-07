import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

const SLOT_TYPES = ['item', 'item', 'item', 'separator', 'item'] as const;
const DESKTOP_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 700px)';

const PADDING_X = 10;
const BASE_ITEM_WIDTH = 52;
const EXPANSION_WIDTH = 44;
const SEPARATOR_WIDTH = 14;

function createDefaultScales() {
  return SLOT_TYPES.map(() => 1);
}

function calculateLayout(scales: number[]) {
  const widths = SLOT_TYPES.map((type, index) =>
    type === 'separator'
      ? SEPARATOR_WIDTH
      : BASE_ITEM_WIDTH + EXPANSION_WIDTH * (scales[index] - 1),
  );

  let x = PADDING_X;

  const lefts = widths.map((width) => {
    const left = x;
    x += width;

    return left;
  });

  return {
    widths,
    lefts,
    totalWidth: x + PADDING_X,
  };
}

export function useDockMagnifier() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);
  const [scales, setScales] = useState(createDefaultScales);
  const scalesRef = useRef(scales);
  const layout = useMemo(() => calculateLayout(scales), [scales]);

  const maxScale = Math.max(...scales);

  const setNextScales = (next: number[]) => {
    scalesRef.current = next;
    setScales(next);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);

    const updateMode = () => {
      setIsDesktop(mediaQuery.matches);
      const defaults = createDefaultScales();
      scalesRef.current = defaults;
      setScales(defaults);
    };

    updateMode();
    mediaQuery.addEventListener('change', updateMode);

    return () => mediaQuery.removeEventListener('change', updateMode);
  }, []);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!isDesktop || event.pointerType === 'touch') {
      return;
    }

    let next = scalesRef.current.slice();

    for (let iteration = 0; iteration < 4; iteration++) {
      const current = calculateLayout(next);

      const pointerX =
        event.clientX - document.documentElement.clientWidth / 2 + current.totalWidth / 2;

      const targets = SLOT_TYPES.map((type, index) => {
        if (type === 'separator') {
          return 1;
        }

        const center = current.lefts[index] + current.widths[index] / 2;
        const distance = Math.abs(pointerX - center);
        const influence = Math.max(0, Math.min(1, 1 - (distance - 12) / 115));
        const eased = influence * influence * (3 - 2 * influence);

        return 1 + 0.6 * eased;
      });

      next = next.map(
        (currentScale, index) => currentScale + (targets[index] - currentScale) * 0.6,
      );
    }

    setNextScales(next);
  };

  const onPointerLeave = () => {
    if (isDesktop) {
      setNextScales(createDefaultScales());
    }
  };

  const getItemStyle = (index: number): CSSProperties | undefined =>
    isDesktop
      ? {
          left: `${layout.lefts[index]}px`,
          width: `${layout.widths[index]}px`,
        }
      : undefined;

  const getIconStyle = (index: number): CSSProperties | undefined =>
    isDesktop ? { transform: `scale(${scales[index]})` } : undefined;

  const dockStyle = isDesktop
    ? ({
        width: `${layout.totalWidth}px`,
        height: `${68 + EXPANSION_WIDTH * (maxScale - 1)}px`,
        '--dock-ey': `${EXPANSION_WIDTH * (maxScale - 1)}px`,
      } as CSSProperties)
    : undefined;

  return {
    isDesktop,
    layout,
    dockStyle,
    getItemStyle,
    getIconStyle,
    onPointerMove,
    onPointerLeave,
  };
}
