import React from "react";

const FormatDate = ({ dateString }) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const date = new Date(dateString);
  const fdate = `${date.toLocaleDateString(
    "en-GB",
    options
  )} | ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return <span>{fdate}</span>;
};

export default FormatDate;
