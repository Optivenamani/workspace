import React from "react";

const PositionInfo = ({ formData, setFormData, onNext }) => {
  return (
    <>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text font-bold">Position</span>
        </label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          placeholder="Enter the position"
          className="input input-bordered input-accent w-full max-w-xs"
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text font-bold">Interview Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered input-accent w-full max-w-xs"
          value={formData.interviewDate}
          onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
        />
      </div>
      <button
        onClick={onNext}
        className="btn btn-primary mt-4"
      >
        Next
      </button>
    </>
  );
};

export default PositionInfo;
