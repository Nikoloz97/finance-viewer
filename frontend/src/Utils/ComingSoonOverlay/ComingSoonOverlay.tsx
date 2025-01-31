import { CSSProperties, ReactNode } from "react";
import "./ComingSoonOverlay.css";

interface ComingSoonOverlayProps {
  children: ReactNode;
  containerStyle?: CSSProperties;
  overlayStyle?: CSSProperties;
  overlayTextStyle?: CSSProperties;
}

const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({
  children,
  overlayStyle,
  containerStyle,
  overlayTextStyle,
}) => {
  return (
    <div className="overlay-container" style={{ ...containerStyle }}>
      {children}
      <div className="overlay" style={{ ...overlayStyle }}>
        <div className="overlay-text" style={{ ...overlayTextStyle }}>
          Coming Soon
        </div>
      </div>
    </div>
  );
};

export default ComingSoonOverlay;
