import { DataTypes } from "sequelize";
import db from "./../db.js";
import Group from "./Group.js";
import Election from "./Election.js";

//Sequelize Model for EligibleGroups Table
const EligibleGroup = db.define(
  "EligibleGroup",
  {
    eligible_groupid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    election_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "EligibleGroups",
    timestamps: false,
  }
);

// Associations
EligibleGroup.belongsTo(Group, { foreignKey: "group_id" });

Election.hasMany(EligibleGroup, { foreignKey: "election_id" });
EligibleGroup.belongsTo(Election, { foreignKey: "election_id" });

export default EligibleGroup;
