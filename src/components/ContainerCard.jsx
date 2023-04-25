import React, { useState } from "react";
import { LaunchCardButton } from "./LaunchCardButton";
import { Sprite, Stage } from "@pixi/react";
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

  const initLaunch = () => {
    setCardSelected(mockData);
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
