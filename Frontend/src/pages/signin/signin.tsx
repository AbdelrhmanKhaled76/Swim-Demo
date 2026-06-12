import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store";
import Button from "../../components/button/button";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false); 

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      showSuccessToast("Access Granted! Welcome to SWIM Protocol.");
      navigate("/statistics");
    } else {
      const errorMsg = typeof resultAction.payload === "string" 
        ? resultAction.payload 
        : "Invalid email or password.";
      showErrorToast(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow flex flex-col justify-center items-center container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl flex flex-col">
          <div className="mb-10">
            <h1 className="header text-6xl md:text-8xl text-primary-900 tracking-tight mb-4">
              ACCESS SYSTEM
            </h1>
            <p className="inter text-base md:text-lg text-neutral-800 max-w-2xl leading-relaxed">
              SWIM Protocol v4.02. Secure terminal for Industrial Store and
              Warehouse Inventory Management. Unauthorized access is logged and
              prosecuted.
            </p>
          </div>

          <div className="w-full border border-neutral-300 p-8 md:p-12 bg-white">
            <div className="mb-8 inline-block">
              <h2 className="header text-base tracking-widest text-primary-900 uppercase leading-tight">
                AUTHENTICATION
                <br />
                <span className="border-b-[3px] border-primary-900 pb-1 inline-block">
                  REQ
                </span>
                <span className=" border-primary-900 pb-1 inline-block">
                  UIRED
                </span>
              </h2>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="regular text-xs text-neutral-700 uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@iti.gov.eg"
                  className="regular w-full border border-neutral-200 p-4 text-primary-900 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="regular text-xs text-neutral-700 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                    className="regular w-full border border-neutral-200 p-4 pr-12 text-primary-900 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary-900 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20"/><path d="M6.71 6.71q2.3-.71 5.29-.71 7 0 10 7-1.07 2.4-3 4.29"/><path d="M14.08 14.08a3 3 0 0 1-4.16-4.16"/><path d="M17.29 17.29q-2.3.71-5.29.71-7 0-10-7 1.07-2.4 3-4.29"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className={`w-full mt-4 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Authenticate"}
              </Button>
            </form>

            <div className="flex justify-between items-center mt-6">
              <Link
                to="/forgot-password" 
                className="regular text-xs text-neutral-600 hover:text-primary-900 underline decoration-neutral-400 hover:decoration-primary-900 underline-offset-4 transition-colors"
              >
                FORGOT PASSKEY?
              </Link>
              <p className="regular text-xs text-neutral-600">
                NEW TO SWIM?
                <Link
                  to="/signup"
                  className="text-primary-900 hover:underline underline-offset-4 font-bold ml-1"
                >
                  SIGN UP
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignIn;