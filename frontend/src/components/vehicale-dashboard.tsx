"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  CalendarIcon,
  TruckIcon,
  UsersIcon,
  MapPinIcon,
  ClockIcon,
  SearchIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Vehicle {
  _id: string;
  name: string;
  capacityKg: number;
  vehicleNo: string;
  tyres: number;
  route: string[];
  available: boolean;
  createdAt: string;
  updatedAt: string;
  estimatedRideDurationHours?: number;
}

interface Booking {
  _id: string;
  vehicleId: string;
  customerId: string;
  fromPincode: string;
  toPincode: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

const mockVehicles: Vehicle[] = [
  {
    _id: "68b80a84871f0aa470b2ef2d",
    name: "Mahindra Pickup",
    capacityKg: 800,
    tyres: 4,
    available: true,
    route: ["110001", "122001", "124001"],
    vehicleNo: "DL01AB1234",
    createdAt: "2025-09-03T09:34:11.963Z",
    updatedAt: "2025-09-03T09:34:11.963Z",
  },
  {
    _id: "68b80a84871f0aa470b2ef2e",
    name: "Tata Ace",
    capacityKg: 500,
    tyres: 4,
    available: false,
    route: ["400001", "400002", "400003"],
    vehicleNo: "MH01CD5678",
    createdAt: "2025-09-03T09:34:11.963Z",
    updatedAt: "2025-09-03T09:34:11.963Z",
  },
  {
    _id: "68b80a84871f0aa470b2ef2f",
    name: "Ashok Leyland Dost",
    capacityKg: 1200,
    tyres: 6,
    available: true,
    route: ["110001", "400001", "560001"],
    vehicleNo: "KA03EF9012",
    createdAt: "2025-09-03T09:34:11.963Z",
    updatedAt: "2025-09-03T09:34:11.963Z",
  },
];

const mockBookings: Booking[] = [
  {
    _id: "68b80b93871f0aa470b2ef33",
    vehicleId: "68b80a84871f0aa470b2ef2d",
    customerId: "CUST001",
    fromPincode: "110001",
    toPincode: "400001",
    startTime: "2025-09-04T04:30:00.000Z",
    endTime: "2025-09-04T12:30:00.000Z",
    createdAt: "2025-09-03T09:34:11.963Z",
    updatedAt: "2025-09-03T09:34:11.963Z",
  },
  {
    _id: "68b80b93871f0aa470b2ef34",
    vehicleId: "68b80a84871f0aa470b2ef2e",
    customerId: "CUST002",
    fromPincode: "400001",
    toPincode: "400003",
    startTime: "2025-09-04T06:00:00.000Z",
    endTime: "2025-09-04T10:00:00.000Z",
    createdAt: "2025-09-03T09:34:11.963Z",
    updatedAt: "2025-09-03T09:34:11.963Z",
  },
];

export function VehicleDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    capacityKg: "",
    tyres: "",
    available: true,
    route: "",
    vehicleNo: "",
  });
  const [searchParams, setSearchParams] = useState({
    capacityRequired: "",
    fromPincode: "",
    toPincode: "",
    startTime: "",
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("[v0] Attempting to fetch data from API...");
      const [vehiclesRes, bookingsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/vehicles/`),
        fetch(`${API_BASE_URL}/bookings`),
      ]);

      if (!vehiclesRes.ok || !bookingsRes.ok) {
        throw new Error("API not available");
      }

      const vehiclesData = await vehiclesRes.json();
      const bookingsData = await bookingsRes.json();

      console.log("[v0] Successfully fetched data from API");
      setVehicles(vehiclesData);
      setBookings(bookingsData);
      setApiError(null);
    } catch (error) {
      console.log("[v0] API not available, using mock data for demonstration");
      setVehicles(mockVehicles);
      setBookings(mockBookings);
      setApiError("API not available - showing demo data");
    } finally {
      setLoading(false);
    }
  };

  const searchAvailableVehicles = async () => {
    if (
      !searchParams.capacityRequired ||
      !searchParams.fromPincode ||
      !searchParams.toPincode ||
      !searchParams.startTime
    ) {
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        capacityRequired: searchParams.capacityRequired,
        fromPincode: searchParams.fromPincode,
        toPincode: searchParams.toPincode,
        startTime: searchParams.startTime,
      });

      const response = await fetch(
        `${API_BASE_URL}/vehicles/available?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("API not available");
      }

      const data = await response.json();
      setAvailableVehicles(data);
    } catch (error) {
      console.log("[v0] Search API not available, filtering mock data");
      const filtered = mockVehicles.filter(
        (vehicle) =>
          vehicle.available &&
          vehicle.capacityKg >=
            Number.parseInt(searchParams.capacityRequired) &&
          vehicle.route.includes(searchParams.fromPincode) &&
          vehicle.route.includes(searchParams.toPincode)
      );
      setAvailableVehicles(filtered);
    }
  };

  const addVehicle = async () => {
    try {
      const vehicleData = {
        name: newVehicle.name,
        capacityKg: Number.parseInt(newVehicle.capacityKg),
        tyres: Number.parseInt(newVehicle.tyres),
        available: newVehicle.available,
        route: newVehicle.route.split(",").map((code) => code.trim()),
        vehicleNo: newVehicle.vehicleNo,
      };

      const response = await fetch(`${API_BASE_URL}/vehicles/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        throw new Error("API not available");
      }

      // Reset form and close dialog
      setNewVehicle({
        name: "",
        capacityKg: "",
        tyres: "",
        available: true,
        route: "",
        vehicleNo: "",
      });
      setIsAddVehicleOpen(false);
      // Refresh data to show new vehicle
      fetchData();
    } catch (error) {
      console.log("[v0] Add vehicle API not available, adding to mock data");
      const newVehicleData: Vehicle = {
        _id: `mock_${Date.now()}`,
        name: newVehicle.name,
        capacityKg: Number.parseInt(newVehicle.capacityKg),
        tyres: Number.parseInt(newVehicle.tyres),
        available: newVehicle.available,
        route: newVehicle.route.split(",").map((code) => code.trim()),
        vehicleNo: newVehicle.vehicleNo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setVehicles((prev) => [...prev, newVehicleData]);
      setNewVehicle({
        name: "",
        capacityKg: "",
        tyres: "",
        available: true,
        route: "",
        vehicleNo: "",
      });
      setIsAddVehicleOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVehicleById = (vehicleId: string) => {
    return vehicles.find((v) => v._id === vehicleId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const totalVehicles = vehicles.length;
  const availableVehiclesCount = vehicles.filter((v) => v.available).length;
  const totalBookings = bookings.length;
  const totalCapacity = vehicles.reduce((sum, v) => sum + v.capacityKg, 0);

  async function handleBookNow(vehicle: Vehicle) {
    try {
      const payload = {
        vehicleId: vehicle._id,
        customerId: "dummyCustomer123", // replace with logged-in customer ID
        fromPincode: searchParams.fromPincode,
        toPincode: searchParams.toPincode,
        startTime: searchParams.startTime,
      };

      const res = await axios.post(`${API_BASE_URL}/bookings`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Booking Confirmed !!", {
        description: `Booking ID: ${res.data._id}`,
      });
    } catch (err: any) {
      toast.error("Booking Failed !!", {
        description: err.response?.data?.error || "Failed to create booking",
      });
    }
  }

  async function handleDeleteBooking(id: string) {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`);
      toast.success("Booking Deleted ", {
        description: "The booking has been removed successfully.",
      });

      // Refresh bookings list after deletion
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err: any) {
      toast.error("Delete Failed ", {
        description: err.response?.data?.error || "Something went wrong",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Vehicle Fleet Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your vehicle fleet and bookings
            </p>
            {apiError && (
              <p className="text-sm text-amber-600 mt-1">
                ⚠️ {apiError} - Set NEXT_PUBLIC_API_URL in Project Settings to
                connect to your API
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {/* Add Vehicle button */}
            <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Vehicle</DialogTitle>
                  <DialogDescription>
                    Add a new vehicle to your fleet. Fill in all the required
                    information.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Vehicle Name</Label>
                    <Input
                      id="name"
                      placeholder="Mahindra Pickup"
                      value={newVehicle.name}
                      onChange={(e) =>
                        setNewVehicle((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="vehicleNo">Vehicle Number</Label>
                    <Input
                      id="vehicleNo"
                      placeholder="DL01AB1234"
                      value={newVehicle.vehicleNo}
                      onChange={(e) =>
                        setNewVehicle((prev) => ({
                          ...prev,
                          vehicleNo: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="capacity">Capacity (kg)</Label>
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="800"
                        value={newVehicle.capacityKg}
                        onChange={(e) =>
                          setNewVehicle((prev) => ({
                            ...prev,
                            capacityKg: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tyres">Number of Tyres</Label>
                      <Input
                        id="tyres"
                        type="number"
                        placeholder="4"
                        value={newVehicle.tyres}
                        onChange={(e) =>
                          setNewVehicle((prev) => ({
                            ...prev,
                            tyres: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="route">Route (Pincodes)</Label>
                    <Input
                      id="route"
                      placeholder="110001, 122001, 124001"
                      value={newVehicle.route}
                      onChange={(e) =>
                        setNewVehicle((prev) => ({
                          ...prev,
                          route: e.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter pincodes separated by commas
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={newVehicle.available}
                      onCheckedChange={(checked) =>
                        setNewVehicle((prev) => ({
                          ...prev,
                          available: checked,
                        }))
                      }
                    />
                    <Label htmlFor="available">Available for booking</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddVehicleOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addVehicle}>Add Vehicle</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={fetchData}>Refresh Data</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Vehicles
              </CardTitle>
              <TruckIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVehicles}</div>
              <p className="text-xs text-muted-foreground">
                {availableVehiclesCount} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                Active reservations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Fleet Capacity
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCapacity.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total kg capacity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilization</CardTitle>
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalVehicles > 0
                  ? Math.round(
                      ((totalVehicles - availableVehiclesCount) /
                        totalVehicles) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Fleet utilization</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vehicles">Fleet Overview</TabsTrigger>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="search">Find Vehicles</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Fleet</CardTitle>
                <CardDescription>
                  Overview of all vehicles in your fleet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <TruckIcon className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">{vehicle.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.vehicleNo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {vehicle.capacityKg} kg
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.tyres} tyres
                          </p>
                        </div>
                        <Badge
                          variant={vehicle.available ? "default" : "secondary"}
                        >
                          {vehicle.available ? "Available" : "In Use"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Latest vehicle reservations and trips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const vehicle = getVehicleById(booking.vehicleId);
                    return (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold">
                              {vehicle?.name || "Unknown Vehicle"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Vehicle No: {vehicle?.vehicleNo || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Customer: {booking.customerId}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {booking.fromPincode} → {booking.toPincode}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(booking.startTime)}
                            </p>
                          </div>
                          <Badge variant="outline">Active</Badge>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteBooking(booking._id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Find Available Vehicles</CardTitle>
                <CardDescription>
                  Search for vehicles based on your requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Capacity Required (kg)
                    </label>
                    <Input
                      type="number"
                      placeholder="800"
                      value={searchParams.capacityRequired}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          capacityRequired: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">From Pincode</label>
                    <Input
                      placeholder="110001"
                      value={searchParams.fromPincode}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          fromPincode: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">To Pincode</label>
                    <Input
                      placeholder="400001"
                      value={searchParams.toPincode}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          toPincode: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Start Time</label>
                    <Input
                      type="datetime-local"
                      value={searchParams.startTime}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <Button onClick={searchAvailableVehicles} className="w-full">
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Search Available Vehicles
                </Button>

                {availableVehicles.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Available Vehicles
                    </h3>
                    {availableVehicles.map((vehicle) => (
                      <div
                        key={vehicle._id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950"
                      >
                        <div className="flex items-center space-x-4">
                          <TruckIcon className="h-8 w-8 text-green-600" />
                          <div>
                            <h4 className="font-semibold">{vehicle.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {vehicle.vehicleNo}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {vehicle.capacityKg} kg capacity
                            </p>
                            {vehicle.estimatedRideDurationHours && (
                              <p className="text-xs text-muted-foreground flex items-center">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {vehicle.estimatedRideDurationHours}h estimated
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={() => handleBookNow(vehicle)}
                            size="sm"
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Distribution</CardTitle>
                  <CardDescription>Vehicle types in your fleet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(vehicles.map((v) => v.name))).map(
                      (vehicleType) => {
                        const count = vehicles.filter(
                          (v) => v.name === vehicleType
                        ).length;
                        const percentage = Math.round(
                          (count / totalVehicles) * 100
                        );
                        return (
                          <div
                            key={vehicleType}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-medium">
                              {vehicleType}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-secondary rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {count}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Capacity Analysis</CardTitle>
                  <CardDescription>Fleet capacity breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Capacity</span>
                      <span className="font-medium">
                        {totalCapacity.toLocaleString()} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average per Vehicle</span>
                      <span className="font-medium">
                        {Math.round(
                          totalCapacity / totalVehicles
                        ).toLocaleString()}{" "}
                        kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Largest Vehicle</span>
                      <span className="font-medium">
                        {Math.max(
                          ...vehicles.map((v) => v.capacityKg)
                        ).toLocaleString()}{" "}
                        kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Smallest Vehicle</span>
                      <span className="font-medium">
                        {Math.min(
                          ...vehicles.map((v) => v.capacityKg)
                        ).toLocaleString()}{" "}
                        kg
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
