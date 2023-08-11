import React from "react";

const PositionInfo = ({ formData, setFormData, onNext }) => {
  const validateForm = () => {
    return formData.position && formData.interviewDate;
  };

  return (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text font-bold">Position</span>
        </label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={(e) =>
            setFormData({ ...formData, position: e.target.value })
          }
          placeholder="Enter position"
          className="input input-bordered mb-4"
        />

        <label className="label">
          <span className="label-text font-bold">Interview Date</span>
        </label>
        <input
          type="date"
          name="interviewDate"
          value={formData.interviewDate}
          onChange={(e) =>
            setFormData({ ...formData, interviewDate: e.target.value })
          }
          className="input input-bordered"
        />

        <div className="flex justify-center mt-5">
          <button
            onClick={onNext}
            disabled={!validateForm()}
            className="mx-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default PositionInfo;