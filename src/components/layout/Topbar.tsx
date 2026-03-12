import ThemeToggle from "@/components/ui/ThemeToggle";
import SocialIcons from "@/components/ui/SocialIcons";

export default function Topbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[1001] bg-dark text-white/70 text-[13px] hidden md:block dark:bg-[#060e16]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-[36px]">
          {/* Left — contact */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+420777027809"
              className="flex items-center gap-1.5 text-white/70 font-medium transition-colors duration-[250ms] hover:text-blue"
            >
              <svg className="w-3.5 h-3.5 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.06a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              +420 777 027 809
            </a>
            <span className="text-white/25">·</span>
            <a
              href="mailto:info@carbeat.cz"
              className="text-white/70 font-medium transition-colors duration-[250ms] hover:text-blue"
            >
              info@carbeat.cz
            </a>
          </div>

          {/* Right — social + theme toggle */}
          <div className="flex items-center gap-4">
            <SocialIcons
              className="gap-1"
              linkClassName="flex items-center justify-center w-7 h-7 rounded text-white/50 transition-all duration-[250ms] hover:text-blue"
              iconSize={15}
            />
            <ThemeToggle variant="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
