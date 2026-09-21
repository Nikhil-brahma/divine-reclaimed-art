import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";
import brandInfoTool from "./tools/brand-info";

const backendUrl = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];

if (!backendUrl) {
  throw new Error("Backend URL is required to secure the MCP server.");
}

const authIssuer = `${backendUrl.replace(/\/+$/, "")}/auth/v1`;

export default defineMcp({
  name: "punarvsu-mcp",
  title: "Punarvsu",
  version: "0.1.0",
  instructions:
    "Tools for Punarvsu — sacred temple-textile handcrafted bags. Use `list_products` to browse the live catalog, `get_product` for full details on a specific bag by handle, and `brand_info` for brand story, artisans, shipping and contact.",
  auth: auth.oauth.issuer({
    issuer: authIssuer,
    acceptedAudiences: "authenticated",
    jwksUri: `${authIssuer}/.well-known/jwks.json`,
  }),
  tools: [listProductsTool, getProductTool, brandInfoTool],
});
