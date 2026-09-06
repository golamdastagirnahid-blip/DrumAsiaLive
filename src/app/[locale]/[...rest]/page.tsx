import { notFound } from "next/navigation";

/**
 * Catch-all for unmatched paths under a locale. Calls notFound() so the
 * locale-scoped [locale]/not-found.tsx renders (within the [locale] root
 * layout) instead of Next's global 404.
 */
export default function CatchAll() {
  notFound();
}
