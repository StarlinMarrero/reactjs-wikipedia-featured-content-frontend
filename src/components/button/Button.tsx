import React from "react";

enum EnumButtonStyleTypes {
    PRIMARY = "btn-primary",
    SECONDARY = "btn-secondary",
    SUCCESS = "btn-success",
    DANGER = "btn-danger",
    WARNING = "btn-warning",
    INFO = "btn-info",
    LIGHT = "btn-light",
    DARK = "btn-dark",
    LINK = "btn-link",
}

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    styleType?: EnumButtonStyleTypes;
}

const Button = ({ children, styleType, ...rest }: IButtonProps) => {
    return (
        <button className={`btn ${styleType || EnumButtonStyleTypes.PRIMARY}`} {...rest}>
            {children}
        </button>
    );
};

export default Button;
