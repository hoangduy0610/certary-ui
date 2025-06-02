type HeaderProps = {
    active?: string;
}

export const Header = ({ active }: HeaderProps) => {
    const navLinks = [
        { name: "Home", path: "/", active: active === "home" },
        { name: "My Certificate", path: "/my-certificates", active: active === "my-certificates" },
        { name: "Forum", path: "/forum", active: active === "forum" },
        { name: "Contact", path: "/contact", active: active === "contact" },
        { name: "Login", path: "/login", active: active === "login" }
    ];

    return (
        <header className="header">
            <a href="/" className="logo" style={{ textDecoration: "none" }}>
                Certary
            </a>
            <nav className="navigation">
                {
                    navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            className={`navLink ${link.active && "active"}`}
                        >
                            {link.name}
                        </a>
                    ))
                }
            </nav>
        </header>
    )
}