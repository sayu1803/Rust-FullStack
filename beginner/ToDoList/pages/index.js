import React, { useState, useEffect, useCallback } from "react";
import { MdDelete, MdEdit, MdAdd } from "react-icons/md";
import axios from "axios";
import { format } from "date-fns";
import CheckBox from "../Components/CheckBox.jsx";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [searchInput, setSearchInput] = useState("");
  const [filteredTodos, setFilteredTodos] = useState([]);

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    const results = todos.filter((todo) => 
      todo && todo.title && todo.title.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredTodos(results);
  }, [searchInput, todos]);

  const addTodo = async () => {
    if (!todoInput.trim()) {
      alert("Please enter a todo!");
      return;
    }

    try {
      if (editIndex === -1) {
        const response = await axios.post("http://127.0.0.1:8080/todos", {
          title: todoInput,
          completed: false,
        });
        setTodos(response.data);
      } else {
        const todoId = todos[editIndex]?.id;
        if (todoId) {
          const response = await axios.put(`http://127.0.0.1:8080/todos/${todoId}`, {
            title: todoInput,
          });
          setTodos(response.data);
        }
        setEditIndex(-1);
      }
      setTodoInput("");
    } catch (error) {
      console.error("Error adding/updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8080/todos/${id}`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const editTodo = (index) => {
    const todo = todos[index];
    if (todo) {
      setTodoInput(todo.title);
      setEditIndex(index);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;

      const response = await axios.put(`http://127.0.0.1:8080/todos/${id}`, {
        completed: !todoToUpdate.completed,
      });
      
      setTodos(response.data);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  return (
    <div className="main-body">
      <div className="todo-app">
        <h1>Todo List with Rust</h1>

        <div className="input-section">
          <input
            type="text"
            placeholder="Enter a todo"
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
          />
          <button onClick={addTodo} className="add-btn">
            {editIndex === -1 ? <MdAdd /> : "Update"}
          </button>
        </div>

        <div className="input-section">
          <input
            type="text"
            placeholder="Search todos"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="todos">
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo.id} className={todo.completed ? "completed" : ""}>
                <div className="todo-content">
                  <CheckBox
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span className="todo-text">{todo.title}</span>
                </div>
                <div className="todo-meta">
                  <span className="todo-date">
                    {todo.created_at ? format(new Date(todo.created_at), "MMM d, yyyy") : "N/A"}
                  </span>
                  <div className="todo-actions">
                    <button className="edit-btn" onClick={() => editTodo(todos.findIndex(t => t.id === todo.id))}>
                      <MdEdit />
                    </button>
                    <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {filteredTodos.length === 0 && (
            <div className="empty-state">
              <img
                src="https://assets.vercel.com/image/upload/v1538361091/repositories/next-js/next-js-bg.png"
                alt="Empty Todo List"
                className="empty-image"
              />
              <p className="empty-text">No Todos Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;

