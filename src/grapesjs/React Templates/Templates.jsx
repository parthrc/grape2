import { useEffect, useState } from "react";

const Text = ({ style, children }) => {
  return <div className="bg-red-400">{children}</div>;
};

const Template = () => {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const savedContent = JSON.parse(localStorage.getItem("MyCanvas"));
    if (savedContent) {
      setContent(savedContent.components);
    }
  }, []);

  const renderPages = (component) => {
    // console.log("Inside render component = ", component);
    if (component.type === "custom-page") {
      console.log("Page");
      return (
        <div>
          {component.components?.map((child, index) => {
            console.log("Child=", child);
            return <div key={index}>{renderPages(child)}</div>;
          })}
        </div>
      );
    }
  };

  return (
    <div>
      <h1>Template</h1>
      {content &&
        content.map((component, index) => {
          return <div key={index}>{renderPages(component)}</div>;
        })}
    </div>
  );
};

export { Template, Text };
