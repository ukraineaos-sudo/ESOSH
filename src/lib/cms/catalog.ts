import { pageLoaders } from "@/content/page-loaders";

export type CatalogRoute = {
  locale: "uk" | "en";
  route: string;
  fullPath: string;
};

/** RU: Каталог маршрутов из legacy loaders (без статей новостей). EN: Route catalog excluding news articles. */
export function listCatalogRoutes(): CatalogRoute[] {
  const items: CatalogRoute[] = [];
  for (const fullPath of Object.keys(pageLoaders)) {
    if (fullPath.match(/^\/(en\/)?news\//)) continue;
    if (fullPath.startsWith("/en")) {
      const route = fullPath === "/en" ? "/" : fullPath.slice(3) || "/";
      items.push({ locale: "en", route, fullPath });
    } else {
      items.push({ locale: "uk", route: fullPath, fullPath });
    }
  }
  return items.sort((a, b) => a.fullPath.localeCompare(b.fullPath));
}
