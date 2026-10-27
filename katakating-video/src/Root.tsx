import { Composition } from "remotion";
import { KatakatingVideo } from "./KatakatingVideo";
import { FPS, HEIGHT, WIDTH } from "./constants/video";
import { TOTAL_FRAMES } from "./timing/vo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="KatakatingLaunch"
      component={KatakatingVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
