export function constructArticleCanonicalUrl(slug: string, basePath: string): string {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pretto.fr';
    const cleanSiteUrl = siteUrl.replace(/\/$/, '');
    const cleanBase = basePath.replace(/^\/|\/$/g, '');
    const cleanSlug = slug.replace(/^\//, '');

    return `${cleanSiteUrl}/${cleanBase}/${cleanSlug}`;
}