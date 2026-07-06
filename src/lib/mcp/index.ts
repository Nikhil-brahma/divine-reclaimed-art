import { defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";
import brandInfoTool from "./tools/brand-info";

export default defineMcp({
  name: "punarvsu-mcp",
  title: "Punarvsu",
  version: "0.1.0",
  instructions:
    "Tools for Punarvsu — sacred temple-textile handcrafted bags. Use `list_products` to browse the live catalog, `get_product` for full details on a specific bag by handle, and `brand_info` for brand story, artisans, shipping and contact.",
  tools: [listProductsTool, getProductTool, brandInfoTool],
});
