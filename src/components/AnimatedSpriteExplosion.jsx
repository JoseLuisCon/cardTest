import React, { useState, useEffect, useRef } from "react";

import * as PIXI from "pixi.js";

import { AnimatedSprite, useApp } from "@pixi/react";

const spritesheet = "spritesheet.json";

export const AnimatedSpriteExplosion = ({ setDestroy, endAnimation }) => {
  const [frames, setFrames] = useState([]);

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
    if (endAnimation) animatedSpt.current?.play();
  }, [endAnimation]);

  if (frames.length === 0) {
    return;
  }

  return (
    <AnimatedSprite
      textures={frames}
      isPlaying={true}
      loop={false}
      x={0}
      y={0}
      animationSpeed={0.25}
      autoUpdate={true}
      initialFrame={0}
      onComplete={() => setDestroy(true)}
      name="animatedSpriteCard"
      playOnce={true}
    />
  );
};
