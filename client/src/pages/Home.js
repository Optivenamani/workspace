import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import bus from "../assets/media/home.jpg";
import { selectActiveSiteVisits } from "../redux/features/siteVisit/siteVisitSlice";

const Home = () => {
  const activeSiteVisits = useSelector(selectActiveSiteVisits);

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

  const isMarketer = accessRole === `113`;
  const isAdmin =
    accessRole === `112#700#117#116` ||
    accessRole === `112#770#303#304#305#116` ||
    accessRole === `112#114#700`;

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
                <h2 className="mt-6 font-black">
                  <span className="text-4xl sm:text-5xl lg:text-7xl">
                    {greeting} {firstName}.
                  </span>
                </h2>
                {(isMarketer || isAdmin) && (
                  <button
                    onClick={() => navigate("/book-site-visit")}
                    disabled={activeSiteVisits.length > 0}
                    className={`mt-8 inline-block w-full bg-primary py-4 text-sm font-bold uppercase tracking-widest text-white ${activeSiteVisits.length > 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                      }`}
                  >
                    Book a Site Visit
                  </button>
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
