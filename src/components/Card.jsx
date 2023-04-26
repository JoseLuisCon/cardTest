import { Container, Sprite, Text, useApp, useTick } from "@pixi/react";
import React, { useEffect, useRef, useState } from "react";

import * as PIXI from "pixi.js";
import { AnimatedSpriteExplosion } from "./AnimatedSpriteExplosion";

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
  }
};

const getTextureUrl = (key, url) => {
  //Cargamos de forma asincrona la textura de la imagen
  PIXI.Assets.load(url)
    .then((texture) => {
      const newTexture = {
        id: key,
        texture,
      };
      return newTexture;
    })
    .catch((err) => console.log(err));
};

let i = 0;
export const Card = ({ dataCard, position }) => {
  const [dataImgCard, setDataImgCard] = useState(null);
  const [scale, setScale] = useState({ x: 0.35, y: 0.35 });
  const [animationEnd, setAnimationEnd] = useState(false);
  const [alpha, setAlpha] = useState(1);

  let animatedSpt = useRef(true);
  let animatedExplosion = useRef(null);

  const textCard = useRef(null);
  const container = useRef(null);
  const arrayTexture = useRef([]);

  const app = useApp();

  const setDestroy = (val) => {
    if (val) {
      console.log("destroy");
      container.current.parent?.removeChild(
        app.stage.getChildByName("animatedSpriteCard", true)
      );
    }
  };

  useTick((delta) => {
    let contador = scale.x + 0.035; //0.03 nos sirve para retrasar
    i += 0.04 * delta;

    contador = contador - (Math.sin(i / 10) || 0) * 0.04;

    if (contador > scale.x && animatedSpt.current) {
    } else if (scale.x > 0.1 && animatedSpt.current) {
      if (scale.x < 0.19 && scale.x > 0.15) setAnimationEnd(true);

      setScale({ x: contador, y: contador });
      setAlpha((alpha) => alpha - 0.015);
    } else {
      delta = 0;
      console.log("animationEnd");
      animatedSpt.current = false;
    }
  });

  useEffect(() => {
    const arrayPropsCard = Object.entries(dataCard);

    arrayPropsCard.map((item, index) => {
      const [key, value] = item;

      if (key === "text") {
        textCard.current = value;
        // setTextCard(value);
        return;
      }
      PIXI.Assets.load(value)
        .then((texture) => {
          const newTexture = {
            id: key,
            texture,
          };
          if (!newTexture) return;
          // Obtenemos un array con las texturas
          arrayTexture.current = [...arrayTexture.current, newTexture];
          arrayTexture.current.length === 5 &&
            setDataImgCard(arrayTexture.current);
        })
        .catch((err) => console.log(err));
    });

    return () => {
      arrayTexture.current = [];
    };
  }, []);

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
