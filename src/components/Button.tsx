import * as React from "react";

export enum ButtonType {
  PRIMARY = "btn-primary",
  SECONDARY = "btn-secondary",
  TERTIARY = "btn-tertiary"
}

export enum ButtonSize {
  SMALL = "btn-sm",
  MEDIUM = "btn-md",
  LARGE = "btn-lg"
}

export type ButtonProps = {
  text?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  type?: ButtonType;
  size?: ButtonSize;
};

const Button: React.FC<ButtonProps> = ({
    text,
    icon,
    onClick, 
    style, 
    type=ButtonType.PRIMARY, 
    size=ButtonSize.MEDIUM
}) => {

  return (
        <button className={`btn ${type} ${size}`} onClick={onClick} style={style}>
            {icon}{text}
        </button>
  )
}

export default Button;