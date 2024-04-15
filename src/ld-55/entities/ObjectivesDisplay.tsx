import React from "react";
import { ReactEntity } from "../../core/ReactEntity";
import { fontName } from "../../core/resources/resourceUtils";
import { Persistence } from "../constants/constants";
import { getLevelController } from "./LevelController";

export class ObjectivesDisplay extends ReactEntity {
  persistenceLevel = Persistence.Level;

  constructor() {
    super(() => {
      const levelController = getLevelController(this.game);
      if (!levelController) return <></>;

      const objectives = levelController.getObjectives();
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            padding: "1rem",
            fontFamily: fontName("kgBrokenVesselsSketch"),
            color: "white",
            textShadow: "0 0 1px #000",
            textAlign: "right",
          }}
        >
          <h1 style={{ fontSize: "2em", margin: 0 }}>Objectives</h1>
          <ul>
            {objectives.map((objective) => (
              <li
                key={objective.label}
                style={{
                  textDecoration: objective.completed
                    ? "line-through"
                    : undefined,
                  fontFamily: fontName("kgBrokenVesselsSketch"),
                }}
              >
                {objective.label}
              </li>
            ))}
          </ul>
        </div>
      );
    });
  }
}
