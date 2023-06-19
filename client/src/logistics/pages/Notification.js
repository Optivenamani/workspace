import React, { useCallback, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { formatDistanceToNowStrict } from "date-fns";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchNotifications,
  setNotifications as updateNotifications,
  addNotification,
} from "../../redux/logistics/features/notifications/notificationsSlice";
import huh from "../../assets/app-illustrations/Shrug-bro.png";

const Notifications = () => {
  const notificationsArray = useSelector(
    (state) => state.notifications.notifications.notifications
  );

  const token = useSelector((state) => state.user.token);

  const dispatch = useDispatch();

  const markAsRead = useCallback(
    async (notificationId) => {
      if (!notificationId) {
        return;
      }

      try {
        const response = await fetch(
          `https://workspace.optiven.co.ke/api/notifications/${notificationId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isRead: true }),
          }
        );

        if (response.ok) {
          // Update the notification's read status in the local state
          dispatch(
            updateNotifications(
              notificationsArray.map((notification) =>
                notification.id === notificationId
                  ? { ...notification, isRead: true }
                  : notification
              )
            )
          );
          // console.log(`Notification of ID ${notificationId} has been marked as read`);
        } else {
          console.error("Error marking notification as read:", response.status);
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [dispatch, notificationsArray, token]
  );

  const markAllAsRead = useCallback(async () => {
    if (!Array.isArray(notificationsArray)) return;

    const unreadNotifications = notificationsArray.filter(
      (notification) => !notification.isRead
    );

    const markReadPromises = unreadNotifications.map((notification) =>
      markAsRead(notification.id)
    );

    await Promise.all(markReadPromises);
  }, [markAsRead, notificationsArray]);

  useEffect(() => {
    const markAllAsReadOnView = async () => {
      if (!Array.isArray(notificationsArray)) return;

      const unreadNotifications = notificationsArray.filter(
        (notification) => !notification.isRead
      );

      const markReadPromises = unreadNotifications.map(async (notification) => {
        await markAsRead(notification.id);
      });

      await Promise.all(markReadPromises);
    };

    markAllAsReadOnView();
  }, [notificationsArray, markAsRead]);

  useEffect(() => {
    return () => {
      (async () => {
        await markAllAsRead();
      })();
    };
  }, [markAllAsRead]);

  // Fetch notifications and listen for socket events
  useEffect(() => {
    const socket = io("https://workspace.optiven.co.ke");

    // Fetch notifications only if there are none currently
    if (!notificationsArray || notificationsArray.length === 0) {
      dispatch(fetchNotifications());
    }

    const handleSiteVisitRejected = (notification) => {
      // Update the notifications state
      dispatch(
        addNotification({
          type: "rejected",
          message: "Your site visit request has been rejected :(",
          remarks: notification.remarks,
          timestamp: new Date(notification.timestamp),
          isRead: false,
        })
      );
    };

    const handleSiteVisitApproved = (notification) => {
      // Update the notifications state
      dispatch(
        addNotification({
          type: "approved",
          message: "Your site visit request has been approved!",
          site_visit_id: notification.site_visit_id,
          remarks: notification.remarks,
          timestamp: new Date(notification.timestamp),
          isRead: false,
        })
      );
    };

    const handleSiteVisitCompleted = (notification) => {
      // Update the notifications state
      dispatch(
        addNotification({
          type: "completed",
          message: "A site visit has been completed. Please fill the survey",
          site_visit_id: notification.site_visit_id,
          timestamp: new Date(notification.timestamp),
          isRead: false,
        })
      );
    };

    const handleSiteVisitCancelled = (notification) => {
      // Update the notifications state
      dispatch(
        addNotification({
          type: "cancelled",
          message: "A site visit has been cancelled. Please fill the survey",
          site_visit_id: notification.site_visit_id,
          timestamp: new Date(notification.timestamp),
          isRead: false,
        })
      );
    };

    socket.on("siteVisitRejected", handleSiteVisitRejected);
    socket.on("siteVisitApproved", handleSiteVisitApproved);
    socket.on("siteVisitCompleted", handleSiteVisitCompleted);
    socket.on("siteVisitCancelled", handleSiteVisitCancelled);

    return () => {
      socket.off("siteVisitRejected", handleSiteVisitRejected);
      socket.off("siteVisitApproved", handleSiteVisitApproved);
      socket.off("siteVisitCompleted", handleSiteVisitCompleted);
      socket.off("siteVisitCancelled", handleSiteVisitCancelled);

      // Disconnect the socket
      socket.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, notificationsArray]);

  const notificationIcons = {
    rejected: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-8 w-8 mr-2"
        color="red"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    approved: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-9 w-9 mr-2"
        color="blue"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    completed: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-9 w-9 mr-2"
        color="green"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    cancelled: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-2">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <circle cx="12" cy="12" r="9" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle>
          <path d="M12 8V13" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          <path d="M12 16V16.0001" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
        </g>
      </svg>

    ),
  };

  return (
    <>
      <Sidebar>
        <div className="flex flex-col mb-10">
          <div className="mt-6 mb-6 flex justify-center">
            <h1 className="text-2xl font-bold text-gray-800 uppercase">
              Notifications
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center px-3">
            {Array.isArray(notificationsArray) ? (
              <div className="flex flex-col space-y-4">
                {notificationsArray && notificationsArray.length > 0 ? (
                  notificationsArray.map((notification, index) => (
                    <div
                      key={index}
                      className={`bg-white shadow-lg rounded-3xl p-4 flex items-center justify-between ${!notification.isRead ? "bg-blue-100" : ""
                        }`}
                    >
                      <div className="flex items-center">
                        {notificationIcons[notification.type]}
                        <div>
                          <p className="text-gray-800 font-medium">
                            {notification.message}
                          </p>
                          <div className="text-gray-500 text-sm flex justify-between">
                            <p className="text-sm">
                              Remarks: {notification.remarks}
                            </p>
                          </div>
                          <p className="text-sm italic">
                            {notification.timestamp && (
                              <>
                                {formatDistanceToNowStrict(
                                  new Date(notification.timestamp)
                                )}{" "}
                                ago
                              </>
                            )}
                          </p>

                          {notification.type === "completed" && (
                            <Link
                              to={`/survey/${notification.site_visit_id}`}
                              className="text-primary underline text-sm mt-2"
                            >
                              Complete the survey
                            </Link>
                          )}

                          {notification.type === "approved" && (
                            <Link
                              to={`/sv-details/${notification.site_visit_id}`}
                              className="text-secondary underline text-sm mt-2"
                            >
                              View site visit details
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center mt-20">
                      <img src={huh} alt="huh" className="lg:w-96" />
                      <h1 className="font-bold text-center">
                        No notifications. Check back later.
                      </h1>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="flex flex-col items-center mt-20">
                  <img src={huh} alt="huh" className="lg:w-96" />
                  <h1 className="font-bold text-center">
                    Nothing to see here.
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default Notifications;
