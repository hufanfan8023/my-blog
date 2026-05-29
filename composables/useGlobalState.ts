export function useSearchOpen() {
  return useState<boolean>('search-open', () => false)
}

export function useMobileMenuOpen() {
  return useState<boolean>('mobile-menu-open', () => false)
}
