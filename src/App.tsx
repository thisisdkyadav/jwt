import { useState } from "react"
import TokenDecoder from "./components/TokenDecoder"
import TokenEncoder from "./components/TokenEncoder"
import SignatureVerifier from "./components/SignatureVerifier"
import SecretStrengthChecker from "./components/SecretStrengthChecker"
import KeyGenerator from "./components/KeyGenerator"
import LifetimeVisualizer from "./components/LifetimeVisualizer"
import "./App.css"

const TABS = [
	{ label: "Decode", component: <TokenDecoder /> },
	{ label: "Encode", component: <TokenEncoder /> },
	{ label: "Verify", component: <SignatureVerifier /> },
	{ label: "Strength", component: <SecretStrengthChecker /> },
	{ label: "Keys", component: <KeyGenerator /> },
	{ label: "Visualize", component: <LifetimeVisualizer /> },
]

function App() {
	const [tab, setTab] = useState(0)
	return (
		<div className="min-h-screen bg-gray-50 text-gray-900">
			<header className="p-4 border-b flex flex-col items-center gap-2">
				<h1 className="text-2xl font-bold">JWT Developer Toolkit</h1>
				<nav className="flex gap-2 mt-2">
					{TABS.map((t, i) => (
						<button
							key={t.label}
							className={`px-3 py-1 rounded-t font-medium border-b-2 transition-colors ${
								tab === i
									? "border-blue-500 bg-white"
									: "border-transparent bg-gray-100 hover:bg-gray-200"
							}`}
							onClick={() => setTab(i)}
						>
							{t.label}
						</button>
					))}
				</nav>
			</header>
			<main className="p-4 max-w-3xl mx-auto">
				{TABS[tab].component}
			</main>
		</div>
	)
}

export default App
