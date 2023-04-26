import React, { useRef, useEffect } from "react";
import { Sprite } from "@pixi/react";

export const Carta = ({
  id,
  image,
  position,
  name,
  alpha,
  angle,
  anchor,
  zIndex,
  scale,
  clickStart,
  clickEnd,
  mouseMove,
  passRef,
}) => {
  const referenciaSprite = useRef(null);
  const createTextureSprite = (image) => {
    console.log(image);
  };

  useEffect(() => {
    createTextureSprite(image);
    passRef(referenciaSprite.current);
  }, []);

  return (
    <Sprite
      id={id}
      ref={referenciaSprite}
      image={"img/Carta_02.png"}
      position={position}
      angle={angle}
      alpha={alpha}
      anchor={anchor}
      zIndex={zIndex}
      scale={scale}
      interactive={true}
      cursor="pointer"
      pointerdown={clickStart}
      pointerup={clickEnd}
      pointermove={mouseMove}
      name={name}
    />
  );
};
