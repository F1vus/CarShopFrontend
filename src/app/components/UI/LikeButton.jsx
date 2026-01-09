import { useEffect, useState } from "react";
import { useAuth } from "../context/authProvider";
import { useNavigate } from "react-router-dom";
import profileService from "../../services/profile.service";

function LikeButton({ carId, isLikedActive = false }) {
  const [isLiked, setIsLiked] = useState(isLikedActive);
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLiked(isLikedActive);
  }, [isLikedActive]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const wasLiked = isLiked;

    try {
      setIsLiked(!wasLiked);

      if (wasLiked) {
        await profileService.removeLikedCar(carId);
      } else {
        await profileService.addLikedCar(carId);
      }
    } catch (err) {
      console.error("Error updating like status:", err);
      setIsLiked(wasLiked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="car-card__fav like-button" onClick={() => handleLike()}>
        <i className={`bi bi-heart${!isLiked ? "" : "-fill"}`}></i>
      </div>
    </>
  );
}

export default LikeButton;
