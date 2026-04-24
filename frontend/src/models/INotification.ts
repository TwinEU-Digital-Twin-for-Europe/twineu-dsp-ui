import { Timestamp } from "firebase/firestore";

export interface INotificationUser {
	id: string;
	description: string;
}

export enum INotificationType {
	DataProvided = 0
}

export interface INotification {
	id: string;
	fromUser: INotificationUser;
	toUser: INotificationUser;
	title: string;
	body: string;
	type: INotificationType;
	payload?: {
		dataEntityId: string;
	};
	createdAt: Timestamp;
	read: boolean;

}