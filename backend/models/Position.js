import { DataTypes } from "sequelize";
import db from "./../db.js";
import Candidate from "./Candidate.js";

//Sequelize Model for Positions Table
const Position = db.define(
  "Position",
  {
    position_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    election_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "Positions",
    timestamps: false,
  }
);

//Associations
Position.hasMany(Candidate, { foreignKey: "position_id" });
Candidate.belongsTo(Position, { foreignKey: "position_id" });

export default Position;
