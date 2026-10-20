import React from "react";
import { Composition } from "remotion";
import { ClutchWirePromo } from "./ClutchWirePromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ClutchWirePromo"
        component={ClutchWirePromo}
        durationInFrames={900} // 30秒 (30fps)
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
