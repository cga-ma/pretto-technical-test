import Link from 'next/link'
import { getAllSlugs } from '@/lib/wordpress'

export default async function ArticlesPage() {
    const slugs = await getAllSlugs()

    return (
        <main>
            <h1>Articles</h1>
            <ul>
                {slugs.map((slug) => (
                    <li key={slug}>
                        <Link href={`/articles/${slug}`}>
                            {slug}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    )
}