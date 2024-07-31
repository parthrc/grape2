import { v4 as uuidv4 } from "uuid";

const CustomPageComponent = ({ content }) => {
  return (
    <div
      style={{
        height: "10rem",
        border: "5px solid cyan",
        padding: "5px",
      }}
    >
      Custom page - {uuidv4()}
    </div>
  );
};

export default CustomPageComponent;
