import { DataTypes } from "sequelize";
import db from "./../db.js";

const Vote = db.define(
  "Vote",
  {
    vote_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    election_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    voter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    candidates: {
      type: DataTypes.JSON,
      allowNull: false,
      //left: positionId, right: candidateId
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "Votes",
    timestamps: false,
  }
);

export default Vote;
