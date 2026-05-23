import type { Metadata } from "next";
import { BodyClass } from "./_components/BodyClass";
import { ProductWorkspace } from "./_components/ProductWorkspace";

export const metadata: Metadata = {
  title: "Product Workspace | doLegal",
  description:
    "Use the doLegal workspace to run Armenian legal research, review grounded citations, and draft documents with AI-assisted workflows.",
};

export default function ProductPage() {
  return (
    <>
      <BodyClass className="product-body" />
      <ProductWorkspace />
    </>
  );
}
