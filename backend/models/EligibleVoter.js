import { DataTypes } from "sequelize";
import db from "./../db.js";
import User from "./User.js";
import Group from "./Group.js";

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
    voted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
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
