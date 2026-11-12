import { useForm } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rooms } from "../../services/guesthouse";
import { errorMessage } from "../../services/api";
import { FormError } from "../../components/Feedback";

const amenitiesList = ["wifi", "tv", "ac", "minibar", "balcony"];

const NewRoomPage = () => {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      status: "AVAILABLE",
      amenities: [],
    },
  });

  const selectedAmenities = watch("amenities");
  const normalizedAmenities = Array.isArray(selectedAmenities)
    ? selectedAmenities
    : selectedAmenities
      ? [selectedAmenities]
      : [];

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await rooms.create(data);
      navigate("/rooms");
    } catch (e) {
      setServerError(errorMessage(e));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate("/rooms")}
          className="px-3 py-2 rounded-xl bg-gray-200 flex items-center gap-2 mb-2"
        >
          <FiArrowLeft />
          Back
        </button>
        <h1 className="text-3xl font-serif">Add New Room</h1>

        <p className="text-gray-500">Create a new room for reservations</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FORM */}

        <div className="lg:col-span-2 bg-white rounded-3xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormError message={serverError} />
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm">Room Number *</label>

                <input
                  {...register("room_number")}
                  className="w-full border border-gray-300 rounded-xl p-3"
                  placeholder="101"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Room Name *</label>

                <input
                  {...register("room_name")}
                  className="w-full border rounded-xl p-3 border-gray-300 border-gray-300 "
                  placeholder="Garden View"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Room Type *</label>

                <select
                  {...register("room_type")}
                  className="w-full border rounded-xl p-3 border-gray-300 "
                >
                  <option value="">Select Type</option>

                  <option value="Standard">Standard</option>

                  <option value="Deluxe">Deluxe</option>

                  <option value="Executive">Executive</option>

                  <option value="Suite">Suite</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm">Floor *</label>

                <input
                  type="number"
                  {...register("floor")}
                  className="w-full border rounded-xl p-3 border-gray-300 "
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Price/Night *</label>

                <input
                  type="number"
                  {...register("price_per_night")}
                  className="w-full border rounded-xl p-3 border-gray-300 "
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Max Guests *</label>

                <input
                  type="number"
                  {...register("max_guests")}
                  className="w-full border rounded-xl p-3 border-gray-300 "
                />
              </div>
            </div>

            {/* Amenities */}

            <div>
              <label className="block mb-3 text-sm">Amenities</label>

              <div className="flex flex-wrap gap-3">
                {amenitiesList.map((amenity) => (
                  <label
                    key={amenity}
                    className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-xl
                        border
                        border-gray-300
                       
                        border
                        cursor-pointer
                      "
                  >
                    <input
                      type="checkbox"
                      value={amenity}
                      {...register("amenities")}
                    />

                    <span className="capitalize">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}

            <div>
              <label className="block mb-2 text-sm">Status</label>

              <select
                {...register("status")}
                className="w-full border rounded-xl p-3 border-gray-300 "
              >
                <option value="AVAILABLE">Available</option>

                <option value="MAINTENANCE">Maintenance</option>

                <option value="OCCUPIED">Occupied</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/rooms")}
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
                Create Room
              </button>
            </div>
          </form>
        </div>

        {/* PREVIEW */}

        <div className="bg-white rounded-3xl p-6 h-fit">
          <h2 className="font-semibold mb-5">Room Preview</h2>

          <div className="space-y-3">
            <div>
              <span className="text-gray-500">Amenities Selected</span>

              <div className="flex flex-wrap gap-2 mt-2">
                {normalizedAmenities.map((item) => (
                  <span
                    key={item}
                    className="
                        px-3 py-1
                        rounded-lg
                        bg-[#F8F6F2]
                        text-sm
                      "
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoomPage;
