import React from "react";
import { Loader } from "../../../components/Loader.jsx";
import AssetCard from "../AssetCard.jsx";

export default function AssetsGrid({ assets, loading, users = [], onSelect }) {
  if (loading) return <Loader />;

  return (
    <div className="creative-grid">
      {(assets || []).map((a) => (
        <AssetCard key={a.assetId ?? a.id} asset={a} users={users} onClick={() => onSelect?.(a)} />
      ))}
    </div>
  );
}