import React from "react";

const SVG = ({ textColor, AQI, fillColor, stoke }: any) => {
  return (
    <svg height={50} width={50}>
      <circle
        cx={25}
        cy={25}
        r={20}
        stroke={stoke}
        strokeWidth={4}
        fill={fillColor}
      >
        {"{"}" "{"}"}
      </circle>
      <text x={17} y={30} fill={textColor}>
        {AQI}
      </text>
    </svg>
  );
};

export default SVG;
