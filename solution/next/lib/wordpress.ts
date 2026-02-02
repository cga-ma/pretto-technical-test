import { constructArticleCanonicalUrl } from "@/utils/urls";
import { decode } from 'he';

export interface Post {
    slug: string
    title: string
    content: string
    excerpt: string
    date: string
    modified: string
    canonicalUrl: string
    featuredImage: string | null
    author: string
    seo: {
        title: string
        description: string
        ogImage: string | null
        robots: {
            index: string
            follow: string
        }
    }
}

interface WpPostRaw {
    slug: string
    date: string
    modified: string
    title: { rendered: string }
    content: { rendered: string }
    excerpt: { rendered: string }
    _embedded?: {
        'wp:featuredmedia'?: Array<{ source_url: string }>
        'author'?: Array<{ name: string }>
    }
    yoast_head_json?: {
        title?: string
        description?: string
        canonical?: string
        og_image?: Array<{ url: string; width?: number; height?: number }>
        robots?: {
            index?: string
            follow?: string
        }
    }
}

export async function getAllSlugs(): Promise<string[]> {
    const slugs: string[] = []
    let page = 1
    let hasMore = true
    // Limitation volontaire pour le test technique afin que le build local ne soit pas trop long
    const MAX_PAGES_FOR_TEST = 5

    while (hasMore && page <= MAX_PAGES_FOR_TEST) {
        try {
            const res = await fetch(
                `${process.env.WP_REST_URL}/posts?_fields=slug&per_page=100&page=${page}`,
                { next: { tags: ['articles-list'] } }
            )
            if (!res.ok) { hasMore = false; break; }

            const posts: { slug: string }[] = await res.json()

            if (posts.length === 0) hasMore = false
            else {
                slugs.push(...posts.map((p) => p.slug))
                page++
            }
        } catch (e) { hasMore = false }
    }
    return slugs
}

export async function getPost(slug: string, categoryBasePath: string): Promise<Post | null> {
    const res = await fetch(
        `${process.env.WP_REST_URL}/posts?slug=${slug}&_embed`,
        {
            next: {
                tags: [`post-${slug}`, 'posts']
            }
        }
    )

    if (!res.ok) {
        console.error(`Failed to fetch post: ${res.status}`);
        return null;
    }

    const posts: WpPostRaw[] = await res.json()
    if (!posts || posts.length === 0) return null

    const raw = posts[0]
    console.log('Fetched post:', raw.yoast_head_json);

    const cleanExcerpt = decode(raw.excerpt.rendered.replace(/<[^>]+>/g, ''))
        .replace(/\n/g, ' ')
        .trim();

    const cleanTitle = decode(raw.title.rendered);

    const featuredImage = raw._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

    return {
        slug: raw.slug,
        title: cleanTitle,
        content: raw.content.rendered,
        excerpt: cleanExcerpt,
        date: raw.date,
        modified: raw.modified,
        canonicalUrl: constructArticleCanonicalUrl(raw.slug, categoryBasePath),
        featuredImage: featuredImage,
        author: raw._embedded?.['author']?.[0]?.name || "L'équipe Pretto",

        seo: {
            title: cleanTitle,
            description: cleanExcerpt,
            ogImage: featuredImage,
            robots: {
                index: 'index',
                follow: 'follow',
            }
        }
    }
}