import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Transaction } from '@/lib/types';
import { Pencil } from 'lucide-react';

interface EditExpenseDialogProps {
  expense: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: Transaction) => void;
}

export const EditExpenseDialog = ({ expense, open, onOpenChange, onSave }: EditExpenseDialogProps) => {
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount.toString());

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const updated: Transaction = {
      ...expense,
      description,
      amount: parsedAmount
    };

    onSave(updated);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setDescription(expense.description);
    setAmount(expense.amount.toString());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Expense
          </DialogTitle>
          <DialogDescription>
            Update the description and amount for this expense entry.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expense description..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!description.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};