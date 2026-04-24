import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PfDropdown } from '@profabric/react-components';
import { Unsubscribe } from "firebase/firestore";
import firabaseUtils from '@app/firebase';
import { INotification } from '@app/models/INotification';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

export const StyledDropdown = styled(PfDropdown)`
  border: none;
  width: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  --pf-dropdown-menu-min-width: 18rem;

  .dropdown-item {
    padding: 0.5rem 1rem;
  }

  .text-sm {
    margin-bottom: 0;
  }
  .dropdown-divider {
    margin: 0;
  }
`;
const NotificationsDropdown = () => {
  const [t] = useTranslation();
  const [notifications, setNotifications] = useState<any[]>([]);
  //const [totalNotifications, setTotalNotifications] = useState<number>(0);
  //localStorage.setItem("totalNotifications", "0");

  const handleNotificationClick = async (notification: INotification) => {
    //alert(`Notifica: ${notification.title} \Id: ${notification.id}`);
    //toast.info(`Notification: ${notification.title} \Id: ${notification.id}`);

    if (!notification.read) {
      await firabaseUtils.markNotificationAsRead(notification);
    }
    window.location.href = `/detailDataEntity?id=${notification.payload?.dataEntityId}`;
  };
  /*  useEffect(() => {
     firabaseUtils.countNotifications().then((count) => setTotalNotifications(Number(count)));
   }, [notifications]); */
  /*   useEffect(() => {
      setTotalNotifications(Number(localStorage.getItem("totalNotifications")) );
    }, [localStorage.getItem("totalNotifications")]); */
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
            unsubNotif = await firabaseUtils.listenNotifications((items) => setNotifications(items));
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
  /*
<span className="badge badge-warning navbar-badge">{totalNotifications > 50 ? '50+' : totalNotifications}</span>
quantity: totalNotifications
totalNotifications > 5 ? `(${totalNotifications > 50 ? '50+' : totalNotifications - 5} more)` : ''
  */
  return (
    <StyledDropdown hideArrow>
      <div slot="button">
        <i className="far fa-bell" />
        <span className="badge badge-warning navbar-badge">{notifications.length}</span>
      </div>
      <div slot="menu">
        <span className="dropdown-item dropdown-header">
          {t<string>('header.notifications.count', { quantity: notifications.length })}
        </span>
        <div className="dropdown-divider" />
        {notifications.slice(0, 5).map((notification) => (

          <Button className="dropdown-item" key={notification.id} onClick={() => handleNotificationClick(notification)}>
            <Row >
              <Col>
                <i className="fas fa-file mr-2" />
                <b> <span>{notification.title}</span> </b>
              </Col>
              <i className="fas fa-trash-alt mr-2" onClick={() => handleNotificationClick(notification)} />
            </Row>
            <p>{notification.body}</p>
            {notification.title === "Data Provided" && <p>Created by the user: {notification.fromUser.description} on {notification.createdAt.toDate().toLocaleString()}</p>}
            <div className="dropdown-divider" />
          </Button>
        ))}
        <div className="dropdown-divider" />
        {notifications.length > 0 && (
          <Link to="/AllNotifications" className="dropdown-item dropdown-footer" onClick={() => {}}>
            {t<string>('header.notifications.seeAll')} {notifications.length > 5 ? `(${notifications.length - 5} more)` : ''}
          </Link>
        )}
      </div>
    </StyledDropdown>
  );
};
export default NotificationsDropdown;
