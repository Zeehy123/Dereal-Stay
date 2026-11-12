import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BRAND_NAME } from "../../config";

const DashboardHero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.first_name || user?.username || "";

  return (
    <div className="relative h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#1b1816] via-[#2c2118] to-[#C76A12]">
      {/* Optional: drop a video at public/videos/guesthouse.mp4 and it plays behind the text. */}
      <video autoPlay muted loop playsInline className="w-full h-full object-cover">
        <source src="/videos/guesthouse.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute bottom-10 left-10 text-white">
        <p className="text-xl">Welcome back, {firstName}</p>

        <h1 className="text-5xl font-serif mt-2">{BRAND_NAME} Guest House</h1>

        <button
          onClick={() => navigate("/rooms")}
          className="mt-6 bg-[#C76A12] px-6 py-3 rounded-xl"
        >
          View Rooms
        </button>
      </div>
    </div>
  );
};

export default DashboardHero;
