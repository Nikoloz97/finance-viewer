import { CSSProperties, ReactNode } from "react";
import "./ComingSoonOverlay.css";

interface ComingSoonOverlayProps {
  children: ReactNode;
  style?: CSSProperties;
}

const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({
  children,
  style,
}) => {
  return (
    <div className="overlay-container" style={{ ...style }}>
      {children}
      <div className="overlay">
        <div className="overlay-text">Coming Soon</div>
      </div>
    </div>
  );
};

export default ComingSoonOverlay;
