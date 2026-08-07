import React from "react";
import StatusBadge from "../../components/StatusBadge.jsx";
import { FORMAT_META } from "./creativeStudio.constants.js";
import { API_BASE, ENDPOINTS } from "../../api/endpoints.js";
import { useAuthedFileUrl } from "../../api/useAuthedFileUrl.js";

function toFormatKey(str) {
  if (!str) return "Banner";
  return String(str)
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

// Which HTML tag can actually preview this asset type.
function previewKindFor(formatKey) {
  if (["Banner", "Image", "Native", "RichMedia"].includes(formatKey)) return "image";
  if (formatKey === "Video") return "video";
  if (formatKey === "Audio") return "audio";
  return "none";
}

export default function AssetCard({ asset, users = [], onClick }) {
  const formatLabel = asset.format ?? asset.assetType;
  const formatKey = toFormatKey(formatLabel);
  const meta = FORMAT_META[formatKey] || FORMAT_META.Banner;
  const Icon = meta.Icon;

  const dimensions =
    asset.dimensions ?? (asset.width && asset.height ? `${asset.width}x${asset.height}` : null);

  const brandLabel = asset.brand ?? asset.brandId;
  const assetId = asset.assetId ?? asset.id;

  const uploaderId = asset.uploadedById ?? asset.uploadedBy;
  const uploader = users.find((u) => String(u.userId ?? u.id) === String(uploaderId));
  const uploaderLabel = uploader ? uploader.name : uploaderId != null ? `User #${uploaderId}` : null;

  // The actual uploaded file, served from GET /api/creative-assets/{id}/file.
  // That route is JWT-protected at the gateway, and a plain <img src> can't
  // attach an Authorization header - so we fetch it ourselves (with the
  // token) and turn it into a local blob URL the tag can actually load.
  const previewKind = previewKindFor(formatKey);
  const rawUrl =
    assetId != null && previewKind !== "none"
      ? `${API_BASE}/${ENDPOINTS.creativeAssets}/${assetId}/file`
      : null;
  const { blobUrl, failed, error } = useAuthedFileUrl(rawUrl);
  const showMedia = blobUrl && !failed;

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
      <div className="creative-thumb" style={{ background: meta.grad, position: "relative", overflow: "hidden" }}>
        {showMedia && previewKind === "image" && (
          <img
            src={blobUrl}
            alt={asset.assetName}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        {showMedia && previewKind === "video" && (
          <video
            src={blobUrl}
            muted
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        {showMedia && previewKind === "audio" && (
          <>
            <Icon className="fmt-ic" style={{ position: "relative", zIndex: 1 }} />
            <audio
              src={blobUrl}
              controls
              style={{ position: "absolute", bottom: 6, left: 6, right: 6, width: "calc(100% - 12px)", height: 28 }}
            />
          </>
        )}
        {/* Fallback icon whenever there's no media to show - either this
            asset type has no preview (e.g. a raw text/other asset), or the
            fetch failed. When it failed, hover the icon to see exactly why
            (401/404/network error) instead of guessing. */}
        {!showMedia && (
          <Icon
            className="fmt-ic"
            style={{ position: "relative", zIndex: 1 }}
            title={failed && error ? `Preview failed: ${error}` : undefined}
          />
        )}
        {/* <span className="ver" style={{ position: "relative", zIndex: 1 }}>
          v{asset.version} {"; Id : "} {assetId}
        </span> */}
        {/* {dimensions && dimensions !== "—" && (
          <span className="dims" style={{ position: "relative", zIndex: 1 }}>{dimensions}</span>
        )} */}
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