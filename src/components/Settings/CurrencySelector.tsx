
import { useAppContext } from "@/lib/AppContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CurrencySelector = () => {
  const { currency, setCurrency, availableCurrencies } = useAppContext();

  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Currency" />
      </SelectTrigger>
      <SelectContent>
        {availableCurrencies.map((curr) => (
          <SelectItem key={curr} value={curr}>
            {curr}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
