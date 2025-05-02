
import React from 'react';
import { useAppContext } from '@/lib/AppContext';
import { DollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CurrencySelectorProps {
  className?: string;
}

export function CurrencySelector({ className }: CurrencySelectorProps) {
  const { currency, setCurrency, availableCurrencies } = useAppContext();

  return (
    <div className={className}>
      <Select value={currency} onValueChange={setCurrency}>
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          {availableCurrencies.map((curr) => (
            <SelectItem key={curr} value={curr}>
              {curr}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
