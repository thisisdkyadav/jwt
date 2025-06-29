import { useState, useEffect } from "react"
import TokenDecoder from "./components/TokenDecoder"
import TokenEncoder from "./components/TokenEncoder"
import SecretStrengthChecker from "./components/SecretStrengthChecker"
import KeyGenerator from "./components/KeyGenerator"
import LifetimeVisualizer from "./components/LifetimeVisualizer"
import { Toaster } from "sonner"
import { KeyRound, FileJson, KeySquare, Clock, Menu, X, Sun, Moon } from "lucide-react"
import "./App.css"

function App() {
  const [tab, setTab] = useState(0)
  const [isDark, setIsDark] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu when tab changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [tab])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const TABS = [
    {
      label: "Decode",
      icon: <FileJson size={18} />,
      component: <TokenDecoder isDark={isDark} />,
    },
    {
      label: "Encode",
      icon: <FileJson size={18} />,
      component: <TokenEncoder isDark={isDark} />,
    },
    {
      label: "Strength",
      icon: <KeyRound size={18} />,
      component: <SecretStrengthChecker isDark={isDark} />,
    },
    {
      label: "Keys",
      icon: <KeySquare size={18} />,
      component: <KeyGenerator isDark={isDark} />,
    },
    {
      label: "Visualize",
      icon: <Clock size={18} />,
      component: <LifetimeVisualizer isDark={isDark} />,
    },
  ]

  return (
    <div className={`min-h-screen w-full flex flex-col transition-all duration-500 ${isDark ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800" : "bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50"}`}>
      {/* Toaster for notifications */}
      <Toaster position="top-right" theme={isDark ? "dark" : "light"} richColors />

      {/* Fixed Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${isDark ? "bg-slate-900/80 border-slate-700/50" : "bg-white/80 border-sky-200/50"}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-sky-500" : "bg-sky-600"}`}>
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>JWTBench</h1>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Modern JWT Developer Bench</p>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 rounded-xl transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`}>
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
              <div className="flex items-center space-x-1 lg:space-x-2">
                {TABS.map((t, i) => (
                  <button
                    key={t.label}
                    className={`
                      px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-medium
                      transition-all duration-200 ease-out flex items-center gap-2
                      ${tab === i ? `${isDark ? "bg-sky-500 text-white" : "bg-sky-600 text-white"} shadow-lg` : `${isDark ? "text-gray-300 hover:text-white hover:bg-slate-700/50" : "text-gray-600 hover:text-gray-900 hover:bg-sky-50"}`}
                    `}
                    onClick={() => setTab(i)}
                  >
                    {t.icon}
                    <span className="hidden lg:inline">{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Theme Toggle */}
              <button onClick={toggleTheme} className={`p-2 rounded-xl transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 sm:hidden ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
        <div className={`absolute top-16 right-0 w-64 p-4 rounded-bl-2xl shadow-xl transition-all duration-300 transform ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"} ${isDark ? "bg-slate-800 border-l border-b border-slate-700/50" : "bg-white border-l border-b border-sky-200/50"}`}>
          <div className="flex flex-col space-y-2">
            {TABS.map((t, i) => (
              <button
                key={t.label}
                className={`
                  px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 ease-out flex items-center gap-3
                  ${tab === i ? `${isDark ? "bg-sky-500 text-white" : "bg-sky-600 text-white"} shadow-lg` : `${isDark ? "text-gray-300 hover:text-white hover:bg-slate-700/50" : "text-gray-600 hover:text-gray-900 hover:bg-sky-50"}`}
                `}
                onClick={() => setTab(i)}
              >
                {t.icon}
                {t.label}
              </button>
            ))}

            {/* Theme Toggle in mobile menu */}
            <button onClick={toggleTheme} className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${isDark ? "text-gray-300 hover:text-white hover:bg-slate-700/50" : "text-gray-600 hover:text-gray-900 hover:bg-sky-50"}`}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-16 sm:pt-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className={`transition-all duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>{TABS[tab].component}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 ${isDark ? "bg-slate-900/50 border-slate-700/50 text-gray-400" : "bg-white/50 border-sky-200/50 text-gray-500"}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm">JWTBench &copy; {new Date().getFullYear()} &mdash; Secure, client-side processing</div>
        </div>
      </footer>
    </div>
  )
}

export default App
