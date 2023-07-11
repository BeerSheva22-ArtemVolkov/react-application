import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoginData from '../../model/LoginData';
import InputResult from '../../model/InputResult';
import { Alert, Divider, Snackbar } from '@mui/material';
import { StatusType } from '../../model/StatusType';
import GoogleIcon from '@mui/icons-material/Google';
import { NetworkType } from '../../service/auth/AuthService';

const SUBMIT_BUTTON_VALUE = 'Sign In'
const GOOGLE_SUBMIT_BUTTON_VALUE = 'Google Sign In'

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://tel-ran.com/">
                Tel-Ran
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

type Props = {
    submitFn: (loginData: LoginData) => Promise<InputResult>
    networks?: NetworkType
}

const SignInForm: React.FC<Props> = ({ submitFn }) => {

    const message = React.useRef<string>('');
    const [open, setOpen] = React.useState(false);
    const severity = React.useRef<StatusType>('success');

    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        let email: string = ''
        let password: string = ''

        switch (event.nativeEvent.submitter.value) {
            case GOOGLE_SUBMIT_BUTTON_VALUE:
                email = "GOOGLE"
                break;
            case SUBMIT_BUTTON_VALUE:
                email = data.get('email')! as string;
                password = data.get('password')! as string;
                break
        }

        const result = await submitFn({ email, password });
        message.current = result.message!;
        severity.current = result.status;
        message.current && setOpen(true);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: { xs: 8, sm: -4, md: 8 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container justifyContent={'center'} spacing={1}>
                            <Grid item xs={12} sm={6} md={12}>
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
                            </Grid>
                            <Grid item xs={12} sm={6} md={12}>
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
                            </Grid>
                            <Grid item xs={12} sm={6} md={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    value={SUBMIT_BUTTON_VALUE}
                                >
                                    Sign In
                                </Button>
                            </Grid>
                            <Divider sx={{width: '100%', fontWeight: 'bold'}}>or</Divider>
                            <Grid item xs={12} sm={6} md={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="outlined"
                                    value={GOOGLE_SUBMIT_BUTTON_VALUE}
                                    startIcon={<GoogleIcon />}
                                >
                                    Sign In with Google
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Snackbar open={open} autoHideDuration={10000}
                        onClose={() => setOpen(false)}>
                        <Alert onClose={() => setOpen(false)} severity={severity.current} sx={{ width: '100%' }}>
                            {message.current}
                        </Alert>
                    </Snackbar>
                </Box>
                <Copyright sx={{ mt: 4, mb: 4 }} />
            </Container>
        </ThemeProvider >
    );
}
export default SignInForm;