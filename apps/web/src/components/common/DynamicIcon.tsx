import React from "react";
import {
  Layers,
  Split,
  RotateCw,
  Minimize2,
  Image as ImageIcon,
  FileSearch,
  ShieldCheck,
  ClipboardCopy,
  Send,
  Bot,
  PenTool,
  ScanText,
  GitFork,
  FileText,
  Lock,
  CheckCircle2,
  ArrowRight,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  QrCode,
  Sparkles,
  Download,
  Trash2,
  Plus,
  ChevronRight,
  type LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Layers,
  Split,
  RotateCw,
  Minimize2,
  Image: ImageIcon,
  FileSearch,
  ShieldCheck,
  ClipboardCopy,
  Send,
  Bot,
  PenTool,
  ScanText,
  GitFork,
  FileText,
  Lock,
  CheckCircle2,
  ArrowRight,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  QrCode,
  Sparkles,
  Download,
  Trash2,
  Plus,
  ChevronRight,
};

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = ICON_MAP[name] || FileText;
  return <IconComponent {...props} />;
}
