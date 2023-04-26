import { Container, Sprite, Text, useApp, useTick } from "@pixi/react";
import React, { useEffect, useRef, useState } from "react";

import * as PIXI from "pixi.js";
import { AnimatedSpriteExplosion } from "./AnimatedSpriteExplosion";

const PROPS_CARDS = {
  scale: { x: 0.35, y: 0.35 },
  alpha: 1,
};
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

let i = 0;
export const Card = ({ dataCard, position }) => {
  const [dataImgCard, setDataImgCard] = useState(null);
  const [scale, setScale] = useState(PROPS_CARDS.scale);
  const [animationEnd, setAnimationEnd] = useState(false);
  const [alpha, setAlpha] = useState(PROPS_CARDS.alpha);

  let animatedSpt = useRef(true);
  let animatedExplosion = useRef(null);

  const textCard = useRef(null);
  const container = useRef(null);
  const arrayTextures = useRef([]);
  const tickHookRef = useRef(null);

  const app = useApp();

  const setDestroy = (val) => {
    // Apagamos el ticker después la animación de la explosión
    setTimeout(() => {
      tickHookRef.current?.stop();
    }, 1000);
  };

  useTick((delta, ticker) => {
    tickHookRef.current = ticker;

    let contador = scale.x + 0.035; //0.03 nos sirve para retrasar

    i += 0.04 * delta;

    contador = contador - (Math.sin(i / 10) || 0) * 0.04;

    if (contador > scale.x && animatedSpt.current) {
    } else if (scale.x > 0.1 && animatedSpt.current) {
      if (scale.x < 0.19 && scale.x > 0.15) setAnimationEnd(true);

      setScale({ x: contador, y: contador });
      setAlpha((alpha) => alpha - 0.015);
    } else {
      animatedSpt.current = false;
      contador = scale.x + 0.035;
    }
  });

  const getDataImgUrl = (data) => {
    const arrayPropsCard = Object.entries(data);
    arrayTextures.current = [];

    arrayPropsCard.forEach((item, index) => {
      const [key, value] = item;

      if (key === "text") {
        textCard.current = value;
        // setTextCard(value);
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
            setDataImgCard(arrayTextures.current);
        })
        .catch((err) => console.log(err));
    });
  };

  useEffect(() => {
    setScale(PROPS_CARDS.scale);
    setAlpha(PROPS_CARDS.alpha);
    getDataImgUrl(dataCard);
    animatedSpt.current = true;
    tickHookRef.current?.start();
    console.log("🚀 ~ file: Card.jsx:108 ~ useEffect ~ dataCard:", dataCard);
  }, [dataCard]);

  return (
    <>
      <Container
        ref={container}
        sortableChildren={true}
        x={position.x}
        y={position.y}
        angle={0}
        scale={scale}
        alpha={alpha}
        name="containerCard"
      >
        {dataImgCard &&
          dataImgCard.map(({ id, texture }, index) => {
            const zIndex = getOrderZIndex(id);
            return (
              <Sprite
                texture={texture}
                key={index}
                zIndex={zIndex}
                anchor={0.5}
              />
            );
          })}

        <Text
          text={textCard.current}
          zIndex={9}
          x={-150}
          y={200}
          style={
            new PIXI.TextStyle({
              fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
              fontSize: 36,
              fill: "white",
              align: "center",
              wordWrap: true,
              wordWrapWidth: 300,
            })
          }
        />
      </Container>
      <AnimatedSpriteExplosion
        ref={animatedExplosion}
        setDestroy={setDestroy}
        x={position.x}
        y={position.y}
        anchor={0.5}
        zIndex={10}
        endAnimation={animationEnd}
      />
    </>
  );
};
