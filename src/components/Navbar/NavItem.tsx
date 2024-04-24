interface IProps {
    text: string;
    active?: boolean;
    disabled?: boolean;
}

export const NavItem = ({ text, active = false, disabled = false }: IProps) => {
    return (
        <li className="nav-item">
            <a className={`nav-link ${active ? "active" : ""}`} aria-current={active ? "page" : undefined} href="#">
                {text}
            </a>
        </li>
    );
};
