import { socket } from "../globals";
export const getDaysAgo = (dateString) => {
  const createdDate = new Date(dateString);
  const today = new Date();

  createdDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today - createdDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

export const SocketConnection = (userId) => {
  if (!userId) return;

  const register = () => {
    socket.emit("register", { userId });
  };

  if (socket.connected) {
    register();
  } else {
    socket.once("connect", register);
  }

  // Clean up to prevent multiple listeners
  return () => {
    socket.off("connect", register);
  };
};
