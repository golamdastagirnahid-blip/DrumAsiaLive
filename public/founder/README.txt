DRUMASIA — FOUNDER PORTRAIT SLOT
================================

There are TWO ways to put the founder's photo on the site. Either one works —
no code change required, and the page never shows a broken image.

WAY 1 — local file
------------------
Drop the photo here as:

    portrait.jpg      (or portrait.png / portrait.webp / portrait.jpeg)

Recommended: 2000px+ on the long edge, JPG or WebP. Portrait orientation works
best, but the layout uses aspect-ratio + object-fit: cover, so landscape or
square also work.

WAY 2 — remote URL
------------------
Set an environment variable (in .env.local, or Vercel project settings):

    NEXT_PUBLIC_FOUNDER_PORTRAIT_URL=https://.../founder.jpg

The remote URL takes priority over the local file.

BOTH WAYS
---------
The founders page (/founders) and the homepage founder section automatically
upgrade from the machined "M." monogram fallback to the real photo the moment
either is present.
