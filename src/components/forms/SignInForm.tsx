import { Container, CssBaseline, Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputResult from "../../model/InputResult";
import { useRef, useState } from "react";
import { StatusType } from "../../model/StatusType";
import LoginData from "../../model/LoginData";
import { useDispatch } from "react-redux";
import { codeActions } from "../redux/slices/codeSlice";
import CodeType from "../../model/CodeType";

const defaultTheme = createTheme();


type Props = {
    submitFn: (loginData: LoginData) => Promise<InputResult>
}

const SignInForm: React.FC<Props> = ({ submitFn }) => {

    const message = useRef<string>('')
    // const [open, setOpen] = useState<boolean>(false)
    const status = useRef<StatusType>("success")
    const dispatch = useDispatch()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email: string = data.get('email')! as string;
        const password: string = data.get('password')! as string;
        const result = await submitFn({ email, password });        
        // message.current = result.message!;
        // status.current = result.status;
        console.log(result);
        
        dispatch(codeActions.set({ message: result.message, code: result.status == "success" ? CodeType.OK : CodeType.UNKNOWN }))
        // message.current && setOpen(true)
        // setTimeout(() => setOpen(false), 5000)
    };

    return (
        <ThemeProvider theme={defaultTheme} >
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                    {/* <Snackbar open={open} transitionDuration={1000} >
                        <Alert onClose={() => setOpen(false)} severity={status.current}>{message.current}</Alert>
                    </Snackbar> */}
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default SignInForm