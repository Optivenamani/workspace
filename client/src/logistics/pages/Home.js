import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Sidebar from "../components/Sidebar";
import bus from "../../assets/media/home.jpg";
import {
  fetchActiveSiteVisits,
  selectActiveSiteVisits,
} from "../../redux/logistics/features/siteVisit/siteVisitSlice";
import { fetchNotifications } from "../../redux/logistics/features/notifications/notificationsSlice";

const Home = () => {
  const [canBookSiteVisit, setCanBookSiteVisit] = useState(true);
  const [latestNotification, setLatestNotification] = useState(null);
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

  useEffect(() => {
    dispatch(fetchActiveSiteVisits());

    dispatch(fetchNotifications())
      .unwrap()
      .then((notificationsData) => {
        const latestNotification = notificationsData.notifications[0];
        setLatestNotification(latestNotification); // Store the latest notification in state
        if (
          latestNotification.type === "approved" &&
          moment().diff(latestNotification.timestamp, "hours") > 24
        ) {
          setCanBookSiteVisit(false);
        }
      });
  }, [dispatch]);

  const hasActiveSiteVisit =
    siteVisitStatus === "succeeded" && activeVisits.length > 0;

  const shouldDisableSiteVisitButton = () => {
    if (
      latestNotification &&
      latestNotification.type === "approved" &&
      moment().diff(latestNotification.timestamp, "hours") > 24
    ) {
      return true;
    }

    if (hasActiveSiteVisit) {
      for (const visit of activeVisits) {
        if (
          visit.status === "in_progress" ||
          visit.status === "complete" ||
          visit.status === "reviewed"
        ) {
          return true;
        }
      }
    }

    return false;
  };

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
                      disabled={
                        !canBookSiteVisit || shouldDisableSiteVisitButton()
                      }
                      className={`mt-4 inline-block w-full bg-primary py-4 text-sm font-bold uppercase tracking-widest text-white ${
                        !canBookSiteVisit || shouldDisableSiteVisitButton()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Book a Site Visit
                    </button>

                    {activeVisits.map((visit, index) => (
                      <div key={index}>
                        {visit.status === "approved" &&
                          latestNotification?.type === "approved" &&
                          moment().diff(latestNotification.timestamp, "hours") >
                            24 && (
                            <p className="mt-2 text-red-600 font-bold italic">
                              Please wait until your approved site visit is
                              completed or canceled before booking a new one.
                            </p>
                          )}
                        {visit.status === "in_progress" && (
                          <p className="mt-2 text-red-600 font-bold italic">
                            The assigned driver is en route for your site visit.
                            You will receive an email notification when the
                            visit is marked as complete.
                          </p>
                        )}
                        {visit.status === "complete" && (
                          <p className="mt-2 text-red-600 font-bold italic">
                            Your previous site visit has been marked as
                            complete by the driver. To book a new visit, please{" "}
                            <Link
                              to="/notifications"
                              className="btn bg-blue-500 btn-sm border-none"
                            >
                              complete the survey
                            </Link>{" "}
                            for the previous visit.
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
