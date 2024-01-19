"use client"

import Image from 'next/image'
import styles from './page.module.css'
import { useState, useEffect } from "react"

type Todo = {
  _id: string
  text: string | null
  completed: boolean
}

export default function Home() {
  const [isLoading, setLoading] = useState(true)
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodoText, setNewTodoText] = useState<string>("")
  const [editTodo, setEditTodo] = useState<Todo | null>(null)

  useEffect(() => {
    fetch("http://localhost:3000/api/todo")
    .then(res => res.json())
    .then(data => {
      setTodos(data)
      setLoading(false)
    })
  }, [])

  const addTodo = async() => {
    if(!newTodoText) return;

    const response = await fetch('http://localhost:3000/api/todo', {
      method: 'POST',
      body: JSON.stringify({ text: newTodoText }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    console.log("data", data)
    setTodos([...todos, data])
    setNewTodoText('')
  }

  return (
    <main className="font-mulish grid lg:place-items-start place-items-center w-full bg-black text-purple-500 min-h-screen">
      <div className="flex lg:flex-row flex-col gap-5 lg:justify-start justify-center lg:items-start items-center w-full">
        <div className="sm:w-9/12 lg:w-6/12 w-full px-4 lg:my-10 flex flex-col justify-center items-center">
          <h1 className="text-4xl py-8 lg:py-0 lg:pt-4 lg:pb-14 text-yellow-500">
            Todo list
          </h1>
          {/* edit todo */}
          {editTodo ? (
            <>
              <input 
                className="w-full lg:w-8/12 bg-black border border-yellow-400 py-4 text-xl rounded-lg text-purple-400 outline-none px-3"
                type="text"
              />
              <button className="bg-slate-800 px-6 py-2 rounded-lg my-7 text-green-400 text-lg uppercase font-semibold">
                Save
              </button>
            </>
            ) : (
            /* add todo */
              <>
                <input 
                  className="w-full lg:w-8/12 bg-black border border-purple-400 py-4 text-xl rounded-lg text-purple-400 outline-none px-3"
                  type="text"
                  placeholder="Write here..."
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                />
                <button onClick={addTodo} className="bg-slate-800 px-6 py-2 rounded-lg my-7 text-green-400 text-lg uppercase font-semibold">
                  Add Todo
                </button>
              </>
            )
          }   

        </div>

        <ul className="sm:w-9/12 lg:w-5/12 w-full px-4 flex flex-col justify-center items-centermy-6 py-6">
          {isLoading && (
            <p className="text-pink-600 text-2xl italic my-10">Loading...</p>
          )}
          {!isLoading && todos && todos.length == 0 ? (
            <div className="text-pink-600 text-2xl italic my-10">
              (No todos present in the list)
            </div>
          ) : (
            <>
              {!isLoading && todos && todos.map((todo: Todo) => (
                <li 
                  key={todo._id}
                  className="bg-slate-900 px-6 py-5 rounded-lg my-3 hover:text-green-400 text-lg w-full"
                >
                  <div className="flex justify-start items-start w-8/12">
                    <input
                      type="checkbox"
                      className="w-5 h-5 cursor-pointermt-1"
                    />
                    <span 
                      className={`${
                        todo.completed ? "line-through" : "list-none"
                      } px-4 w-full text-yellow-500`}>
                      {todo.text}
                    </span>
                  </div>

                </li>
              ))}
            </>
          )

          }
        </ul>

      </div>
      
    </main>
  )
}
