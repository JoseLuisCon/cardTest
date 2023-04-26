import React, { useState, useEffect, useRef } from "react";

import * as PIXI from "pixi.js";

import { AnimatedSprite, useApp } from "@pixi/react";

const spritesheet = "spritesheet.json";

export const AnimatedSpriteExplosion = ({ x, y, setDestroy, endAnimation }) => {
  const [frames, setFrames] = useState([]);
  const [zIndex, setzIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  let animatedSpt = useRef();
  let app = useApp();

  useEffect(() => {
    PIXI.Assets.load(spritesheet)
      .then(({ data }) => data)
      .then(({ frames }) =>
        setFrames(Object.keys(frames).map((frame) => PIXI.Texture.from(frame)))
      )
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    console.log(endAnimation);
    if (endAnimation) {
      setVisible(true);
      setzIndex(10);
      animatedSpt.current?.play();
    }
  }, [endAnimation]);

  if (frames.length === 0) {
    return;
  }

  return (
    <AnimatedSprite
      scale={0.35}
      ref={animatedSpt}
      textures={frames}
      loop={false}
      anchor={0.5}
      x={x}
      y={y}
      visible={visible}
      animationSpeed={0.25}
      autoUpdate={true}
      initialFrame={0}
      onComplete={() => setDestroy(true)}
      name="animatedSpriteCard"
      zIndex={zIndex}
      // playOnce={true}
    />
  );
};
