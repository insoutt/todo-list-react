import {FC, useEffect, useState} from 'react'
import { ITodoResponse } from '../../../models'
import { Button } from '../../atoms/button'
import { Input } from '../../atoms/input'
import Typography from '../../atoms/typography'
import './index.scss'
import {useHistory, useParams} from "react-router-dom";
import {useList} from "../../../hooks/useLists";

interface TodoFormProps {
  todoEdit?: ITodoResponse
  onUpdate?(action: 'create' | 'update'): void
}
const TodoForm: FC<TodoFormProps> = ({onUpdate, todoEdit}) => {

  const history = useHistory()
  // @ts-ignore
  let { id } = useParams();
  const { find, create, update } = useList()

  const [todoForm, setTodoForm] = useState<ITodoResponse>({ description: '', finish_at: '', status: 0 })
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [errorDate, setErrorDate] = useState<string>('')

  useEffect(() => {
    if (!id) {
      return ;
    }
    find(id)
        .then(todo => {
          setTodoForm(todo);
        })

    return () => {
      setTodoForm({
        description: '',
        finish_at: '',
        status: 0,
      })
    }

  }, [id])
  const handleOnChange = (property: 'description' | 'finish_at') => (value: string) => {
    console.log(value)
    setTodoForm(current => ({
      ...current,
      [property]: value
    }))
  }


  const submit = async () => {
    console.log('submit')
    if (!todoForm.description.length) {
      setErrorDescription('Descripción es requerida')
    } else {
      setErrorDescription('')
    }
    if (!todoForm.finish_at.length) {
      setErrorDate('La fecha limite es requerida')
    } else {
      setErrorDate('')
    }

    if (errorDescription || errorDate) {
      return;
    }

    if (id) {
      console.log('update')
      update(id, todoForm)
          .then(() => {
            if (typeof onUpdate === 'function') {
              onUpdate('update')
            }
            back();
          });
    } else {
      console.log('create');
      await create(todoForm)
      if (typeof onUpdate === 'function') {
        onUpdate('create')
      }
    }
    // onCreate(todoForm);
    // back();
  }

  const back = () => {
    history.push('/')
  }

  return <div className='todo-form'>
    <div className='todo-form-imput-container'>
      <Typography>
        Descripción
      </Typography>
      <Input placeholder='Descripción' testid="input-description" initialValue={todoForm.description} onChange={handleOnChange('description')} errorMessage={errorDescription} />
    </div>
    <div className='todo-form-imput-container'>
      <Typography>
        Fecha limite
      </Typography>
      <Input placeholder='Fecha limite' testid="input-date" type='date' initialValue={todoForm.finish_at} onChange={handleOnChange('finish_at')} errorMessage={errorDate} />
    </div>
    <div className='todo-form-button-container'>
      <Button onClick={back} variant="secondary"> Volver </Button>
      <Button onClick={submit}> {id ? 'Actualizar' : 'Agregar'} </Button>
    </div>
  </div>
}

export default TodoForm
