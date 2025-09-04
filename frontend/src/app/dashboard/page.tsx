"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { VehicleDashboard } from "@/components/vehicale-dashboard";

export default function DashboardPage() {
  const [stats, setStats] = useState({ vehicles: 0, bookings: 0, capacity: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        // Fetch vehicles
        const vehicles = await apiFetch<any[]>("/vehicles", { method: "GET" });
        const bookings = await apiFetch<any[]>("/bookings", { method: "GET" });

        setStats({
          vehicles: vehicles.length,
          bookings: bookings.length,
          capacity: vehicles.reduce((sum, v) => sum + v.capacityKg, 0),
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    }
    loadStats();
  }, []);

  return (
    <>
      <VehicleDashboard />
    </>
  );
}
