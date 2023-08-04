import React from "react";

const IntervieweeInfo = ({ formData, setFormData, onNext, onPrevious }) => {
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...formData.interviewees];
    list[index][name] = value;
    setFormData({ ...formData, interviewees: list });
  };

  const handleAddInterviewee = () => {
    setFormData({
      ...formData,
      interviewees: [
        ...formData.interviewees,
        { name: "", email: "", phone: "", interviewTime: "" },
      ],
    });
  };

  const handleRemoveInterviewee = (index) => {
    const list = [...formData.interviewees];
    list.splice(index, 1);
    setFormData({ ...formData, interviewees: list });
  };


  return (
    <>
      <div className="form-control">
        <h2 className="text-2xl font-bold mb-4">Interviewees</h2>
        <div className="flex gap-4">
          {formData.interviewees.map((interviewee, index) => (
            <div key={index} className="flex flex-col w-full">
              <label className="label">
                <span className="label-text font-bold">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={interviewee.name}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Enter name"
                className="input input-bordered"
              />

              <label className="label">
                <span className="label-text font-bold">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={interviewee.email}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Enter email"
                className="input input-bordered"
              />

              <label className="label">
                <span className="label-text font-bold">Phone</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={interviewee.phone}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Enter phone"
                className="input input-bordered"
              />

              <label className="label">
                <span className="label-text font-bold">Interview Time</span>
              </label>
              <input
                type="time"
                name="interviewTime"
                value={interviewee.interviewTime}
                onChange={(e) => handleInputChange(e, index)}
                className="input input-bordered"
              />

              {formData.interviewees.length > 1 && (
                <div className="mt-6">
                  <button
                    onClick={() => handleRemoveInterviewee(index)}
                    className="btn text-white btn-error"
                  >
                    Remove Interviewee
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleAddInterviewee}
          className="btn btn-primary btn-outline mt-4"
        >
          Add Another Interviewee
        </button>

        <div className="flex justify-center mt-5">
          <button
            onClick={onPrevious}
            className="mx-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            Previous
          </button>

          <button
            onClick={onNext}
            disabled={!formData.interviewees.every((interviewee) => interviewee.name && interviewee.email)}
            className="mx-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default IntervieweeInfo;
