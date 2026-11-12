import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { guests } from "../../services/guesthouse";
import { errorMessage } from "../../services/api";
import { FormError } from "../../components/Feedback";

const NewGuestPage = () => {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm();

  const firstName = watch("first_name");
  const lastName = watch("last_name");

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await guests.create(data);
      navigate("/guests");
    } catch (e) {
      setServerError(errorMessage(e));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-serif">New Guest</h1>

        <p className="text-gray-500">Register a new guest</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FORM */}

        <div className="lg:col-span-2 bg-white rounded-3xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormError message={serverError} />
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm">First Name *</label>

                <input
                  {...register("first_name")}
                  className="w-full border rounded-xl p-3 out"
                  placeholder="Arthur"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Last Name *</label>

                <input
                  {...register("last_name")}
                  className="w-full border rounded-xl p-3 "
                  placeholder="Morgan"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Phone Number *</label>

                <input
                  {...register("phone_number")}
                  className="w-full border rounded-xl p-3"
                  placeholder="08012345678"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Email</label>

                <input
                  type="email"
                  {...register("email")}
                  className="w-full border rounded-xl p-3"
                  placeholder="guest@email.com"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Nationality</label>

                <input
                  {...register("nationality")}
                  className="w-full border rounded-xl p-3"
                  placeholder="Nigerian"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">ID Type</label>

                <select
                  {...register("id_type")}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Select ID Type</option>

                  <option value="NATIONAL_ID">National ID</option>

                  <option value="DRIVERS_LICENSE">Driver's License</option>

                  <option value="PASSPORT">Passport</option>

                  <option value="VOTERS_CARD">Voter's Card</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm">ID Number</label>

              <input
                {...register("id_number")}
                className="w-full border rounded-xl p-3"
                placeholder="1234567890"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Address</label>

              <textarea
                rows="3"
                {...register("address")}
                className="w-full border rounded-xl p-3"
                placeholder="Abuja, Nigeria"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Notes</label>

              <textarea
                rows="4"
                {...register("notes")}
                className="w-full border rounded-xl p-3"
                placeholder="Additional information..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/guests")}
                className="
                  px-5 py-3
                  rounded-xl
                  bg-gray-200
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  px-5 py-3
                  rounded-xl
                  bg-[#C76A12]
                  text-white
                "
              >
                Create Guest
              </button>
            </div>
          </form>
        </div>

        {/* PREVIEW */}

        <div className="bg-white rounded-3xl p-6 h-fit">
          <h2 className="font-semibold mb-4">Guest Preview</h2>

          <div className="space-y-4">
            <div
              className="
                w-16 h-16
                rounded-full
                bg-[#C76A12]
                text-white
                flex
                items-center
                justify-center
                text-xl
                font-semibold
              "
            >
              {firstName?.[0] || ""}
              {lastName?.[0] || ""}
            </div>

            <div>
              <p className="font-medium">
                {firstName || "First Name"} {lastName || "Last Name"}
              </p>

              <p className="text-gray-500 text-sm">Guest Profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGuestPage;
