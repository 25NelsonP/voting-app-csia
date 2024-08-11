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
      allowNull: true,
    },
    voter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    candidates: {
      type: DataTypes.JSON,
      allowNull: true,
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
