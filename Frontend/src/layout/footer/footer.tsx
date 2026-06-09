import FooterContent from "./footerContent";
import AuthFooter from "./authFooter";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export default function Footer() {
  const { token } = useSelector((state: RootState) => state.auth);
  if (token) {
    return <AuthFooter />;
  }
  return <FooterContent />;
}
