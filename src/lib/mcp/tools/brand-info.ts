import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "brand_info",
  title: "About Punarvsu",
  description:
    "Returns Punarvsu brand information: mission, sacred textile process, artisan team, contact and shipping details. Use for questions about the brand's story, ethics, or how to reach them.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      brand: "Punarvsu",
      tagline: "India's first brand making luxury bags from sacred temple textiles (Bhagwan ki Poshak).",
      workshop: "Maharana Pratap Community Centre, Sector-9, Rohini, Delhi 110085",
      managed_by: "Sampurna NGO (35+ years of social work)",
      head_artisan: "Kiran Mam (women-led team)",
      temple_partners: ["Khatushyam Delhi Dham", "other Delhi & North India temples"],
      impact: {
        sacred_textile_saved_kg: 3200,
        hours_per_piece: "8-15 hours handcrafted, UV sterilized, no machines",
      },
      shipping: "Free above ₹5,000 | Ships across India | 5-10 business days",
      returns: "No returns — each bag carries sacred temple blessings",
      contact: {
        email: "punarvsu.com@gmail.com",
        phone: "+91-9220464425",
        website: "https://punarvsu.com",
      },
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
