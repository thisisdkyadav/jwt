import { useState } from "react"
import TokenDecoder from "./components/TokenDecoder"
import TokenEncoder from "./components/TokenEncoder"
import SignatureVerifier from "./components/SignatureVerifier"
import SecretStrengthChecker from "./components/SecretStrengthChecker"
import KeyGenerator from "./components/KeyGenerator"
import LifetimeVisualizer from "./components/LifetimeVisualizer"
import "./App.css"

function App() {
  const [tab, setTab] = useState(0)
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const TABS = [
    { label: "Decode", component: <TokenDecoder isDark={isDark} /> },
    { label: "Encode", component: <TokenEncoder isDark={isDark} /> },
    { label: "Verify", component: <SignatureVerifier isDark={isDark} /> },
    { label: "Strength", component: <SecretStrengthChecker isDark={isDark} /> },
    { label: "Keys", component: <KeyGenerator isDark={isDark} /> },
    { label: "Visualize", component: <LifetimeVisualizer isDark={isDark} /> },
  ]

  return (
    <div className={`min-h-screen w-full flex flex-col transition-all duration-500 ${isDark ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800" : "bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50"}`}>  
      {/* Fixed Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${isDark ? "bg-slate-900/80 border-slate-700/50" : "bg-white/80 border-sky-200/50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Navigation Links */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                {TABS.map((t, i) => (
                  <button
                    key={t.label}
                    className={`
                      px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium
                      transition-all duration-200 ease-out
                      ${tab === i ? `${isDark ? "bg-sky-500 text-white" : "bg-sky-600 text-white"} shadow-lg` : `${isDark ? "text-gray-300 hover:text-white hover:bg-slate-700/50" : "text-gray-600 hover:text-gray-900 hover:bg-sky-50"}`}
                    `}
                    onClick={() => setTab(i)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Theme Toggle */}
              <button onClick={toggleTheme} className={`p-2 rounded-xl transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`}>
                {isDark ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`transition-all duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>{TABS[tab].component}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 ${isDark ? "bg-slate-900/50 border-slate-700/50 text-gray-400" : "bg-white/50 border-sky-200/50 text-gray-500"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm">JWTBench &copy; {new Date().getFullYear()} &mdash; Secure, client-side processing</div>
        </div>
      </footer>
    </div>
  )
}

export default App
