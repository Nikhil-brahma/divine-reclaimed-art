import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const SHOPIFY_DOMAIN = "str4c2-32.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";

export default defineTool({
  name: "get_product",
  title: "Get product details",
  description:
    "Fetch full details for a single Punarvsu product by its handle (slug). Includes description, variants, price and images.",
  inputSchema: {
    handle: z.string().min(1).describe("Product handle/slug, e.g. 'temple-tote'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ handle }) => {
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!token) {
      return {
        content: [{ type: "text", text: "Shopify Storefront token not configured." }],
        isError: true,
      };
    }
    const query = `query($handle: String!) {
      productByHandle(handle: $handle) {
        title handle description availableForSale
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 5) { edges { node { url altText } } }
        variants(first: 10) { edges { node { title availableForSale price { amount currencyCode } } } }
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
        body: JSON.stringify({ query, variables: { handle } }),
      }
    );
    if (!resp.ok) {
      return {
        content: [{ type: "text", text: `Shopify error: ${resp.status}` }],
        isError: true,
      };
    }
    const data = await resp.json();
    const p = data?.data?.productByHandle;
    if (!p) {
      return {
        content: [{ type: "text", text: `No product found with handle '${handle}'.` }],
        isError: true,
      };
    }
    const product = {
      title: p.title,
      handle: p.handle,
      description: p.description,
      available: p.availableForSale,
      price: `${p.priceRange.minVariantPrice.currencyCode} ${p.priceRange.minVariantPrice.amount}`,
      url: `https://punarvsu.com/product/${p.handle}`,
      images: p.images.edges.map((e: any) => ({ url: e.node.url, alt: e.node.altText })),
      variants: p.variants.edges.map((e: any) => ({
        title: e.node.title,
        available: e.node.availableForSale,
        price: `${e.node.price.currencyCode} ${e.node.price.amount}`,
      })),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
      structuredContent: { product },
    };
  },
});
