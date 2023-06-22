import * as React from "react";

export type TextFieldProps = {
  placeholder?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};


const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  onChange,
  style,
  value
}) => {

  const TEXT_FIELD_STYLE = {
    height: "30px",
    width: "100%",
    padding: "4px 8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    ...style
  }

  return (
    <input style={TEXT_FIELD_STYLE} placeholder={placeholder} onChange={onChange} value={value} type="text" />
  )
}

export default TextField;