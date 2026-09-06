import { navTree, type NavNodeItem } from "@/config/nav";

/**
 * Navigation loader.
 *
 * R4: the nav is CMS-driven and infinitely nestable. In production this reads
 * Sanity `navNode` documents; for the M1 shell it returns the static seed from
 * /config/nav.ts. The recursive <NavNode> component consumes the SAME shape in
 * both cases — no component change when the CMS is wired in.
 */
export function getNavItems(): NavNodeItem[] {
  return navTree.filter((n) => n.isVisible !== false);
}
