import React, { useEffect, useState, useRef } from "react";
import { CheckSquare, Edit, Trash2 } from "lucide-react";

function Todo() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(0);
  const [error, setError] = useState("");

  const checkDuplicate = (newTodo) => {
    return todos.some(
      (item) => item.list.toLowerCase() === newTodo.toLowerCase()
    );
  };

  const addTodo = () => {
    if (todo.trim() !== "") {
      // Check for duplicates (case insensitive)
      if (checkDuplicate(todo)) {
        setError("This todo already exists!");
        return;
      }

      if (editId) {
        // Check if edited text creates a duplicate
        const otherTodos = todos.filter(t => t.id !== editId);
        if (otherTodos.some(item => item.list.toLowerCase() === todo.toLowerCase())) {
          setError("This todo already exists!");
          return;
        }

        const updateTodo = todos.map((to) =>
          to.id === editId ? { ...to, list: todo } : to
        );
        setTodos(updateTodo);
        setEditId(0);
      } else {
        // Add new todo at the beginning of the array
        setTodos([
          { list: todo, id: Date.now(), status: false },
          ...todos
        ]);
      }
      setTodo("");
      setError("");
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onDelete = (id) => {
    const todoItem = todos.find(to => to.id === id);
    if (!todoItem.status) {
      setTodos(todos.filter((to) => id !== to.id));
    }
  };

  const onComplete = (id) => {
    setTodos(
      todos.map((list) =>
        list.id === id ? { ...list, status: !list.status } : list
      )
    );
  };

  const onEdit = (id) => {
    const todoItem = todos.find(to => to.id === id);
    if (!todoItem.status) {
      setTodo(todoItem.list);
      setEditId(todoItem.id);
      setError("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          TODO APP
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={todo}
              ref={inputRef}
              placeholder="Enter Your Todo"
              onChange={(event) => {
                setTodo(event.target.value);
                setError("");
              }}
              className="flex-grow p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
            >
              {editId ? "EDIT" : "ADD"}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </form>
        <div className="mt-4">
          <ul className="space-y-3">
            {todos.map((to) => (
              <li
                key={to.id}
                className={`flex items-center justify-between bg-gray-200 p-3 rounded-lg ${
                  to.status ? "line-through text-gray-500 opacity-60" : ""
                }`}
              >
                <span className="flex-grow">{to.list}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onComplete(to.id)}
                    className={`text-green-600 hover:text-green-700 transition-colors ${
                      to.status ? 'opacity-50' : ''
                    }`}
                    title="Complete"
                  >
                    <CheckSquare size={20} />
                  </button>
                  <button
                    onClick={() => onEdit(to.id)}
                    className={`text-blue-600 hover:text-blue-700 transition-colors ${
                      to.status ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="Edit"
                    disabled={to.status}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(to.id)}
                    className={`text-red-600 hover:text-red-700 transition-colors ${
                      to.status ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="Delete"
                    disabled={to.status}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Todo;