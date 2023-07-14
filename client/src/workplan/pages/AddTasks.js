import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const AddTasks = () => {
  const token = useSelector((state) => state.user.token);
  const { id } = useParams();
  const workplanId = id;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [status, setStatus] = useState("pending"); // Add status state
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const handleInputChange = (event, taskIndex, field) => {
    const { value } = event.target;
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        [field]: value,
      };
      return updatedTasks;
    });
  };
  const handleAddAnotherTask = () => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        workplan_id: workplanId,
        title: "",
        description: "",
        time: "",
        date: "",
        expected_output: "",
        status
      },
    ]);
  };

  const handleRemoveTask = (index) => {
    const tasksCopy = [...tasks];
    tasksCopy.splice(index, 1);
    setTasks(tasksCopy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateTasks();
    if (!isValid) {
      return;
    }
    setLoading(true);
    setError(""); // Clear any previous errors

    console.log("workplanId:", workplanId);
    console.log("token:", token);
    console.log("tasks:", tasks);

    try {
      const tasksData = [
       
        {
          workplan_id: workplanId,
          title,
          description,
          time,
          date,
          expected_output: expectedOutput,
          status: "pending",
        },
        ...tasks,
      ];

      const response = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tasksData),
      });

      if (!response.ok) {
        throw new Error("Task creation failed");
      }

      const result = await response.json();
      console.log(result);

      setLoading(false);
      toast.success("Tasks created successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset form fields
      setTitle("");
      setDescription("");
      setTime("");
      setDate("");
      setExpectedOutput("");

      setTasks([]);

      // Perform any additional actions or navigate to another page if needed
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const validateTasks = () => {
    for (const task of tasks) {
      if (
        !task.title ||
        !task.description ||
        !task.time ||
        !task.date ||
        !task.expected_output
      ) {
        setError("Please fill in all required fields.");
        return false;
      }
    }
    setError("");
    return true;
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="flex-1 flex flex-col lg:flex-row"></div>
      <div className="hidden lg:relative lg:block lg:w-1/2 lg:p-12">
        <div className="block text-white text-4xl"></div>
      </div>
      <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-5 lg:px-16 lg:py-8 xl:col-span-6">
        <div className="max-w-xl lg:max-w-3xl">
          <div className="relative -mt-16 block lg:hidden"></div>
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link to="/workplan-home">Home</Link>
              </li>
              <li>Add Tasks</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="label">
                  <span className="label-text font-bold">Title</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  id="title"
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="description" className="label">
                  <span className="label-text font-bold">Description</span>
                </label>
                <textarea
                  className="input input-bordered w-full"
                  id="description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label htmlFor="time" className="label">
                  <span className="label-text font-bold">Time</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  id="time"
                  type="time"
                  placeholder="Enter time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="date" className="label">
                  <span className="label-text font-bold">Date</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  id="date"
                  type="date"
                  placeholder="Enter date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="expectedOutput" className="label">
                  <span className="label-text font-bold">Expected Output</span>
                </label>
                <textarea
                  className="input input-bordered w-full"
                  id="expectedOutput"
                  placeholder="Enter expected output"
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                ></textarea>
              </div>
            </div>
            {tasks.map((task, index) => (
              <div key={index} className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <label htmlFor={`title_${index}`} className="label">
                    <span className="label-text font-bold">Title</span>
                  </label>
                  <input
                    type="text"
                    id={`title_${index}`}
                    name={`task_${index}_title`}
                    value={task.title}
                    onChange={(event) =>
                      handleInputChange(event, index, "title")
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`description_${index}`} className="label">
                    <span className="label-text font-bold">Description</span>
                  </label>
                  <textarea
                    id={`description_${index}`}
                    name={`task_${index}_description`}
                    value={task.description}
                    onChange={(event) =>
                      handleInputChange(event, index, "description")
                    }
                    className="input input-bordered w-full"
                    required
                  ></textarea>
                </div>
                <div>
                  <label htmlFor={`time_${index}`} className="label">
                    <span className="label-text font-bold">Time</span>
                  </label>
                  <input
                    type="time"
                    id={`time_${index}`}
                    name={`task_${index}_time`}
                    value={task.time}
                    onChange={(event) =>
                      handleInputChange(event, index, "time")
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`date_${index}`} className="label">
                    <span className="label-text font-bold">Date</span>
                  </label>
                  <input
                    type="date"
                    id={`date_${index}`}
                    name={`task_${index}_date`}
                    value={task.date}
                    onChange={(event) =>
                      handleInputChange(event, index, "date")
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`expectedOutput_${index}`} className="label">
                    <span className="label-text font-bold">
                      Expected Output
                    </span>
                  </label>
                  <textarea
                    id={`expectedOutput_${index}`}
                    name={`task_${index}_expectedOutput`}
                    value={task.expected_output}
                    onChange={(event) =>
                      handleInputChange(event, index, "expected_output")
                    }
                    className="input input-bordered w-full"
                    required
                  ></textarea>
                </div>
                {tasks.length > 0 && (
                  <div className="col-span-2 mt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(index)}
                      className="btn btn-error"
                    >
                      Remove Task
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-end mt-8">
              <div>{error && <p className="text-red-500">{error}</p>}</div>
              <div>
                <button
                  onClick={handleAddAnotherTask}
                  className="btn btn-primary btn-outline"
                >
                  Add Another Task
                </button>
              </div>
              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Task(s)"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddTasks;
