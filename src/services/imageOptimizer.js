// SPROUT — NETWORK-AWARE & DEVICE-RESPONSIVE IMAGE OPTIMIZER

export function getEffectiveConnection() {
  if (typeof window === 'undefined') return '4g';
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return '4g';
  if (conn.saveData) return 'slow';
  return conn.effectiveType || '4g';
}

export function getAdaptiveImageSource(basePath) {
  if (!basePath) return '';
  // Normalize base path without extension
  const rawPath = basePath.replace(/\.(png|jpg|webp)$/, '');

  if (typeof window === 'undefined') {
    return `${rawPath}.webp`;
  }

  const connType = getEffectiveConnection();
  const screenWidth = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;
  const effectiveWidth = screenWidth * dpr;

  // 1. Slow Connection (Save-Data, 2g, 3g) or small screen (< 640px)
  if (connType === 'slow' || connType === '2g' || connType === '3g' || effectiveWidth <= 768) {
    return `${rawPath}-sm.webp`;
  }

  // 2. Medium Connection or medium screen (<= 1440px)
  if (effectiveWidth <= 1440) {
    return `${rawPath}-md.webp`;
  }

  // 3. High-Speed Connection & Large Display
  return `${rawPath}.webp`;
}

export function getBlurPlaceholder(basePath) {
  if (!basePath) return '';
  const rawPath = basePath.replace(/\.(png|jpg|webp)$/, '');
  return `${rawPath}-blur.webp`;
}
