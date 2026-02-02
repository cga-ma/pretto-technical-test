import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const secret = searchParams.get('secret')
    const tag = searchParams.get('tag')


    if (secret !== process.env.REVALIDATE_SECRET_TOKEN) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    if (!tag) {
        return NextResponse.json({ message: 'Tag param missing' }, { status: 400 })
    }

    revalidateTag(tag, 'seconds')

    return NextResponse.json({ revalidated: true, now: Date.now() })
}