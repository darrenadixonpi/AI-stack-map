/** Pixels to leave clear of the sticky header when scrolling to anchors */
export function getScrollOffset(): number {
  const header = document.querySelector('.app-header')
  const height = header?.getBoundingClientRect().height ?? 0
  return Math.ceil(height + 16)
}

export function syncHeaderScrollOffset(): void {
  document.documentElement.style.setProperty('--header-offset', `${getScrollOffset()}px`)
}

/** Open every <details> ancestor so a hidden target becomes visible */
export function openDetailsAncestors(el: HTMLElement | null): void {
  let node: HTMLElement | null = el?.parentElement ?? null
  while (node) {
    if (node instanceof HTMLDetailsElement) {
      node.open = true
    }
    node = node.parentElement
  }
}

/** Reveal nested details, then scroll so the anchor sits below the sticky header */
export function scrollToAnchor(anchorId: string, smooth = true): void {
  const run = () => {
    const el = document.getElementById(anchorId)
    if (!el) return
    if (el instanceof HTMLDetailsElement) {
      el.open = true
    }
    openDetailsAncestors(el)

    const offset = getScrollOffset()
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({
      top: Math.max(0, top),
      behavior: smooth ? 'smooth' : 'auto',
    })
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(run)
  })
}
