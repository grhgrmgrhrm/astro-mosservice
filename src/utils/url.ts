// Хелпер для построения путей с учётом Astro base.
// Использование: href={url('/uslugi')} или href={url(`/uslugi/${slug}`)}
// import.meta.env.BASE_URL возвращает '/' при base='/' или '/astro-mosservice/' при base='/astro-mosservice/'
export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/$/, '')}${cleanPath}`;
}
