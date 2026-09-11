"use client";

import React, { useState } from "react";
import { Package, Edit2, Check, Factory, MapPin, Tag } from "lucide-react";

interface ProductProfileProps {
  profile: {
    product?: string;
    material?: string;
    intended_use?: string;
    target_user?: string;
    industry?: string;
    market?: string;
    location?: string;
  };
  onUpdate?: (updated: any) => void;
}

export const ProductProfileCard: React.FC<ProductProfileProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) onUpdate(formData);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-trust" />
          <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider">Active Product Profile</h3>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="text-xs text-trust hover:text-trust-dark font-medium flex items-center space-x-1"
        >
          {isEditing ? (
            <>
              <Check className="w-3.5 h-3.5 text-bisgreen" />
              <span className="text-bisgreen font-bold">Save</span>
            </>
          ) : (
            <>
              <Edit2 className="w-3.5 h-3.5" />
              <span>Modify</span>
            </>
          )}
        </button>
      </div>

      {!isEditing ? (
        <div className="pt-3 space-y-2 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Product:</span>{" "}
            <span className="font-bold text-navy-900">{profile.product || "Not specified yet"}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <div>
              <span className="text-slate-400">Material:</span> {profile.material || "N/A"}
            </div>
            <div>
              <span className="text-slate-400">Intended Use:</span> {profile.intended_use || "N/A"}
            </div>
            <div>
              <span className="text-slate-400">Industry:</span> {profile.industry || "General"}
            </div>
            <div>
              <span className="text-slate-400">Market:</span> {profile.market || "India"}
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-3 space-y-2 text-xs">
          <div>
            <label className="block text-[11px] text-slate-500 font-medium mb-0.5">Product Name</label>
            <input
              type="text"
              value={formData.product || ""}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-trust"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-0.5">Material</label>
              <input
                type="text"
                value={formData.material || ""}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-trust"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-0.5">Intended Use</label>
              <input
                type="text"
                value={formData.intended_use || ""}
                onChange={(e) => setFormData({ ...formData, intended_use: e.target.value })}
                className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-trust"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
