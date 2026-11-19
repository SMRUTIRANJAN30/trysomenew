import { toolMetadata, ToolSeoContent } from "@/lib/seo";

const PATH = "/pdf/merge";
export const metadata = toolMetadata(PATH);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeoContent path={PATH} hideFaq />
    </>
  );
}
