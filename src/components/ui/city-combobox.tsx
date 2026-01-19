import * as React from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { gujaratCities } from "@/data/gujaratCities";

interface CityComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CityCombobox({
  value,
  onChange,
  placeholder = "Select city...",
  disabled = false,
  className,
}: CityComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const filteredCities = React.useMemo(() => {
    if (!searchValue) return gujaratCities;
    return gujaratCities.filter((city) =>
      city.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
    setSearchValue("");
  };

  const handleUseCustomCity = () => {
    if (searchValue.trim()) {
      onChange(searchValue.trim());
      setOpen(false);
      setSearchValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-white text-gray-900 hover:bg-gray-50",
            !value && "text-gray-500",
            className
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 z-50" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search or type city..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {filteredCities.length === 0 && searchValue.trim() && (
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={handleUseCustomCity}
                >
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  Use "{searchValue.trim()}"
                </Button>
              </div>
            )}
            {filteredCities.length === 0 && !searchValue.trim() && (
              <CommandEmpty>No city found.</CommandEmpty>
            )}
            <CommandGroup className="max-h-[300px] overflow-auto">
              {filteredCities.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={() => handleSelect(city)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city}
                </CommandItem>
              ))}
              {searchValue.trim() && filteredCities.length > 0 && !filteredCities.some(c => c.toLowerCase() === searchValue.toLowerCase()) && (
                <CommandItem
                  value={`custom-${searchValue}`}
                  onSelect={handleUseCustomCity}
                  className="border-t mt-1 pt-2"
                >
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  Use "{searchValue.trim()}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
