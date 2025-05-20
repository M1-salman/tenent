import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import CreateTenantForm from "./UpdateTenantForm";
import GenerateBillForm from "./UpdateBillForm";

interface Tenant {
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  monthlyRent: number;
  totalRooms: number;
  fix: number | null;
  perUnit: number | null;
  image: string | null;
  advance: number;
  startDate: string;
  endDate: string | null;
}

interface Bill {
  billId: string;
  totalUnits: number | null;
  electricityBill: number;
  advance: number;
  arrears: number;
  startDate: string;
  endDate: string;
  billType: string;
  total: number;
}

export default function TenantProfile() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isEditTenantOpen, setIsEditTenantOpen] = useState(false);
  const [isEditBillOpen, setIsEditBillOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  useEffect(() => {
    fetchTenantData();
    fetchBills();
  }, [tenantId]);

  const fetchTenantData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tenant/${tenantId}`
      );
      const data = await response.json();
      setTenant(data.data);
    } catch (error) {
      console.error("Error fetching tenant data:", error);
    }
  };

  const fetchBills = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tenant/get-bill/${tenantId}`
      );
      const data = await response.json();
      setBills(data.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const handleDeleteTenant = async () => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:3000/api/tenant/delete/${tenantId}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        navigate("/dashboard");
      } catch (error) {
        console.error("Error deleting tenant:", error);
      }
    }
  };

  const handleDeleteBill = async (billId: string) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        await fetch(`http://localhost:3000/api/tenant/delete-bill/${billId}`, {
          method: "DELETE",
        });
        fetchBills();
      } catch (error) {
        console.error("Error deleting bill:", error);
      }
    }
  };

  const handleEditBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsEditBillOpen(true);
  };

  if (!tenant) {
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
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tenant Profile</CardTitle>
          <div className="flex gap-2" role="toolbar" aria-label="Tenant actions">
            <Dialog open={isEditTenantOpen} onOpenChange={setIsEditTenantOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  aria-label="Edit tenant information"
                >
                  <Pencil className="h-4 w-4 mr-2" aria-hidden="true" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent aria-labelledby="edit-tenant-title">
                <h2 id="edit-tenant-title" className="sr-only">Edit Tenant Information</h2>
                <CreateTenantForm
                  initialData={tenant}
                  onClose={() => setIsEditTenantOpen(false)}
                  isEdit={true}
                />
              </DialogContent>
            </Dialog>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteTenant}
              aria-label="Delete tenant"
            >
              <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="region" aria-label="Tenant details">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" id="personal-info">Personal Information</h3>
              <div className="space-y-2" aria-labelledby="personal-info">
                <p>
                  <span className="font-medium">Name:</span> {tenant.firstName}{" "}
                  {tenant.lastName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {tenant.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {tenant.phoneNumber}
                </p>
                {tenant.image && (
                  <img
                    src={tenant.image}
                    alt="Tenant"
                    className="max-w-[200px] mt-2 rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold" id="rental-info">Rental Information</h3>
              <div className="space-y-2" aria-labelledby="rental-info">
                <p>
                  <span className="font-medium">Monthly Rent:</span> ₹
                  {tenant.monthlyRent}
                </p>
                <p>
                  <span className="font-medium">Total Rooms:</span>{" "}
                  {tenant.totalRooms}
                </p>
                <p>
                  <span className="font-medium">Advance Payment:</span> ₹
                  {tenant.advance}
                </p>
                <p>
                  <span className="font-medium">Start Date:</span>{" "}
                  {new Date(tenant.startDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">End Date:</span>{" "}
                  {tenant.endDate
                    ? new Date(tenant.endDate).toLocaleDateString()
                    : "Currently residing"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold" id="electricity-info">Electricity Information</h3>
              <div className="space-y-2" aria-labelledby="electricity-info">
                {tenant.fix ? (
                  <p>
                    <span className="font-medium">Fixed Rate:</span> ₹
                    {tenant.fix}
                  </p>
                ) : tenant.perUnit ? (
                  <p>
                    <span className="font-medium">Per Unit Rate:</span> ₹
                    {tenant.perUnit}
                  </p>
                ) : (
                  <p>No electricity billing set up</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle id="billing-history">Billing History</CardTitle>
        </CardHeader>
        <CardContent aria-labelledby="billing-history">
          {bills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" role="status">
              <p className="text-lg">No billing history available</p>
              <p className="text-sm mt-2">Generate a bill to see the billing history here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Bill Type</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Electricity</TableHead>
                  <TableHead>Advance</TableHead>
                  <TableHead>Arrears</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.billId}>
                    <TableCell>
                      {new Date(bill.startDate).toLocaleDateString()} -{" "}
                      {new Date(bill.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{bill.billType}</TableCell>
                    <TableCell>
                      {bill.totalUnits !== null
                        ? bill.totalUnits
                        : "Per unit rate selected"}
                    </TableCell>
                    <TableCell>₹{bill.electricityBill}</TableCell>
                    <TableCell>₹{bill.advance}</TableCell>
                    <TableCell>₹{bill.arrears}</TableCell>
                    <TableCell>₹{bill.total}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog
                          open={
                            isEditBillOpen && selectedBill?.billId === bill.billId
                          }
                          onOpenChange={(open) => {
                            if (!open) {
                              setIsEditBillOpen(false);
                              setSelectedBill(null);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditBill(bill)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <GenerateBillForm
                              initialData={selectedBill}
                              onClose={() => {
                                setIsEditBillOpen(false);
                                setSelectedBill(null);
                              }}
                              isEdit={true}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBill(bill.billId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
