import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import octopusImg from "../../assets/images/octupus.svg";
import Button from "../../components/button/button";

function SignUp() {
  const [step, setStep] = useState<number>(1);

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [orgName, setOrgName] = useState<string>("");
  const [warehouse, setWarehouse] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [agreed, setAgreed] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const validateField = (field: string, value: string) => {
    let newErrors = { ...errors };

    switch (field) {
      case "fullName":
        if (value.trim().length < 3)
          newErrors.fullName = "Name must be at least 3 characters.";
        else delete newErrors.fullName;
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          newErrors.email = "Please enter a valid email address.";
        else delete newErrors.email;
        break;
      case "password":
        if (value.length < 6)
          newErrors.password = "Password must be at least 6 characters.";
        else delete newErrors.password;
        if (confirmPassword && value !== confirmPassword)
          newErrors.confirmPassword = "Passwords do not match.";
        else delete newErrors.confirmPassword;
        break;
      case "confirmPassword":
        if (value !== password)
          newErrors.confirmPassword = "Passwords do not match.";
        else delete newErrors.confirmPassword;
        break;
      case "orgName":
        if (value.trim().length < 2)
          newErrors.orgName = "Organization name is required.";
        else delete newErrors.orgName;
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    validateField("fullName", fullName);
    validateField("email", email);
    validateField("password", password);
    validateField("confirmPassword", confirmPassword);

    if (
      Object.keys(errors).length === 0 &&
      fullName &&
      email &&
      password &&
      confirmPassword === password
    ) {
      setStep(2);
    } else {
      showErrorToast("Please fix the errors before proceeding.");
    }
  };

  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    validateField("orgName", orgName);
    if (Object.keys(errors).length > 0 || !orgName) {
      showErrorToast("Please fix the errors before submitting.");
      return;
    }

    const userData = {
      fullName,
      email,
      password,
      confirmPassword,
      orgName,
      warehouse,
      industry,
    };

    const resultAction = await dispatch(registerUser(userData));

    if (registerUser.fulfilled.match(resultAction)) {
      showSuccessToast("Account created successfully! Welcome to the Core.");
      navigate("/home");
    } else {
      showErrorToast(resultAction.payload as string, 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow flex flex-col justify-center items-center container mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl flex flex-col">
          {step === 1 && (
            <div className="w-full flex flex-col animate-fade-in">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-4 border-b border-transparent">
                <div>
                  <h1 className="header text-6xl md:text-8xl text-primary-900 tracking-tight mb-0 uppercase">
                    Join The Core
                  </h1>
                  <h2 className="inter text-xl md:text-2xl text-primary-900 uppercase tracking-widest mt-1">
                    Personal Information
                  </h2>
                </div>
                <div className="flex items-center gap-4 mt-6 md:mt-0">
                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary-700"></span>
                    <span className="w-5 h-5 rounded-full bg-primary-200"></span>
                  </div>
                  <span className="inter text-3xl text-primary-900">1/2</span>
                </div>
              </div>

              <form onSubmit={handleNextStep} className="flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                  <div className="flex flex-col gap-2 w-full">
                    <label className="regular text-xs text-neutral-700 uppercase tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        validateField("fullName", e.target.value);
                      }}
                      onBlur={(e) => validateField("fullName", e.target.value)}
                      placeholder="OPERATOR NAME"
                      className={`regular w-full border p-4 text-primary-900 focus:outline-none transition-colors ${errors.fullName ? "border-red-500 focus:border-red-500 bg-red-50" : "border-neutral-200 focus:border-primary-400"}`}
                      required
                    />
                    {errors.fullName && (
                      <span className="text-red-500 text-xs regular">
                        {errors.fullName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label className="regular text-xs text-neutral-700 uppercase tracking-widest">
                      Work Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateField("email", e.target.value);
                      }}
                      onBlur={(e) => validateField("email", e.target.value)}
                      placeholder="operator@iti.gov.eg"
                      className={`regular w-full border p-4 text-primary-900 focus:outline-none transition-colors ${errors.email ? "border-red-500 focus:border-red-500 bg-red-50" : "border-neutral-200 focus:border-primary-400"}`}
                      required
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs regular">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                  <div className="flex flex-col gap-2 w-full">
                    <label className="regular text-xs text-neutral-700 uppercase tracking-widest">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          validateField("password", e.target.value);
                        }}
                        onBlur={(e) => validateField("password", e.target.value)}
                        placeholder="******"
                        className={`regular w-full border p-4 pr-12 text-primary-900 focus:outline-none transition-colors ${errors.password ? "border-red-500 focus:border-red-500 bg-red-50" : "border-neutral-200 focus:border-primary-400"}`}
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
                    {errors.password && (
                      <span className="text-red-500 text-xs regular">
                        {errors.password}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label className="regular text-xs text-neutral-700 uppercase tracking-widest">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          validateField("confirmPassword", e.target.value);
                        }}
                        onBlur={(e) =>
                          validateField("confirmPassword", e.target.value)
                        }
                        placeholder="******"
                        className={`regular w-full border p-4 pr-12 text-primary-900 focus:outline-none transition-colors ${errors.confirmPassword ? "border-red-500 focus:border-red-500 bg-red-50" : "border-neutral-200 focus:border-primary-400"}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary-900 transition-colors focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20"/><path d="M6.71 6.71q2.3-.71 5.29-.71 7 0 10 7-1.07 2.4-3 4.29"/><path d="M14.08 14.08a3 3 0 0 1-4.16-4.16"/><path d="M17.29 17.29q-2.3.71-5.29.71-7 0-10-7 1.07-2.4 3-4.29"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span className="text-red-500 text-xs regular">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full mt-2">
                  Next Step
                </Button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="w-full flex flex-col animate-fade-in relative">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="absolute top-0 left-0 flex items-center gap-2 text-neutral-500 hover:text-primary-900 transition-colors regular text-sm cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                BACK TO PERSONAL INFO
              </button>

              <div className="flex justify-center mb-2 mt-4 md:mt-0">
                <img
                  src={octopusImg}
                  alt="Octopus Logo"
                  className="w-24 h-24 md:w-32 md:h-32 object-contain"
                />
              </div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-4 border-b border-transparent">
                <div>
                  <h1 className="header text-6xl md:text-8xl text-primary-900 tracking-tight mb-0 uppercase">
                    Set Up Your Dock
                  </h1>
                  <h2 className="inter text-xl md:text-2xl text-primary-900 uppercase tracking-widest mt-1">
                    Organization Information
                  </h2>
                </div>
                <div className="flex items-center gap-4 mt-6 md:mt-0">
                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary-700"></span>
                    <span className="w-5 h-5 rounded-full bg-primary-700"></span>
                  </div>
                  <span className="inter text-3xl text-primary-900">2/2</span>
                </div>
              </div>

              <form
                onSubmit={handleCreateAccount}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                  <div className="flex flex-col gap-2 w-full">
                    <label className="regular text-xs text-neutral-700 uppercase tracking-widest">
                      Company/Organization Name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => {
                        setOrgName(e.target.value);
                        validateField("orgName", e.target.value);
                      }}
                      onBlur={(e) => validateField("orgName", e.target.value)}
                      placeholder="ITI Core Systems"
                      className={`regular w-full border p-4 text-primary-900 focus:outline-none transition-colors ${errors.orgName ? "border-red-500 focus:border-red-500 bg-red-50" : "border-neutral-200 focus:border-primary-400"}`}
                      required
                    />
                    {errors.orgName && (
                      <span className="text-red-500 text-xs regular">
                        {errors.orgName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 w-full relative">
                    <label className="regular text-xs text-neutral-700 uppercase tracking-widest">
                      Primary Warehouse
                    </label>
                    <select
                      value={warehouse}
                      onChange={(e) => setWarehouse(e.target.value)}
                      className="regular appearance-none w-full border border-neutral-200 p-4 text-primary-900 focus:border-primary-400 bg-white"
                      required
                    >
                      <option value="" disabled>
                        Select Location
                      </option>
                      <option value="smart-village">Smart Village</option>
                      <option value="cairo">Cairo</option>
                    </select>
                    <div className="absolute right-4 top-[2.75rem] pointer-events-none text-neutral-500">
                      ▼
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full relative">
                  <label className="regular text-xs text-neutral-700 uppercase tracking-widest">
                    Industry/Sector (Optional)
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="regular appearance-none w-full border border-neutral-200 p-4 text-primary-900 focus:border-primary-400 bg-white"
                  >
                    <option value="">
                      None (Select Industry)
                    </option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                  </select>
                  <div className="absolute right-4 top-[2.75rem] pointer-events-none text-neutral-500">
                    ▼
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="checkbox"
                    id="protocol"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 accent-primary-900 cursor-pointer"
                    required
                  />
                  <label
                    htmlFor="protocol"
                    className="regular text-xs text-neutral-700 uppercase tracking-widest cursor-pointer mt-[2px]"
                  >
                    I agree to the protocol
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className={`w-full mt-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SignUp;