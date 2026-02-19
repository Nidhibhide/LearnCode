import { useEffect } from "react";
import { Content } from "./Shared";
import { SocketConnection } from "../../components/index";
import { socket } from "../../globals";
import {
  setUnreadNotifications,
  setReadNotifications,
} from "../../redux/features/notificationSlice";
import { useDispatch, useSelector } from "react-redux";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user?._id) return;

    const unregister = SocketConnection(user._id);

    // Listen for unread notifications
    socket.on("unreadNotifications", (notifications) => {
      if (Array.isArray(notifications)) {
        dispatch(setUnreadNotifications(notifications));
      }
    });

    // Listen for read notifications
    socket.on("readNotifications", (notifications) => {
      if (Array.isArray(notifications)) {
        dispatch(setReadNotifications(notifications));
      }
    });

    return () => {
      if (typeof unregister === "function") unregister();
      socket.off("unreadNotifications");
      socket.off("readNotifications");
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
