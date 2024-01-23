"use client"

import { useState, useEffect } from "react"
import { BASE_URL } from "@/lib/constants"

type Todo = {
  _id: string
  title: string | null
  text: string | null
  completed: boolean
}

export default function Home() {
  const [isLoading, setLoading] = useState(true)
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState<string>("")
  const [text, setText] = useState<string>("")
  const [editTodo, setEditTodo] = useState<Todo | null>(null)


  useEffect(() => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
      setTodos(data)
      setLoading(false)
    })
  }, [])


  const handleSubmitAddTodo = async(event : any) => {
    event.preventDefault();

    const title = event.target.title.value;
    const text = event.target.text.value;

    if(!text && !title) return;

    console.log('submit', title, text)

    const response = await fetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({ title, text }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    console.log("data", data)

    setTodos([...todos, data])
    setTitle('')
    setText('')
  }

  const handleEdit = (todo: Todo) => {
    setEditTodo(todo)
  }

  const handleSubmitEditTodo  = async (event : any) => {
    event.preventDefault();

    if (!editTodo) return

    const response = await fetch(BASE_URL, {
      method: 'PUT',
      body: JSON.stringify({ 
        id: editTodo._id,
        title: editTodo.title,
        text: editTodo.text,
        completed: editTodo.completed
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      setTodos(
        todos.map((todo: Todo) =>
          todo._id === editTodo._id ? { 
            ...todo, 
            title: editTodo.title, 
            text: editTodo.text 
          } : todo
        )
      )
      setEditTodo(null)
    }
  }

  const handleDelete = async (id: string) => {
    const response = await fetch(BASE_URL, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      setTodos(todos.filter((todo: Todo) => todo._id !== id))
    }
  }

  const toggleTodo = async (id: string, title: string, text: string, completed : boolean) => {
    const response = await fetch(BASE_URL, {
      method: 'PUT',
      body: JSON.stringify({ 
        id,
        title,
        text,
        completed: !completed }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      setTodos(
        todos.map((todo: Todo) =>
          todo._id === id ? { 
            ...todo, 
            title, 
            text,
            completed: !completed 
          } : todo
        )
      )
    }
  }


  return (
    <main className="flex justify-center file:font-mulishlg:place-items-start place-items-center w-full bg-stone-50 text-cyan-800 min-h-screen">
      <div className="max-w-1100 mx-4 flex lg:flex-row flex-col gap-5 lg:justify-start justify-center lg:items-start items-center">
        <div className="sm:w-12/12 lg:w-12/12 w-full px-4 lg:my-10 flex flex-col justify-center items-center">
          <h1 className="text-4xl py-8 lg:py-0 lg:pt-4 lg:pb-14 text-cyan-800 font-bold">
            My Todo List
          </h1>
          {/* edit todo */}
          {editTodo ? (
            <>
              <form 
                onSubmit = {handleSubmitEditTodo}
                className="w-96 flex flex-col"
              >
                <input
                  className="w-full lg:w-12/12 py-4 bg-teal-100 text-xl rounded-lg text-cyan-800 font-semibold outline-none px-3 mb-2"
                  type="text"
                  name="title"
                  value={editTodo.title!}
                  onChange={(e) => setEditTodo({...editTodo, title: e.target.value})}
                />
                <textarea
                  className="w-full h-auto bg-teal-100 py-4 text-xl rounded-lg text-cyan-800 outline-none px-3 text-wrap"
                  name="text"
                  value={editTodo.text!}
                  onChange={(e) => setEditTodo({...editTodo, text: e.target.value})}
                />
              
                <button className="bg-slate-200 px-6 py-2 rounded-lg my-7 text-rose-400 text-lg uppercase font-semibold">
                  Save
                </button>
              </form>
            </>
            ) : (
            /* add todo */
              <>
                <form 
                  onSubmit={handleSubmitAddTodo} 
                  className="w-96 flex flex-col"
                >
                  <input 
                    className="w-full lg:w-12/12 bg-teal-100 border border-purple-400 py-4 text-xl rounded-lg text-cyan-800 font-semibold outline-none px-3 mb-2"
                    type="text"
                    name="title"
                    placeholder="Write here your title..."
                    value={title!}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  
                  <textarea
                    className="w-full h-auto lg:w-12/12 bg-teal-100 border border-purple-400 py-4 text-xl rounded-lg text-cyan-800 outline-none px-3"
                    name="text"
                    placeholder="Write here your text..."
                    value={text!}
                    onChange={(e) => setText(e.target.value)}
                  />
                
                  <button 
                    className="bg-slate-300 px-6 py-2 rounded-lg my-7 text-cyan-800 text-lg uppercase font-semibold"
                  >
                    Add Todo
                  </button>
                </form>

              </>
            )
          }   
        </div>

        <ul className="sm:w-9/12 lg:w-12/12 w-full px-4 flex flex-col justify-center items-centermy-6 py-6">
          {isLoading && (
            <p className="text-cyan-800  text-2xl italic my-10">Loading...</p>
          )}
          {!isLoading && todos && todos.length == 0 ? (
            <div className="text-cyan-800  text-2xl italic my-10">
              (No todos present in the list)
            </div>
          ) : (
            <>
              {!isLoading && todos && todos.map((todo: Todo) => (
                <li 
                  key={todo._id}
                  className="bg-teal-200 px-6 py-5 rounded-lg my-3 hover:text-green-400 text-lg w-full flex justify-between items-start"
                >
                  <div className="flex justify-start items-start w-8/12 text-wrap">
                    <input
                      type="checkbox"
                      className="w-5 h-5 cursor-pointer mt-1"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo._id, todo.title!, todo.text!, todo.completed)}
                    />
                    <div 
                  
                      style={{ width: "400px", display: "flex", flexDirection: "column",  }}
                    >
                      <span 
                        className={`${
                          todo.completed ? "line-through" : "list-none"
                        } px-4 w-full text-cyan-800 font-semibold`}>
                        {todo.title}
                      </span>
                      <p
                        className={`${
                          todo.completed ? "line-through" : "list-none"
                        } px-4 text-cyan-800 text-wrap`}>
                        {todo.text}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-4/12 md:w-3/12">
                    <button 
                      onClick={() => handleEdit(todo)} 
                      className="text-stone-900 uppercase md:text-base text-sm px-3 hover:text-sky-600"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(todo._id)} 
                      className="text-rose-900 uppercase md:text-base text-sm px-3 hover:text-pink-600"
                    >
                      Del
                    </button>
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </main>
  )
}
