import type { Metadata } from "next";
import { BodyClass } from "../../product/_components/BodyClass";
import { ProductWorkspace } from "../../product/_components/ProductWorkspace";

export const metadata: Metadata = {
  title: "Product Workspace | Legis",
  description:
    "Use the Legis workspace to run Armenian legal research, review grounded citations, and draft documents with AI-assisted workflows.",
};

export default function ProductPage() {
  return (
    <>
      <BodyClass className="product-body" />
      <ProductWorkspace />
    </>
  );
}
