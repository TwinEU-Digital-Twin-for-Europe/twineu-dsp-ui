import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, onSnapshot, where, doc, updateDoc, serverTimestamp, limit, getCountFromServer } from "firebase/firestore";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import { INotification } from "./models/INotification";
import axiosWithInterceptorInstance from "./components/helpers/AxiosConfig";
import { RetrieveLocalApi } from "./components/helpers/RetrieveLocalApi";

let app: any = null;
let db: any = null;
let auth: any = null;

async function initFirebase(MW_token: string): Promise<void> {
	//console.log("Initializing Firebase...");
	if (!app) {
		const configResponse = await axiosWithInterceptorInstance.get(`/dataset/onenet-settings/${(window as any)["env"]["appOnenetSettingsId"]}`);
		const firebaseConfig = configResponse.data.onenet_settings_obj.notification_config;
		app = initializeApp(JSON.parse(firebaseConfig));
		db = getFirestore(app);
		auth = getAuth(app);
	}
	const apiRetrieved = await RetrieveLocalApi();
	const tokenResponse = await axiosWithInterceptorInstance.post(
		`${apiRetrieved.ed_api_url}/notifications/auth/firebase-token`,
		{},
		{ headers: { Authorization: `Bearer ${MW_token}` } }
	);
	await signInWithCustomToken(auth, tokenResponse.data.firebaseToken);
}


async function markNotificationAsRead(notification: INotification) {
	if (!notification.read) {
		const docRef = doc(db, "notifications", notification.id);
		try {
			await updateDoc(docRef, {
				status: 'READ',
				readAt: serverTimestamp()
			});
		} catch (error) {
			console.error(error);
		}
	}
}


async function signOutFB() {
	if (auth) {
		await signOut(auth);
	}

}

async function listenNotifications(callback: (items: any[]) => void) {
	if (!auth?.currentUser?.uid) {
		return null;
	}
	const q = query(
		collection(db, "notifications"),
		where("toUser.id", "==", auth.currentUser.uid),
		where("status", "==", 'SENT'),
		orderBy("createdAt", "desc"),
		limit(50)
	);
	return onSnapshot(q, (snapshot) => {
		const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		callback(items as any[]);
	});
}
// https://firebase.google.com/docs/firestore/query-data/query-cursors?hl=it

async function countNotifications(): Promise<Number> {
	if (!auth?.currentUser?.uid) return 0;
	const count = query(
		collection(db, "notifications"),
		where("toUser.id", "==", auth.currentUser.uid),
		where("status", "==", "SENT"),
	);
	const countSnapshot = await getCountFromServer(count);
	const totalNotifications = countSnapshot.data().count;
	return totalNotifications;
}

const firabaseUtils =
{
	initFirebase,
	listenNotifications,
	markNotificationAsRead,
	signOutFB,
	countNotifications
};

export default firabaseUtils;


