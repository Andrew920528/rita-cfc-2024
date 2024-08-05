import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {dracula} from "react-syntax-highlighter/dist/cjs/styles/prism";

// https://stackoverflow.com/questions/71907116/react-markdown-and-react-syntax-highlighter <-- shout out to champ!
type MarkdownRendererProps = {
  children: string;
};

export function MarkdownRenderer({children: markdown}: MarkdownRendererProps) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({node, inline, className, children, ...props}: any) {
          const match = /language-(\w+)/.exec(className || "");

          return (
            <SyntaxHighlighter
              style={dracula}
              PreTag="div"
              language={match ? match[1] : "python"}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {markdown}
    </Markdown>
  );
}
