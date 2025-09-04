"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        FleetLink – Smart Logistics Management
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl mb-8">
        Manage your fleet, track availability, and simplify logistics bookings
        with real-time insights.
      </p>
      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </Link>
        <Button variant="outline" size="lg">Learn More</Button>
      </div>
    </main>
  );
}
