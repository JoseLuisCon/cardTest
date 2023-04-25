import React, { useState, useEffect, useRef } from "react";

import * as PIXI from "pixi.js";

import { AnimatedSprite, useApp } from "@pixi/react";

// const spritesheet = "https://pixijs.io/examples/examples/assets/spritesheet/fighter.json";
const spritesheet = "spritesheet.json";

export const SpriteAnimated = ({ x, y, endAnimation, setDestroy }) => {
  const [frames, setFrames] = useState([]);

  let animatedSpt = useRef();
  let app = useApp();

  useEffect(async () => {
    if (frames.length === 0) {
      app.loader.add(spritesheet).load((_, resource) => {
        setFrames(
          Object.keys(resource[spritesheet].data.frames).map((frame) =>
            PIXI.Texture.from(frame)
          )
        );
      });
    }
  }, []);

  useEffect(() => {
    if (endAnimation) animatedSpt.current?.play();
  }, [endAnimation]);

  if (frames.length === 0) {
    return null;
  }

  return (
    <AnimatedSprite
      ref={animatedSpt}
      animationSpeed={0.25}
      scale={{ x: 0.35, y: 0.35 }}
      isPlaying={false}
      textures={frames}
      x={x}
      y={y}
      loop={false}
      onComplete={() => setDestroy(true)}
    />
  );
};
