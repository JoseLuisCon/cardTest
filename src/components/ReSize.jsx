import { useState, useRef } from "react";

import { Stage } from "@pixi/react";
import { LaunchCard } from "./LaunchCard";

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

const mockData = [
  {
    "bg-border":
      "https://bridder-strapi.s3.eu-central-1.amazonaws.com/01_borde_eea64181d3.png",

    "bg-card":
      "https://bridder-strapi.s3.eu-central-1.amazonaws.com/bg_blue_generic_04ef5399a0.png",
    // rarity:
    //   "https://bridder-strapi.s3.eu-central-1.amazonaws.com/frame_common_4d8c56a5b1.png",
    rarity:
      "https://bridder-strapi.s3.eu-central-1.amazonaws.com/frame_legendary_c2e11d5b53.png",
    logo: "https://bridder-strapi.s3.eu-central-1.amazonaws.com/Logo_Suja_1f96e7632f.png",
    img: "https://bridder-strapi.s3.eu-central-1.amazonaws.com/1_card_34a46d66e3.png",
    text: "Text Card",
  },
];

// const mockData = [
//   {
//     "bg-border": "img/border.png",
//     "bg-card": "img/bg_card.png",
//     rarity: "img/frame.png",
//     logo: "",
//     img: "img/img-card.png",
//     text: "Cosas que tiene la vida",
//   },
//   {
//     "bg-border": "img/border.png",
//     "bg-card": "img/bg_card.png",
//     rarity: "img/frame.png",
//     logo: "",
//     img: "img/img-card.png",
//     text: "Tóxico",
//   },
//   {
//     "bg-border": "img/border.png",
//     "bg-card": "img/bg_card.png",
//     rarity: "img/frame.png",
//     logo: "img/logo.png",
//     img: "img/img-card.png",
//     text: "Text Card",
//   },
//   {
//     "bg-border": "img/border.png",
//     "bg-card": "img/bg_card.png",
//     rarity: "img/frame.png",
//     logo: "img/logo.png",
//     img: "img/img-card.png",
//     text: "",
//   },
// ];

const ButtonLaunchCard = ({ launchCard }) => {
  const [isHovering, setIsHovering] = useState(false);

  const cont = useRef(0);

  const handleHover = () => setIsHovering(!isHovering);

  const styleButton = {
    backgroundColor: isHovering ? "#a39db2" : "transparent",
    font: "bold 20px sans-serif",
    padding: "5px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  };
  return (
    <button
      style={styleButton}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      onClick={() => launchCard(cont.current++)}
    >
      Lounch Card
    </button>
  );
};

/* COMPONENTE QUE SE ADAPTA AL TAMAÑO DE LA PANTALLA */
export const ReSize = ({ x, y }) => {
  const [dataCarta, setDataCarta] = useState(null);

  const launchCard = (id) => {
    !mockData[id] ? setDataCarta(null) : setDataCarta(() => mockData[id]);
  };

  return (
    <>
      <div
        className="botonLaunch"
        style={{
          width: "100%",
          padding: 10,
          background: "#eee",
        }}
      >
        <ButtonLaunchCard launchCard={launchCard} />
      </div>

      <Stage {...initialSize} options={options}>
        {dataCarta !== null && (
          <LaunchCard
            dataCard={{ data: dataCarta, x: 300, y: 200 }}
          ></LaunchCard>
        )}
      </Stage>
    </>
  );
};
