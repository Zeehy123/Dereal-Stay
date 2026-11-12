import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { apiStatus, reservations, rooms as roomsApi } from "../../services/guesthouse";
import { errorMessage } from "../../services/api";
import { ErrorBox, FormError, Loading } from "../../components/Feedback";

const EditReservationForm = ({ reservation, rooms }) => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const initialValues = {
    id: reservation.id,
    reservation_number: reservation.reservation_number,
    guest: reservation.guest_id,
    room: reservation.room_id,
    check_in_date: reservation.checkIn,
    check_out_date: reservation.checkOut,
    number_of_guests: reservation.guests_count,
    amount_paid: reservation.amount_paid,
    status: apiStatus(reservation.status),
    special_requests: reservation.special_requests,
  };

  const { register, watch, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initialValues,
  });

  const roomId = watch("room");
  const checkIn = watch("check_in_date");
  const checkOut = watch("check_out_date");
  const amountPaid = watch("amount_paid") || 0;

  const [duration, setDuration] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const selectedRoom = rooms.find((room) => room.id === Number(roomId));

  useEffect(() => {
    if (selectedRoom && checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (days > 0) {
        setDuration(days);

        setTotalAmount(days * selectedRoom.price_per_night);
      }
    }
  }, [selectedRoom, checkIn, checkOut]);

  const balance = totalAmount - Number(amountPaid);

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await reservations.update(reservation.id, data);
      navigate(`/reservations/${reservation.id}`);
    } catch (e) {
      setServerError(errorMessage(e));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-serif">Edit Reservation</h1>

        <p className="text-gray-500">{initialValues.reservation_number}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* FORM */}

        <div className="col-span-2 bg-white rounded-3xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormError message={serverError} />
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Guest</label>

                <input
                  type="text"
                  defaultValue={reservation.guest}
                  className="w-full border rounded-xl p-3"
                  readOnly
                />
              </div>

              <div>
                <label className="block mb-2">Room</label>

                <select
                  {...register("room")}
                  className="w-full border rounded-xl p-3"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Room {room.room_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Check In</label>

                <input
                  type="date"
                  {...register("check_in_date")}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2">Check Out</label>

                <input
                  type="date"
                  {...register("check_out_date")}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2">Number of Guests</label>

                <input
                  type="number"
                  {...register("number_of_guests")}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2">Amount Paid</label>

                <input
                  type="number"
                  {...register("amount_paid")}
                  readOnly
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2">Status</label>

                <select
                  {...register("status")}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="PENDING">Pending</option>

                  <option value="CONFIRMED">Confirmed</option>

                  <option value="CHECKED_IN">Checked In</option>

                  <option value="CHECKED_OUT">Checked Out</option>

                </select>
              </div>
            </div>

            <div>
              <label className="block mb-2">Special Requests</label>

              <textarea
                rows="4"
                {...register("special_requests")}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="bg-gray-200 px-5 py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  bg-[#C76A12]
                  text-white
                  px-5
                  py-3
                  rounded-xl
                "
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* SUMMARY */}

        <div className="bg-white rounded-3xl p-6 h-fit">
          <h2 className="text-lg font-semibold mb-6">Reservation Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Room Type</span>
              <span>{selectedRoom?.room_type}</span>
            </div>

            <div className="flex justify-between">
              <span>Rate/Night</span>
              <span>₦{selectedRoom?.price_per_night?.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Duration</span>
              <span>{duration} Days</span>
            </div>

            <hr />

            <div className="flex justify-between font-medium">
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

const EditReservationPage = () => {
  const { id } = useParams();
  const { data, loading, error, reload } = useApi(
    async () => {
      const [reservation, rooms] = await Promise.all([reservations.get(id), roomsApi.list()]);
      return { reservation, rooms };
    },
    [id],
  );
  if (loading) return <Loading />;
  if (error || !data) return <ErrorBox message={error || "Reservation not found."} onRetry={reload} />;
  return <EditReservationForm reservation={data.reservation} rooms={data.rooms} />;
};

export default EditReservationPage;
