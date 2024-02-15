import { useState, useEffect } from 'react';

export const useTruncatedText = (
  initialText: string,
  truncateLength: number,
  showEllipsis: boolean = true
) => {
  const [text, setText] = useState(initialText);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setText(initialText);
    setExpanded(false);
  }, [initialText]);

  const toggleLines = () => setExpanded(!expanded);

  const ellipsis = showEllipsis ? '...' : '';
  const truncatedText = expanded ? text : text.slice(0, truncateLength) + ellipsis;
  const isTruncated = text.length > truncateLength;

  const truncate = (inputText: string, maxLength: number) =>
    inputText.length > maxLength ? inputText.slice(0, maxLength) + ellipsis : inputText;

  return {
    text,
    setText,
    expanded,
    setExpanded,
    toggleLines,
    truncatedText,
    isTruncated,
    less: 'Hide',
    more: 'Show',
    truncate,
  };
};
