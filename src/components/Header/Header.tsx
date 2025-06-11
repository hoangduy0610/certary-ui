import { Dropdown } from "antd";
import { UserInfo, useUserInfo } from "../../hooks/useUserInfo";
import { logout } from "../../utils/auth";

type HeaderProps = {
    active?: string;
}

export const Header = ({ active }: HeaderProps) => {
    const { userInfo } = useUserInfo();

    const getSpecialRoute = (userInfo: Partial<UserInfo>) => {
        if (!userInfo.id) {
            return { name: "Login", path: "/login", active: active === "login" };
        }

        if (userInfo.role !== "user") {
            return { name: "Admin Dashboard", path: "/admin", active: active === "admin" };
        }
    };

    const navLinks = [
        { name: "Home", path: "/", active: active === "home" },
        { name: "My Certificate", path: "/my-certificates", active: active === "my-certificates" },
        { name: "Forum", path: "/forum", active: active === "forum" },
        { name: "Verification", path: "/verify-certificate", active: active === "verify-certificate" },
        { name: "Contact", path: "/contact", active: active === "contact" },
        { ...getSpecialRoute(userInfo) }
    ];

    return (
        <header className="header">
            <a href="/" className="logo" style={{ textDecoration: "none" }}>
                Certary
            </a>
            <nav className="navigation">
                {
                    navLinks.map((link) => link.path && (
                        <a
                            key={link.name}
                            href={link.path}
                            className={`navLink ${link.active && "active"}`}
                        >
                            {link.name}
                        </a>
                    ))
                }

                {userInfo.id && (
                    <Dropdown
                        menu={{
                            items: [
                                { key: 'logout', label: <a onClick={() => { logout() }} className="navLink">Logout</a> }
                            ]
                        }}
                        trigger={['click']}
                    >
                        <a
                            type="text"
                            className={`navLink dropdownToggle`}
                        >
                            Hello, {userInfo.firstName} {userInfo.lastName} <span style={{ marginLeft: 4, fontSize: 12 }}>▼</span>
                        </a>
                    </Dropdown>
                )
                }
            </nav >
        </header >
    )
}