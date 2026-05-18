const SELECTED_PET_ID_STORAGE_KEY = "selectedPetId";
const SELECTED_PET_NAME_STORAGE_KEY = "selectedPet";
const SELECTED_PET_SPECIES_STORAGE_KEY = "selectedPetSpecies";

export const getSelectedPet = () => ({
  id: localStorage.getItem(SELECTED_PET_ID_STORAGE_KEY),
  name: localStorage.getItem(SELECTED_PET_NAME_STORAGE_KEY),
  species: localStorage.getItem(SELECTED_PET_SPECIES_STORAGE_KEY),
});

export const setSelectedPet = (pet) => {
  const id = pet?.id ?? pet?.Id;
  const name = pet?.name ?? pet?.Name;
  const species = pet?.species ?? pet?.Species;

  if (id !== null && id !== undefined) {
    localStorage.setItem(SELECTED_PET_ID_STORAGE_KEY, String(id));
  }

  if (name) {
    localStorage.setItem(SELECTED_PET_NAME_STORAGE_KEY, name);
  }

  if (species !== null && species !== undefined && species !== "") {
    localStorage.setItem(SELECTED_PET_SPECIES_STORAGE_KEY, String(species));
  } else {
    localStorage.removeItem(SELECTED_PET_SPECIES_STORAGE_KEY);
  }
};

export const clearSelectedPet = () => {
  localStorage.removeItem(SELECTED_PET_ID_STORAGE_KEY);
  localStorage.removeItem(SELECTED_PET_NAME_STORAGE_KEY);
  localStorage.removeItem(SELECTED_PET_SPECIES_STORAGE_KEY);
};
