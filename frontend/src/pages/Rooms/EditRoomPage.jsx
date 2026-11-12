import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { rooms } from "../../services/guesthouse";
import { errorMessage } from "../../services/api";
import { ErrorBox, FormError, Loading } from "../../components/Feedback";

const amenitiesList = ["wifi", "tv", "ac", "minibar", "balcony"];

const EditRoomForm = ({ room }) => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      ...room,
      amenities: room.amenities || [],
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
      await rooms.update(room.id, data);
      navigate(`/rooms/${room.id}`);
    } catch (e) {
      setServerError(errorMessage(e));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-serif">Edit Room</h1>

        <p className="text-gray-500">Room {room.room_number}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormError message={serverError} />
            <div className="grid md:grid-cols-2 gap-5">
              <label className="block mb-2 text-sm">Room Number *</label>
              <input
                {...register("room_number")}
                className="border rounded-xl p-3 border-gray-300"
              />

              <input
                {...register("room_name")}
                className="border rounded-xl p-3 border-gray-300"
              />

              <input
                {...register("floor")}
                className="border rounded-xl p-3 border-gray-300"
              />

              <input
                {...register("price_per_night")}
                className="border rounded-xl p-3 border-gray-300"
              />

              <input
                {...register("max_guests")}
                className="border rounded-xl p-3 border-gray-300"
              />

              <select
                {...register("room_type")}
                className="border rounded-xl p-3 border-gray-300"
              >
                <option>Standard</option>

                <option>Deluxe</option>

                <option>Executive</option>

                <option>Suite</option>
              </select>
            </div>

            <div>
              <label className="block mb-3">Amenities</label>

              <div className="flex flex-wrap gap-3 ">
                {amenitiesList.map((amenity) => (
                  <label
                    key={amenity}
                    className="
                        flex
                        items-center
                        gap-2
                        border
                        rounded-xl
                        px-4
                        py-2
                        border-gray-300
                      "
                  >
                    <input
                      type="checkbox"
                      value={amenity}
                      {...register("amenities")}
                    />

                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <select
                {...register("status")}
                className="
                  w-full
                  border
                  rounded-xl
                  p-3
                  border-gray-300
                "
              >
                <option value="AVAILABLE">Available</option>

                <option value="OCCUPIED">Occupied</option>

                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(`/rooms/${room.id}`)}
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
          <h2 className="font-semibold mb-4">Current Amenities</h2>

          <div className="flex flex-wrap gap-2">
            {normalizedAmenities.map((item) => (
              <span
                key={item}
                className="
                    px-3 py-1
                    bg-[#F8F6F2]
                    rounded-lg
                  "
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EditRoomPage = () => {
  const { id } = useParams();
  const { data: room, loading, error, reload } = useApi(() => rooms.get(id), [id]);
  if (loading) return <Loading />;
  if (error || !room) return <ErrorBox message={error || "Room not found."} onRetry={reload} />;
  return <EditRoomForm room={room} />;
};

export default EditRoomPage;
