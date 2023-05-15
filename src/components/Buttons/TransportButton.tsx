import { ReactNode } from "react";
import "./styles.css";

type Props = {
  children: ReactNode;
};

function TransportButton({ children, ...props }: Props) {
  return (
    <button style={{ padding: "1.025rem" }} className="button" {...props}>
      {children}
    </button>
  );
}

export default TransportButton;
