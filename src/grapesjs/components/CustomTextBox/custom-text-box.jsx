import Tiptap from "../../../tiptap/tiptap.jsx";

const CustomTextBox = () => {
  return (
    <div style={{ border: "5px solid black", backgroundColor: "cyan" }}>
      Custom Text Box
      <div style={{ border: "3px solid purple", margin: "1px" }}>
        <Tiptap />
      </div>
    </div>
  );
};

export default CustomTextBox;
