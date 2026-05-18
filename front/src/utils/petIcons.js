import ButterflyIcon from "../assets/icons/pets/butterfly.svg?react";
import CatIcon from "../assets/icons/pets/cat.svg?react";
import CrabIcon from "../assets/icons/pets/crab.svg?react";
import DogIcon from "../assets/icons/pets/dog.svg?react";
import FishIcon from "../assets/icons/pets/fish.svg?react";
import FrogIcon from "../assets/icons/pets/frog.svg?react";
import HamsterIcon from "../assets/icons/pets/hamster.svg?react";
import HedgehogIcon from "../assets/icons/pets/hedgehog.svg?react";
import LizardIcon from "../assets/icons/pets/lizard.svg?react";
import OwlIcon from "../assets/icons/pets/owl.svg?react";
import ParrotIcon from "../assets/icons/pets/parrot.svg?react";
import RabbitIcon from "../assets/icons/pets/rabbit.svg?react";
import RatIcon from "../assets/icons/pets/rat.svg?react";
import RoosterIcon from "../assets/icons/pets/rooster.svg?react";
import SnailIcon from "../assets/icons/pets/snail.svg?react";
import SnakeIcon from "../assets/icons/pets/snake.svg?react";

const PET_SPECIES_ICON_BY_VALUE = {
  0: CatIcon,
  1: RatIcon,
  2: DogIcon,
  3: LizardIcon,
  4: ParrotIcon,
  5: OwlIcon,
  6: SnailIcon,
  7: HedgehogIcon,
  8: ButterflyIcon,
  9: SnakeIcon,
  10: FrogIcon,
  11: RoosterIcon,
  12: CrabIcon,
  13: FishIcon,
  14: RabbitIcon,
  15: HamsterIcon,
};

export const getPetSpeciesIcon = (species) => {
  if (species === null || species === undefined || species === "") return CatIcon;

  return PET_SPECIES_ICON_BY_VALUE[Number(species)] || CatIcon;
};
