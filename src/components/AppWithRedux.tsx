import React, {useCallback, useEffect} from 'react';
import '../App.css';
import {TaskType, Todolist} from "./Todolist";
import {AddItemForm} from "./AddItemForm";
import {
    AppBar,
    Button,
    Container,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Toolbar,
    Typography
} from "@material-ui/core";
import {MenuOpen} from "@material-ui/icons";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC, fetchTodolistsTC, removeTodolistTC,
} from "../state/todolists-reducer";
import {
    addTaskTC,
    updateTaskStatusTC,
    removeTaskTC, changeTaskTitleTC,
} from "../state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {RequestStatusType} from "./app-reducer";


export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistType = {
    id: string
    title: string
    filter: string
}
export type TaskStateType = {
    [key: string]: Array<TaskType>
}


function AppWithRedux() {
    const todolists = useSelector<AppRootStateType,
        Array<TodolistType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType,
        TaskStateType>(state => state.tasks)
    const status = useSelector<AppRootStateType>(state => state.app.status)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        const action = addTodolistTC(title)
        dispatch(action)
    }, [dispatch])
    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistTC(todolistId))
    }, [dispatch])
    const changeTodolistTitle = useCallback((title: string, todolistId: string) => {
        const action = changeTodolistTitleTC(title, todolistId)
        dispatch(action)
    }, [dispatch])
    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        const action = changeTodolistFilterAC(value, todolistId)
        dispatch(action)
    }, [dispatch])

    const removeTask = useCallback((taskId: string, todolistId: string) => {
        dispatch(removeTaskTC(todolistId, taskId))
    }, [dispatch])
    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTaskTC(title, todolistId))
    }, [dispatch])
    const changeTaskTitle = useCallback((id: string, title: string, todolistId: string) => {
        const action = changeTaskTitleTC(id, title, todolistId)
        dispatch(action)
    }, [dispatch])
    const changeTaskStatus = useCallback((id: string, isDone: boolean, todolistId: string) => {
        const action = updateTaskStatusTC(id, isDone, todolistId)
        dispatch(action)
    }, [dispatch])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    {/*    <IconButton edge="start"*/}
                    {/*        className={classes.menuButton}*/}
                    {/*                color="inherit" aria-label="menu">*/}
                    {/*        <MenuOpen/>*/}
                    {/*    </IconButton>*/}
                    <Typography variant="h6"
                        // className={classes.title}
                    >
                        Todolists
                    </Typography>
                    {/*<Button color="inherit">Login</Button>*/}
                </Toolbar>
                {
                    status === 'loading' && <LinearProgress color="secondary"/>
                }
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '10px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(todolist => {
                            let tasksForTodolist = tasks[todolist.id]
                            return <Grid item>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist
                                        key={todolist.id}
                                        id={todolist.id}
                                        title={todolist.title}
                                        filter={todolist.filter}
                                        removeTodolist={removeTodolist}
                                        changeTodolistTitle={changeTodolistTitle}
                                        tasks={tasksForTodolist}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeTaskStatus}
                                        changeTaskTitle={changeTaskTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    )
}

export default AppWithRedux
