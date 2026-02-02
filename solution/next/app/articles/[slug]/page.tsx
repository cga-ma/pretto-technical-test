import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSlugs, getPost } from '@/lib/wordpress'
import ArticleJsonLd from "@/components/seo/ArticleJsonLd";
import {getFormattedDate} from "@/utils/date";


export const dynamicParams = true
const categoryBasePath = 'articles'

interface PageParams {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const slugs = await getAllSlugs()
    return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { slug } = await params
    const post = await getPost(slug, categoryBasePath)
    if (!post) {
        return {
            title: 'Article introuvable',
            description: 'Désolé, cet article n\'existe pas.'
        }
    }

    const ogImages = post.seo.ogImage
        ? [{ url: post.seo.ogImage, width: 1200, height: 630, alt: post.title }]
        : []

    return {
        title: post.seo.title,
        description: post.seo.description,
        metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
        alternates: {
            canonical: post.canonicalUrl,
        },
        openGraph: {
            title: post.seo.title,
            description: post.seo.description,
            url: post.canonicalUrl,
            siteName: 'Pretto',
            locale: 'fr_FR',
            type: 'article',
            publishedTime: post.date,
            modifiedTime: post.modified,
            authors: [post.author],
            images: ogImages,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.seo.title,
            description: post.seo.description,
            images: ogImages,
        },
        robots: {
            index: post.seo.robots.index !== 'noindex',
            follow: post.seo.robots.follow !== 'nofollow',
        }
    }
}

export default async function ArticlePage({ params }: PageParams) {
    const { slug } = await params
    const post = await getPost(slug, categoryBasePath)

    if (!post) notFound()

    return (
        <main className="container mx-auto px-4 py-8">
            <ArticleJsonLd post={post} />
            <article className="max-w-3xl mx-auto">
                <h1
                    className="text-4xl font-bold mb-4"
                    dangerouslySetInnerHTML={{ __html: post.title }}
                />
                <time dateTime={post.date} className="text-gray-500 block mb-8">
                    {getFormattedDate(post.date)}
                </time>
                <div
                    className="prose lg:prose-xl prose-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </main>
    )
}