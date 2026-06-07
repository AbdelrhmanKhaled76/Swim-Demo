// 
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import NavContent from "./navContent";
import AuthNav from "./authNav";

export default function Nav() {
  // Check if we have a token
  const { token } = useSelector((state: RootState) => state.auth);

  // If token exists, show AuthNav, otherwise show public NavContent
  if (token) {
    return <AuthNav />;
  }
  return <NavContent />;
}