import React, { MouseEventHandler, ReactElement } from 'react';
import "../../style/adminButton.css";

type ButtonColor = "gray" | "red" | "green";

const colorToCSSClass = { "gray": "adminButtonGray", "red": "adminButtonRed", "green": "adminButtonGreen" };

const AdminButton = ({ children, onClick, style = {}, disabled = false, color = "gray" }:
    { style?: Object, children: string | ReactElement<any, any>, onClick: MouseEventHandler<HTMLButtonElement>, disabled?: boolean, color?: ButtonColor }) => {

    const colorClass = colorToCSSClass[color];

    return (
        <button style={style} className={`adminButton ${colorClass}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default AdminButton;