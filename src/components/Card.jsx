import { Container, Sprite, Text, useApp } from "@pixi/react";
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

export const Card = ({ dataCard, position }) => {
  const [dataImgCard, setDataImgCard] = useState(null);

  const arrayPropsCard = Object.entries(dataCard);

  const textCard = useRef(null);
  const container = useRef(null);
  const arrayTexture = useRef([]);

  const app = useApp();

  useEffect(() => {
    arrayPropsCard.map((item, index) => {
      const [key, value] = item;

      if (key === "text") {
        textCard.current = value;
        // setTextCard(value);
        return;
      }

      const loadSprite = PIXI.Assets.load(value);
      loadSprite
        .then((texture) => {
          const newTexture = {
            id: key,
            texture,
          };
          // Obtenemos un array con las texturas
          arrayTexture.current = [...arrayTexture.current, newTexture];
          // Cuando el array de texturas tenga la misma longitud que el array de propiedades de la carta
          if (arrayPropsCard.length - 1 === 5)
            setDataImgCard(arrayTexture.current);
        })
        .catch((err) => console.log(err));
    });

    return () => {
      app.stage.removeChild(app.stage.getChildByName("containerCard", true));
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
        {dataImgCard?.length === 5 &&
          dataImgCard.map(({ id, texture }, index) => {
            const zIndex = getOrderZIndex(id);

            return <Sprite texture={texture} key={index} zIndex={zIndex} />;
          })}

        <Text
          text={textCard.current}
          zIndex={9}
          x={30}
          y={container.current?.y + container.current?.height - 10}
          style={
            new PIXI.TextStyle({
              fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
              fontSize: 36,
              fill: "white",
              align: "center",
              wordWrap: true,
              wordWrapWidth: container.current?.width * 2,
            })
          }
        />
      </Container>
    </>
  );
};
