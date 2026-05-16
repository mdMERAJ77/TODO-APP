import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [arr, setArr] = useState(function () {
    const data = localStorage.getItem("LocalStorageData");
    return data ? JSON.parse(data) : [];
  });

  const [editingIndex, setEditingIndex] = useState(null);
  function inputHandler(e) {
    setInput(e.target.value);
  }

  function Add_Update_Button_Handler() {
  const trimmedInput = input.trim();
  if (trimmedInput === "") {
    alert("input is empty !");
    return;
  }

  if (editingIndex !== null) {
    // EDIT MODE
    const newArray = arr.map(function (currArr, index) {
      if (editingIndex === index) {
        return { ...currArr, text: input };
      }
      return currArr;
    });

    localStorage.setItem("LocalStorageData", JSON.stringify(newArray));
    setArr(newArray);
  } else {
    // ADD MODE - FIXED!
    const newTask = {
      id: Date.now(),
      text: input,
      completed: false
    };
    
    const updatedArray = [...arr, newTask];
    
    localStorage.setItem("LocalStorageData", JSON.stringify(updatedArray));
    setArr(updatedArray);
  }

  setInput("");
  setEditingIndex(null);
}

  function editHandler(index) {
    setEditingIndex(index);
    setInput(arr[index].text);
  }

  function deleteButton(ClickIndex) {
    const userConfirmed = confirm(`Are you Sure "${arr[ClickIndex].text}"?`);

    if (userConfirmed) {
      const filteredArray = arr.filter(function (_, index) {
        return ClickIndex !== index;
      });

      setArr(filteredArray);

      localStorage.setItem("LocalStorageData", JSON.stringify(filteredArray));

      alert("successful");
    }
  }
  // ✅ CHECKBOX HANDLER - Ye important hai!
  function toggleComplete(index) {
    const updatedArray = arr.map(function (currItem, i) {
      if (i === index) {
        // Is task ka completed status toggle karo
        return { ...currItem, completed: !currItem.completed };
      }
      return currItem;
    });
    
    setArr(updatedArray);
    localStorage.setItem("LocalStorageData", JSON.stringify(updatedArray));
  }
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-center text-4xl font-bold text-gray-800 mb-10">
        TODO APP
      </h1>

      <div className="flex justify-center gap-4 mb-8 px-4">
        <input
          type="text"
          value={input}
          placeholder="Enter your task..."
          onChange={inputHandler}
          className="w-full max-w-md px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-sm"
        />

        <button
          className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition text-white font-semibold shadow-md"
          onClick={Add_Update_Button_Handler}
        >
          {editingIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {arr.map(function (currItem, index) {
          return (
            <ul key={index}>
              <li className="bg-white shadow-md rounded-2xl px-5 py-4 flex justify-between items-center mb-4 border border-gray-100 hover:shadow-lg transition">
                <span className="text-lg text-gray-700 font-medium wrap-break-words">
                  <input
                    type="checkbox"
                    onChange={() => toggleComplete(index)}
                    checked={currItem.completed}
                    className="mr-5 transform scale-150"
                  />
                  <span className={`text-lg text-gray-700 font-medium ${currItem.completed ? "line-through text-gray-400" : ""}`}>{index + 1}. {currItem.text}</span>
                </span>

                <div className="flex gap-3">
                  <button
                    onClick={function () {
                      editHandler(index);
                    }}
                    className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteButton(index)}
                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            </ul>
          );
        })}

        {arr.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No tasks added yet...
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
