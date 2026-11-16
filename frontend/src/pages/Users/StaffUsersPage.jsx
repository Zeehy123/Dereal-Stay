import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormError } from "../../components/Feedback";
import { errorMessage } from "../../services/api";
import { staffUsers } from "../../services/guesthouse";

const ROLES = ["Receptionist", "Accountant", "Manager"];

const StaffUsersPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [createdUser, setCreatedUser] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: ROLES[0] } });

  const onSubmit = async (data) => {
    setServerError("");
    setCreatedUser("");
    const accountData = { ...data };
    delete accountData.confirmPassword;
    try {
      const user = await staffUsers.create(accountData);
      setCreatedUser(user.full_name || user.username);
      reset({ role: ROLES[0] });
    } catch (error) {
      setServerError(errorMessage(error));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-serif">Add Staff User</h1>
        <p className="text-gray-500">Create a receptionist, accountant, or manager account.</p>
      </div>

      <div className="max-w-3xl rounded-3xl bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <FormError message={serverError} />
          {createdUser && (
            <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              Account created for {createdUser}.
            </p>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="mb-2 block text-sm">First name *</label>
              <input
                id="first_name"
                autoComplete="given-name"
                {...register("first_name", { required: "First name is required." })}
                className="w-full rounded-xl border border-gray-300 p-3"
              />
              {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>}
            </div>

            <div>
              <label htmlFor="last_name" className="mb-2 block text-sm">Last name *</label>
              <input
                id="last_name"
                autoComplete="family-name"
                {...register("last_name", { required: "Last name is required." })}
                className="w-full rounded-xl border border-gray-300 p-3"
              />
              {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>}
            </div>

            <div>
              <label htmlFor="username" className="mb-2 block text-sm">Username *</label>
              <input
                id="username"
                autoComplete="username"
                {...register("username", { required: "Username is required." })}
                className="w-full rounded-xl border border-gray-300 p-3"
              />
              {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="w-full rounded-xl border border-gray-300 p-3"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone_number" className="mb-2 block text-sm">Phone number</label>
              <input
                id="phone_number"
                type="tel"
                autoComplete="tel"
                {...register("phone_number")}
                className="w-full rounded-xl border border-gray-300 p-3"
              />
            </div>

            <div>
              <label htmlFor="role" className="mb-2 block text-sm">Role *</label>
              <select
                id="role"
                {...register("role", { required: "Select a role." })}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm">Initial password *</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required.",
                  minLength: { value: 8, message: "Use at least 8 characters." },
                })}
                className="w-full rounded-xl border border-gray-300 p-3"
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm">Confirm password *</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: "Confirm the password.",
                  validate: (value) => value === getValues("password") || "Passwords do not match.",
                })}
                className="w-full rounded-xl border border-gray-300 p-3"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500">
            This account can sign in to the guesthouse app but will not have access to Django admin.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-xl bg-gray-200 px-5 py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#C76A12] px-5 py-3 text-white disabled:opacity-60"
            >
              {isSubmitting ? "Creating…" : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffUsersPage;
