import React, { useCallback, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { formatDistanceToNowStrict, add } from "date-fns";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchNotifications,
  setNotifications as updateNotifications,
} from "../redux/features/notifications/notificationsSlice";

const Notifications = () => {
  const notificationsArray = useSelector(
    (state) => state.notifications.notifications.notifications
  );

  const token = useSelector((state) => state.user.token);

  const dispatch = useDispatch();

  const markAsRead = useCallback(
    async (notificationId) => {
      if (!notificationId) {
        console.error("Notification ID is missing or invalid");
        return;
      }

      console.log(notificationId);
      try {
        const response = await fetch(
          `http://209.38.246.14:8080/api/notifications/${notificationId}`,
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
    const socket = io("http://209.38.246.14:8080");

    // Fetch notifications
    dispatch(fetchNotifications());

    const handleSiteVisitRejected = (notification) => {
      console.log("Site visit rejected:", notification);
      // Update the notifications state
      dispatch(
        updateNotifications([
          {
            type: "rejected",
            message: "Your site visit request has been rejected",
            remarks: notification.remarks,
            timestamp: new Date(notification.timestamp),
            isRead: false,
          },
          ...notificationsArray,
        ])
      );
    };

    const handleSiteVisitApproved = (notification) => {
      console.log("Site visit approved:", notification);
      // Update the notifications state
      dispatch(
        updateNotifications([
          {
            type: "approved",
            message: "Your site visit request has been approved",
            remarks: notification.remarks,
            timestamp: new Date(notification.timestamp),
            isRead: false,
          },
          ...notificationsArray,
        ])
      );
    };

    const handleSiteVisitCompleted = (notification) => {
      console.log("Site visit completed:", notification);
      // Update the notifications state
      dispatch(
        updateNotifications([
          {
            type: "completed",
            message: "A site visit has been completed. Please fill the survey",
            site_visit_id: notification.site_visit_id,
            timestamp: new Date(notification.timestamp),
            isRead: false,
          },
          ...notificationsArray,
        ])
      );
    };

    socket.on("siteVisitRejected", handleSiteVisitRejected);
    socket.on("siteVisitApproved", handleSiteVisitApproved);
    socket.on("siteVisitCompleted", handleSiteVisitCompleted);

    return () => {
      socket.off("siteVisitRejected", handleSiteVisitRejected);
      socket.off("siteVisitApproved", handleSiteVisitApproved);
      socket.off("siteVisitCompleted", handleSiteVisitCompleted);
      // Disconnect the socket
      socket.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Fetch notifications
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

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
        color="green"
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
  };

  return (
    <>
      <Sidebar>
        <div className="flex flex-col mb-10">
          <div className="mt-6 mb-6 flex justify-center">
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          </div>
          <div className="flex flex-col items-center justify-center px-3">
            <div className="flex flex-col space-y-4">
              {Array.isArray(notificationsArray) ? (
                notificationsArray.map((notification, index) => (
                  <div
                    key={index}
                    className={`bg-white shadow-lg rounded-md p-4 flex items-center justify-between ${
                      !notification.isRead ? "bg-blue-100" : ""
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
                                add(new Date(notification.timestamp), {
                                  hours: 3,
                                }),
                                { addSuffix: true }
                              )}
                            </>
                          )}
                        </p>

                        {notification.type === "completed" && (
                          <Link
                            to={`/survey/${notification.site_visit_id}`}
                            className="text-blue-500 underline text-sm mt-2"
                          >
                            Complete the survey
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Loading notifications...</p>
              )}
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default Notifications;
