
import React, { useState, useRef, useLayoutEffect } from "react";

const LeaveReason = () => {
  const [leaveReason, setLeaveReason] = useState("");
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    const computedStyle = window.getComputedStyle(textarea);

    const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
    const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;

    const newHeight =
      textarea.scrollHeight + borderTop + borderBottom;

    textarea.style.height = `${newHeight}px`;

    const newWidth = textarea.getBoundingClientRect().width;

    setDimensions({
      width: Math.round(newWidth),
      height: Math.round(newHeight)
    });
  };

  useLayoutEffect(() => {
    resizeTextarea();

    window.addEventListener("resize", resizeTextarea);

    return () => {
      window.removeEventListener("resize", resizeTextarea);
    };
  }, [leaveReason]);

  const handleChange = (event) => {
    setLeaveReason(event.target.value);
  };

  return (
    <>
      <style>{`
        .leave-container {
          width: 100%;
          max-width: 600px;
          margin: 30px auto;
          padding: 20px;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        .leave-container h2 {
          margin-bottom: 15px;
          font-size: 22px;
        }

        .leave-textarea {
          display: block;
          width: 100%;
          min-height: 45px;
          padding: 12px;
          box-sizing: border-box;
          font-size: 16px;
          line-height: 1.5;
          font-family: inherit;
          border: 1px solid #ccc;
          border-radius: 8px;
          resize: none;
          overflow: hidden;
          outline: none;
          transition: border-color 0.2s;
        }

        .leave-textarea:focus {
          border-color: #2563eb;
        }

        .leave-info {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 12px;
          font-size: 13px;
          color: #555;
        }
      `}</style>

      <div className="leave-container">
        <h2>Leave Reason</h2>

        <textarea
          ref={textareaRef}
          className="leave-textarea"
          value={leaveReason}
          onChange={handleChange}
          placeholder="Enter your leave reason..."
          rows={1}
        />

        <div className="leave-info">
          <span>Total Characters: {leaveReason.length}</span>
          <span>Width: {dimensions.width}px</span>
          <span>Height: {dimensions.height}px</span>
        </div>
      </div>
    </>
  );
};

export default LeaveReason;
