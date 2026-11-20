import type { IllustrationName } from "@/content/types";
import { BidPackage } from "./BidPackage";
import { DwvIsometric } from "./DwvIsometric";
import { EquipmentRoom } from "./EquipmentRoom";
import { FixtureSchedule } from "./FixtureSchedule";
import { GasManifold } from "./GasManifold";
import { HouseRoughIn } from "./HouseRoughIn";
import { MedicalGasZone } from "./MedicalGasZone";
import { PlanMarkup } from "./PlanMarkup";
import { ProcessPiping } from "./ProcessPiping";
import { RestroomPlan } from "./RestroomPlan";
import { RiserIsometric } from "./RiserIsometric";
import { SprinklerLayout } from "./SprinklerLayout";
import { StormRoof } from "./StormRoof";
import { TakeoffSheet } from "./TakeoffSheet";
import { UndergroundPlan } from "./UndergroundPlan";

type Drawing = (props: { className?: string }) => React.JSX.Element;

const DRAWINGS: Record<IllustrationName, Drawing> = {
  "plan-markup": PlanMarkup,
  "riser-isometric": RiserIsometric,
  "dwv-isometric": DwvIsometric,
  "underground-plan": UndergroundPlan,
  "fixture-schedule": FixtureSchedule,
  "equipment-room": EquipmentRoom,
  "storm-roof": StormRoof,
  "gas-manifold": GasManifold,
  "medical-gas-zone": MedicalGasZone,
  "sprinkler-layout": SprinklerLayout,
  "takeoff-sheet": TakeoffSheet,
  "bid-package": BidPackage,
  "restroom-plan": RestroomPlan,
  "house-rough-in": HouseRoughIn,
  "process-piping": ProcessPiping,
};

/**
 * Inline SVG drawings in a drafted, engineer's-plan style. One drawing per name, each on a 640 x 400
 * sheet with its own paper background, so it reads the same on white cards and on navy sections.
 */
export function Illustration({ name, className }: { name: IllustrationName; className?: string }) {
  const Drawing = DRAWINGS[name];
  return Drawing ? <Drawing className={className} /> : null;
}
