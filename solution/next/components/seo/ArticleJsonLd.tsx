import { Post } from '@/lib/wordpress'

interface Props {
    post: Post
}

export default function ArticleJsonLd({ post }: Props) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": post.title,
        "image": post.featuredImage ? [post.featuredImage] : [],
        "datePublished": post.date,
        "dateModified": post.modified,
        "author": [{
            "@type": "Person",
            "name": post.author,
            "url": "https://www.pretto.fr/qui-sommes-nous/"
        }],
        "publisher": {
            "@type": "Organization",
            "name": "Pretto",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.pretto.fr/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": post.canonicalUrl
        },
        "description": post.seo.description || post.excerpt
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}