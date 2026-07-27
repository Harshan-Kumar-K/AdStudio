import {
  IcFmtBanner, IcFmtVideo, IcFmtNative, IcFmtAudio, IcFmtRich, IcFmtText,
} from "../../assets/icons.jsx";

export const FORMAT_META = {
  Banner: { Icon: IcFmtBanner, grad: "linear-gradient(135deg,#1f4396,#2f5bc4)" },
  Video: { Icon: IcFmtVideo, grad: "linear-gradient(135deg,#122a5c,#18367a)" },
  Native: { Icon: IcFmtNative, grad: "linear-gradient(135deg,#2f5bc4,#3d8bff)" },
  Audio: { Icon: IcFmtAudio, grad: "linear-gradient(135deg,#0e1f44,#1f4396)" },
  RichMedia: { Icon: IcFmtRich, grad: "linear-gradient(135deg,#18367a,#5fa3ff)" },
  Text: { Icon: IcFmtText, grad: "linear-gradient(135deg,#3a4763,#6c7a9c)" },
};

export const DECISION_TONE = {
  Approved: "badge-green",
  Rejected: "badge-red",
  RevisionRequired: "badge-amber",
};
