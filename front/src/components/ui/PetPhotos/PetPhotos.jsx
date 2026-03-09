import styles from "./PetPhotos.module.scss";

import { memo } from "react";

import PetPhoto from "../../../assets/images/pet-photo.png";
import API_BASE_URL from "../../../api/config";

const PetPhotos = ({ photos, petName }) => {
  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    return photoUrl.startsWith("http") ? photoUrl : `${API_BASE_URL}${photoUrl}`;
  };

  const validPhotos = photos?.filter(photo => {
    const url = photo?.url;
    return url && typeof url === 'string' && url.trim() !== '';
  }) || [];

  if (validPhotos.length === 0) {
    return (
      <div className={styles["pet-photos"]}>
        <img
          className={styles["pet-photos__item"]}
          src={PetPhoto}
          alt={petName}
          width="500" height="367" loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={styles["pet-photos"]}>
      <div className={`${styles[`pet-photos__grid--${validPhotos.length === 1 ? "1" : "2"}`]}`}>
        {validPhotos.map((photo, index) => {
          const photoUrl = getPhotoUrl(photo.url);
          if (!photoUrl) return null;

          return (
            <img
              className={`${styles["pet-photos__item"]} ${validPhotos.length === 1 ? "" : styles["pet-photos__item--small"]}`}
              key={photo.id || index}
              src={photoUrl}
              alt={`${petName} - фото ${index + 1}`}
              onError={(e) => {
                e.target.src = PetPhoto;
              }}
              width="500" height="367" loading="lazy"
            />
          );
        })}
      </div>
    </div>
  );
}

export default PetPhotos;