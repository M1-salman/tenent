import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

interface GenerateBillFormProps {
  initialData?: any;
  onClose: () => void;
  isEdit?: boolean;
}

export default function GenerateBillForm({ initialData, onClose, isEdit = false }: GenerateBillFormProps) {
  const { tenantId } = useParams();
  const [formData, setFormData] = useState({
    totalUnits: '',
    electricityBill: '',
    advance: '',
    arrears: '',
    startDate: '',
    endDate: '',
    billType: '',
    total: '',
  });
  const [errors, setErrors] = useState({
    billType: '',
  });

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (initialData) {
      setFormData({
        totalUnits: initialData.totalUnits?.toString() || '',
        electricityBill: initialData.electricityBill?.toString() || '',
        advance: initialData.advance?.toString() || '',
        arrears: initialData.arrears?.toString() || '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        billType: initialData.billType || '',
        total: initialData.total?.toString() || '',
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

  const validateForm = () => {
    const newErrors = {
      billType: '',
    };

    if (!formData.billType) {
      newErrors.billType = 'Please select a bill type';
    }

    setErrors(newErrors);
    return !newErrors.billType;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const url = isEdit
      ? `${serverUrl}/api/tenant/update-bill/${initialData.billId}`
      : `${serverUrl}/api/tenant/generate-bill`;

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tenantId,
          totalUnits: formData.totalUnits ? Number(formData.totalUnits) : null,
          electricityBill: Number(formData.electricityBill),
          advance: Number(formData.advance),
          arrears: Number(formData.arrears),
          total: Number(formData.total),
        }),
      });

      if (response.ok) {
        onClose();
      } else {
        console.error('Error saving bill data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#f7f8fa]" role="form" aria-label="Bill generation form">
      <div className="space-y-4">
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
              required
              aria-required="true"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bill-type">Bill Type</Label>
          <Select
            value={formData.billType}
            onValueChange={(value: string) => {
              setFormData(prev => ({
                ...prev,
                billType: value,
              }));
              setErrors(prev => ({
                ...prev,
                billType: '',
              }));
            }}
          >
            <SelectTrigger 
              id="bill-type" 
              className={errors.billType ? "border-red-500" : ""}
              aria-label="Select bill type"
              aria-invalid={!!errors.billType}
              aria-describedby={errors.billType ? "bill-type-error" : undefined}
            >
              <SelectValue placeholder="Select bill type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Final">Final</SelectItem>
            </SelectContent>
          </Select>
          {errors.billType && (
            <p id="bill-type-error" className="text-sm text-red-500 mt-1" role="alert">
              {errors.billType}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalUnits">Total Units</Label>
            <Input
              id="totalUnits"
              name="totalUnits"
              type="number"
              value={formData.totalUnits}
              onChange={handleChange}
              aria-label="Total electricity units"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="electricityBill">Electricity Bill</Label>
            <Input
              id="electricityBill"
              name="electricityBill"
              type="number"
              value={formData.electricityBill}
              onChange={handleChange}
              required
              aria-required="true"
              aria-label="Electricity bill amount in rupees"
              min="0"
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
              aria-label="Advance payment amount in rupees"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arrears">Arrears</Label>
            <Input
              id="arrears"
              name="arrears"
              type="number"
              value={formData.arrears}
              onChange={handleChange}
              required
              aria-required="true"
              aria-label="Arrears amount in rupees"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total">Total Amount</Label>
          <Input
            id="total"
            name="total"
            type="number"
            value={formData.total}
            onChange={handleChange}
            required
            aria-required="true"
            aria-label="Total bill amount in rupees"
            min="0"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} aria-label="Cancel bill generation">
          Cancel
        </Button>
        <Button type="submit" aria-label={isEdit ? "Update bill" : "Generate bill"}>
          {isEdit ? 'Update' : 'Generate'}
        </Button>
      </div>
    </form>
  );
} 