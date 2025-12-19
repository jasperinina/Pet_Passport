import { memo } from "react";
import PetPhoto from "../../assets/images/pet-photo.png";
import API_BASE_URL from "../../api/config";

const PetPhotosGrid = memo(({ photos, petName }) => {
  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    return photoUrl.startsWith("http") ? photoUrl : `${API_BASE_URL}${photoUrl}`;
  };

  const validPhotos = photos?.filter(photo => {
    const url = photo?.url;
    return url && typeof url === 'string' && url.trim() !== '';
  }) || [];

  if (validPhotos.length === 0) {
    return <img src={PetPhoto} alt={petName} className="pet-block__photo" />;
  }

  const gridColumns = validPhotos.length === 1 ? "1fr" : "repeat(2, 1fr)";

  return (
    <div
      className="pet-photos-grid"
      style={{
        display: "grid",
        gridTemplateColumns: gridColumns,
        gap: "10px",
        width: "100%",
        height: "100%",
      }}
    >
      {validPhotos.map((photo, index) => {
        const photoUrl = getPhotoUrl(photo.url);
        if (!photoUrl) return null;

        return (
          <img
            key={photo.id || index}
            src={photoUrl}
            alt={`${petName} - фото ${index + 1}`}
            className="pet-photos-grid__photo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.src = PetPhoto;
            }}
          />
        );
      })}
    </div>
  );
});

PetPhotosGrid.displayName = 'PetPhotosGrid';

export default PetPhotosGrid;

