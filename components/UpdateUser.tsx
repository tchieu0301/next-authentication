import { User } from "@/app/page";
import { authenticatedRequest } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";

interface OldUserData {
  oldFirstName: string;
  oldLastName: string;
  setOldUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UpdateUser: React.FC<OldUserData> = ({
  oldFirstName,
  oldLastName,
  setOldUser,
}) => {
  const router = useRouter();

  const [changed, setChanged] = React.useState({
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = React.useState({
    first_name: "",
    last_name: "",
  });

  const [touched, setTouched] = React.useState({
    first_name: false,
    last_name: false,
  });

  const [isValid, setIsValid] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (oldFirstName && oldLastName) {
      setChanged({ first_name: oldFirstName, last_name: oldLastName });
    }
  }, [oldFirstName, oldLastName]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChanged((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    let newErrors = { first_name: "", last_name: "" };
    let valid = true;

    // First Name validation
    if (!changed.first_name.trim()) {
      newErrors.first_name = "First Name is required.";
      valid = false;
    }

    // Last Name validation
    if (!changed.last_name.trim()) {
      newErrors.last_name = "Last Name is required.";
      valid = false;
    }

    if (
      changed.first_name === oldFirstName &&
      changed.last_name === oldLastName
    ) {
      valid = false;
    }

    setErrors(newErrors);
    setIsValid(valid);
  };

  React.useEffect(() => {
    validateForm();
  }, [changed]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await authenticatedRequest.put("api/user", {
        ...changed,
      });

      if (response.status === 200) {
        alert("Updated successfully");
        setOldUser((prev) =>
          prev
            ? {
                ...prev,
                first_name: response.data.first_name,
                last_name: response.data.last_name,
              }
            : {
                email: response.data.email,
                first_name: response.data.first_name,
                last_name: response.data.last_name,
              }
        );
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Fetch User Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authorization");
    localStorage.removeItem("refreshToken");
    router.push("/login")
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-2 w-full">
        <label>First Name</label>
        <InputText
          name="first_name"
          type="text"
          className="p-inputtext-sm"
          onChange={handleOnChange}
          onBlur={handleBlur}
          value={changed.first_name}
        />
        {touched.first_name && errors.first_name && (
          <small className="text-red-500">{errors.first_name}</small>
        )}
      </div>
      <div className="grid grid-cols-1 gap-2 w-full">
        <label>Last Name</label>
        <InputText
          name="last_name"
          type="text"
          className="p-inputtext-sm"
          onChange={handleOnChange}
          onBlur={handleBlur}
          value={changed.last_name}
        />
        {touched.last_name && errors.last_name && (
          <small className="text-red-500">{errors.last_name}</small>
        )}
      </div>
      <Button
        label="Update"
        onClick={handleSubmit}
        disabled={!isValid}
        severity="success"
        loading={isLoading}
      />
      <Button label="Logout" onClick={handleLogout} severity="danger" />
    </>
  );
};

export default UpdateUser;
