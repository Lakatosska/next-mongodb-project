"use client"

import Image from 'next/image'
import styles from './page.module.css'
import { useState } from "react"

type Todo = {
  _id: string
  text: string | null
  completed: boolean
}

export default function Home() {
  const [isLoading, setLoading] = useState(true)
  const [todos, setTodos] = useState<Todo | null>(null)
  const [newTodoText, setNewTodoText] = useState<string>("")
  const [editTodo, setEditTodo] = useState<Todo | null>(null)

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
                />
                <button className="bg-slate-800 px-6 py-2 rounded-lg my-7 text-green-400 text-lg uppercase font-semibold">
                  Add Todo
                </button>
              </>
            )
          }   

        </div>

      </div>
      
    </main>
  )
}
