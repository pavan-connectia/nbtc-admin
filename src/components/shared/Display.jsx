import { Label } from "..";

export default function BooleanSelect({
  value,
  onChange,
  id = "display",
  label = "Display",
  placeholder,
}) {
  return (
    <div className="space-y-1">
      {label && <Label id={id}>{label}</Label>}
      <select
        value={value === true ? "true" : value === false ? "false" : ""}
        onChange={(e) => {
          const val =
            e.target.value === "true"
              ? true
              : e.target.value === "false"
                ? false
                : null;
          onChange(val);
        }}
        id={id}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placeholder && value === null && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        <option value="false">Hide</option>
        <option value="true">Display</option>
      </select>
    </div>
  );
}
