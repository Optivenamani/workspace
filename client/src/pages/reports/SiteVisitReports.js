import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const SiteVisitReports = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // Get the token from local storage
    const token = localStorage.getItem("token");

    const handleDownload = async () => {
        const response = await axios.get('https://workspace.optiven.co.ke/api/site-visit-requests/download-pdf/download', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                startDate,
                endDate,
            },
            responseType: 'blob',
        });

        // Create a blob from the PDF stream
        const file = new Blob([response.data], {
            type: 'application/pdf',
        });

        // Create a link and click it to trigger the download
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'site_visit_info.pdf';
        link.click();
    };

    return (
        <Sidebar>
            <div className="hero min-h-screen">
                <div className="form-control w-full max-w-xs">
                    <div className="flex flex-col justify-center">
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
                        <button className='btn btn-outline' onClick={handleDownload}>Download PDF</button>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default SiteVisitReports;
