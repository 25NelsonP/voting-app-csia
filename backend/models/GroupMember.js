import { DataTypes } from "sequelize";
import db from "./../db.js";
import User from "./User.js";
import Group from "./Group.js";

const GroupMember = db.define(
  "GroupMember",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date_added: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "Group_Members",
    timestamps: false,
  }
);

GroupMember.belongsTo(User, { foreignKey: "member_id" });
User.hasMany(GroupMember, { foreignKey: "member_id" });

GroupMember.belongsTo(Group, { foreignKey: "group_id" });
Group.hasMany(GroupMember, { foreignKey: "group_id" });

export default GroupMember;
