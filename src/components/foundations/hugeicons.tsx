import {
  forwardRef,
  type ComponentProps,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import * as iconDefinitions from "@hugeicons/core-free-icons";

type HugeIconDefinition = ComponentProps<typeof HugeiconsIcon>["icon"];
export type LucideProps = Omit<ComponentProps<typeof HugeiconsIcon>, "icon"> & {
  absoluteStrokeWidth?: boolean;
};
export type LucideIcon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

const definitions = iconDefinitions as unknown as Record<
  string,
  HugeIconDefinition | undefined
>;
const aliases: Record<string, string> = {
  BarChart2: "BarChartIcon",
  BarChart3: "ChartColumnIcon",
  CheckCircle2: "CheckmarkCircle02Icon",
  DownloadCloud: "CloudDownloadIcon",
  Edit2: "Edit02Icon",
  Edit3: "Edit03Icon",
  Globe2: "Globe02Icon",
  Layers3: "Layers02Icon",
  Loader2: "LoaderCircleIcon",
  PlusCircle: "PlusSignCircleIcon",
  Sliders: "SlidersHorizontalIcon",
  UploadCloud: "CloudUploadIcon",
};

const createHugeIcon = (name: string): LucideIcon => {
  const definition =
    definitions[aliases[name] ?? `${name}Icon`] ??
    definitions[name] ??
    definitions.HelpCircleIcon;

  const Icon = forwardRef<SVGSVGElement, LucideProps>(
    ({ absoluteStrokeWidth, ...props }, ref) => {
      void absoluteStrokeWidth;
      return (
        <HugeiconsIcon
          {...props}
          ref={ref}
          icon={definition as HugeIconDefinition}
        />
      );
    },
  );
  Icon.displayName = name;
  return Icon;
};

export const Activity = createHugeIcon("Activity03Icon");
export const AlertCircle = createHugeIcon("AlertCircle");
export const AlertTriangle = createHugeIcon("AlertTriangle");
export const AlignLeft = createHugeIcon("AlignLeft");
export const Archive = createHugeIcon("Archive");
export const ArrowDown = createHugeIcon("ArrowDown");
export const ArrowLeft = createHugeIcon("ArrowLeft");
export const ArrowRight = createHugeIcon("ArrowRight");
export const ArrowUpRight = createHugeIcon("ArrowUpRight");
export const Award = createHugeIcon("Award");
export const BadgeAlert = createHugeIcon("BadgeAlert");
export const BarChart2 = createHugeIcon("BarChart2");
export const BarChart3 = createHugeIcon("BarChart3");
export const Bell = createHugeIcon("Bell");
export const Book = createHugeIcon("Book");
export const BookSubmit = createHugeIcon("BookUploadIcon");
export const BookPublish = createHugeIcon("BookUp2Icon");
export const Books = createHugeIcon("BookCopyIcon");
export const BookAlertIcon = createHugeIcon("BookAlertIcon");
export const BookCheck = createHugeIcon("BookCheck");
export const BookHeart = createHugeIcon("BookHeart");
export const Bookmark = createHugeIcon("Bookmark");
export const BookMarked = createHugeIcon("BookMarked");
export const BookOpen = createHugeIcon("BookOpen");
export const Box = createHugeIcon("Box");
export const Brain = createHugeIcon("Brain");
export const Building = createHugeIcon("Building");
export const Building2 = createHugeIcon("Building2");
export const Calendar = createHugeIcon("Calendar03Icon");
export const CalendarCheck = createHugeIcon("CalendarCheck");
export const CalendarCheck2 = createHugeIcon("CalendarCheck2");
export const CalendarClock = createHugeIcon("DateTimeIcon");
export const CalendarDays = createHugeIcon("CalendarDays");
export const CalendarPlus = createHugeIcon("CalendarPlus");
export const Check = createHugeIcon("Check");
export const CheckCircle = createHugeIcon("CheckCircle");
export const CheckCircle2 = createHugeIcon("CheckCircle2");
export const CheckSquare = createHugeIcon("CheckSquare");
export const ChevronDown = createHugeIcon("ChevronDown");
export const ChevronLeft = createHugeIcon("ChevronLeft");
export const ChevronRight = createHugeIcon("ChevronRight");
export const ChevronUp = createHugeIcon("ChevronUp");
export const Circle = createHugeIcon("Circle");
export const CircleCheckBig = createHugeIcon("CircleCheckBig");
export const CircleDashed = createHugeIcon("CircleDashed");
export const Clock = createHugeIcon("Clock");
export const ClockAlert = createHugeIcon("ClockAlertIcon");
export const Clock5 = createHugeIcon("Clock05Icon");
export const CloudDownload = createHugeIcon("CloudDownload");
export const CloudOff = createHugeIcon("CloudOff");
export const Coffee = createHugeIcon("Coffee");
export const Coins = createHugeIcon("Coins");
export const Compass = createHugeIcon("Compass");
export const Copy = createHugeIcon("Copy");
export const CornerDownRight = createHugeIcon("CornerDownRight");
export const Cpu = createHugeIcon("Cpu");
export const CreditCard = createHugeIcon("CreditCard");
export const Crosshair = createHugeIcon("Crosshair");
export const Crown = createHugeIcon("Crown");
export const Database = createHugeIcon("Database");
export const DollarSign = createHugeIcon("DollarSign");
export const Download = createHugeIcon("Download");
export const DownloadCloud = createHugeIcon("DownloadCloud");
export const Droplet = createHugeIcon("Droplet");
export const Edit2 = createHugeIcon("Edit2");
export const Edit3 = createHugeIcon("Edit3");
export const ExternalLink = createHugeIcon("ExternalLink");
export const Eye = createHugeIcon("Eye");
export const EyeOff = createHugeIcon("EyeOff");
export const Feather = createHugeIcon("Feather");
export const Files = createHugeIcon("Files");
export const FileSearch = createHugeIcon("FileSearch");
export const FileText = createHugeIcon("FileText");
export const Filter = createHugeIcon("Filter");
export const Fingerprint = createHugeIcon("Fingerprint");
export const Flame = createHugeIcon("Flame");
export const Folder = createHugeIcon("Folder");
export const FolderOpen = createHugeIcon("FolderOpen");
export const FolderPlus = createHugeIcon("FolderPlus");
export const FolderTree = createHugeIcon("FolderTree");
export const Frown = createHugeIcon("Frown");
export const Gauge = createHugeIcon("Gauge");
export const Gem = createHugeIcon("Gem");
export const Gift = createHugeIcon("Gift");
export const Globe = createHugeIcon("Globe");
export const Globe2 = createHugeIcon("Globe2");
export const GraduationCap = createHugeIcon("GraduationCap");
export const HardDrive = createHugeIcon("HardDrive");
export const Hash = createHugeIcon("Hash");
export const Heart = createHugeIcon("Heart");
export const HeartCrack = createHugeIcon("HeartCrack");
export const HeartHandshake = createHugeIcon("HeartHandshake");
export const HelpCircle = createHugeIcon("HelpCircle");
export const History = createHugeIcon("History");
export const Home = createHugeIcon("Home");
export const Hourglass = createHugeIcon("Hourglass");
export const Image = createHugeIcon("Image");
export const ImageIcon = createHugeIcon("ImageIcon");
export const ImageOff = createHugeIcon("ImageOff");
export const Info = createHugeIcon("Info");
export const KeyRound = createHugeIcon("KeyRound");
export const Languages = createHugeIcon("Languages");
export const Layers = createHugeIcon("Layers");
export const Layers3 = createHugeIcon("Layers3");
export const LayoutDashboard = createHugeIcon("LayoutDashboard");
export const LayoutGrid = createHugeIcon("LayoutGrid");
export const LayoutList = createHugeIcon("LayoutList");
export const Leaf = createHugeIcon("Leaf");
export const Library = createHugeIcon("Library");
export const LibraryBig = createHugeIcon("LibraryBig");
export const Lightbulb = createHugeIcon("Lightbulb");
export const Link = createHugeIcon("Link");
export const List = createHugeIcon("List");
export const ListOrdered = createHugeIcon("ListOrdered");
export const ListPlus = createHugeIcon("ListPlus");
export const Loader2 = createHugeIcon("Loader2");
export const Lock = createHugeIcon("Lock");
export const LogIn = createHugeIcon("LogIn");
export const LogOut = createHugeIcon("LogOut");
export const Mail = createHugeIcon("Mail");
export const Map = createHugeIcon("Map");
export const MapPin = createHugeIcon("MapPin");
export const Maximize2 = createHugeIcon("Maximize2");
export const Meh = createHugeIcon("Meh");
export const Menu = createHugeIcon("Menu");
export const MessageCircle = createHugeIcon("MessageCircle");
export const MessageSquare = createHugeIcon("MessageSquare");
export const Mic = createHugeIcon("Mic");
export const Moon = createHugeIcon("Moon");
export const MoreHorizontalIcon = createHugeIcon("MoreHorizontalIcon");
export const MoreVertical = createHugeIcon("MoreVertical");
export const MousePointerClick = createHugeIcon("MousePointerClick");
export const MoveRight = createHugeIcon("MoveRight");
export const Pause = createHugeIcon("Pause");
export const Pencil = createHugeIcon("Edit02Icon");
export const PendingUser = createHugeIcon("UserTime02Icon");
export const PenLine = createHugeIcon("PenLine");
export const Play = createHugeIcon("Play");
export const Plus = createHugeIcon("Plus");
export const PlusCircle = createHugeIcon("PlusCircle");
export const Power = createHugeIcon("Power");
export const Presentation = createHugeIcon("Presentation");
export const Printer = createHugeIcon("Printer");
export const QrCode = createHugeIcon("QrCode");
export const Quote = createHugeIcon("Quote");
export const QuickAccess = createHugeIcon("EnergyIcon");
export const Receipt = createHugeIcon("Receipt");
export const ReceiptText = createHugeIcon("ReceiptText");
export const RefreshCcw = createHugeIcon("RefreshCcw");
export const RefreshCw = createHugeIcon("RefreshCw");
export const RotateCcw = createHugeIcon("RotateCcw");
export const RotateCw = createHugeIcon("RotateCw");
export const Save = createHugeIcon("Save");
export const Scale = createHugeIcon("Scale");
export const ScanSearch = createHugeIcon("ScanSearch");
export const School = createHugeIcon("School");
export const Search = createHugeIcon("Search");
export const Send = createHugeIcon("Send");
export const Settings = createHugeIcon("Settings");
export const Share2 = createHugeIcon("Share2");
export const Share8 = createHugeIcon("Share08Icon");
export const Shield = createHugeIcon("Shield");
export const ShieldAlert = createHugeIcon("ShieldAlert");
export const ShieldCheck = createHugeIcon("ShieldCheck");
export const Siren = createHugeIcon("Siren");
export const Sliders = createHugeIcon("Sliders");
export const SlidersHorizontal = createHugeIcon("SlidersHorizontal");
export const Smartphone = createHugeIcon("Smartphone");
export const Smile = createHugeIcon("Smile");
export const Sparkles = createHugeIcon("Sparkles");
export const Square = createHugeIcon("Square");
export const Star = createHugeIcon("Star");
export const Stars = createHugeIcon("Stars");
export const Sun = createHugeIcon("Sun");
export const Tag = createHugeIcon("Tag");
export const Target = createHugeIcon("Target");
export const Teacher = createHugeIcon("StudentsIcon");
export const ToggleLeft = createHugeIcon("ToggleLeft");
export const ToggleRight = createHugeIcon("ToggleRight");
export const Trash2 = createHugeIcon("Trash2");
export const TrendingDown = createHugeIcon("TrendingDown");
export const TrendingUp = createHugeIcon("TrendingUp");
export const TriangleAlert = createHugeIcon("TriangleAlert");
export const Trophy = createHugeIcon("Trophy");
export const Undo2 = createHugeIcon("Undo2");
export const Unlock = createHugeIcon("Unlock");
export const Upload = createHugeIcon("Upload");
export const UploadCloud = createHugeIcon("UploadCloud");
export const User = createHugeIcon("User");
export const UserCheck = createHugeIcon("UserCheck02Icon");
export const UserCircle = createHugeIcon("UserCircle");
export const UserMinus = createHugeIcon("UserMinus");
export const UserPlus = createHugeIcon("UserAdd02Icon");
export const Users = createHugeIcon("UserGroup02Icon");
export const UsersRound = createHugeIcon("UsersRound");
export const UserX = createHugeIcon("UserBlock02Icon");
export const Volume2 = createHugeIcon("Volume2");
export const VolumeX = createHugeIcon("VolumeX");
export const Wallet = createHugeIcon("Wallet");
export const WalletCards = createHugeIcon("WalletCardsIcon");
export const Wifi = createHugeIcon("Wifi");
export const WifiOff = createHugeIcon("WifiOff");
export const X = createHugeIcon("X");
export const XCircle = createHugeIcon("XCircle");
export const Zap = createHugeIcon("Zap");
export const ZoomIn = createHugeIcon("ZoomIn");
export const ZoomOut = createHugeIcon("ZoomOut");
