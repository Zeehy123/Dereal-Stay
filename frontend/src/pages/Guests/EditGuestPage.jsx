import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { guests } from "../../services/guesthouse";
import { errorMessage } from "../../services/api";
import { ErrorBox, FormError, Loading } from "../../components/Feedback";

const EditGuestForm = ({ guest }) => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm({
    defaultValues: guest,
  });

  const firstName = watch("first_name");
  const lastName = watch("last_name");

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await guests.update(guest.id, data);
      navigate("/guests");
    } catch (e) {
      setServerError(errorMessage(e));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-serif">Edit Guest</h1>

        <p className="text-gray-500">Update guest information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormError message={serverError} />
            <div className="grid md:grid-cols-2 gap-5">
              <input
                {...register("first_name")}
                className="border rounded-xl p-3"
              />

              <input
                {...register("last_name")}
                className="border rounded-xl p-3"
              />

              <input
                {...register("phone_number")}
                className="border rounded-xl p-3"
              />

              <input {...register("email")} className="border rounded-xl p-3" />

              <input
                {...register("nationality")}
                className="border rounded-xl p-3"
              />

              <select
                {...register("id_type")}
                className="border rounded-xl p-3"
              >
                <option value="NATIONAL_ID">National ID</option>

                <option value="DRIVERS_LICENSE">Driver's License</option>

                <option value="PASSPORT">Passport</option>

                <option value="VOTERS_CARD">Voter's Card</option>
              </select>
            </div>

            <input
              {...register("id_number")}
              className="w-full border rounded-xl p-3"
            />

            <textarea
              rows="3"
              {...register("address")}
              className="w-full border rounded-xl p-3"
            />

            <textarea
              rows="4"
              {...register("notes")}
              className="w-full border rounded-xl p-3"
            />

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
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-3xl p-6 h-fit">
          <h2 className="font-semibold mb-4">Guest Profile</h2>

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
              mb-4
            "
          >
            {firstName?.[0] || ""}
            {lastName?.[0] || ""}
          </div>

          <p className="font-medium">
            {firstName} {lastName}
          </p>

          <p className="text-gray-500 text-sm">Existing Guest</p>
        </div>
      </div>
    </div>
  );
};

const EditGuestPage = () => {
  const { id } = useParams();
  const { data: guest, loading, error, reload } = useApi(() => guests.get(id), [id]);
  if (loading) return <Loading />;
  if (error || !guest) return <ErrorBox message={error || "Guest not found."} onRetry={reload} />;
  return <EditGuestForm guest={guest} />;
};

export default EditGuestPage;
