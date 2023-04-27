import React, { useEffect, useState, useRef } from "react";
import { useApp } from "@pixi/react";

import { Carta } from "./Carta";

import sonidoDeleteCard from "../../assets/sound/card-deleted.mp3";
import sonidoDeleteLastCard from "../../assets/sound/last-card-deleted.mp3";
import sonidoRebote from "../../assets/sound/rebote.mp3";

const TWEEN = require("@tweenjs/tween.js");

export const Baraja = ({ pos, data }) => {
  const [cartasSprite, setCartasSprite] = useState([]);

  const isDragging = useRef(false);
  const isRetorning = useRef(false);
  const initialProps = useRef(null);
  const referenciaSprite = useRef(null);
  const positionPointer = useRef({ x: 0, y: 0 });
  const alpha = useRef(1);
  const app = useApp();

  const initSoundDeletedCard = (selecTrack) => {
    let audioSelected = "";
    switch (selecTrack) {
      case 0:
        audioSelected = sonidoDeleteLastCard;
        break;
      case 1:
        audioSelected = sonidoDeleteCard;
        break;
      case 2:
        audioSelected = sonidoRebote;
    }

    const audio = new Audio(audioSelected);

    audio.volume = 0.2;
    audio.muted = false;
    audio.play();
  };

  const createDataSprite = (mockData) => {
    return mockData.map((data, index) => {
      return {
        id: index,
        img: data,
        scale: { x: 0.25, y: 0.25 },
        rot: 0,
        zIndex: 0,
        anchor: { x: 0.4, y: 0.8 },
        select: false,
      };
    });
  };

  const reDistribution = (arrayIn) => {
    let xBar = pos.x;
    let yBar = pos.y;

    let initialAngle =
      arrayIn.length === 1 ? 0 : Math.trunc(arrayIn.length / 2) * -2;
    let angle = initialAngle;

    const newCartasSprite = arrayIn.map((carta, index) => {
      const { rot, anchor, x, y, ...rest } = carta;

      if (index === 0) {
        angle = initialAngle;
      } else {
        angle = angle + 2;
      }
      xBar = xBar + 60;
      return {
        rot: angle,
        anchor: { x: 0.5, y: 0.7 },
        x: xBar,
        y: yBar,
        ...rest,
      };
    });

    return newCartasSprite;
  };

  const showSelectedCard = (idCarta = 0, arraySprite) => {
    if (isRetorning.current) return;

    if (!arraySprite || !arraySprite[idCarta]) return;
    // Se trata de actualizar el estado de las cartas para que se muestren seleccionadas
    // la que se selecciona se eleva y las demás se bajan. Las de la izquierda se bajan hacia la izquierda
    // y las de la derecha hacia la derecha.
    let newCartasSprite = arraySprite.slice();

    newCartasSprite[idCarta].select = true;
    newCartasSprite[idCarta].zIndex = newCartasSprite.length;

    // A ambos lados se situan con un Zindex decreciente
    const zIndexMax = newCartasSprite.length;

    //Dividimos array desde la carta selecionada a izquierda y derecha
    const indexCenter = newCartasSprite.findIndex(
      (carta) => carta.id === idCarta
    );

    let cardsLeft = [];
    let cardsRight = [];

    if (indexCenter !== 0) {
      if (indexCenter === newCartasSprite.length - 1) {
        cardsLeft = [...newCartasSprite.slice(0, indexCenter)];
        cardsRight = [];
      } else {
        cardsLeft = [...newCartasSprite.slice(0, indexCenter)];
        cardsRight = [...newCartasSprite.slice(indexCenter + 1)];
      }
    } else {
      cardsLeft = [];
      cardsRight = [...newCartasSprite.slice(indexCenter + 1)];
    }

    let numCartsLeft = cardsLeft.length;
    let newZIndex = zIndexMax - numCartsLeft;

    for (let index = 0; index < numCartsLeft; index++) {
      cardsLeft[index].select = false;
      cardsLeft[index].zIndex = newZIndex;
      newZIndex++;
    }

    let numCartsRight = cardsRight.length;
    newZIndex = zIndexMax - 1;
    for (let index = 0; index < numCartsRight; index++) {
      cardsRight[index].select = false;
      cardsRight[index].zIndex = newZIndex;
      newZIndex--;
    }

    newCartasSprite = [...cardsLeft, newCartasSprite[idCarta], ...cardsRight];

    alpha.current = 1;
    return newCartasSprite;
  };

  //* ====================================  EFECTO RETORNO CON LIBRERÍA TWEEN ====================

  const initReturn = () => {
    let { x, y, ...props } = initialProps.current;

    const tween = new TWEEN.Tween({
      x: cartasSprite[initialProps.current.id].x,
      y: cartasSprite[initialProps.current.id].y,
    })
      .to({ x: x, y: y }, 1200)
      .easing(TWEEN.Easing.Elastic.Out)
      .onUpdate(({ x, y }) => {
        const newCartasSprite = cartasSprite.map((carta) => {
          if (carta.id === initialProps.current.id) {
            const newCarta = {
              x: Math.trunc(x),
              y: Math.trunc(y),
              ...props,
            };
            return newCarta;
          } else {
            return carta;
          }
        });

        setCartasSprite(newCartasSprite);
      })
      .start()
      .onStart(() => {
        isRetorning.current = true;
      })
      .onComplete(() => {
        isRetorning.current = false;
      });
  };

  const animate = (time) => {
    requestAnimationFrame(animate);
    TWEEN.update(time);
  };
  const effectReturnCarta = () => {
    initReturn();
    animate();
  };
  //* ====================================  FIN EFECTO RETORNO CON LIBRERÍA TWEEN ====================

  const onStart = (e) => {
    console.log("onStart");
    if (isRetorning.current) return;

    if (cartasSprite[e.target?.id].zIndex !== cartasSprite.length) return;

    isDragging.current = true;

    initialProps.current = cartasSprite[e.target.id];
    referenciaSprite.current = e.target;

    const newCartasSprite = cartasSprite.map((carta) => {
      if (carta.id === initialProps.current.id) {
        let { x, y, rot, anchor, ...props } = carta;
        const newCart = {
          rot: 0,
          x: Math.trunc(e.data.global.x),
          y: Math.trunc(e.data.global.y),
          anchor: 0.5,
          ...props,
        };
        return newCart;
      } else {
        return carta;
      }
    });

    setCartasSprite(newCartasSprite);
  };

  const onMove = (e) => {
    console.log("onMove", e.data.global.x, e.data.global.y);
    if (isRetorning.current) return;

    if (!isDragging.current && !initialProps.current) {
      initialProps.current = cartasSprite[e.target.id];
      referenciaSprite.current = e.target;
      console.log("onMove", initialProps.current);
    }

    if (isDragging.current) {
      const newCartasSprite = cartasSprite.map((carta) => {
        if (carta.id === initialProps.current?.id) {
          let { x, y, ...props } = carta;
          const newCart = {
            x: Math.trunc(e.data.global.x),
            y: Math.trunc(e.data.global.y),
            ...props,
          };
          return newCart;
        } else {
          return carta;
        }
      });

      // //* EFECTO DE DESVANECIMIENTO EN DOS PASOS
      if (
        Math.abs(
          initialProps.current?.y - newCartasSprite[initialProps.current.id].y
        ) > 300 ||
        Math.abs(
          initialProps.current?.x - newCartasSprite[initialProps.current.id].x
        ) > 300
      ) {
        alpha.current = 0.5;
      } else {
        alpha.current = 1;
      }

      setCartasSprite(newCartasSprite);
    }
    //================================    ************************************************************  ================================
    //================================    MANEJO DE LAS CARTAS CUANDO NO SE ENCUENTRAN DRAG AND DROP    ================================
    //================================    ************************************************************  ================================
    else {
      // Modificamos la referencia a las coordenadas del ratón.
      positionPointer.current = {
        x: Math.trunc(e.data.global.x),
        y: Math.trunc(e.data.global.y),
      };

      //================================   NOS DESPLAZAMOS HACIA LA DERECHA    ================================
      if (
        positionPointer.current.x > e.target?.x + 30 &&
        positionPointer.current?.y <
          e.target?.y +
            referenciaSprite.current?.height *
              (1 - referenciaSprite.current?.anchor?.y) && //Valor de y de la carta levantada
        positionPointer.current?.y >
          e.target?.y -
            referenciaSprite.current?.height *
              referenciaSprite.current?.anchor?.y //Valor de y de la carta levantada
        // referenciaSprite.current?.zIndex === e.target?.zIndex
      ) {
        //Si estamos en la carta final habilitamos la zona para que se seleccione en caso de que no esté seleccionada
        const checkIdFinal = cartasSprite[cartasSprite.length - 1].id;
        if (
          checkIdFinal === e.target?.id &&
          positionPointer.current.x > e.target?.x &&
          positionPointer.current.x <
            e.target?.x + referenciaSprite.current?.width &&
          cartasSprite[e.target?.id].zIndex !== cartasSprite.length
        ) {
          setCartasSprite(showSelectedCard(e.target?.id, cartasSprite));
        } else if (
          cartasSprite[e.target?.id].zIndex === cartasSprite.length &&
          checkIdFinal === e.target?.id
        ) {
          setCartasSprite(showSelectedCard(e.target?.id, cartasSprite));
        } else {
          // Avanzamos una carta a la derecha
          setCartasSprite(showSelectedCard(e.target?.id + 1, cartasSprite));
        }
      }

      //================================    MANEJO DE LAS CARTAS CUANDO NOS DESPLAZAMOS HACIA LA IZQUIERDA    ================================
      else if (
        positionPointer.current.x < e.target?.x - 30 &&
        positionPointer.current?.y <
          e.target?.y +
            referenciaSprite.current?.height /
              referenciaSprite.current?.anchor.y &&
        positionPointer.current?.y >
          e.target?.y -
            referenciaSprite.current?.height +
            (1 - referenciaSprite.current?.anchor.y)
      ) {
        const checkIdInitial = cartasSprite[0].id;
        if (
          checkIdInitial === e.target?.id &&
          positionPointer.current.x < e.target?.x &&
          positionPointer.current.x >
            e.target?.x - referenciaSprite.current?.width / 2 &&
          cartasSprite[e.target?.id].zIndex !== cartasSprite.length
        ) {
          setCartasSprite(showSelectedCard(e.target?.id, cartasSprite));
        } else if (
          cartasSprite[e.target?.id].zIndex === cartasSprite.length &&
          checkIdInitial === e.target?.id
        ) {
          setCartasSprite(showSelectedCard(e.target?.id, cartasSprite));
        } else {
          setCartasSprite(showSelectedCard(e.target?.id - 1, cartasSprite));
        }
      }
    }
  };

  const getNewReferenceSprite = (idCartas) => {
    return app.stage.getChildByName("carta" + idCartas, true).parent;
  };

  const onEnd = () => {
    isDragging.current = false;

    if (isRetorning.current) return;
    console.log("onEnd");
    if (
      Math.abs(
        initialProps.current?.y - cartasSprite[initialProps.current?.id].y
      ) > 300 ||
      Math.abs(
        initialProps.current?.x - cartasSprite[initialProps.current?.id].x
      ) > 300
    ) {
      //! DELETING CARDS  //

      if (cartasSprite.length === 1) {
        setCartasSprite([]);
        initSoundDeletedCard(0);
      } else {
        // creamos nuevo array de cartas sin la carta que se ha eliminado
        const newCartasSprite = cartasSprite.filter(
          (carta) => carta.id !== initialProps.current.id
        );

        // reasignamos los id de las cartas
        const newCartas = newCartasSprite.map(({ id, ...props }, index) => ({
          id: index,
          ...props,
        }));

        // recolocamos las cartas
        const newArrayCartasRedistribuidas = reDistribution(newCartas);

        // Obtenemos el id de la última carta del array
        const chekMaxId =
          newArrayCartasRedistribuidas[newArrayCartasRedistribuidas.length - 1]
            .id;

        // comprobamos si la carta que se ha eliminado es la última del array
        console.log("💚", cartasSprite);
        if (chekMaxId === initialProps.current.id - 1) {
          setCartasSprite(
            showSelectedCard(chekMaxId, newArrayCartasRedistribuidas)
          );
          referenciaSprite.current = getNewReferenceSprite(chekMaxId);
        } else {
          // Si no es la última carta del array, seleccionamos la carta con el mismo id que la que se ha eliminado
          setCartasSprite(
            showSelectedCard(
              initialProps.current.id,
              newArrayCartasRedistribuidas
            )
          );

          referenciaSprite.current = getNewReferenceSprite(
            initialProps.current.id
          );
        }
        initSoundDeletedCard(1);
      }
    } else {
      // Retornamos la carta a su posición inicial con el efecto de rebote y sonido
      effectReturnCarta();
      initSoundDeletedCard(2);
    }

    alpha.current = 1;
  };

  useEffect(() => {
    const cartaSpriteInitial = createDataSprite(data);

    if (cartaSpriteInitial.length !== 0) {
      const newArray = reDistribution(cartaSpriteInitial);
      setCartasSprite(showSelectedCard(0, newArray));
    }
  }, []);
  useEffect(() => {
    if (cartasSprite.length !== 0) {
      const newArray = reDistribution(cartasSprite);
    }
  }, [cartasSprite]);

  const passRef = (ref) => {
    referenciaSprite.current = ref;
  };

  return (
    <>
      {cartasSprite.map(
        ({ id, img, x, y, anchor, zIndex, rot, scale, select }) => (
          <Carta
            id={id}
            key={id}
            image={img}
            position={{ x, y: select ? y - 30 : y }}
            angle={rot}
            alpha={initialProps.current?.id === id ? alpha.current : 1}
            anchor={anchor}
            zIndex={zIndex}
            scale={scale}
            clickStart={onStart}
            clickEnd={onEnd}
            mouseMove={onMove}
            name={"carta" + id}
            passRef={passRef}
          />
        )
      )}
    </>
  );
};
