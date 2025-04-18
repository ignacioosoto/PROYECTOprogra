import { Children } from "react"
import { Link } from "react-router-dom"

interface DefaultLayoutProps {
    children: React.ReactNode;
}

//pagina que tenga el menu de nagevacion
export default function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <>
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/signup">Singup</Link>
                        </li>
                    </ul>
                </nav>

            </header>
            <main>{children}</main>
        </>
    )
}