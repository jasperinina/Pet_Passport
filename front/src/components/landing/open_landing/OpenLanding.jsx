import { useNavigate } from "react-router-dom";

const OpenLanding = () => {
  const navigate = useNavigate();

  return (
    <button
      className="button button--outlined"
      type="button"
      onClick={() => navigate('/landing')}
    >
      Наш сайт
    </button>
  );
};

export default OpenLanding;