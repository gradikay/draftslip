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
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.textContent = currentValue || "";
    }
  }, [currentValue]);

  const handleInput = () => {
    if (divRef.current) {
      const newValue = divRef.current.textContent || "";
      setCurrentValue(newValue);
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    if (!currentValue.trim() && placeholder) {
      setCurrentValue("");
    }
  };

  const handleFocus = () => {
    if (currentValue === placeholder) {
      setCurrentValue("");
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
      className={className}
      id={id}
      dangerouslySetInnerHTML={{ __html: currentValue || placeholder }}
      style={{ 
        minHeight: "1em", 
        whiteSpace: multiline ? "pre-wrap" : "normal",
      }}
    />
  );
};

export default ContentEditable;
