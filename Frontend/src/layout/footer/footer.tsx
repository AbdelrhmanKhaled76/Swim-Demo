import FooterContent from './footerContent';
import AuthFooter from './authFooter';

export default function Footer({ variant = "public" }: { variant?: "public" | "auth" }) {
  if (variant === "auth") {
    return <AuthFooter />;
  }
  return <FooterContent />;
}
