import { useEffect, useState } from "react";
import { useAuth } from "../context/authProvider";
import { useNavigate } from "react-router-dom";
import profileService from "../../services/profile.service";
import { LIKED_ADS } from "../../utils/authUtils";
import localStorageService from "../../services/localStorage.service";

function LikeButton({ carId, isLikedActive = false, onLikeChanged }) {
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
        let favorites = localStorageService.getLikedAds();
        favorites = favorites.filter((id) => id !== carId);
        localStorage.setItem(LIKED_ADS, JSON.stringify(favorites));
      } else {
        await profileService.addLikedCar(carId);
        let favorites = localStorageService.getLikedAds();

        if (favorites) {
          favorites.push(carId);
          localStorage.setItem(LIKED_ADS, JSON.stringify(favorites));
        }
      }

      if (onLikeChanged) {
        onLikeChanged(carId, !wasLiked);
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
      <div className="car-card__fav like-button" onClick={handleLike}>
        <i className={`bi bi-heart${!isLiked ? "" : "-fill"}`}></i>
      </div>
    </>
  );
}

export default LikeButton;
