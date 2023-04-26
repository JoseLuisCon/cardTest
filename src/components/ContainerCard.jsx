import React, { useRef, useState, useEffect } from "react";
import { LaunchCardButton } from "./LaunchCardButton";
import { Stage } from "@pixi/react";
import { mockData } from "./data";
import { Card } from "./Card";

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight - 100,
});

const initialSize = getSize();

const options = {
  backgroundColor: 0x8fd7c5,
  resizeTo: window,
  raf: false,
  autoDensity: true,
};

export const ContainerCard = () => {
  const [cardSelected, setCardSelected] = useState(null);
  const contCards = useRef(0);

  const initLaunch = () => {
    setCardSelected(mockData[contCards.current]);
    contCards.current++;
    if (contCards.current === mockData.length) {
      contCards.current = 0;
    }
  };

  return (
    <>
      <div
        className="botonLaunch"
        style={{
          width: "100%",
          padding: 10,
          background: "#eee",
        }}
      >
        <LaunchCardButton onClickButton={initLaunch}></LaunchCardButton>
      </div>

      <Stage {...initialSize} options={options}>
        {cardSelected && (
          <Card dataCard={cardSelected} position={{ x: 500, y: 400 }} />
        )}
      </Stage>
    </>
  );
};
