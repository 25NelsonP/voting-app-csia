import { DataTypes } from "sequelize";
import db from "./../db.js";

//Sequelize Model for Groups Table
const Group = db.define(
  "Group",
  {
    group_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "Groups",
    timestamps: false,
  }
);

export default Group;
