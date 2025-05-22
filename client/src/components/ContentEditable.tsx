import { useState, useEffect, useRef } from "react";

interface ContentEditableProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  id?: string;
  multiline?: boolean;
}

const ContentEditable = ({
  value,
  onChange,
  className = "",
  placeholder = "",
  id,
  multiline = false,
}: ContentEditableProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [isEmpty, setIsEmpty] = useState(!value);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentValue(value);
    setIsEmpty(!value);
  }, [value]);

  useEffect(() => {
    if (divRef.current) {
      // Only set textContent when not empty to prevent placeholder from being treated as content
      if (!isEmpty) {
        divRef.current.textContent = currentValue;
      }
    }
  }, [currentValue, isEmpty]);

  const handleInput = () => {
    if (divRef.current) {
      const newValue = divRef.current.textContent || "";
      const newIsEmpty = !newValue.trim();
      setCurrentValue(newValue);
      setIsEmpty(newIsEmpty);
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    if (divRef.current) {
      const newValue = divRef.current.textContent || "";
      const newIsEmpty = !newValue.trim();
      setIsEmpty(newIsEmpty);
      
      // Clear the content if empty so placeholder can show
      if (newIsEmpty && divRef.current) {
        divRef.current.textContent = "";
      }
    }
  };

  const handleFocus = () => {
    // If currently showing placeholder, clear it when focused
    if (isEmpty && divRef.current) {
      divRef.current.textContent = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      divRef.current?.blur();
    }
  };

  return (
    <div
      ref={divRef}
      contentEditable="true"
      onInput={handleInput}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      className={`${className} ${isEmpty ? "empty-content" : ""}`}
      id={id}
      data-placeholder={placeholder}
      style={{ 
        minHeight: "1em", 
        whiteSpace: multiline ? "pre-wrap" : "normal",
      }}
    />
  );
};

export default ContentEditable;
