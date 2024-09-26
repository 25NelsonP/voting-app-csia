import React from "react";
import FormatDate from "./FormatDate";
import { Link } from "react-router-dom";

//election card for user side display
const ElectionCard = ({ election }) => {
  return (
    <>
      <div>
        <h3 className="font-semibold text-sm sm:text-base md:text-lg">
          {election.title}
        </h3>
        {election.use_startdate &&
        new Date(election.start_date) > new Date() ? (
          <p className="text-xs sm:text-sm">
            Starting : {<FormatDate dateString={election.start_date} />}
          </p>
        ) : (
          <></>
        )}
        {election.use_enddate && new Date(election.end_date) > new Date() ? (
          <p className="text-xs sm:text-sm">
            Closing : {<FormatDate dateString={election.end_date} />}
          </p>
        ) : (
          <></>
        )}
      </div>

      {election.accepting_responses ? (
        <Link
          to={`/vote/${election.election_id}`}
          className="text-white bg-blue-500 hover:bg-blue-600 py-1 px-3 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm"
        >
          View
        </Link>
      ) : (
        <></>
      )}
    </>
  );
};

export default ElectionCard;
