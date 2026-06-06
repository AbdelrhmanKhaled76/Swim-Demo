
const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export default function Footer() {
  return (
    <footer className="hidden md:block relative w-full bg-[#0a2342] overflow-hidden py-16 md:py-24 px-8 md:px-24">
      {/* Background Noise overlay */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: noiseBg }}></div>

      {/* Background Letters (S W I M) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <span className="absolute top-[10%] right-[10%] text-[#051426] text-[8rem] md:text-[14rem] header uppercase leading-none mix-blend-multiply opacity-60">S</span>
        <span className="absolute bottom-[-10%] right-[5%] text-[#051426] text-[8rem] md:text-[14rem] header uppercase leading-none mix-blend-multiply opacity-60">W</span>
        <span className="absolute bottom-[10%] left-[35%] text-[#051426] text-[8rem] md:text-[14rem] header uppercase leading-none mix-blend-multiply opacity-60">i</span>
        <span className="absolute bottom-[-10%] left-[5%] text-[#051426] text-[8rem] md:text-[14rem] header uppercase leading-none mix-blend-multiply opacity-60">M</span>
      </div>

      <div className="container mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">
        
        {/* Left Side: Logo & Socials */}
        <div className="flex flex-col gap-8 w-full md:w-1/2">
          {/* Logo Placeholder */}
          <div className="w-[300px] h-[60px] bg-gray-500"></div>
          
          {/* Social Icons */}
          <div className="flex gap-4 items-center mt-2 pl-2">
            {/* Facebook */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hover:stroke-white cursor-pointer transition-colors"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            {/* Instagram */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hover:stroke-white cursor-pointer transition-colors"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            {/* TikTok */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hover:stroke-white cursor-pointer transition-colors"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
            {/* LinkedIn */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hover:stroke-white cursor-pointer transition-colors"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </div>
        </div>

        {/* Right Side: Links Grid */}
        <div className="flex flex-col gap-6 w-full md:w-1/2 md:pl-16">
          {/* Company */}
          <div className="flex gap-8 items-center">
            <h4 className="text-white text-xl font-bold uppercase w-[120px] tracking-wide inter">COMPANY</h4>
            <div className="flex gap-4 text-[#e2e8f0] text-sm tracking-widest font-mono lowercase">
              <a href="#" className="hover:text-white transition-colors">home</a>
              <a href="#" className="hover:text-white transition-colors">about us</a>
              <a href="#" className="hover:text-white transition-colors">pricing</a>
            </div>
          </div>
          
          {/* Socials */}
          <div className="flex gap-8 items-center">
            <h4 className="text-white text-xl font-bold uppercase w-[120px] tracking-wide inter">SOCIALS</h4>
            <div className="flex gap-4 text-[#e2e8f0] text-sm tracking-widest font-mono lowercase">
              <a href="#" className="hover:text-white transition-colors">instagram</a>
              <a href="#" className="hover:text-white transition-colors">facebook</a>
              <a href="#" className="hover:text-white transition-colors">tiktok</a>
            </div>
          </div>

          {/* Support */}
          <div className="flex gap-8 items-center">
            <h4 className="text-white text-xl font-bold uppercase w-[120px] tracking-wide inter">SUPPORT</h4>
            <div className="flex gap-4 text-[#e2e8f0] text-sm tracking-widest font-mono lowercase">
              <a href="tel:+021121024995" className="hover:text-white transition-colors">+021121024995</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
