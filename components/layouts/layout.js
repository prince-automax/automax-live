import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
    return (
        <div className="flex flex-col  min-h-screen ">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}