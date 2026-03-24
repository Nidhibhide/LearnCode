import {
  IoMdCheckmarkCircleOutline,
  IoMdInformationCircleOutline,
  IoMdWarning,
} from "react-icons/io";
import { getDaysAgo, Button } from "../../components/index";
import { NotFoundControls } from "../../components/index";
import { markAsread } from "../../api/notification";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setMarkAsRead } from "../../redux/features/notificationSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const unreadNotifications = useSelector(
    (state) => state.notifications.unreadNotifications || []
  );
  const readNotifications = useSelector(
    (state) => state.notifications.readNotifications || []
  );
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("unread"); // 'unread' or 'read'

  const handleMarkAsRead = async (id) => {
    try {
      await markAsread(user._id, id);
      dispatch(setMarkAsRead(id));
    } catch (e) {
      console.log(e);
    }
  };

  const notifications =
    activeTab === "unread" ? unreadNotifications : readNotifications;

  return (
    <div className="w-full h-full py-4 sm:py-8 md:py-12 px-4">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-8 text-center text-textPrimary flex items-center justify-center gap-2">
        Notifications
      </h1>

      {/* Tabs for Unread and Read notifications */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("unread")}
          className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors ${
            activeTab === "unread"
              ? "border-b-2 border-primary text-primary"
              : "text-textSecondary hover:text-textPrimary"
          }`}
        >
          Unread ({unreadNotifications.length})
        </button>
        <button
          onClick={() => setActiveTab("read")}
          className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors ${
            activeTab === "read"
              ? "border-b-2 border-primary text-primary"
              : "text-textSecondary hover:text-textPrimary"
          }`}
        >
          Read ({readNotifications.length})
        </button>
      </div>

      <div className="">
        {notifications?.length === 0 ? (
          <NotFoundControls
            title={
              activeTab === "unread"
                ? "No Unread Notifications"
                : "No Read Notifications"
            }
            description={
              activeTab === "unread"
                ? "You're all caught up! New notifications will appear here."
                : "No read notifications yet."
            }
          />
        ) : (
          <ul className="overflow-y-auto ">
            {notifications.map((note) => (
              <li
                key={note._id}
                className={`px-5 py-4 transition-all mb-3 ${
                  note.type === "success"
                    ? "bg-successBg hover:bg-success/20"
                    : note.type === "warning"
                    ? "bg-warningBg hover:bg-warning/20"
                    : "bg-infoBg hover:bg-info/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  {note.type === "success" ? (
                    <IoMdCheckmarkCircleOutline
                      size={32}
                      className="text-success mt-2"
                    />
                  ) : note.type === "warning" ? (
                    <IoMdWarning
                      size={32}
                      className="text-warning mt-2"
                    />
                  ) : (
                    <IoMdInformationCircleOutline
                      size={28}
                      className="text-info mt-1"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 md:mb-1">
                      <h3 className="md:text-lg text-base font-semibold">
                        {note.title}
                      </h3>
                      <span className="md:text-sm text-xs text-textSecondary self-start sm:self-auto">
                        {getDaysAgo(note?.createdAt)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="md:text-base text-sm">{note.message}</p>
                      {activeTab === "unread" && (
                        <button
                          onClick={() => handleMarkAsRead(note._id)}
                          className="text-primary hover:text-primaryDark underline text-left"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;
