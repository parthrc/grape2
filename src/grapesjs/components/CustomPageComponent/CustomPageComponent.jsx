const CustomPageComponent = ({ content }) => {
  return (
    <div
      style={{
        height: "10rem",
        border: "5px solid cyan",
        padding: "5px",
      }}
    >
      Custom page - {content}
    </div>
  );
};

export default CustomPageComponent;
