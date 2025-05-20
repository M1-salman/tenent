import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import CreateTenantForm from "./createTenantForm";
import SelectTenantDialog from "./SelectTenantDialog";
import GenerateBillForm from "./GenerateBillForm";
import { Link } from "react-router-dom";

interface Tenant {
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  monthlyRent: number;
  image?: string;
  fix?: number;
  perUnit?: number;
  totalRooms: number;
  advance: number;
}

export default function DashboardContent() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [totalTenants, setTotalTenants] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSelectTenantDialogOpen, setIsSelectTenantDialogOpen] =
    useState(false);
  const [isGenerateBillFormOpen, setIsGenerateBillFormOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch tenants
        const tenantsResponse = await fetch("http://localhost:3000/api/tenant/get", {
          headers,
        });
        if (!tenantsResponse.ok) throw new Error("Failed to fetch tenants");
        const tenantsData = await tenantsResponse.json();
        setTenants(tenantsData.data);
        setTotalTenants(tenantsData.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
  
    };

    fetchData();
  }, []);

  const handleTenantSelect = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsGenerateBillFormOpen(true);
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        role="status"
        aria-label="Loading tenants"
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"
          aria-hidden="true"
        ></div>
        <span className="sr-only">Loading tenants...</span>
      </div>
    );
  }

  return (
    <>
      <Card className="mx-14 mb-14">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tenants Overview</CardTitle>
            {totalTenants > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Total Tenants: {totalTenants}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-[#b593ff] hover:bg-[#d3c0fc]"
              aria-label="Create new tenant"
            >
              Create Tenant
            </Button>
            <Button
              onClick={() => setIsSelectTenantDialogOpen(true)}
              className="bg-[#b593ff] hover:bg-[#d3c0fc]"
              aria-label="Generate bill for tenant"
            >
              Generate Bill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table aria-label="Tenants list">
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Electricity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.tenantId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tenant.image ? (
                        <img
                          src={tenant.image}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                          aria-hidden="true"
                        />
                      ) : (
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
                          aria-hidden="true"
                        >
                          <User className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <Link
                          to={`/tenant-profile/${tenant.tenantId}`}
                          className="font-medium hover:text-blue-500"
                        >
                          {tenant.firstName} {tenant.lastName}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {tenant.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tenant.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell>₹{tenant.monthlyRent}</TableCell>
                  <TableCell>
                    {tenant.fix ? (
                      <span className="text-sm">Fixed: ₹{tenant.fix}</span>
                    ) : tenant.perUnit ? (
                      <span className="text-sm">
                        Per Unit: ₹{tenant.perUnit}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Not specified
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {tenants.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6"
                    aria-live="polite"
                  >
                    No tenants found. Create your first tenant to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateTenantForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <SelectTenantDialog
        open={isSelectTenantDialogOpen}
        onOpenChange={setIsSelectTenantDialogOpen}
        tenants={tenants}
        onTenantSelect={handleTenantSelect}
      />

      {selectedTenant && (
        <GenerateBillForm
          open={isGenerateBillFormOpen}
          onOpenChange={setIsGenerateBillFormOpen}
          tenant={selectedTenant}
        />
      )}
    </>
  );
}
