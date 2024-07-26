import React from "react";
const SampleComponent = () => {
  const dummyData = [
    { id: 1, name: "John Doe", age: 28 },
    { id: 2, name: "Jane Smith", age: 34 },
    { id: 3, name: "Sam Johnson", age: 23 },
  ];

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        backgroundColor: "#A020F0",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h1>My Form</h1>
        <form>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Name:
              <input type="text" name="name" />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Age:
              <input type="number" name="age" />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        <h2>Data Table</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ffffff", padding: "8px" }}>
                ID
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Age</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((item) => (
              <tr key={item.id}>
                <td style={{ border: "1px solid #ffffff", padding: "8px" }}>
                  {item.id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item.name}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item.age}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SampleComponent;
