import { useState } from "react";

function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow flex justify-center pt-16 px-4 pb-12">
        <div className="w-full max-w-3xl flex flex-col">
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
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  className="regular w-full border border-neutral-200 p-4 text-primary-900 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="inter tracking-widest w-full bg-primary-900 text-white py-4 mt-4 font-medium hover:bg-primary-700 transition-colors uppercase"
              >
                Authenticate
              </button>
            </form>

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                className="regular text-xs text-neutral-600 hover:text-primary-900 underline decoration-neutral-400 hover:decoration-primary-900 underline-offset-4 transition-colors"
              >
                FORGOT PASSKEY?
              </button>
              <p className="regular text-xs text-neutral-600">
                NEW TO SWIM?
                <a
                  href="/signup"
                  className="text-primary-900 hover:underline underline-offset-4 font-bold ml-1"
                >
                  SIGN UP
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignIn;