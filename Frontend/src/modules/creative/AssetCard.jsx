import React from "react";
import StatusBadge from "../../components/StatusBadge.jsx";
import { FORMAT_META } from "./creativeStudio.constants.js";

function toFormatKey(str) {
  if (!str) return "Banner";
  return String(str)
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

export default function AssetCard({ asset, users = [], onClick }) {
  const formatLabel = asset.format ?? asset.assetType;
  const meta = FORMAT_META[toFormatKey(formatLabel)] || FORMAT_META.Banner;
  const Icon = meta.Icon;

  const dimensions =
    asset.dimensions ?? (asset.width && asset.height ? `${asset.width}x${asset.height}` : null);

  const brandLabel = asset.brand ?? asset.brandId;
  const assetId = asset.assetId ?? asset.id;

  const uploaderId = asset.uploadedById ?? asset.uploadedBy;
  const uploader = users.find((u) => String(u.userId ?? u.id) === String(uploaderId));
  const uploaderLabel = uploader ? uploader.name : uploaderId != null ? `User #${uploaderId}` : null;

  return (
    <div
      className="creative-card"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={onClick ? { cursor: "pointer" } : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="creative-thumb" style={{ background: meta.grad }}>
        <Icon className="fmt-ic" />
        <span className="ver">v{asset.version} {"; Id : "} {assetId}</span>
        {dimensions && dimensions !== "—" && <span className="dims">{dimensions}</span>}
      </div>
      <div className="creative-body">
        <div className="cn">{asset.assetName}</div>
        <div className="cm">{formatLabel} · {" Brand: "}{brandLabel}</div>
        {uploaderLabel && <div className="cm txt-sm mute">Uploaded by {uploaderLabel}</div>}
        <div className="cf">
          <StatusBadge status={asset.status} />
          <span className="txt-sm mute">{asset.fileSizeKB} KB</span>
        </div>
      </div>
    </div>
  );
}