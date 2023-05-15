import { ReactNode } from "react";
import "./styles.css";

type Props = {
  children: ReactNode;
};

function ChannelButton({ children, ...props }: Props) {
  return (
    <button
      style={{ margin: "0.6rem 0 0.4rem", padding: "0.25rem 0.5rem" }}
      className="button"
      {...props}
    >
      {children}
    </button>
  );
}

export default ChannelButton;
