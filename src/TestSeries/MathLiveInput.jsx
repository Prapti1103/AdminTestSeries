import React, { useEffect, useRef, useState } from "react";
import { MathfieldElement } from "mathlive";
import { Input, Button, Tooltip } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// Register the custom element once globally
if (!window.customElements.get("math-field")) {
  window.customElements.define("math-field", MathfieldElement);
}

const MathLiveInput = ({ value, onChange, placeholder = "Type your question here..." }) => {
  const mathFieldRef = useRef(null);
  const [isMathMode, setIsMathMode] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || "");

  useEffect(() => {
    setCurrentValue(value || "");
  }, [value]);

  useEffect(() => {
    if (mathFieldRef.current && isMathMode) {
      // Configure MathLive for better text handling
      mathFieldRef.current.setOptions({
        virtualKeyboardMode: 'manual',
        smartMode: true,
        smartFence: true,
        smartSuperscript: true,
        scriptDepth: 2,
        removeExtraneousParentheses: true,
        mathModeSpace: '\\;',
        // Enable text mode within math
        defaultMode: 'text',
        macros: {
          '\\text': '\\mathrm{#1}',
          '\\newline': '\\\\',
        }
      });

      // Set the value if it exists
      if (currentValue !== mathFieldRef.current.value) {
        mathFieldRef.current.value = currentValue;
      }

      // Add event listeners for better text handling
      mathFieldRef.current.addEventListener('beforeinput', handleBeforeInput);
      mathFieldRef.current.addEventListener('keydown', handleKeyDown);

      return () => {
        if (mathFieldRef.current) {
          mathFieldRef.current.removeEventListener('beforeinput', handleBeforeInput);
          mathFieldRef.current.removeEventListener('keydown', handleKeyDown);
        }
      };
    }
  }, [isMathMode, currentValue]);

  const handleBeforeInput = (e) => {
    // Allow space in text mode
    if (e.inputType === 'insertText' && e.data === ' ') {
      e.preventDefault();
      mathFieldRef.current.executeCommand(['insert', '\\;']);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Insert a line break in math mode
      mathFieldRef.current.executeCommand(['insert', '\\\\']);
    } else if (e.key === ' ') {
      e.preventDefault();
      // Insert proper space
      mathFieldRef.current.executeCommand(['insert', '\\;']);
    }
  };

  const handleMathInput = (e) => {
    const newValue = e.target.value;
    setCurrentValue(newValue);
    onChange(newValue);
  };

  const handleTextAreaChange = (e) => {
    const newValue = e.target.value;
    setCurrentValue(newValue);
    onChange(newValue);
  };

  const toggleMode = () => {
    setIsMathMode(!isMathMode);
  };

  const handleTextAreaKeyDown = (e) => {
    // Allow normal behavior for textarea - Enter creates new line, space works normally
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = currentValue.substring(0, start) + '\t' + currentValue.substring(end);
      setCurrentValue(newValue);
      onChange(newValue);
      
      // Set cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          type="button"
          onClick={toggleMode}
          style={{
            padding: '4px 12px',
            fontSize: '12px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            backgroundColor: isMathMode ? '#1890ff' : '#f0f0f0',
            color: isMathMode ? 'white' : '#333',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          {isMathMode ? '📐 Math Mode' : '📝 Text Mode'}
        </button>
        {/* <span style={{ fontSize: '12px', color: '#666' }}>
          {isMathMode 
            ? 'Math symbols enabled | Enter: new line | Space: math space' 
            : 'Regular text input | Enter: new line | Space: normal space'
          }
        </span> */}
      </div>

      {isMathMode ? (
        <div style={{ position: 'relative' }}>
          <math-field
            ref={mathFieldRef}
            value={currentValue}
            onInput={handleMathInput}
            style={{ 
              width: '100%', 
              minHeight: '80px',
              maxHeight: '200px',
              padding: '8px', 
              border: '1px solid #d9d9d9', 
              borderRadius: '4px',
              fontFamily: 'inherit',
              fontSize: '14px',
              lineHeight: '1.5',
              overflow: 'auto',
              resize: 'vertical'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '0',
            fontSize: '11px',
            color: '#999',
            pointerEvents: 'none'
          }}>
            Use \text{} for regular text within math
          </div>
        </div>
      ) : (
        <TextArea
          value={currentValue}
          onChange={handleTextAreaChange}
          onKeyDown={handleTextAreaKeyDown}
          placeholder={placeholder}
          autoSize={{ minRows: 3, maxRows: 10 }}
          style={{
            fontFamily: 'inherit',
            fontSize: '14px',
            lineHeight: '1.5'
          }}
        />
      )}

      {/* Quick math symbols panel for math mode */}
      {isMathMode && (
        <div style={{ 
          marginTop: '8px', 
          padding: '8px', 
          backgroundColor: '#fafafa', 
          borderRadius: '4px',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Quick Insert:</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {[
              { label: 'α', latex: '\\alpha' },
              { label: 'β', latex: '\\beta' },
              { label: 'γ', latex: '\\gamma' },
              { label: '∑', latex: '\\sum' },
              { label: '∫', latex: '\\int' },
              { label: '√', latex: '\\sqrt{#?}' },
              { label: 'x²', latex: 'x^{#?}' },
              { label: 'x₁', latex: 'x_{#?}' },
              { label: '≤', latex: '\\leq' },
              { label: '≥', latex: '\\geq' },
              { label: '≠', latex: '\\neq' },
              { label: '∞', latex: '\\infty' },
              { label: 'π', latex: '\\pi' },
              { label: 'Text', latex: '\\text{#?}' },
              { label: 'New Line', latex: '\\\\' }
            ].map((symbol, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (mathFieldRef.current) {
                    mathFieldRef.current.executeCommand(['insert', symbol.latex]);
                    mathFieldRef.current.focus();
                  }
                }}
                style={{
                  padding: '2px 6px',
                  fontSize: '12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '3px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  minWidth: '30px'
                }}
                title={`Insert ${symbol.latex}`}
              >
                {symbol.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview section */}
      {currentValue && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
          border: '1px solid #e8e8e8'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Preview:</div>
          <div style={{ 
            minHeight: '20px',
            fontSize: '14px',
            lineHeight: '1.5',
            wordBreak: 'break-word'
          }}>
            {isMathMode ? (
              <math-field
                read-only
                value={currentValue}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  width: '100%'
                }}
              />
            ) : (
              <pre style={{ 
                margin: 0, 
                fontFamily: 'inherit', 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {currentValue}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MathLiveInput;