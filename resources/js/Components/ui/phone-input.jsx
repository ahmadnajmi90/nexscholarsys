import { forwardRef, useMemo } from "react";
import PhoneInput from "react-phone-number-input";
import { AsYouType, getCountries, getCountryCallingCode } from "libphonenumber-js";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import "react-phone-number-input/style.css";
import Select, { components as selectComponents } from "react-select";
import { ChevronDown } from "lucide-react";

const inputVariants = cva(
  "block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      error: {
        true: "focus-visible:ring-destructive border-destructive",
        false: "",
      },
    },
    defaultVariants: {
      error: false,
    },
  },
);

const countrySelectClasses = cva(
  "flex items-center gap-2 rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      error: {
        true: "focus-visible:ring-destructive border-destructive",
        false: "",
      },
    },
    defaultVariants: {
      error: false,
    },
  },
);

const helperTextClasses = cva("text-xs text-muted-foreground", {
  variants: {
    error: {
      true: "text-destructive",
      false: "",
    },
  },
  defaultVariants: {
    error: false,
  },
});

const formatCountryLabel = (country) => {
  try {
    const code = getCountryCallingCode(country);
    return `${country.toUpperCase()} +${code}`;
  } catch (error) {
    console.warn("Unknown country code", country);
    return country.toUpperCase();
  }
};

const DropdownIndicator = (props) => (
  selectComponents.DropdownIndicator ? (
    <selectComponents.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </selectComponents.DropdownIndicator>
  ) : null
);

const CountrySelect = ({
  value,
  onChange,
  disabled,
  countries,
  error,
  selectClassName,
}) => {
  const options = countries.map((country) => ({
    value: country,
    label: formatCountryLabel(country),
  }));

  const selected = options.find((option) => option.value === value) ?? null;

  return (
    <Select
      classNamePrefix="phone-select"
      className={cn("min-w-[140px]", selectClassName)}
      isSearchable
      isDisabled={disabled}
      options={options}
      value={selected}
      onChange={(option) => onChange(option?.value ?? value)}
      components={{
        DropdownIndicator,
        IndicatorSeparator: null,
      }}
      menuPortalTarget={typeof window !== "undefined" ? document.body : undefined}
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: "hsl(var(--muted))",
          borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--input))",
          boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--ring))" : "none",
          borderRadius: "0.5rem",
          minHeight: "40px",
          color: "hsl(var(--foreground))",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }),
        valueContainer: (base) => ({
          ...base,
          paddingInline: "0.5rem",
        }),
        singleValue: (base) => ({
          ...base,
          color: "hsl(var(--foreground))",
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999,
          borderRadius: "0.5rem",
          overflow: "hidden",
        }),
        option: (base, state) => ({
          ...base,
          fontSize: "0.875rem",
          backgroundColor: state.isFocused || state.isSelected ? "hsl(var(--accent))" : "transparent",
          color: state.isFocused || state.isSelected ? "hsl(var(--accent-foreground))" : "hsl(var(--foreground))",
          cursor: "pointer",
        }),
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: "hsl(var(--ring))",
          primary25: "hsl(var(--accent))",
          neutral0: "hsl(var(--popover))",
          neutral80: "hsl(var(--foreground))",
        },
      })}
    />
  );
};

const PhoneNumberInput = forwardRef(
  (
    {
      value,
      onChange,
      defaultCountry = "US",
      countries,
      disabled = false,
      required = false,
      label,
      helperText,
      error = false,
      containerClassName,
      inputClassName,
      selectClassName,
      id,
      name,
      placeholder = "Enter phone number",
      ...props
    },
    ref,
  ) => {
    const availableCountries = useMemo(() => countries ?? getCountries(), [countries]);

    return (
      <div className={cn("flex w-full flex-col gap-1", containerClassName)}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-destructive"> *</span>}
          </label>
        )}

        <PhoneInput
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          defaultCountry={defaultCountry}
          countries={availableCountries}
          disabled={disabled}
          required={required}
          international
          withCountryCallingCode
          placeholder={placeholder}
          className="flex w-full items-center gap-2"
          numberInputProps={{
            className: cn(inputVariants({ error }), "rounded-md", inputClassName)
          }}
          countrySelectComponent={({ value: countryValue, onChange: handleChange, disabled: isSelectDisabled }) => (
            <CountrySelect
              value={countryValue}
              onChange={handleChange}
              disabled={isSelectDisabled}
              countries={availableCountries}
              error={error}
              selectClassName={selectClassName}
            />
          )}
          {...props}
        />

        {helperText && <p className={helperTextClasses({ error })}>{helperText}</p>}
      </div>
    );
  },
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export const formatPhoneNumber = (value) => {
  if (!value) return "";
  const formatter = new AsYouType();
  return formatter.input(value);
};

export default PhoneNumberInput;

