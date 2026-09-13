// SPROUT — NETWORK-AWARE & DEVICE-RESPONSIVE IMAGE OPTIMIZER
// Supports both PC (16:9) and MOB (9:16) image variants

export function getEffectiveConnection() {
  if (typeof window === 'undefined') return '4g';
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return '4g';
  if (conn.saveData) return 'slow';
  return conn.effectiveType || '4g';
}

/**
 * Detects if the current viewport is a mobile portrait screen.
 * Returns true for viewports ≤ 768px wide, which matches our CSS breakpoint.
 */
export function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
}

/**
 * Given a basePath like "/story/1 pc.webp", resolves the best image source
 * based on viewport size and network conditions.
 * 
 * On mobile viewports (≤ 768px), it swaps "pc" variants for "mob" variants
 * (9:16 ratio images designed for portrait mobile screens).
 */
export function getAdaptiveImageSource(basePath) {
  if (!basePath) return '';
  // Normalize base path without extension
  const rawPath = basePath.replace(/\.(png|jpg|webp)$/, '');

  if (typeof window === 'undefined') {
    return `${rawPath}.webp`;
  }

  const mobile = isMobileViewport();
  const connType = getEffectiveConnection();
  const screenWidth = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;
  const effectiveWidth = screenWidth * dpr;

  // Mobile viewport: serve 9:16 mob images instead of 16:9 pc images
  if (mobile) {
    // Convert "/story/1 pc" -> "/story/1 mob" 
    // Convert "/story/bg pc" -> "/story/bg mob"
    // Convert "/story/hero bg pc" -> "/story/bg mob" (hero bg has no mob variant, fallback to bg mob)
    let mobPath = rawPath;
    
    if (rawPath.includes('hero bg pc')) {
      // Special case: hero background on mobile uses "bg mob"
      mobPath = rawPath.replace(/hero bg pc\d*/, 'bg mob');
    } else if (rawPath.includes(' pc')) {
      // Standard case: swap "pc" suffix for "mob"
      // Remove any size suffix first (e.g., "-sm", "-md")
      mobPath = rawPath.replace(/-(?:sm|md|blur)$/, '').replace(/ pc/, ' mob');
    }
    
    return `${mobPath}.webp`;
  }

  // Desktop: use network-adaptive sizing
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
