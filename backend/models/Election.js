import { DataTypes } from "sequelize";
import db from "./../db.js";
import Position from "./Position.js";
import EligibleVoter from "./EligibleVoter.js";

//Sequelize Model for Elections Table
const Election = db.define(
  "Election",
  {
    election_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    accepting_responses: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    use_startdate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    use_enddate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "Elections",
    timestamps: false,
  }
);

//Assosiations
Election.hasMany(Position, { foreignKey: "election_id" });
Position.belongsTo(Election, { foreignKey: "election_id" });

Election.hasMany(EligibleVoter, { foreignKey: "election_id" });
EligibleVoter.belongsTo(Election, { foreignKey: "election_id" });

export default Election;
