import React, { useRef, useEffect, useState } from "react";
import { Container, Sprite, Text } from "@pixi/react";

import * as PIXI from "pixi.js";

const getOrderZIndex = (id) => {
  switch (id) {
    case "bg-border":
      return 1;
    case "bg-card":
      return 2;
    case "rarity":
      return 3;
    case "logo":
      return 4;
    case "img":
      return 5;
    case "text":
      return 6;
    default:
      return 0;
  }
};

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
  const [imgSprt, setImgSprt] = useState(null);

  const arrayTextures = useRef([]);
  const textCard = useRef(null);

  useEffect(() => {
    const arrayPropsCard = Object.entries(image);
    arrayTextures.current = [];

    arrayPropsCard.forEach((item, index) => {
      const [key, value] = item;

      if (key === "text") {
        textCard.current = value;
        return;
      }
      // Cargamos las texturas desde las url
      PIXI.Assets.load(value)
        .then((texture) => {
          const newTexture = {
            id: key,
            texture,
          };
          if (!newTexture) return;
          // Obtenemos un array con las texturas
          arrayTextures.current = [...arrayTextures.current, newTexture];
          arrayTextures.current.length === 5 &&
            setImgSprt(arrayTextures.current);
        })
        .catch((err) => console.log(err));
    });
    passRef(referenciaSprite.current);
  }, []);

  return (
    <>
      <Container
        position={position}
        zIndex={zIndex}
        sortableChildren={true}
        interactive={true}
        id={id}
        angle={angle}
        pointerdown={clickStart}
        pointerup={clickEnd}
        pointermove={mouseMove}
        cursor="pointer"
        anchor={anchor}
      >
        {imgSprt &&
          imgSprt.map(({ id, texture }, index) => {
            const zIndex = getOrderZIndex(id);
            return (
              <Sprite
                name={name}
                texture={texture}
                ref={id === 0 ? referenciaSprite : null}
                key={index}
                alpha={alpha}
                scale={scale}
                zIndex={zIndex}
                anchor={anchor}
                angle={angle}
              />
            );
          })}

        <Text
          text={textCard.current}
          zIndex={9}
          x={-45}
          y={20}
          angle={angle}
          style={
            new PIXI.TextStyle({
              fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
              fontSize: 12,
              fill: "white",
              align: "center",
              wordWrap: true,
              wordWrapWidth: 100,
            })
          }
        />
      </Container>
    </>
  );
};
