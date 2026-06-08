const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export default function AuthFooter() {
  return (
    <footer className="hidden lg:block relative w-full bg-neutral-900 overflow-hidden py-8 md:py-12">
      {/* Background Noise overlay */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: noiseBg }}
      ></div>

      {/* Background Letters (S W I M) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <span className="absolute top-[10%] right-[10%] text-light-700 text-[5rem] md:text-[8rem] header uppercase leading-none mix-blend-multiply opacity-60">
          S
        </span>
        <span className="absolute bottom-[-10%] right-[5%] text-light-700 text-[5rem] md:text-[8rem] header uppercase leading-none mix-blend-multiply opacity-60">
          W
        </span>
        <span className="absolute bottom-[10%] left-[35%] text-light-700 text-[5rem] md:text-[8rem] header uppercase leading-none mix-blend-multiply opacity-60">
          i
        </span>
        <span className="absolute bottom-[-10%] left-[5%] text-light-700 text-[5rem] md:text-[8rem] header uppercase leading-none mix-blend-multiply opacity-60">
          M
        </span>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4">
        {/* Left Side: Logo & Socials */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          {/* Logo Placeholder */}
          <div className="h-[60px] ">
            <svg
              width="119"
              height="42"
              viewBox="0 0 119 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.16956 26.429H0C0.233821 31.9004 4.61471 34.0294 13.0085 34.1236C13.2103 34.1272 13.4145 34.1284 13.621 34.1284C21.8154 34.1284 26.0194 32.2107 26.0194 27.1772C26.0194 25.4683 25.5708 24.1509 24.6474 23.2511C23.7228 22.3823 22.4718 21.7522 20.892 21.3931C19.2825 21.0339 17.0464 20.7343 14.1563 20.5243L13.0085 20.4396L12.9338 20.4348C11.1748 20.3155 9.83474 20.1651 8.96948 19.9861C7.1808 19.6555 6.58498 19.0863 6.58498 18.0087C6.58498 16.5994 7.95705 15.9407 12.1587 15.9407C12.4519 15.9407 12.7344 15.9442 13.0073 15.9502C17.0737 16.0481 18.9834 16.887 18.9834 18.936H25.1233C24.8919 14.2497 20.7804 11.7401 13.0073 11.6005C12.7771 11.5957 12.5445 11.5933 12.3071 11.5933C4.85565 11.5933 0.445091 13.7222 0.445091 17.9777C0.445091 22.5327 3.7542 24.4206 12.0103 24.8991L13.0085 24.954L13.113 24.9588C15.1094 25.1079 16.5408 25.2285 17.4642 25.3776C19.2825 25.6772 19.8796 26.2177 19.8796 27.3848C19.8796 29.0627 18.3888 29.7822 13.4406 29.7822C13.2934 29.7822 13.1498 29.7811 13.0085 29.7787C8.11134 29.719 6.16837 28.6104 6.16837 26.4266L6.16956 26.429Z"
                fill="white"
              />
              <path
                d="M11.0656 8.05981V10.6518C11.4679 10.6362 11.881 10.6303 12.3094 10.6303C12.5456 10.6303 12.7795 10.6315 13.0097 10.6374C13.691 10.6494 14.3379 10.6792 14.9539 10.7257V8.06101C14.383 8.39753 13.7195 8.59205 13.0097 8.59205C12.2999 8.59205 11.6365 8.39753 11.0656 8.06101V8.05981Z"
                fill="white"
              />
              <path
                d="M12.1587 16.9061C11.7694 16.9061 11.4038 16.9133 11.0656 16.924V19.3107C11.6317 19.3692 12.2786 19.4217 13.0014 19.4706H13.0097L14.2275 19.5625C14.4744 19.5804 14.7177 19.5971 14.9539 19.6186V17.0469C14.4079 16.9801 13.7658 16.9359 13.0097 16.9168C12.7415 16.9085 12.459 16.9049 12.1599 16.9049L12.1587 16.9061Z"
                fill="white"
              />
              <path
                d="M11.0656 7.20898C11.6365 7.5467 12.3 7.74002 13.0098 7.74002C13.7195 7.74002 14.383 7.5467 14.9539 7.20898C16.0934 6.53832 16.8601 5.29486 16.8601 3.86882C16.8601 1.73273 15.1367 0 13.0098 0C10.8828 0 9.15942 1.73273 9.15942 3.86882C9.15942 5.29486 9.92498 6.53832 11.0656 7.20898ZM13.0098 1.93083H13.0109C14.0732 1.93083 14.9385 2.80078 14.9385 3.86882C14.9385 4.93686 14.0732 5.808 13.0109 5.808H13.0098C11.9463 5.80681 11.081 4.93805 11.081 3.86882C11.081 2.79958 11.9463 1.93202 13.0098 1.93083Z"
                fill="white"
              />
              <path
                d="M13.4417 28.8193C14.0032 28.8193 14.504 28.8097 14.9539 28.7906V26.0746C14.3996 26.0268 13.7693 25.9767 13.0524 25.923H13.0097L11.9593 25.8645C11.6543 25.8466 11.3575 25.8264 11.0656 25.8049V28.719C11.6293 28.7727 12.2738 28.8073 13.0097 28.8157C13.1498 28.8169 13.2946 28.8193 13.4417 28.8193Z"
                fill="white"
              />
              <path
                d="M13.0097 35.0914C12.3332 35.083 11.6863 35.0627 11.0656 35.0281V37.1475C11.6673 37.3921 12.3142 37.632 13.0097 37.8683H13.0109C13.7041 37.6332 14.3533 37.3945 14.9527 37.1499V35.0771C14.523 35.0902 14.0779 35.095 13.621 35.095C13.4144 35.095 13.2091 35.0938 13.0085 35.0914H13.0097Z"
                fill="white"
              />
              <path
                d="M13.0108 38.7395H13.0097C9.71717 37.65 7.01695 36.3337 5.44667 34.5938C4.51732 34.3241 3.69123 33.9912 2.95534 33.5962C1.82184 32.9876 0.910298 32.2203 0.220703 31.299C0.8557 32.9088 2.1435 35.3862 4.53037 37.3934C7.77657 40.125 11.4406 41.0701 13.0097 41.3959H13.0108C14.5764 41.0701 18.2427 40.1262 21.4913 37.3934C23.3144 35.86 24.4978 34.0497 25.2372 32.5628C23.9447 33.7621 22.1845 34.484 20.2676 34.9136C18.6677 36.4972 16.098 37.7168 13.0108 38.7395Z"
                fill="white"
              />
              <path
                d="M12.1611 15.9407C12.4542 15.9407 12.7367 15.9442 13.0097 15.9502V11.6005C12.7795 11.5957 12.5468 11.5933 12.3094 11.5933C4.85802 11.5933 0.447465 13.7222 0.447465 17.9777C0.447465 22.5327 3.75657 24.4206 12.0127 24.8991L13.0109 24.954V20.4396L12.9361 20.4348C11.1771 20.3155 9.83711 20.1651 8.97185 19.9861C7.18318 19.6555 6.58735 19.0863 6.58735 18.0087C6.58735 16.5994 7.95942 15.9407 12.1611 15.9407ZM6.16956 26.429H0C0.233821 31.9004 4.61471 34.0294 13.0085 34.1236V29.7799C8.11134 29.7202 6.16837 28.6116 6.16837 26.4278L6.16956 26.429Z"
                fill="#F2F2F2"
              />
              <path
                d="M13.0097 8.58969V10.6363C12.7795 10.6315 12.5468 10.6291 12.3094 10.6291C11.881 10.6291 11.4679 10.6363 11.0656 10.6506V8.05865C11.6365 8.39518 12.2999 8.58969 13.0097 8.58969Z"
                fill="#F2F2F2"
              />
              <path
                d="M13.0097 16.9168V19.4706H13.0014C12.2786 19.4228 11.6317 19.3691 11.0656 19.3107V16.924C11.405 16.912 11.7706 16.9061 12.1587 16.9061C12.4578 16.9061 12.7415 16.9096 13.0085 16.918L13.0097 16.9168Z"
                fill="#F2F2F2"
              />
              <path
                d="M13.0097 25.9218V28.8157C12.2738 28.8073 11.6293 28.7727 11.0656 28.719V25.8049C11.3563 25.8264 11.6543 25.8466 11.9593 25.8645L13.0097 25.9206V25.9218Z"
                fill="#F2F2F2"
              />
              <path
                d="M13.0097 35.0915V37.8672C12.3154 37.6309 11.6685 37.3911 11.0656 37.1464V35.027C11.6863 35.0616 12.3332 35.0819 13.0097 35.0903V35.0915Z"
                fill="#F2F2F2"
              />
              <path
                d="M13.0098 1.93083V0C10.884 0 9.15942 1.73273 9.15942 3.86882C9.15942 5.29486 9.92498 6.53832 11.0656 7.20898C11.6365 7.5467 12.3 7.74002 13.0098 7.74002V5.80919C11.9463 5.808 11.081 4.93924 11.081 3.87001C11.081 2.80077 11.9463 1.93322 13.0098 1.93202V1.93083Z"
                fill="#F2F2F2"
              />
              <path
                d="M13.0097 38.7395V41.3959C11.4418 41.0701 7.77657 40.125 4.53037 37.3934C2.1435 35.3862 0.8557 32.9088 0.220703 31.299C0.910298 32.2203 1.82184 32.9876 2.95534 33.5962C3.69123 33.9924 4.51732 34.3253 5.44667 34.5938C7.01695 36.3337 9.71717 37.65 13.0097 38.7395Z"
                fill="#F2F2F2"
              />
              <path
                d="M13.0098 8.58969C13.7195 8.58969 14.383 8.39518 14.9539 8.05865V10.7234C14.3379 10.6768 13.6911 10.647 13.0098 10.6351V8.5885V8.58969Z"
                fill="white"
              />
              <path
                d="M16.8589 3.86884C16.8589 5.29489 16.0933 6.53835 14.9527 7.20901C14.3818 7.54673 13.7183 7.74005 13.0085 7.74005V5.80922H13.0097C14.072 5.80922 14.9373 4.93927 14.9373 3.87004C14.9373 2.8008 14.072 1.93205 13.0097 1.93205H13.0085V0.0012207C15.1343 0.0012207 16.8589 1.73395 16.8589 3.87004V3.86884Z"
                fill="white"
              />
              <path
                d="M14.2275 19.5624L13.0098 19.4706V16.9168C13.7658 16.9347 14.4079 16.9801 14.9539 17.0469V19.6185C14.7177 19.5971 14.4744 19.5803 14.2275 19.5624Z"
                fill="white"
              />
              <path
                d="M13.4418 28.8192C13.2946 28.8192 13.151 28.8181 13.0098 28.8157V25.9218H13.0525C13.7694 25.9767 14.3996 26.0268 14.9539 26.0746V28.7906C14.5041 28.8085 14.002 28.8192 13.4418 28.8192Z"
                fill="white"
              />
              <path
                d="M13.0098 15.9502V11.6005C20.7828 11.7401 24.8943 14.2509 25.1257 18.9359H18.9859C18.9859 16.887 17.0761 16.0481 13.0098 15.9502Z"
                fill="white"
              />
              <path
                d="M13.6221 35.095C14.0791 35.095 14.5242 35.0902 14.9538 35.0771V37.1499C14.3533 37.3946 13.7052 37.6344 13.0121 37.8683H13.0109V35.0926C13.2115 35.0938 13.4168 35.0962 13.6233 35.0962L13.6221 35.095Z"
                fill="white"
              />
              <path
                d="M26.0207 27.1772C26.0207 32.2107 21.8166 34.1284 13.6222 34.1284C13.4157 34.1284 13.2115 34.1272 13.0098 34.1236V29.7798C13.1498 29.781 13.2946 29.7834 13.4418 29.7834C18.39 29.7834 19.8808 29.065 19.8808 27.386C19.8808 26.2177 19.2838 25.6771 17.4654 25.3788C16.542 25.2296 15.1106 25.1091 13.1142 24.9599L13.0098 24.9551V20.4407L14.1575 20.5255C17.0476 20.7355 19.2826 21.035 20.8932 21.3942C22.473 21.7534 23.724 22.3835 24.6486 23.2523C25.572 24.152 26.0207 25.4695 26.0207 27.1783V27.1772Z"
                fill="white"
              />
              <path
                d="M25.2373 32.5639C24.4979 34.0508 23.3145 35.8611 21.4914 37.3946C18.2417 40.1273 14.5753 41.0712 13.011 41.397H13.0098V38.7406H13.011C16.0981 37.7179 18.6678 36.4984 20.2677 34.9148C22.1858 34.4852 23.946 33.7632 25.2373 32.5639Z"
                fill="white"
              />
              <path
                d="M34.9712 26.306H39.3093C39.3093 27.886 40.755 28.6653 44.4225 28.6653C47.9014 28.6653 48.9494 28.1593 48.9494 26.9803C48.9494 26.1581 48.5304 25.7798 47.2521 25.5686C46.6029 25.4635 45.5964 25.3788 44.1923 25.2738L43.4172 25.232C37.612 24.8943 35.2869 23.5673 35.2869 20.3644C35.2869 17.3727 38.3883 15.8762 43.6273 15.8762C49.4111 15.8762 52.471 17.6459 52.6383 21.0386H48.3215C48.3215 19.5004 46.7916 18.9312 43.5228 18.9312C40.5674 18.9312 39.6037 19.3942 39.6037 20.3847C39.6037 21.1436 40.0226 21.5434 41.2796 21.7749C41.8873 21.9014 42.8309 22.0064 44.0664 22.0911L44.9258 22.1544C46.9589 22.3012 48.5304 22.5124 49.6615 22.7654C50.7725 23.0184 51.652 23.4611 52.3012 24.0721C52.9505 24.7046 53.265 25.6318 53.265 26.8323C53.265 30.3718 50.3108 31.7202 44.5471 31.7202C38.3657 31.7202 35.1385 30.2453 34.97 26.3048L34.9712 26.306Z"
                fill="white"
              />
              <path
                d="M53.411 16.2342H57.6234L61.7728 28.201L66.8017 16.2342H72.2924L77.3213 28.2225L81.4494 16.2342H85.6617L80.3812 31.2989H74.43L69.5471 19.5207L64.6641 31.2989H58.7129L53.411 16.2342Z"
                fill="white"
              />
              <path
                d="M87.3151 16.2342H91.4859V31.2989H87.3151V16.2342Z"
                fill="white"
              />
              <path
                d="M94.5861 16.2342H101.041L106.364 26.6008L111.686 16.2342H118.119V31.2989H113.948V20.1746L108.312 31.2989H104.435L98.7558 20.1746V31.2989H94.585V16.2342H94.5861Z"
                fill="white"
              />
              <path
                d="M30.4431 14.5839V32.5126"
                stroke="white"
                strokeWidth="2"
                strokeMiterlimit="10"
              />
            </svg>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 items-center mt-2 ">
            {/* Facebook */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hover:stroke-white cursor-pointer transition-colors"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
            {/* Instagram */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hover:stroke-white cursor-pointer transition-colors"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            {/* TikTok */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hover:stroke-white cursor-pointer transition-colors"
            >
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
            </svg>
            {/* LinkedIn */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hover:stroke-white cursor-pointer transition-colors"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </div>
        </div>

        {/* Right Side: Links Grid */}
        <div className="flex flex-col gap-3 w-full md:w-1/2 md:pl-16">
          {/* Company */}
          <div className="flex gap-4 items-center">
            <h4 className="text-white text-lg font-bold uppercase w-[100px] tracking-wide inter">
              COMPANY
            </h4>
            <div className="flex gap-4 text-[#e2e8f0] text-sm tracking-widest font-mono lowercase">
              <a href="#" className="hover:text-white transition-colors">
                home
              </a>
              <a href="#" className="hover:text-white transition-colors">
                about us
              </a>
              <a href="#" className="hover:text-white transition-colors">
                pricing
              </a>
            </div>
          </div>

          {/* Socials */}
          <div className="flex gap-4 items-center">
            <h4 className="text-white text-lg font-bold uppercase w-[100px] tracking-wide inter">
              SOCIALS
            </h4>
            <div className="flex gap-4 text-[#e2e8f0] text-sm tracking-widest font-mono lowercase">
              <a href="#" className="hover:text-white transition-colors">
                instagram
              </a>
              <a href="#" className="hover:text-white transition-colors">
                facebook
              </a>
              <a href="#" className="hover:text-white transition-colors">
                tiktok
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="flex gap-4 items-center">
            <h4 className="text-white text-lg font-bold uppercase w-[100px] tracking-wide inter">
              SUPPORT
            </h4>
            <div className="flex gap-4 text-[#e2e8f0] text-sm tracking-widest font-mono lowercase">
              <a
                href="tel:+021121024995"
                className="hover:text-white transition-colors"
              >
                +021121024995
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
