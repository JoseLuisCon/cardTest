import { AnimatedSprite, Container, Sprite, Text, useApp } from "@pixi/react";
import React, { useEffect, useRef, useState } from "react";

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

export const Card = ({ dataCard, position }) => {
  const [dataImgCard, setDataImgCard] = useState(null);
  const [frames, setFrames] = useState(null);

  const textCard = useRef(null);
  const container = useRef(null);
  const arrayTexture = useRef([]);

  const app = useApp();

  useEffect(() => {
    const arrayPropsCard = Object.entries(dataCard);

    arrayPropsCard.map((item, index) => {
      const [key, value] = item;

      if (key === "text") {
        textCard.current = value;
        // setTextCard(value);
        return;
      }

      // Cargamos la textura de las imagenes desde las urls
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
        interactive={true}
        cursor="pointer"
        sortableChildren={true}
        x={position.x}
        y={position.y}
        angle={0}
        scale={0.5}
        anchor={0.5}
        name={"containerCard"}
      >
        {dataImgCard &&
          dataImgCard.map(({ id, texture }, index) => {
            const zIndex = getOrderZIndex(id);
            return <Sprite texture={texture} key={index} zIndex={zIndex} />;
          })}

        <Text
          text={textCard.current}
          zIndex={9}
          x={80}
          y={600}
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

        {/* <AnimatedSprite
          animationSpeed={0.25}
          scale={{ x: 0.35, y: 0.35 }}
          isPlaying={false}
          textures={frames}
          x={position.x}
          y={position.y}
          loop={false}
          onComplete={() => console.log("finalizdo")}
          zIndex={10}
        /> */}
      </Container>
    </>
  );
};
