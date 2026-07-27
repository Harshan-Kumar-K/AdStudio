import React from "react";
import StatusBadge from "../../components/StatusBadge.jsx";
import { FORMAT_META } from "./creativeStudio.constants.js";

export default function AssetCard({ asset }) {
  const meta = FORMAT_META[asset.format] || FORMAT_META.Banner;
  const Icon = meta.Icon;

  return (
    <div className="creative-card">
      <div className="creative-thumb" style={{ background: meta.grad }}>
        <Icon className="fmt-ic" />
        <span className="ver">v{asset.version}</span>
        {asset.dimensions !== "—" && <span className="dims">{asset.dimensions}</span>}
      </div>
      <div className="creative-body">
        <div className="cn">{asset.name}</div>
        <div className="cm">{asset.format} · {asset.brand}</div>
        <div className="cf">
          <StatusBadge status={asset.status} />
          <span className="txt-sm mute">{asset.fileSizeKB} KB</span>
        </div>
      </div>
    </div>
  );
}
