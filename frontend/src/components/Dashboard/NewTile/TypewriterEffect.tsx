import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface TypewriterProps {
  previewText?: string;
  sqlQuery?: string;
  speed: number;
  showFullText: boolean;
}

const TypewriterEffect: React.FC<TypewriterProps> = ({
  previewText = "",
  sqlQuery = "",
  speed,
  showFullText,
}) => {
  const [displayedPreview, setDisplayedPreview] = useState("");
  const [displayedSQL, setDisplayedSQL] = useState("");
  const [previewIndex, setPreviewIndex] = useState(0);
  const [sqlIndex, setSqlIndex] = useState(0);

  // Reset indices when text changes
  useEffect(() => {
    setPreviewIndex(0);
    setDisplayedPreview("");
  }, [previewText]);

  useEffect(() => {
    setSqlIndex(0);
    setDisplayedSQL("");
  }, [sqlQuery]);

  // Handle preview text typing effect
  useEffect(() => {
    if (!showFullText && previewIndex < previewText.length) {
      const timeout = setTimeout(() => {
        setDisplayedPreview((prev) => prev + previewText[previewIndex]);
        setPreviewIndex(previewIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [previewIndex, previewText, speed, showFullText]);

  // Handle SQL text typing effect
  useEffect(() => {
    if (!showFullText && sqlIndex < sqlQuery.length) {
      const timeout = setTimeout(() => {
        setDisplayedSQL((prev) => prev + sqlQuery[sqlIndex]);
        setSqlIndex(sqlIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [sqlIndex, sqlQuery, speed, showFullText]);

  // Show full text immediately if showFullText is true
  useEffect(() => {
    if (showFullText) {
      setDisplayedPreview(previewText);
      setDisplayedSQL(sqlQuery);
    }
  }, [showFullText, previewText, sqlQuery]);

  return (
    <div className="space-y-2">
      {/* Preview text without syntax highlighting */}
      {previewText && (
        <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
          {displayedPreview}
        </pre>
      )}

      {/* SQL query with syntax highlighting */}
      {sqlQuery && (
        <SyntaxHighlighter
          language="sql"
          className="w-full rounded-lg"
          wrapLines={true}
          lineProps={{ style: { whiteSpace: "pre-wrap" } }}
        >
          {displayedSQL}
        </SyntaxHighlighter>
      )}
    </div>
  );
};

export default TypewriterEffect;
