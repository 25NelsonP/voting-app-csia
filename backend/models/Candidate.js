import { DataTypes } from "sequelize";
import db from "./../db.js";

//Sequelize Model for Candidates Table
const Candidate = db.define(
  "Candidate",
  {
    candidate_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    position_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    img_url: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    tableName: "Candidates",
    timestamps: false,
  }
);

export default Candidate;
