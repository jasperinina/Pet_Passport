import "../styles/home.css";
import PetPhoto from "../assets/images/pet-photo.png";

const Home = () => {
  // фейковые данные
  const pet = {
    name: "Соня",
    species: "Кот",
    breed: "Сфинкс",
    sex: "Женский",
    weight: "4 кг",
    birthday: "05 ноября 2014 (11 лет)",
  };

  return (
    <main className="main-page">
      <div className="container">
        <section className="pet-block">
          {/* ЛЕВАЯ КАРТИНКА */}
          <div className="pet-block__photo-wrapper">
            <img
              src={PetPhoto}
              alt={pet.name}
              className="pet-block__photo"
            />
          </div>

          {/* ПРАВЫЙ БЛОК С ИНФОЙ */}
          <div className="pet-block__info">
            {/* Заголовок: имя + вид животного */}
            <div className="pet-block__top-row">
              <h1 className="h1 pet-block__name">{pet.name}</h1>
              <span className="txt2 pet-block__species">{pet.species}</span>
            </div>

            {/* Линия-разделитель */}
            <div className="pet-block__divider" />

            {/* Порода (на всю ширину) */}
            <div className="pet-block__section pet-block__section--full">
              <span className="txt2 pet-block__label">Порода</span>
              <span className="h2 pet-block__value">{pet.breed}</span>
            </div>

            {/* Пол / Вес / Дата рождения */}
            <div className="pet-block__section pet-block__section--grid">
              <div className="pet-block__field">
                <span className="txt2 pet-block__label">Пол</span>
                <span className="h2 pet-block__value">{pet.sex}</span>
              </div>

              <div className="pet-block__field">
                <span className="txt2 pet-block__label">Вес</span>
                <span className="h2 pet-block__value">{pet.weight}</span>
              </div>

              <div className="pet-block__field">
                <span className="txt2 pet-block__label">Дата рождения</span>
                <span className="h2 pet-block__value">{pet.birthday}</span>
              </div>
            </div>

            {/* Кнопки */}
            <div className="pet-block__actions">
              <button className="btn btn-primary">
                Добавить процедуру
              </button>
              <button className="btn btn-secondary">
                Изменить данные
              </button>
            </div>
          </div>
        </section>
        <section className="procedures">
            <h2 className="h1 procedures__title">Предстоящие процедуры</h2>

            <div className="procedures__card">
                <p className="txt1 procedures__empty-text">
                Нет предстоящих процедур
                </p>
            </div>
        </section>
      </div>
    </main>
  );
};

export default Home;