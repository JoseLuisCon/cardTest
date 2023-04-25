import React, { useState, useRef } from "react";

export const LaunchCardButton = ({ onClickButton }) => {
  const [isHovering, setIsHovering] = useState(false);

  const cont = useRef(0);

  const handleHover = () => setIsHovering(!isHovering);

  const styleButton = {
    backgroundColor: isHovering ? "#a39db2" : "transparent",
    font: "bold 20px sans-serif",
    padding: "5px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  };
  return (
    <button
      style={styleButton}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      onClick={() => onClickButton()}
    >
      Lounch Card
    </button>
  );
};
