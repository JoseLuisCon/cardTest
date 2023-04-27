import { useEffect, useState } from "react";
import { Container, Stage } from "@pixi/react";

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

export const ContainerBaraja = () => {
  const [dataBaraja, setDataBaraja] = useState(mockData);

  const onMoveContainer = (e) => {
    const { x, y } = e.data.global;
  };

  // POSIBLE SITIO PARA RECIBIR LA DATA (FETCH)
  useEffect(() => {
    setDataBaraja(mockData);
  }, []);

  return (
    <Stage {...initialSize} options={options}>
      <Container
        sortableChildren={true}
        interactive={true}
        onmousemove={onMoveContainer}
      >
        <Baraja pos={{ x: 300, y: 400 }} data={dataBaraja} />
      </Container>
    </Stage>
  );
};
