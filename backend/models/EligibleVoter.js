import { DataTypes } from "sequelize";
import db from "./../db.js";
import User from "./User.js";

//Sequelize Model for EligibleVoters Table
const EligibleVoter = db.define(
  "EligibleVoter",
  {
    eligible_voter_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    election_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "EligibleVoters",
    timestamps: false,
  }
);

// Associations
EligibleVoter.belongsTo(User, { foreignKey: "student_id" });

export default EligibleVoter;
