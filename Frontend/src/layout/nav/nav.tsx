//
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import NavContent from "./navContent";
import AuthNav from "./authNav";

export default function Nav() {
  const { token } = useSelector((state: RootState) => state.auth);

  if (token) {
    return <AuthNav />;
  }
  return <NavContent />;
}
