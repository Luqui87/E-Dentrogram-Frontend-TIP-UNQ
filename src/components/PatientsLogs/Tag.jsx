
import { useEffect, useState } from "react"

function Tag({ setTag, children, isSelected }) {
  const AddIcon = () => (
    <svg className="tag-icon" viewBox="0 0 24 24" fill="none">
      <path d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="tag-icon" viewBox="-2.4 -2.4 28.80 28.80" fill="none" stroke="#ffffff">
      <path d="M10.0303 8.96965..." fill="#ffffff" />
      <path d="M12 1.25C..." fill="#ffffff" />
    </svg>
  );

  const SelectedIcon = () => (
    <svg className="tag-icon" viewBox="0 0 24 24" fill="none">
      <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const [hovering, setHovering] = useState(false);

  const icon = isSelected ? (hovering ? CloseIcon : SelectedIcon) : AddIcon;

  return (
    <span
      className="tag"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={setTag}
    >
      {children} {icon()}
    </span>
  );
}

export default Tag