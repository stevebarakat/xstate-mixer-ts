import { FeedbackDelay, Reverb } from "tone";
import BusPanel1 from "./BusPanel1";
import BusPanel2 from "./BusPanel2";

type Props = {
  fx: any;
  busFx: {
    reverb1: Reverb;
    reverb2: Reverb;
    delay1: FeedbackDelay;
    delay2: FeedbackDelay;
  };
  disabled: { panel1: boolean; panel2: boolean };
};

function BusPanels({ fx, busFx, disabled }: Props) {
  return (
    <div>
      <BusPanel1 disabled={disabled} fx={fx} busFx={busFx} />
      <BusPanel2 disabled={disabled} fx={fx} busFx={busFx} />
    </div>
  );
}

export default BusPanels;
