import React, { useEffect, useState } from "react";
import { INotification } from "../models/INotification";
import firabaseUtils from "@app/firebase";
import { Unsubscribe } from "firebase/firestore";

export default function AllNotifications() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const handleNotificationClick = async (notification: INotification) => {
        //alert(`Notifica: ${notification.title} \Id: ${notification.id}`);
        if (!notification.read) {
            await firabaseUtils.markNotificationAsRead(notification);
        }
        window.location.href = `/detailDataEntity?id=${notification.payload?.dataEntityId}`;
    };
    useEffect(() => {
        if (localStorage.getItem("token")) {
            let unsubNotif: Unsubscribe | null = null;
            (async () => {
                const userObj: { token: string; username: string; userId?: string } = {
                    token: localStorage.getItem("token") || "",
                    username: localStorage.getItem("username") || "",
                    userId: localStorage.getItem("uid") || "",
                };
                if (userObj) {
                    try {
                        await firabaseUtils.initFirebase(userObj.token);
                        unsubNotif = await firabaseUtils.listenNotifications((items) => {
                            setNotifications(items);
                        });
                    } catch (err) {
                        console.error(err);
                    }
                }
            })();
            return () => {
                if (unsubNotif) {
                    unsubNotif();
                }
            };
        }
    }, []);
    if (!notifications || notifications.length === 0) return <div className="empty">You don't have any notifications.</div>;
    return (
        <div>
            <h2> <b><i className="fas fa-newspaper nav-icon " style={{ paddingRight: "8px" }}></i>  All Notifications</b></h2>
            <h5>In this page you can view all your notifications. You can mark them as read by clicking on them.</h5>
            <div className="grid" style={{"paddingTop":"10px"}}>
                {notifications.map((item) => (
                    <div
                        key={item.id}
                        className="card"
                        onClick={() => handleNotificationClick(item)}
                        style={{ cursor: 'pointer', paddingLeft: '7px' }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Click to go to the related data entity and mark as read"
                    >
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                        <small>
                            <i>
                                {item.createdAt &&
                                    (item.createdAt.toDate
                                        ? item.createdAt.toDate().toLocaleString()
                                        : String(item.createdAt))}
                            </i>
                        </small>
                    </div>
                ))}
            </div>
        </div>
    );
}