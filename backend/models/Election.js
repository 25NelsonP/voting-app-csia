import { DataTypes } from "sequelize";
import db from "./../db.js";
import Position from "./Position.js";
import EligibleVoter from "./EligibleVoter.js";
import moment from "moment";

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

//Check if the election is currently accepting responses
Election.prototype.isCurrentlyAcceptingResponses = async function () {
  const now = moment(); // Get the current date and time

  // Check if the election has started and not ended
  const hasStarted = this.use_startdate
    ? moment(this.start_date).isBefore(now)
    : true;

  const hasNotEnded = this.use_enddate
    ? moment(this.end_date).isAfter(now)
    : true;

  const currentlyAccepting = hasStarted && hasNotEnded;

  // Check if either use_startdate or use_enddate is being used
  const usingStartOrEndDate = this.use_startdate || this.use_enddate;

  // Update the accepting_responses field in the database if needed
  // Only update if using start date or end date
  if (usingStartOrEndDate && this.accepting_responses !== currentlyAccepting) {
    this.accepting_responses = currentlyAccepting;
    await this.save(); // Save the updated state to the database
  }

  // Return the value of currentlyAccepting if using start or end date,
  // otherwise return the existing value of accepting_responses
  return usingStartOrEndDate ? currentlyAccepting : this.accepting_responses;
};

//Assosiations
Election.hasMany(Position, { foreignKey: "election_id" });
Position.belongsTo(Election, { foreignKey: "election_id" });

Election.hasMany(EligibleVoter, { foreignKey: "election_id" });
EligibleVoter.belongsTo(Election, { foreignKey: "election_id" });

export default Election;
