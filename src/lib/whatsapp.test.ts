import { describe, it, expect } from "vitest";
import { buildWhatsAppLink, buildWhatsAppMessage } from "@/lib/whatsapp";
import { business } from "@/config/business";

describe("buildWhatsAppLink", () => {
  it("targets the canonical business number", () => {
    const url = buildWhatsAppLink({ intent: "general", source: "Contact" });
    expect(url).toContain("https://wa.me/60125161620?text=");
  });

  it("URL-encodes newlines, emoji and Malay diacritics", () => {
    const url = buildWhatsAppLink(
      {
        intent: "general",
        source: "FAQ",
        subject: "Sewa alat muzik 🥁",
        message: "Boleh saya tanya harga?\nTerima kasih.",
      },
      { refCode: "DA-TEST1" },
    );
    const decoded = decodeURIComponent(url.split("?text=")[1]!);
    expect(decoded).toContain("\n");
    expect(decoded).toContain("Sewa alat muzik 🥁");
    expect(decoded).toContain("Terima kasih.");
    expect(decoded).toContain("— sent from drumasia website");
    // The raw URL itself must not contain a literal space or raw newline.
    expect(url).not.toContain(" ");
    expect(url).not.toContain("\n");
  });

  it("produces a structured rider message with every line", () => {
    const url = buildWhatsAppLink(
      {
        intent: "rental_rider",
        source: "Backline",
        dates: "12–14 Sep 2026",
        branch: "Hartamas",
        delivery: "Pickup",
        lines: [
          { item: "Shure SM58", qty: 2, rate: "RM—/day" },
          { item: "Yamaha DXR12", qty: 1, rate: "RM—/day" },
        ],
        total: "RM— (estimate)",
        name: "Aina",
      },
      { refCode: "DA-RIDER" },
    );
    const msg = decodeURIComponent(url.split("?text=")[1]!);
    expect(msg).toContain("RENTAL RIDER");
    expect(msg).toContain("Ref: DA-RIDER");
    expect(msg).toContain("• 2 × Shure SM58 — RM—/day");
    expect(msg).toContain("• 1 × Yamaha DXR12 — RM—/day");
    expect(msg).toContain("Contact: Aina");
  });

  it("renders RM— for missing rates, never RM0", () => {
    const msg = buildWhatsAppMessage({
      intent: "room_booking",
      source: "Rooms",
      room: "Studio Ori",
      refCode: "DA-ROOM1",
    });
    expect(msg).toContain("Room: Studio Ori");
    expect(msg).not.toMatch(/RM0/);
  });

  it("buildWhatsAppMessage and link share the same body", () => {
    const payload = { intent: "general" as const, source: "x", refCode: "DA-Z" };
    const link = buildWhatsAppLink(payload);
    const msg = buildWhatsAppMessage(payload);
    expect(decodeURIComponent(link.split("?text=")[1]!)).toBe(msg);
  });

  it("is deterministic without a ref code — no Ref line, no randomness", () => {
    const payload = { intent: "general" as const, source: "Header" };
    const a = buildWhatsAppLink(payload);
    const b = buildWhatsAppLink(payload);
    expect(a).toBe(b);
    const msg = decodeURIComponent(a.split("?text=")[1]!);
    expect(msg).not.toContain("Ref:");
    expect(msg).toContain("Page: Header");
  });

  it("includes a reference code when one is supplied at click time", () => {
    const link = buildWhatsAppLink(
      { intent: "general", source: "x" },
      { refCode: "DA-CLICK" },
    );
    expect(decodeURIComponent(link.split("?text=")[1]!)).toContain("Ref: DA-CLICK");
  });

  it("keeps every generated link on the single transaction number", () => {
    const n = business.whatsappNumber.replace(/\D/g, "");
    expect(n).toBe("60125161620");
  });
});
