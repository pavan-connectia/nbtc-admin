import { useSelector } from "react-redux";
import { Label, Input } from "..";

const Index = ({ value, onChange }) => {
  const { role } = useSelector((state) => state.auth);

  if (role === "superadmin")
    return (
      <div className="space-y-1">
        <Label id="index">Index</Label>
        <Input id="index" type="number" value={value} onChange={onChange} />
      </div>
    );
};

export default Index;
