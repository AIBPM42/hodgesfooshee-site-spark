"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Markdown({ md }: { md: string }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-neutral-900" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="underline decoration-[rgba(228,90,46,.4)] underline-offset-4 hover:text-[#E45A2E] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 space-y-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-4 last:mb-0" {...props} />
          ),
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}
