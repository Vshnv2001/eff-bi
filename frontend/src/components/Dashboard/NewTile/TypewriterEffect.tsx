import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface TypewriterProps {
  text: string;
  speed: number;
}

const TypewriterEffect: React.FC<TypewriterProps> = ({ text, speed }) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return (
    <pre
      style={{ whiteSpace: "pre-wrap" }}
      className="font-mono text-sm text-gray-800"
    >
      <SyntaxHighlighter
        language="sql"
        className="w-full rounded-lg h-full"
        wrapLines={true}
        lineProps={{ style: { whiteSpace: "pre-wrap" } }}
      >
        {displayedText}
      </SyntaxHighlighter>
    </pre>
  );
};

export default TypewriterEffect;
