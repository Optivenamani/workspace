import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import bus from "../../assets/media/home.jpg";
import {
  fetchActiveSiteVisits,
  selectActiveSiteVisits,
} from "../../redux/logistics/features/siteVisit/siteVisitSlice";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const firstName = user.fullnames
    ? user.fullnames.trim().split(" ")[0]
    : "user";

  const now = new Date();
  const hour = now.getHours();
  let greeting;

  if (hour < 12) {
    greeting = "Good morning,";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon,";
  } else {
    greeting = "Good evening,";
  }

  const navigate = useNavigate();

  const accessRole = useSelector((state) => state.user.accessRole);

  const accessRoles = accessRole.split("#");

  const isMarketer = accessRoles.includes("113");
  const isAdmin = accessRoles.includes("logisticsAdmin");

  const activeVisits = useSelector(selectActiveSiteVisits);
  const siteVisitStatus = useSelector((state) => state.siteVisit.status);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchActiveSiteVisits());
  }, [dispatch]);

  const hasActiveSiteVisit =
    siteVisitStatus === "succeeded" && activeVisits.length > 0;

  return (
    <>
      <Sidebar>
        <div className="flex justify-center items-center mt-20">
          <div className="w-2/3">
            <div className="overflow-hidden rounded-lg shadow-2xl md:grid md:grid-cols-3">
              <img
                alt="Bus"
                src={bus}
                className="h-32 w-full object-cover md:h-full"
              />

              <div className="flex flex-col justify-center p-4 text-start sm:p-6 md:col-span-2 lg:p-8">
                <h2 className="mt-6 text-4xl sm:text-5xl lg:text-7xl lausanne font-bold">
                  {greeting}{" "}
                  <span className="sometimes-italic font-thin">
                    {firstName}.
                  </span>
                </h2>
                {(isMarketer || isAdmin) && (
                  <>
                    <button
                      onClick={() => navigate("/book-site-visit")}
                      disabled={hasActiveSiteVisit}
                      className={`mt-4 inline-block w-full bg-primary py-4 text-sm font-bold uppercase tracking-widest text-white ${
                        hasActiveSiteVisit
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Book a Site Visit
                    </button>
                    {activeVisits.map((visit, index) => (
                      <div key={index}>
                        {visit.status === "approved" && (
                          <p className="mt-2 text-red-600 font-bold italic">
                            Your recent site visit request has been approved,
                            you will have to wait until it's completed, or
                            cancel it on your end, to be able to book a new one.
                          </p>
                        )}
                        {visit.status === "in_progress" && (
                          <p className="mt-2 text-red-600 font-bold italic">
                            The driver assigned to your site visit has started
                            the trip. The site visit status is now in progress.
                            You will get an email notification when the driver
                            marks the site visit as complete on their end.
                          </p>
                        )}
                        {visit.status === "complete" && (
                          <p className="mt-2 text-red-600 font-bold italic">
                            The driver assigned to your previous site visit has
                            marked the site visit as complete. You are now
                            required to{" "}
                            <Link
                              to="/notifications"
                              className="underline text-green-400"
                            >
                              FILL THE SURVEY
                            </Link>{" "}
                            to mark it as complete on your end and be able to
                            book a new site visit.
                          </p>
                        )}
                      </div>
                    ))}
                  </>
                )}

                <button
                  onClick={() => navigate("/request-vehicle")}
                  className="mt-4 inline-block w-full bg-neutral py-4 text-sm font-bold uppercase tracking-widest text-white"
                >
                  Request for a Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default Home;
