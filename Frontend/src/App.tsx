import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { socket } from "./core/socket";
import { fetchRequests } from "./store/slices/requestsSlice";
import { showRequestNotificationToast } from "./utils/toast";
import Nav from "./layout/nav/nav";
import MobileNav from "./layout/nav/mobileNav";
import Footer from "./layout/footer/footer";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user && token) {
      const orgId = user.organizationID || (user as any).organizationId;
      if (orgId) {
        socket.connect();
        socket.emit("join_org", orgId);
        console.log(`Socket joined organization: ${orgId}`);
      }
    } else {
      socket.disconnect();
    }
  }, [user, token]);

  useEffect(() => {
    if (user && token && user.role === "Owner") {
      const handleNewRequest = (newRequest: any) => {
        const storeName = typeof newRequest.storeId === "object"
          ? newRequest.storeId?.name
          : newRequest.storeName || "Store";
          
        const requester = newRequest.requestedBy?.fullName || "A manager";

        // Show toast notification using the application's premium theme
        showRequestNotificationToast(
          `New request from ${requester} for ${storeName}`,
          6000
        );

        // Dispatch fetchRequests to update the Orange notification dot and list in real time
        dispatch(fetchRequests());
      };

      socket.on("new_stock_request", handleNewRequest);

      return () => {
        socket.off("new_stock_request", handleNewRequest);
      };
    }
  }, [user, token, dispatch]);

  return (
    <div className="app-layout min-h-screen flex flex-col relative pb-[80px] md:pb-0">
      <Nav />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}

export default App;
