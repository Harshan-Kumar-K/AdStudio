import React from "react";
import { Loader } from "../../../components/Loader.jsx";
import AssetCard from "../AssetCard.jsx";

export default function AssetsGrid({ assets, loading }) {
  if (loading) return <Loader />;

  return (
    <div className="creative-grid">
      {(assets || []).map((a) => (
        <AssetCard key={a.id} asset={a} />
      ))}
    </div>
  );
}
