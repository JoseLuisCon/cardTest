import React, { useEffect, useRef, useState } from "react";

import { Container, Sprite, Text, useTick, useApp } from "@pixi/react";

import * as PIXI from "pixi.js";

const TWEEN = require("@tweenjs/tween.js");

let i = 0;

export const LaunchCard = ({ dataCard }) => {
  const [position, setPosition] = useState({ x: dataCard.x, y: dataCard.y });
  const [dataImg, setDataImg] = useState(dataCard.data);

  const [animationEnd, setAnimationEnd] = useState(false);

  const [scale, setScale] = useState({ x: 0.25, y: 0.25 });
  const [angle, setAngle] = useState({ angle: 0 });

  const app = useApp();
  const container = useRef(null);
  let animatedSpt = useRef(true);

  const initShowCard = () => {
    // let { angle, ...props } = container.current;

    const tween = new TWEEN.Tween({ angle: 0 })
      .to({ angle: 360 }, 725)
      .repeat(1)
      .onUpdate(({ angle }) => {
        const angleSprite = angle;
        setAngle(angleSprite);
      })
      .start()
      .onComplete(setAnimationEnd());
  };

  const animate = (time) => {
    requestAnimationFrame(animate);
    TWEEN.update(time);
  };

  const effecShowCard = () => {
    initShowCard();
    animate();
  };

  const setDestroy = (val) => {
    if (val) {
      container.current.removeChild(
        container.current.getChildByName("animatedSpt", true)
      );
    }
  };

  useTick((delta) => {
    let contador = scale.x + 0.035; //0.03 nos sirve para retrasar
    i += 0.06 * delta;

    contador = contador - (Math.sin(i / 10) || 0) * 0.04;

    if (contador > scale.x && animatedSpt) {
    } else if (scale.x > 0.1 && animatedSpt) {
      setScale({ x: contador, y: contador });
    } else if (animatedSpt) {
      animatedSpt = false;
      setAnimationEnd(true);
      container.current.removeChild(container.current.getChildByName("sprite"));
    }
  });

  useEffect(() => {
    effecShowCard();
    setDataImg(dataCard.data);
  }, [dataCard]);

  return (
    <Container
      name="animatedBoom"
      ref={container}
      interactive={true}
      cursor="pointer"
      sortableChildren={true}
      x={position.x}
      y={position.y}
      angle={angle}
      scale={scale}
    >
      <Sprite image={dataImg["bg-border"]} anchor={0.5} />
      <Sprite image={dataImg["bg-card"]} anchor={0.5} />
      <Sprite image={dataImg["rarity"]} anchor={0.5} />
      {dataImg["logo"] !== "" && (
        <Sprite image={dataImg["logo"]} anchor={0.5} />
      )}
      <Sprite image={dataImg["img"]} anchor={0.5} />

      <Text
        text={dataImg["text"]}
        zIndex={2}
        x={(container.current?.width / 2) * -1}
        y={container.current?.height}
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

      {/* <SpriteAnimated
        name="animatedSpt"
        endAnimation={animationEnd}
        zIndex={1}
        x={0}
        y={0}
        setDestroy={setDestroy}
      /> */}
    </Container>
  );
};
