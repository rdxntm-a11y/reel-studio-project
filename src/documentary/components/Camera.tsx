import type { CSSProperties, ReactNode } from "react";
import { cameraTransform, type CameraMove } from "../motion";

type CameraProps = {
  frame: number;
  duration: number;
  move?: CameraMove;
  strength?: number;
  children: ReactNode;
  style?: CSSProperties;
};

export const Camera: React.FC<CameraProps> = ({ frame, duration, move = "push", strength = 1, children, style }) => {
  const pose = cameraTransform(frame, duration, move, strength);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: pose.transform,
        transformOrigin: "58% 46%",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
