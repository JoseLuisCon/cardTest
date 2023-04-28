import { createContext, useEffect, useRef, useState } from "react";
import { Container, Graphics, Stage as PixiStage, useApp } from "@pixi/react";

import { Baraja } from "./baraja/Baraja";
import { mockData } from "./baraja/data";

import * as PIXI from "pixi.js";
PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2;

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
	return <Context.Consumer>{(value) => render(<Context.Provider value={value}>{children}</Context.Provider>)}</Context.Consumer>;
};

export const Stage = ({ children, ...props }) => {
	return (
		<ContextBridge Context={contextBaraja} render={(children) => <PixiStage {...props}>{children}</PixiStage>}>
			{children}
		</ContextBridge>
	);
};

export const ContainerBaraja = () => {
	const [dataBaraja, setDataBaraja] = useState(mockData);

	const [selectedCard, setSelectedCard] = useState(null);

	const containerBarajaRef = useRef(null);

	const draw = (g) => {
		const posicionCarta0 = containerBarajaRef.current?.getChildByName("carta0", true)?.parent?.position;
		const cantidadCartas = containerBarajaRef.current?.children.length;
		const posicionUltimaCarta = containerBarajaRef.current?.getChildByName("carta" + (cantidadCartas - 1), true)?.parent?.position;

		g.beginFill(0x2c1ec5);
		g.drawRoundedRect(posicionCarta0?.x - 200, posicionCarta0?.y - 200, posicionUltimaCarta?.x + 100, posicionUltimaCarta?.y + 50, 15);
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
				<Graphics draw={draw} />
				<Container sortableChildren={true} interactive={true} ref={containerBarajaRef}>
					<Baraja pos={{ x: 300, y: 400 }} data={dataBaraja} />
				</Container>
			</Stage>
		</contextBaraja.Provider>
	);
};
