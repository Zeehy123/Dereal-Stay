import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { guests as guestsApi, rooms as roomsApi, reservations } from "../../services/guesthouse";
import { errorMessage } from "../../services/api";
import { ErrorBox, FormError, Loading } from "../../components/Feedback";
const NewReservationPage = () => {
  const { data: lookups, loading, error, reload } = useApi(
    async () => {
      const [g, r] = await Promise.all([guestsApi.list(), roomsApi.list()]);
      return {
        guests: g.map((x) => ({ id: x.id, name: `${x.first_name} ${x.last_name}` })),
        rooms: r.filter((x) => x.status !== "MAINTENANCE"),
      };
    },
    [],
  );
  const guests = lookups?.guests || [];
  const rooms = lookups?.rooms || [];
  const [serverError, setServerError] = useState("");
  const { register, watch, handleSubmit, formState: { isSubmitting } } = useForm();

  const roomId = watch("room");
  const checkIn = watch("check_in_date");
  const checkOut = watch("check_out_date");
  const amountPaid = watch("amount_paid") || 0;

  const [duration, setDuration] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  const selectedRoom = rooms.find((room) => room.id === Number(roomId));

  useEffect(() => {
    if (selectedRoom && checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (days > 0) {
        setDuration(days);
        setTotalAmount(days * selectedRoom.price_per_night);
      } else {
        setDuration(0);
        setTotalAmount(0);
      }
    }
  }, [selectedRoom, checkIn, checkOut]);

  const balance = totalAmount - Number(amountPaid || 0);

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const created = await reservations.create({ ...data, initial_payment: data.amount_paid });
      navigate(`/reservations/${created.id}`);
    } catch (e) {
      setServerError(errorMessage(e));
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-8">
          {/* <h1 className="text-3xl font-serif">Reservations</h1> */}
          <h1 className="text-4xl font-serif">Create New Reservation</h1>

          <button
            className="
                    bg-[#C76A12]
                    text-white
                    px-4
                    py-2.5
                    rounded-xl
                    flex
                    items-center
                    gap-2
                  "
            onClick={() => navigate("/reservations")}
          >
            {/* <FiPlus /> */}
            Reservations
          </button>
        </div>

        <p className="text-gray-500 mt-2">
          Create and manage guest reservations.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* FORM */}

        <div className="col-span-2 bg-white rounded-3xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormError message={serverError} />
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm uppercase tracking-wider text-gray-600">
                  Guest *
                </label>

                <select
                  {...register("guest", { required: true })}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Select Guest</option>

                  {guests.map((guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm uppercase tracking-wider text-gray-600">
                  Room *
                </label>

                <select
                  {...register("room", { required: true })}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Select Room</option>

                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Room {room.room_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm uppercase tracking-wider text-gray-600">
                  Check-In Date *
                </label>

                <input
                  type="date"
                  {...register("check_in_date", { required: true })}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm uppercase tracking-wider text-gray-600">
                  Check-Out Date *
                </label>

                <input
                  type="date"
                  {...register("check_out_date", { required: true })}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm uppercase tracking-wider text-gray-600">
                  Number of Guests
                </label>

                <input
                  type="number"
                  defaultValue={1}
                  {...register("number_of_guests")}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm uppercase tracking-wider text-gray-600">
                  Amount Paid
                </label>

                <input
                  type="number"
                  {...register("amount_paid")}
                  className="w-full border rounded-xl p-3"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm uppercase tracking-wider text-gray-600">
                Special Requests
              </label>

              <textarea
                rows="4"
                {...register("special_requests")}
                className="w-full border rounded-xl p-3"
                placeholder="Any special requirements..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-5 py-3 rounded-xl bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-3 rounded-xl bg-[#C76A12] text-white"
              >
                Create Reservation
              </button>
            </div>
          </form>
        </div>

        {/* SUMMARY */}

        <div className="bg-white rounded-3xl p-8 h-fit">
          <h3 className="text-xl font-semibold mb-6">Reservation Summary</h3>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Room</span>
              <span>
                {selectedRoom ? `Room ${selectedRoom.room_number}` : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Room Type</span>
              <span>{selectedRoom?.room_type || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span>Rate / Night</span>
              <span>
                ₦{selectedRoom?.price_per_night?.toLocaleString() || 0}
              </span>
            </div>

            <hr />

            <div className="flex justify-between">
              <span>Duration</span>
              <span>{duration} Days</span>
            </div>

            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>₦{totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Amount Paid</span>
              <span>₦{Number(amountPaid).toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-red-500 font-semibold">
              <span>Balance</span>
              <span>₦{balance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReservationPage;
