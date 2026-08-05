import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";

export function MarkdownAnswer({ children }: { children: string }) {
  return (
    <div className="text-[14.5px] leading-relaxed text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h3 className="mt-4 mb-2 text-base font-semibold tracking-tight" {...p} />,
          h2: (p) => <h4 className="mt-4 mb-2 text-[15px] font-semibold tracking-tight" {...p} />,
          h3: (p) => <h5 className="mt-3 mb-1.5 text-sm font-semibold" {...p} />,
          p: (p) => <p className="mb-3 last:mb-0" {...p} />,
          ul: (p) => <ul className="mb-3 list-disc space-y-1 pl-5 marker:text-primary" {...p} />,
          ol: (p) => <ol className="mb-3 list-decimal space-y-1 pl-5 marker:text-primary" {...p} />,
          a: (p) => <a className="text-primary underline underline-offset-2" {...p} />,
          strong: (p) => <strong className="font-semibold text-foreground" {...p} />,
          blockquote: (p) => (
            <blockquote className="my-3 border-l-2 border-primary/60 pl-3 text-muted-foreground" {...p} />
          ),
          table: (p) => (
            <div className="scrollbar-thin my-3 overflow-x-auto rounded-md border border-border">
              <table className="w-full text-left text-[13px]" {...p} />
            </div>
          ),
          th: (p) => <th className="border-b border-border bg-secondary/60 px-3 py-1.5 font-semibold" {...p} />,
          td: (p) => <td className="border-b border-border/60 px-3 py-1.5 align-top" {...p} />,
          code: ({ className, children, ...rest }) => {
            const text = String(children ?? "");
            const lang = /language-(\w+)/.exec(className ?? "")?.[1];
            if (!text.includes("\n") && !lang) {
              return (
                <code
                  className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[12.5px] text-accent-foreground"
                  {...rest}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock code={text} lang={lang} />;
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}