import "../styles/styles.css";

const getTimeClass = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

const SkyScene = () => {
  const timeClass = getTimeClass();

  return (
    <div className={`sky ${timeClass}`}>
      {/* Sun / Moon */}
      <div className="sun-moon" />

      {/* Clouds */}
      <div className="cloud cloud1" />
      <div className="cloud cloud2" />

      {/* Mountains */}
      <div className="mountains" />

      {/* Trees */}
      <div className="trees" />
    </div>
  );
};

export default SkyScene;
