import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock = ({ code, language = "kotlin", title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-[hsl(var(--code-border))] overflow-hidden my-4">
      {title && (
        <div className="bg-muted/50 px-4 py-2 border-b border-[hsl(var(--code-border))] flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          <span className="text-xs text-muted-foreground">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="bg-[hsl(var(--code-bg))] p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="text-foreground/90">{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-md bg-background/80 hover:bg-background border border-border transition-all"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[hsl(var(--method-get))]" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
};
