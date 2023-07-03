import { useEffect, useRef, useState } from "react"
import InputResult from "../../model/InputResult"
import Alert from "./Alert"
import { StatusType } from "../../model/StatusType"
import "./Input.css"
import { Button, TextField } from "@mui/material"
import { useDispatch } from "react-redux"
import { codeActions } from "../redux/slices/codeSlice"
import CodeType from "../../model/CodeType"

type Props = {
    submitFn: (inputText: string) => InputResult
    placeholder: string
    buttonTitle?: string
    type?: string
}

const Input: React.FC<Props> = ({ submitFn, placeholder, buttonTitle, type }) => {

    // const inputElementRef = useRef<HTMLInputElement>(null) // получаю ссылку на элемент
    const inputElementRef = useRef<any>(null)
    const [disabled, setDisabled] = useState<boolean>(true)
    const status = useRef<StatusType>("success")
    const dispatch = useDispatch()

    function onClickFn(event: any) {
        const res = submitFn(inputElementRef.current!.value)
        status.current = res.status;
        if (res.status === "success"){
            inputElementRef.current!.value = ''
        }
        dispatch(codeActions.set({ message: res.message, code: CodeType.OK }))
    }

    function onChangeFn(event: any) {
        inputElementRef.current = event.target as any
        setDisabled(!inputElementRef.current?.value)
    }

    return (
        <>
            <div>
                <TextField
                    size="small"
                    type={type || 'text'}
                    placeholder={placeholder}
                    ref={inputElementRef}
                    onChange={onChangeFn}
                />
                <Button
                    onClick={onClickFn}
                    disabled={disabled}
                >{buttonTitle || 'GO'}</Button>
            </div>
        </>
    )
}

export default Input