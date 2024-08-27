import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import FormEditHeader from "../../../components/FormEditHeader";
import LoadingScreen from "../../../components/LoadingScreen";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const electionId = location.pathname.split("/")[4];
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    use_startdate: false,
    use_enddate: false,
    accepting_responses: false,
    start_date: "",
    end_date: "",
  });
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/elections/${electionId}`
        );

        const adjustTime = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          const offset = -date.getTimezoneOffset();
          const adjustedDate = new Date(date.getTime() + offset * 60000);
          return adjustedDate.toISOString().slice(0, 16);
        };

        const startDate = adjustTime(response.data.start_date);
        const endDate = adjustTime(response.data.end_date);

        setFormState({
          use_startdate: response.data.use_startdate,
          use_enddate: response.data.use_enddate,
          accepting_responses: response.data.accepting_responses,
          start_date: startDate,
          end_date: endDate,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching election data:", error);
        setLoading(false);
      }
    };

    fetchElection();
  }, [electionId]);

  const validateDates = (newFormState) => {
    const { start_date, end_date, use_startdate, use_enddate } = newFormState;
    if (
      use_startdate &&
      use_enddate &&
      new Date(end_date) <= new Date(start_date)
    ) {
      setDateError(true);
      return false;
    }
    setDateError(false);
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newFormState = {
      ...formState,
      [name]: type === "checkbox" ? checked : value,
    };

    validateDates(newFormState);
    setFormState(newFormState);
  };

  const handleSave = async () => {
    if (!validateDates(formState)) {
      alert("End date must be after the start date.");
      return;
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/elections/${electionId}`,
        formState
      );
      alert("Settings saved successfully.");
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this election?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/elections/${electionId}`
        );
        navigate("/admin"); // Redirect to elections list page
      } catch (error) {
        console.error("Error deleting election:", error);
      }
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <FormEditHeader electionId={electionId} />
      <main className="flex flex-col items-center p-3">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="mb-4 shadow-md rounded-md p-3 md:w-1/3 bg-gray-100">
          <div className="mb-4 flex justify-between">
            <label className="text-lg font-bold block mb-2">
              Accepting Votes
            </label>
            <input
              type="checkbox"
              name="accepting_responses"
              checked={formState.accepting_responses}
              disabled={formState.use_enddate || formState.use_startdate}
              onChange={handleChange}
              className="ml-3 h-6 w-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div className="mb-4 flex flex-col">
            <label className="text-lg font-bold block mb-2">Start Date</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="use_startdate"
                checked={formState.use_startdate}
                onChange={handleChange}
                className="mr-3 h-6 w-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <input
                type="datetime-local"
                name="start_date"
                value={formState.start_date}
                onChange={handleChange}
                disabled={!formState.use_startdate}
                className={`border rounded p-2 w-full ${
                  dateError ? "border-red-500" : ""
                }`}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-lg font-bold block mb-2">End Date</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="use_enddate"
                checked={formState.use_enddate}
                onChange={handleChange}
                className="mr-3 h-6 w-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <input
                type="datetime-local"
                name="end_date"
                value={formState.end_date}
                onChange={handleChange}
                disabled={!formState.use_enddate}
                className={`border rounded p-2 w-full ${
                  dateError ? "border-red-500" : ""
                }`}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
