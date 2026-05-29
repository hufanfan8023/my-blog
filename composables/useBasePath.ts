export function useBasePath() {
  const {
    app: { baseURL },
  } = useRuntimeConfig()

  return (path: string) => {
    if (
      /^(https?:)?\/\//.test(path) ||
      path.startsWith('mailto:') ||
      path.startsWith('tel:') ||
      path.startsWith('#')
    ) {
      return path
    }

    const base = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
    return `${base}${path.replace(/^\/+/, '')}`
  }
}
