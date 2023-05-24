import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const SiteVisitsSummary = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [office, setOffice] = useState("");
    // Get the token from local storage
    const token = localStorage.getItem("token");
    const accessRole = useSelector((state) => state.user.accessRole);

    const isRachel = (accessRole === `113#114`);
    const isJoe = (accessRole === `113#115`);
    const isAdmin =
        (accessRole === `112#700#117#116` ||
            accessRole === `112#305#117#116#113#770` ||
            accessRole === `112#114#700`);
    const isHOL = (accessRole === `headOfLogistics`);
    const isAnalyst = (accessRole === `112#420#69`);
    const isOperations =
        (accessRole === `112#116#303#305` ||
            accessRole === `112#304` ||
            accessRole === `112#305`);

    const handleDownload = async () => {
        if (!startDate || !endDate) {
            toast.error("Both dates must be chosen before submitting the form.", {
                position: "top-center",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (endDate < startDate) {
            toast.error("End date cannot be before start date.", {
                position: "top-center",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (office === "") {
            toast.error("You need to select a region.", {
                position: "top-center",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        try {
            const response = await axios.get(
                "https://workspace.optiven.co.ke/api/site-visit-requests/download-pdf/site-visit-summary",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        startDate,
                        endDate,
                        office,
                    },
                    responseType: "blob",
                }
            );

            console.log(startDate, endDate, office);

            // Create a blob from the PDF stream
            const file = new Blob([response.data], {
                type: "application/pdf",
            });

            // Create a link and click it to trigger the download
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = `Site Visit Summary ${office}.pdf`;
            link.click();

            toast.success("PDF downloaded successfully.", {
                position: "top-center",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error downloading PDF:", error);
            toast.error(
                "An error occurred while downloading the PDF. Please try again later.",
                {
                    position: "top-center",
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );
        }
    };

    return (
        <Sidebar>
            <div className="hero min-h-screen">
                <div className="form-control w-full max-w-xs">
                    <div className="flex flex-col justify-center">
                        <h1 className="font-bold text-lg">SITE VISITS SUMMARY REPORTS</h1>
                        <label className="label">
                            <span className="label-text font-bold">Start Date</span>
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            className="input input-bordered w-full max-w-xs mb-4"
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <label className="label">
                            <span className="label-text font-bold">End Date</span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered w-full max-w-xs mb-4"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <label className="label">
                            <span className="label-text font-bold">Region</span>
                        </label>
                        <select
                            className="select select-bordered w-full max-w-xs"
                            value={office}
                            onChange={(e) => setOffice(e.target.value)}
                        >
                            <option value="">Select a region</option>
                            {(isAdmin || isRachel || isHOL || isAnalyst || isOperations) && <option value="HQ Ofice (ABSA)">HQ Office (ABSA Towers)</option>}
                            {(isAdmin || isJoe || isHOL || isAnalyst || isOperations) && <option value="Global Office(KAREN)">
                                Global Office (Karen)
                            </option>}
                            {(isAdmin || isRachel || isHOL || isAnalyst || isOperations) && <option value="Nakuru">Nakuru</option>}
                            {(isAdmin || isRachel || isHOL || isAnalyst || isOperations) && <option value="Kitengela">Kitengela</option>}
                            {(isAdmin || isRachel || isHOL || isAnalyst || isOperations) && <option value="Nanyuki">Nanyuki</option>}
                        </select>
                        <button className="btn btn-outline mt-3" onClick={handleDownload}>
                            Download PDF Report
                        </button>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default SiteVisitsSummary;
