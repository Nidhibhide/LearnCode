import {
  IoMdCheckmarkCircleOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import { getDaysAgo } from "../../../../../components/index";
import { NotFoundControls } from "../../../../../components/index";
import { markAsread } from "../../../../../api/notification";
import { useDispatch, useSelector } from "react-redux";
import { setMarkasRead } from "../../../../../redux/features/notificationSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notifications.notifications || []
  );

  const handleClick = async (id) => {
    try {
      const response = await markAsread(id);
      dispatch(setMarkasRead(id));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full h-full shadow-lg rounded-2xl md:py-12 py-4 px-4 ">
      <h1 className="md:text-2xl text-xl font-bold mb-8  text-center text-gray-800 flex items-center justify-center gap-2">
        Notifications
      </h1>
      <div className="">
        {notifications?.length === 0 ? (
          <NotFoundControls
            title="No Notifications Yet"
            description="You're all caught up! New notifications will appear here."
          />
        ) : (
          <ul className="overflow-y-auto ">
            {notifications.map((note) => (
              <li
                key={note.id}
                className="px-5 py-4 hover:bg-blue-150 transition-all bg-blue-100 mb-3"
              >
                <div className="flex items-start gap-3">
                  {note.type === "success" ? (
                    <IoMdCheckmarkCircleOutline
                      size={32}
                      className="text-green-600 mt-2"
                    />
                  ) : (
                    <IoMdInformationCircleOutline
                      size={28}
                      className="text-blue-600 mt-1"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-center md:mb-1">
                      <h3 className="md:text-lg text-base font-semibold">
                        {note.title}
                      </h3>
                      <span className="md:text-sm text-xs text-gray-500">
                        {getDaysAgo(note?.createdAt)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="md:text-base text-sm">{note.message}</p>
                      <button
                        className="text-sm self-start text-blue-600 underline hover:text-blue-800 transition"
                        onClick={() => handleClick(note._id)}
                      >
                        Mark as read
                      </button>
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
