import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { CACHE_TAGS } from "@/lib/wordpress";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  revalidateTag(CACHE_TAGS.posts);
  revalidateTag(CACHE_TAGS.categories);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
