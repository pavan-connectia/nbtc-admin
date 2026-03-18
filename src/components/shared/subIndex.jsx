import { Label, Input } from "..";

const SubIndex = ({ value, onChange }) => {
  return (
    <div className="space-y-1">
      <Label id="subIndex">Sub Index</Label>
      <Input
        id="subIndex"
        type="number"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SubIndex;
