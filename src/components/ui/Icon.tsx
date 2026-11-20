import {
  ArrowRight, Boxes, Briefcase, Building2, Calculator, Calendar, Check, ClipboardCheck, Clock, CircleDollarSign,
  Cog, Download, Droplets, Eye, Factory, FileCheck, FileSearch, FileSpreadsheet, FileText, Flame, Gauge,
  GraduationCap, Hammer, Handshake, HardHat, Hospital, Hotel, House, Info, Layers, ListChecks, Lock, Mail, MapPin,
  MessageSquare, Network, Package, PencilRuler, Phone, Receipt, Ruler, Scale, Search, ShieldCheck, Siren,
  Stethoscope, Table2, Target, ThermometerSun, Timer, TrendingUp, TriangleAlert, Upload, Users, Utensils,
  Warehouse, Waves, Wrench, Zap, type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/content/types";

const MAP: Record<IconName, LucideIcon> = {
  phone: Phone, mail: Mail, "arrow-right": ArrowRight, check: Check, clock: Clock, "shield-check": ShieldCheck,
  "file-spreadsheet": FileSpreadsheet, "file-text": FileText, "file-check": FileCheck, ruler: Ruler, layers: Layers,
  search: Search, users: Users, upload: Upload, wrench: Wrench, droplets: Droplets, flame: Flame, building: Building2,
  factory: Factory, hospital: Hospital, warehouse: Warehouse, home: House, calculator: Calculator,
  "clipboard-check": ClipboardCheck, "hard-hat": HardHat, waves: Waves, gauge: Gauge, "map-pin": MapPin,
  download: Download, lock: Lock, dollar: CircleDollarSign, timer: Timer, "pencil-ruler": PencilRuler, boxes: Boxes,
  package: Package, receipt: Receipt, "list-checks": ListChecks, alert: TriangleAlert, info: Info, hammer: Hammer,
  cog: Cog, thermometer: ThermometerSun, zap: Zap, "graduation-cap": GraduationCap, hotel: Hotel, utensils: Utensils,
  stethoscope: Stethoscope, siren: Siren, handshake: Handshake, "file-search": FileSearch, scale: Scale, eye: Eye,
  briefcase: Briefcase, calendar: Calendar, message: MessageSquare, target: Target, "trending-up": TrendingUp,
  network: Network, table: Table2,
};

/** Server-side icon by content name. Client components import their own lucide icons instead (bundle size). */
export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const C = MAP[name];
  return <C size={size} className={className} aria-hidden="true" strokeWidth={2} />;
}
