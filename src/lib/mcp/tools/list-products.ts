import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const SHOPIFY_DOMAIN = "str4c2-32.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";

export default defineTool({
  name: "list_products",
  title: "List Punarvsu products",
  description:
    "List currently available handcrafted bags from Punarvsu (sacred temple textile upcycled products). Returns title, handle, price, availability and product URL.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Max number of products to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ limit }) => {
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!token) {
      return {
        content: [{ type: "text", text: "Shopify Storefront token not configured." }],
        isError: true,
      };
    }
    const query = `{
      products(first: ${limit ?? 20}) {
        edges { node {
          title handle description availableForSale
          priceRange { minVariantPrice { amount currencyCode } }
        } }
      }
    }`;
    const resp = await fetch(
      `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({ query }),
      }
    );
    if (!resp.ok) {
      return {
        content: [{ type: "text", text: `Shopify error: ${resp.status}` }],
        isError: true,
      };
    }
    const data = await resp.json();
    const products = (data?.data?.products?.edges ?? []).map((e: any) => {
      const n = e.node;
      const p = n.priceRange.minVariantPrice;
      return {
        title: n.title,
        handle: n.handle,
        price: `${p.currencyCode} ${p.amount}`,
        available: n.availableForSale,
        url: `https://punarvsu.com/product/${n.handle}`,
        description: (n.description || "").slice(0, 200),
      };
    });
    return {
      content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
      structuredContent: { products },
    };
  },
});
