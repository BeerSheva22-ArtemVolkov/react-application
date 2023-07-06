import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useState } from 'react'
import InputResult from '../../model/InputResult'

type Props = {
    title: string
    question: string
    submitFn: (opt: any) => any
    closeFn: () => void
}

const Confirm: React.FC<Props> = ({ title, question, submitFn, closeFn }) => {

    return <div>
        <Dialog
            open={true}
            // TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {question}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeFn}>No</Button>
                <Button onClick={submitFn}>Yes</Button>
            </DialogActions>
        </Dialog>
    </div>
}

export default Confirm