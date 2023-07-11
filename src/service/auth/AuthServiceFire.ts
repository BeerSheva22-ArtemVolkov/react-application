import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";
import AuthService, { NetworkType } from "./AuthService";
import { getFirestore, collection, getDoc, doc } from "firebase/firestore"
import { GoogleAuthProvider, UserCredential, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import appFirebase from "../../config/firebase-config";
import { Google } from "@mui/icons-material";

export default class AuthServiceFire implements AuthService {

    private auth = getAuth(appFirebase)
    private administratorsCollection = collection(getFirestore(appFirebase), 'administrators');

    async login(loginData: LoginData): Promise<UserData> {
        let userData: UserData = null
        try {
            let userAuth: UserCredential

            switch (loginData.email) {
                case "GOOGLE":
                    userAuth = await signInWithPopup(this.auth, new GoogleAuthProvider)
                    break;
                default:
                    userAuth = await signInWithEmailAndPassword(this.auth, loginData.email, loginData.password)
            }

            userData = { email: userAuth.user.email as string, role: await this.isAdmin(userAuth.user.uid) ? "admin" : "user" }
            console.log(userData);

        } catch (error: any) {
            console.log(error);

        }
        return userData
    }

    logout(): Promise<void> {
        return signOut(this.auth)
    }

    getAvailableProviders(): NetworkType[] {
        throw new Error("Method not implemented.");
    }

    private async isAdmin(uid: any): Promise<boolean> {
        const docRef = doc(this.administratorsCollection, uid)
        return (await getDoc(docRef)).exists()
    }
}