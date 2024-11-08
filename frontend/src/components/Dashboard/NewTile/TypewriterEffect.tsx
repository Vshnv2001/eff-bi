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
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [displayedSQL, setDisplayedSQL] = useState("");
  const [previewIndex, setPreviewIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [sqlIndex, setSqlIndex] = useState(0);
  const [isPreviewDone, setIsPreviewDone] = useState(false);
  const [isMessageDone, setIsMessageDone] = useState(false);

  const messageText =
    "You have access to the relevant tables needed for your query. Here is the SQL query generated based on your instructions:";

  useEffect(() => {
    setPreviewIndex(0);
    setDisplayedPreview("");
    setIsPreviewDone(false);
  }, [previewText]);

  useEffect(() => {
    setMessageIndex(0);
    setDisplayedMessage("");
    setIsMessageDone(false);
  }, [messageText]);

  useEffect(() => {
    setSqlIndex(0);
    setDisplayedSQL("");
  }, [sqlQuery]);

  // Typing effect for preview text
  useEffect(() => {
    if (!showFullText && previewIndex < previewText.length) {
      const timeout = setTimeout(() => {
        setDisplayedPreview((prev) => prev + previewText[previewIndex]);
        setPreviewIndex(previewIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (previewIndex === previewText.length) {
      setIsPreviewDone(true);
    }
  }, [previewIndex, previewText, speed, showFullText]);

  // Typing effect for message
  useEffect(() => {
    if (isPreviewDone && !showFullText && messageIndex < messageText.length) {
      const timeout = setTimeout(() => {
        setDisplayedMessage((prev) => prev + messageText[messageIndex]);
        setMessageIndex(messageIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (messageIndex === messageText.length) {
      setIsMessageDone(true);
    }
  }, [isPreviewDone, messageIndex, messageText, speed, showFullText]);

  // Typing effect for SQL query
  useEffect(() => {
    if (isMessageDone && !showFullText && sqlIndex < sqlQuery.length) {
      const timeout = setTimeout(() => {
        setDisplayedSQL((prev) => prev + sqlQuery[sqlIndex]);
        setSqlIndex(sqlIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [isMessageDone, sqlIndex, sqlQuery, speed, showFullText]);

  // Show full text immediately if showFullText is true
  useEffect(() => {
    if (showFullText) {
      setDisplayedPreview(previewText);
      setDisplayedMessage(messageText);
      setDisplayedSQL(sqlQuery);
    }
  }, [showFullText, previewText, messageText, sqlQuery]);

  return (
    <div className="space-y-4">
      {previewText && (
        <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
          {displayedPreview}
        </pre>
      )}
      {isPreviewDone && sqlQuery && (
        <>
          {/* Show message only if sqlQuery is not empty */}
          <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
            {displayedMessage}
          </pre>
          {/* Show SQL query only if it's not empty */}
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
