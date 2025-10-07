import "@/styles/Tailwind.css"
import "@/styles/Global.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { PanierProvider } from "@/contexts/PanierContext"

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <PanierProvider>
                <Component {...pageProps} />
            </PanierProvider>
        </AuthProvider>
    )
}