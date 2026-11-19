import { toolMetadata, ToolSeoContent } from "@/lib/seo";

const PATH = "/calculator/age";
export const metadata = toolMetadata(PATH);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeoContent path={PATH} />
    </>
  );
}
