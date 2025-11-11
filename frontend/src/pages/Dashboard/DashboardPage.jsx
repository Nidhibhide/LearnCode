import React, { useEffect, useState } from "react";
import { Content } from "./Shared";
import { SocketConnection } from "../../components/index";
import { socket } from "../../globals";
import {
  setNotificationCount,
  setNotifications,
} from "../../redux/features/notificationSlice";
import { useDispatch } from "react-redux";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("data"));

  useEffect(() => {
    if (!user?._id) return;

    const unregister = SocketConnection(user._id);
    socket.on("demo", (data) => {
      dispatch(setNotifications(data));
    });
    socket.on("notificationCount", ({ count }) => {
      dispatch(setNotificationCount(count));
    });

    return () => {
      if (typeof unregister === "function") unregister();
      socket.off("demo");
      socket.off("notificationCount");
    };
  }, [user?._id]);
  return (
    <>
      <div className="w-screen h-screen flex ">
        <Content />
      </div>
    </>
  );
};

export default DashboardPage;
