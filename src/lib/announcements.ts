/**
 * lib/announcements.ts — site-wide announcement seed.
 *
 * Drives <AnnouncementBar> and the REC lamp in the Transport Bar.
 * CMS-driven in production (Sanity `announcement` collection); this is the
 * static seed. `live` = true lights the REC lamp (an event is live now).
 */
export interface Announcement {
  id: string;
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
  live?: boolean;
  dismissible?: boolean;
}

export function getAnnouncements(): Announcement[] {
  // Add announcements here (or in the CMS) to light the bar + REC lamp.
  return [];
}
