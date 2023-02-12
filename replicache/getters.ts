import { ReadTransaction } from 'replicache'

export type ITask = {
    id: string,
    name: string,
    completed: boolean
}

export async function listTasks(tx: ReadTransaction) {
    return await tx.get('tasks') as ITask[] || []
}

export async function getText(tx: ReadTransaction) {
    return await tx.get('text') as string | ''
}