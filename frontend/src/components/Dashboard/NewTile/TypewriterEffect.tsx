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
  const [messageCompleted, setMessageCompleted] = useState(false);

  // Reset indices when text changes
  useEffect(() => {
    setPreviewIndex(0);
    setDisplayedPreview("");
    setMessageCompleted(false);
  }, [previewText]);

  useEffect(() => {
    setSqlIndex(0);
    setDisplayedSQL("");
  }, [sqlQuery]);

  // Handle preview text typing effect
  useEffect(() => {
    if (showFullText) {
      setDisplayedPreview(previewText);
      setMessageCompleted(true);
      return;
    }

    if (previewIndex < previewText.length) {
      const timeout = setTimeout(() => {
        setDisplayedPreview((prev) => prev + previewText[previewIndex]);
        setPreviewIndex(previewIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setMessageCompleted(true); // Mark message as completed
    }
  }, [previewIndex, previewText, speed, showFullText]);

  // Handle SQL query typing effect
  useEffect(() => {
    if (showFullText) {
      setDisplayedSQL(sqlQuery);
      return;
    }

    // Start SQL query typewriting only after the message completes
    if (messageCompleted && sqlIndex < sqlQuery.length) {
      const timeout = setTimeout(() => {
        setDisplayedSQL((prev) => prev + sqlQuery[sqlIndex]);
        setSqlIndex(sqlIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [sqlIndex, sqlQuery, speed, messageCompleted, showFullText]);

  // Show full text immediately if showFullText is true
  useEffect(() => {
    if (showFullText) {
      setDisplayedPreview(previewText);
      setDisplayedSQL(sqlQuery);
    }
  }, [showFullText, previewText, sqlQuery]);

  return (
    <div className="space-y-4">
      {/* Typewriting effect for the message */}
      {previewText && (
        <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
          {displayedPreview}
        </pre>
      )}

      {/* Typewriting effect for the SQL query */}
      {sqlQuery && messageCompleted && (
        <>
          <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap mt-4">
            You have access to the relevant tables needed for your query. Here
            is the SQL query generated based on your instructions:
          </pre>
          <SyntaxHighlighter
            language="sql"
            className="w-full rounded-lg"
            wrapLines={true}
            lineProps={{ style: { whiteSpace: "pre-wrap" } }}
          >
            {displayedSQL}
          </SyntaxHighlighter>
        </>
      )}
    </div>
  );
};

export default TypewriterEffect;
