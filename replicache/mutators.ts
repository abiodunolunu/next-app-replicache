import { WriteTransaction } from "replicache";
import { ITask, listTasks } from "./getters";

export type M = typeof mutators

export const mutators = {
    async createTask(tx: WriteTransaction, task: ITask) {
        const allTasks = await listTasks(tx)

        const updatedTasks = [...allTasks, task]

        await tx.put('tasks', updatedTasks)
    },

    async deleteAllTasks(tx: WriteTransaction) {
        await tx.put('tasks', [])

        //OR 
        // await tx.del('tasks')
    },

    async updateSingleTask(tx: WriteTransaction, taskID: string) {
        const allTasks = await listTasks(tx)

        const clonedTasks = [...allTasks]

        const indexOfTask = clonedTasks.findIndex(task => task.id === taskID)

        if (indexOfTask !== -1) {
            const currentTask = { ...clonedTasks[indexOfTask] }
            currentTask.completed = !currentTask.completed
            clonedTasks[indexOfTask] = currentTask
        }

        await tx.put('tasks', clonedTasks)
    },

    async deleteSingleTasks(tx: WriteTransaction, taskID: string) {
        const allTasks = await listTasks(tx)

        let clonedTasks = [...allTasks]



        clonedTasks = clonedTasks.filter(task => task.id !== taskID)

        console.log('HERE')

        await tx.put('tasks', clonedTasks)
    },



    async createText(tx: WriteTransaction, text: string) {
        await tx.put('text', text)
    }
}