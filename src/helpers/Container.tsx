import * as React from "react";


type ContainerProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  justifyCenter?: boolean;
  alignCenter?: boolean;
  spaceBetween?: string;
};

const Container: React.FC<ContainerProps> = ({children, style, justifyCenter=false, alignCenter=false, spaceBetween='1rem'}) => {
  const CONTAINER_STYLE = {
    display: 'flex',
    padding: '1rem',

    justifyContent: justifyCenter ? 'center' : 'flex-start',
    alignItems: alignCenter ? 'center' : 'flex-start',
    gap: spaceBetween,
    ...style
  }
  return (
    <div style={CONTAINER_STYLE} >
        {children}
    </div>
  )
}

export default Container;