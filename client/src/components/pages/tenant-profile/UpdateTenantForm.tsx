import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateTenantFormProps {
  initialData?: any;
  onClose: () => void;
  isEdit?: boolean;
}

export default function CreateTenantForm({ initialData, onClose, isEdit = false }: CreateTenantFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    monthlyRent: '',
    totalRooms: '',
    fix: '',
    perUnit: '',
    image: '',
    advance: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        monthlyRent: initialData.monthlyRent?.toString() || '',
        totalRooms: initialData.totalRooms?.toString() || '',
        fix: initialData.fix?.toString() || '',
        perUnit: initialData.perUnit?.toString() || '',
        image: initialData.image || '',
        advance: initialData.advance?.toString() || '',
        startDate: '',
        endDate: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEdit
      ? `http://localhost:3000/api/tenant/update/${initialData.tenantId}`
      : 'http://localhost:3000/api/tenant/create';

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          monthlyRent: Number(formData.monthlyRent),
          totalRooms: Number(formData.totalRooms),
          fix: formData.fix ? Number(formData.fix) : null,
          perUnit: formData.perUnit ? Number(formData.perUnit) : null,
          advance: Number(formData.advance),
          endDate: formData.endDate || null,
        }),
      });

      if (response.ok) {
        onClose();
      } else {
        console.error('Error saving tenant data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Tenant information form">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby="email-description"
            />
            <span id="email-description" className="sr-only">Enter a valid email address</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby="phone-description"
            />
            <span id="phone-description" className="sr-only">Enter a valid phone number</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyRent">Monthly Rent</Label>
            <Input
              id="monthlyRent"
              name="monthlyRent"
              type="number"
              value={formData.monthlyRent}
              onChange={handleChange}
              required
              aria-required="true"
              aria-label="Monthly rent in rupees"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalRooms">Total Rooms</Label>
            <Input
              id="totalRooms"
              name="totalRooms"
              type="number"
              value={formData.totalRooms}
              onChange={handleChange}
              required
              aria-required="true"
              min="1"
              aria-label="Total number of rooms"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="advance">Advance Payment</Label>
            <Input
              id="advance"
              name="advance"
              type="number"
              value={formData.advance}
              onChange={handleChange}
              required
              aria-required="true"
              aria-label="Advance payment in rupees"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              aria-label="Optional end date"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="billing-type">Electricity Billing Type</Label>
          <Select
            value={formData.fix ? 'fix' : formData.perUnit ? 'perUnit' : 'none'}
            onValueChange={(value) => {
              if (value === 'fix') {
                setFormData(prev => ({
                  ...prev,
                  fix: prev.fix || '0',
                  perUnit: '',
                }));
              } else if (value === 'perUnit') {
                setFormData(prev => ({
                  ...prev,
                  perUnit: prev.perUnit || '0',
                  fix: '',
                }));
              } else {
                setFormData(prev => ({
                  ...prev,
                  fix: '',
                  perUnit: '',
                }));
              }
            }}
          >
            <SelectTrigger id="billing-type" aria-label="Select electricity billing type">
              <SelectValue placeholder="Select billing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Electricity</SelectItem>
              <SelectItem value="fix">Fixed Rate</SelectItem>
              <SelectItem value="perUnit">Per Unit Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.fix !== '' && (
          <div className="space-y-2">
            <Label htmlFor="fix">Fixed Rate</Label>
            <Input
              id="fix"
              name="fix"
              type="number"
              value={formData.fix}
              onChange={handleChange}
              required
              aria-required="true"
              aria-label="Fixed rate in rupees"
            />
          </div>
        )}

        {formData.perUnit !== '' && (
          <div className="space-y-2">
            <Label htmlFor="perUnit">Per Unit Rate</Label>
            <Input
              id="perUnit"
              name="perUnit"
              type="number"
              value={formData.perUnit}
              onChange={handleChange}
              required
              aria-required="true"
              aria-label="Rate per unit in rupees"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} aria-label="Cancel form">
          Cancel
        </Button>
        <Button type="submit" aria-label={isEdit ? "Update tenant" : "Create tenant"}>
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
} 