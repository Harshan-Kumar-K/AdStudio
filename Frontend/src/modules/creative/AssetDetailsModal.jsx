import React from "react";
import StatusBadge from "../../components/StatusBadge.jsx";
import { IcTarget, IcLink } from "../../assets/icons.jsx";
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

function previewKindFor(formatKey) {
  if (["Banner", "Image", "Native", "RichMedia"].includes(formatKey)) return "image";
  if (formatKey === "Video") return "video";
  if (formatKey === "Audio") return "audio";
  return "none";
}

function toPascalNoSep(str) {
  if (!str) return str;
  return String(str)
    .toLowerCase()
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

export default function AssetDetailsModal({ asset, onClose, brands = [], briefs = [], users = [], links = [], onRequestLink }) {
  const formatKey = toFormatKey(asset?.format ?? asset?.assetType);
  const previewKind = previewKindFor(formatKey);
  const assetId = asset?.assetId ?? asset?.id;
  // Same JWT-protected /file endpoint as AssetCard - fetched with the auth
  // header attached and turned into a blob URL, since a plain <img src>
  // can't send Authorization and would otherwise always 401.
  const rawUrl =
    asset && assetId != null && previewKind !== "none"
      ? `${API_BASE}/${ENDPOINTS.creativeAssets}/${assetId}/file`
      : null;
  const { blobUrl, failed, error } = useAuthedFileUrl(rawUrl);

  if (!asset) return null;

  const formatLabel = asset.format ?? asset.assetType;
  const meta = FORMAT_META[formatKey] || FORMAT_META.Banner;
  const Icon = meta.Icon;
  const showMedia = blobUrl && !failed;

  const brand = brands.find((b) => String(b.brandId ?? b.id) === String(asset.brandId));
  const brief = briefs.find((b) => String(b.briefId ?? b.id) === String(asset.campaignBriefId));
  const uploaderId = asset.uploadedById ?? asset.uploadedBy;
  const uploader = users.find((u) => String(u.userId ?? u.id) === String(uploaderId));

  const linkedRows = links.filter((l) => String(l.assetId) === String(assetId));
  const isApproved = String(asset.status).toUpperCase() === "APPROVED";

  const rows = [
    ["Asset ID", assetId],
    ["Brand", brand ? `${brand.brandId ?? brand.id} — ${brand.brandName ?? brand.name}` : asset.brandId],
    ["Campaign Brief", brief ? `${brief.briefId ?? brief.id} — ${brief.campaignName ?? brief.name}` : (asset.campaignBriefId ?? "—")],
    ["Type", formatLabel],
    ["Dimensions", asset.width && asset.height ? `${asset.width} x ${asset.height}` : (asset.dimensions ?? "—")],
    ["File", asset.filePath ?? "—"],
    ["Size", asset.fileSizeKB != null ? `${asset.fileSizeKB} KB` : "—"],
    ["Version", `v${asset.version}`],
    ["Uploaded By", uploader ? uploader.name : uploaderId != null ? `User #${uploaderId}` : "—"],
  ];

  return (
    <div className="universal-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="universal-modal">
        <span className="universal-orb universal-orb-1" />
        <span className="universal-orb universal-orb-2" />

        <button type="button" className="universal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="universal-header">
          <h2 className="universal-title"><IcTarget /> {asset.assetName}</h2>
          <p className="universal-subtitle">Asset details</p>
        </div>

        <div className="creative-thumb" style={{ background: meta.grad, marginBottom: 16, position: "relative", overflow: "hidden", minHeight: 160 }}>
          {showMedia && previewKind === "image" && (
            <img
              src={blobUrl}
              alt={asset.assetName}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
          {showMedia && previewKind === "video" && (
            <video
              src={blobUrl}
              controls
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
          {showMedia && previewKind === "audio" && (
            <>
              <Icon className="fmt-ic" style={{ position: "relative", zIndex: 1 }} />
              <audio
                src={blobUrl}
                controls
                style={{ position: "absolute", bottom: 10, left: 10, right: 10, width: "calc(100% - 20px)" }}
              />
            </>
          )}
          {!showMedia && (
            <Icon
              className="fmt-ic"
              style={{ position: "relative", zIndex: 1 }}
              title={failed && error ? `Preview failed: ${error}` : undefined}
            />
          )}
        </div>

        <div className="universal-form">
          {rows.map(([label, value]) => (
            <div key={label} className="universal-field-row" style={{ gridTemplateColumns: "140px 1fr", alignItems: "center" }}>
              <label className="universal-label">{label}</label>
              <span className="txt-sm">{value}</span>
            </div>
          ))}

          <div className="universal-field-row" style={{ gridTemplateColumns: "140px 1fr", alignItems: "center" }}>
            <label className="universal-label">Status</label>
            <StatusBadge status={toPascalNoSep(asset.status)} />
          </div>

          <div className="universal-field" style={{ marginTop: 8 }}>
            <label className="universal-label">Linked Line Items</label>
            {linkedRows.length === 0 ? (
              <span className="universal-hint">Not linked to any line item yet.</span>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {linkedRows.map((l) => (
                  <span key={l.linkId} className="badge badge-navy">{l.lineItemId}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="universal-actions">
          <button type="button" className="universal-btn universal-btn-ghost" onClick={onClose}>
            Close
          </button>
          {isApproved && (
            <button
              type="button"
              className="universal-btn universal-btn-primary"
              onClick={() => onRequestLink?.(assetId)}
            >
              <IcLink /> Link to line item
            </button>
          )}
        </div>
      </div>
    </div>
  );
}