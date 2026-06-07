import NavContent from './navContent';
import AuthNav from './authNav';

export default function Nav({ variant = "public" }: { variant?: "public" | "auth" }) {
  if (variant === "auth") {
    return <AuthNav />;
  }
  return <NavContent />;
}
