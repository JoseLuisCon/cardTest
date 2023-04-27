import { Children, createContext, useEffect, useRef, useState } from "react";
import { Container, Graphics, Stage as PixiStage } from "@pixi/react";

import { Baraja } from "./baraja/Baraja";
import { mockData } from "./baraja/data";

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight - 100,
});

const initialSize = getSize();

const options = {
  backgroundColor: 0x8fd7c5,
  resizeTo: window,
  raf: false,
  autoDensity: true,
};

export const contextBaraja = createContext(null);
// CONTEXT BRIDGE para poder usar el contexto Pixi
// the context bridge:
const ContextBridge = ({ children, Context, render }) => {
  return (
    <Context.Consumer>
      {(value) =>
        render(<Context.Provider value={value}>{children}</Context.Provider>)
      }
    </Context.Consumer>
  );
};

export const Stage = ({ children, ...props }) => {
  return (
    <ContextBridge
      Context={contextBaraja}
      render={(children) => <PixiStage {...props}>{children}</PixiStage>}
    >
      {children}
    </ContextBridge>
  );
};

export const ContainerBaraja = () => {
  const [dataBaraja, setDataBaraja] = useState(mockData);

  const [selectedCard, setSelectedCard] = useState(null);

  const containerBarajaRef = useRef(null);

  const draw = (g) => {
    g.beginFill(0x2c1ec5);
    g.drawRoundedRect(containerBarajaRef.x - 300, 400, 200, 50, 15);
    g.endFill();
  };

  // POSIBLE SITIO PARA RECIBIR LA DATA (FETCH)
  useEffect(() => {
    setDataBaraja(mockData);
    setSelectedCard("manuel");
  }, []);

  return (
    <contextBaraja.Provider value={{ selectedCard, setSelectedCard }}>
      <Stage {...initialSize} options={options}>
        <Container
          sortableChildren={true}
          interactive={true}
          ref={containerBarajaRef}
        >
          <Graphics draw={draw} />
          <Baraja pos={{ x: 300, y: 400 }} data={dataBaraja} />
        </Container>
      </Stage>
    </contextBaraja.Provider>
  );
};
