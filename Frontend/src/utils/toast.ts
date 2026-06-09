import toast from "react-hot-toast";

export const showSuccessToast = (message: string, duration = 4000) => {
  toast.success(message, {
    duration,
    style: {
      background: "#04162A",
      color: "#fff",
      fontFamily: '"Inter", sans-serif',
      letterSpacing: "0.5px",
      padding: "20px 40px",
      fontSize: "18px",
      fontWeight: "bold",
      borderRadius: "10px",
    },
    iconTheme: {
      primary: "#22c55e",
      secondary: "#04162A",
    },
  });
};

export const showErrorToast = (message: string, duration = 4000) => {
  toast.error(message, {
    duration,
    style: {
      background: "#fff",
      color: "#FF383C",
      border: "2px solid #FF383C",
      fontFamily: '"Inter", sans-serif',
      letterSpacing: "0.5px",
      padding: "20px 40px",
      fontSize: "18px",
      fontWeight: "bold",
      borderRadius: "10px",
      boxShadow: "0 10px 25px -5px rgba(255, 56, 60, 0.2)",
    },
  });
};

export const showWarningToast = (message: string, duration = 4000) => {
  toast(message, {
    duration,
    icon: "⚠️",
    style: {
      background: "#fff",
      color: "#f59e0b",
      border: "2px solid #f59e0b",
      fontFamily: '"Inter", sans-serif',
      letterSpacing: "0.5px",
      padding: "20px 40px",
      fontSize: "18px",
      fontWeight: "bold",
      borderRadius: "10px",
    },
  });
};
