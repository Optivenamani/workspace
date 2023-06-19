import React, { useState, useEffect } from 'react'
import Sidebar from "../../components/Sidebar";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import formatTime from '../../../utils/formatTime';
import formatDate from '../../../utils/formatDate';

const ApprovedSVDetails = () => {
    const [siteVisit, setSiteVisit] = useState(null);
    const token = useSelector((state) => state.user.token);
    const { id } = useParams();

    useEffect(() => {
        fetch(`https://workspace.optiven.co.ke/api/site-visit-requests/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setSiteVisit(data))
            .catch((error) => console.error('Error:', error));
    }, [id, token]);

    return (
        <Sidebar>
            {siteVisit ? (
                <section className="bg-gray-900 text-white h-screen">
                    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
                        <div className="mx-auto max-w-lg text-center w-full">
                            <h2 className="text-3xl font-extrabold sm:text-4xl uppercase my-4">Your Site Visit Info:</h2>
                            <p><strong>Site Name:</strong> {siteVisit.site_name}</p>
                            <p><strong>Driver Name:</strong> {siteVisit.driver_name}</p>
                            <p><strong>Vehicle Registration:</strong> {siteVisit.vehicle_name}</p>
                            <p><strong>Pickup Time:</strong> {formatTime(siteVisit.pickup_time)}</p>
                            <p><strong>Pickup Date:</strong> {formatDate(siteVisit.pickup_date)}</p>
                        </div>
                        <div className="mx-auto w-full">
                            <h2 className="text-3xl font-extrabold sm:text-4xl text-center my-4">YOUR CLIENT(S) INFO:</h2>
                        </div>
                        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {siteVisit.clients.map((client, index) => (
                                <div key={index} className="text-center block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10">
                                    <h2 className="mt-4 text-xl font-bold text-white">{client.client_name.toUpperCase()}</h2>
                                    <p className="mt-1 text-sm text-gray-300">
                                        <strong>Email:</strong> {client.client_email}<br />
                                        <strong>Phone:</strong> {client.client_phone}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : (
                <p>Loading...</p>
            )}
        </Sidebar>
    )
}

export default ApprovedSVDetails
