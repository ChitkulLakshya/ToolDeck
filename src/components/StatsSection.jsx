import React from "react";
import { QrCode, Users, Heart } from "lucide-react";

const ToolStatPill = ({ icon: Icon, value, colorClass }) => (
  <div className={`p-5 m-2 flex flex-col items-center justify-center rounded-[20px] shadow-lg ${colorClass} min-w-[150px]`}>
    <Icon className="w-8 h-8 mb-2" />
    <span className="text-2xl font-bold">{value}</span>
  </div>
);

const StatsSection = () => (
  <section className="bg-white py-12">
    <div className="flex justify-center gap-6">
      <ToolStatPill icon={QrCode} value="6 Tools" colorClass="bg-cyan-100" />
      <ToolStatPill icon={Users} value="∞ Users" colorClass="bg-pink-100" />
      <ToolStatPill icon={Heart} value="No Cost" colorClass="bg-green-100" />
    </div>
  </section>
);

export default StatsSection;
