import React from "react";
import Sidebar from "../components/Sidebar";

const FoundationHome = () => {
  return (
    <Sidebar>
        <section>
          <div className="relative py-16 lg:flex lg:pt-8 lg:flex-col lg:pb-0 h-screen">
            <div className="inset-y-0 top-0 right-0 z-0 w-full max-w-xl px-4 mx-auto md:px-0 lg:pr-0 lg:mb-0 lg:mx-0 lg:w-7/12 lg:max-w-full lg:absolute xl:px-0">
              <svg
                className="absolute left-0 hidden h-full text-white transform -translate-x-1/2 lg:block"
                viewBox="0 0 100 100"
                fill="currentColor"
                preserveAspectRatio="none slice"
              >
                <path d="M50 0H100L50 100H0L50 0Z" />
              </svg>
              <img
                className="object-cover w-full h-56 rounded shadow-lg lg:rounded-none lg:shadow-none md:h-96 lg:h-full"
                src={require("../../assets/media/IMG_0343 (1).jpg")}
                alt=""
              />
            </div>
            <div className="relative flex flex-col items-start w-full max-w-xl px-4 mx-auto md:px-0 lg:px-8 lg:max-w-screen-xl">
              <div className="mb-16 lg:mb-40 lg:max-w-lg lg:pr-5">
                <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400"></p>
                <h2 className="mb-5 font-sans text-3xl tracking-tight text-white sm:text-4xl sm:leading-none lg:text-5xl lg:leading-tight text-center">
                {" "}
                {/* Increased text size */}
                Optiven <br></br>
              </h2>
                <h2 className="mb-5 font-sans text-3xl tracking-tight text-gray-900 sm:text-4xl sm:leading-none lg:text-5xl lg:leading-tight text-center">
                  {" "}
                  {/* Increased text size */}
                  Optiven{" "}
                <span className="sometimes-italic tracking-wider font-thin">
                  Foundation.
                </span> <br></br>
                💝🤲
                </h2>
               
                <p className="pr-5 mb-5 text-base text-gray-700 md:text-lg text-center">
                  Access the menu from the <u>sidebar</u> on the{" "}
                  <u> top left</u> to get started.
                </p>
                <div className="text-center">
                  <a
                    href="/"
                    className="text-center inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-black transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                  >
                    Back to Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
    </Sidebar>
  );
};

export default FoundationHome;
