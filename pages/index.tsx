import { SPACE_ID } from "@/CONSTANTS";
import { useReplicacheContext } from "@/context/ReplicacheContext";
import { ITask, listTasks } from "@/replicache/getters";
import { Inter } from "@next/font/google";
import { GetServerSideProps } from "next";
import { FormEvent, FormEventHandler, useState } from "react";
import { createSpace, spaceExists } from "replicache-nextjs/lib/backend";
import { useSubscribe } from "replicache-react";
import { v4 as uuid } from "uuid";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps = async () => {
  if (await spaceExists(SPACE_ID))
    return {
      props: {},
    };

  await createSpace(SPACE_ID);
  return {
    props: {},
  };
};

export default function Home() {
  const [taskName, setTaskName] = useState("");
  const { rep } = useReplicacheContext();
  const tasks = useSubscribe(rep, listTasks, [], [rep]);

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    console.log({ t: target.value });

    setTaskName(target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const newTask: ITask = {
      id: uuid(),
      name: taskName,
      completed: false,
    };

    await rep?.mutate.createTask(newTask);
    setTaskName("");
  };

  const updateTask = (taskId: string) => {
    rep?.mutate.updateSingleTask(taskId);
  };

  const deleteALL = () => {
    rep?.mutate.deleteAllTasks();
  };

  const createMultiple = async () => {
    for (let i = 1; i <= 1000; i++) {
      const newTask: ITask = {
        id: uuid(),
        name: "TASK" + i,
        completed: false,
      };

      await rep?.mutate.createTask(newTask);
    }
  };

  return (
    <div style={{ fontFamily: "Inter" }}>
      <div
        style={{
          textAlign: "center",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <button
          type="submit"
          style={{
            marginTop: "1rem",
            height: "2rem",
            background: "white",
            color: "#000",
            padding: "0 1rem",
            cursor: "pointer",
          }}
          onClick={createMultiple}
        >
          CREATE A 1000 TASKS AT ONCE
        </button>

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            height: "2rem",
            background: "white",
            color: "#000",
            padding: "0 1rem",
            cursor: "pointer",
          }}
          onClick={deleteALL}
        >
          DELETE ALL TASKS
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          textAlign: "center",
          maxWidth: "400px",
          margin: "0 auto",
          padding: "1.5rem",
        }}
      >
        <input
          type="text"
          onInput={handleInput}
          value={taskName}
          placeholder="Single Task Name"
          style={{
            width: "100%",
            height: "2rem",
            background: "white",
            color: "black",
            padding: "0 1rem",
          }}
          required
        />
        <button
          type="submit"
          style={{
            marginTop: "1rem",
            height: "2rem",
            background: "white",
            color: "#000",
            padding: "0 1rem",
            cursor: "pointer",
          }}
        >
          CREATE SINGLE TASK
        </button>
      </form>

      {tasks.map((t, i, arr) => {
        return (
          <div
            key={Math.random()}
            style={{
              height: "40px",
              border: "1px solid grey",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: t.completed ? "white" : "black",
              background: t.completed ? "black" : "white",
            }}
            // CLICK TO UPDATE TASK COMPLETED STATE
            onClick={() => updateTask(t.id)}
          >
            {t.name}
            {t.completed ? " -- Completed" : " -- Not Completed"}
          </div>
        );
      })}
    </div>
  );
}
