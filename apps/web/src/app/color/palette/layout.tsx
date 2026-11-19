import { toolMetadata, ToolSeoContent } from "@/lib/seo";

const PATH = "/color/palette";
export const metadata = toolMetadata(PATH);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeoContent path={PATH} />
    </>
  );
}
