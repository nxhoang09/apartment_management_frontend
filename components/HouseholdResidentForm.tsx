import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHouseholdAndHead } from "@/lib/api/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/auth-context";

export default function HouseholdResidentForm({
  initialData,
  onSuccess,
  mode = "create",
}: {
  initialData?: any;
  onSuccess?: () => void;
  mode?: "create" | "edit";
}) {
  const router = useRouter();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(
    initialData || {
      household: {
        houseHoldCode: "",
        apartmentNumber: "",
        buildingNumber: "",
        street: "",
        ward: "",
        province: "",
      },
      resident: {
        nationalId: "",
        phoneNumber: "",
        email: "",
        fullname: "",
        dateOfBirth: "",
        gender: "MALE",
        relationshipToHead: "HEAD",
        placeOfOrigin: "",
        occupation: "",
        workingAdress: "",
        houseHoldId: undefined,
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [group, field] = name.split(".");
    setFormData((prev: typeof formData) => ({
      ...prev,
      [group as "household" | "resident"]: {
        ...prev[group as "household" | "resident"],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (!token) {
        alert("Bạn cần đăng nhập!");
        setIsLoading(false);
        return;
      }
      const submitData = {
        ...formData,
        household: {
          ...formData.household,
          houseHoldCode:
            formData.household.houseHoldCode === ""
              ? 0
              : Number(formData.household.houseHoldCode),
        },
      };
      await createHouseholdAndHead(submitData, token);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/resident");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký hộ khẩu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 md:p-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-700">
        {mode === "edit" ? "Sửa thông tin hộ khẩu & chủ hộ" : "Đăng ký hộ khẩu & chủ hộ"}
      </h2>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-2 text-gray-700">Thông tin hộ khẩu</h3>
            <Input name="household.houseHoldCode" value={formData.household.houseHoldCode} onChange={handleChange} placeholder="Mã hộ khẩu" type="number" required />
            <Input name="household.apartmentNumber" value={formData.household.apartmentNumber} onChange={handleChange} placeholder="Số căn hộ" required />
            <Input name="household.buildingNumber" value={formData.household.buildingNumber} onChange={handleChange} placeholder="Tòa nhà" required />
            <Input name="household.street" value={formData.household.street} onChange={handleChange} placeholder="Đường" required />
            <Input name="household.ward" value={formData.household.ward} onChange={handleChange} placeholder="Phường" required />
            <Input name="household.province" value={formData.household.province} onChange={handleChange} placeholder="Tỉnh/Thành phố" required />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-2 text-gray-700">Thông tin chủ hộ</h3>
            <Input name="resident.nationalId" value={formData.resident.nationalId} onChange={handleChange} placeholder="CMND/CCCD" required />
            <Input name="resident.phoneNumber" value={formData.resident.phoneNumber} onChange={handleChange} placeholder="Số điện thoại" required />
            <Input name="resident.email" value={formData.resident.email} onChange={handleChange} placeholder="Email" required />
            <Input name="resident.fullname" value={formData.resident.fullname} onChange={handleChange} placeholder="Họ và tên" required />
            <Input name="resident.dateOfBirth" value={formData.resident.dateOfBirth} onChange={handleChange} placeholder="Ngày sinh" type="date" required />
            <select name="resident.gender" value={formData.resident.gender} onChange={handleChange} required className="w-full border rounded px-2 py-2">
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
            </select>
            <select name="resident.relationshipToHead" value={formData.resident.relationshipToHead} onChange={handleChange} required className="w-full border rounded px-2 py-2">
              <option value="HEAD">Chủ hộ</option>
              <option value="MEMBER">Thành viên</option>
            </select>
            <Input name="resident.placeOfOrigin" value={formData.resident.placeOfOrigin} onChange={handleChange} placeholder="Quê quán" required />
            <Input name="resident.occupation" value={formData.resident.occupation} onChange={handleChange} placeholder="Nghề nghiệp" required />
            <Input name="resident.workingAdress" value={formData.resident.workingAdress} onChange={handleChange} placeholder="Nơi làm việc" />
          </div>
        </div>
        <Button type="submit" disabled={isLoading} className="w-full mt-4">
          {isLoading ? "Đang xử lý..." : mode === "edit" ? "Cập nhật" : "Đăng ký"}
        </Button>
      </form>
    </div>
  );
}
