import React from "react";
import { RESOURCES } from "../../resources/resources.ts";
import ReactPreloader from "../core/resources/Preloader.ts";

export const GamePreloader = new ReactPreloader(
  RESOURCES,
  ({ fonts, images, sounds }) => (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        margin: "8rem",
        color: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        gap: "1rem",
      }}
    >
      Loading...
      <label>
        <span>fonts</span>
        <progress
          style={{ display: "block" }}
          value={fonts.loaded}
          max={fonts.total}
        />
      </label>
      <label>
        <span>images</span>
        <progress
          style={{ display: "block" }}
          value={images.loaded}
          max={images.total}
        />
      </label>
      <label>
        <span>sounds</span>
        <progress
          style={{ display: "block" }}
          value={sounds.loaded}
          max={sounds.total}
        />
      </label>
    </div>
  )
);
