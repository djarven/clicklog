import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';

import React from 'react';
import { useLocation } from 'react-router-dom';
import {archiveOutline, archiveSharp, mailOutline, mailSharp, settingsOutline, settingsSharp} from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Logga projekt',
    url: '/page/home',
    iosIcon: archiveOutline,
    mdIcon: archiveSharp
  },
  {
    title: 'Sammanställ projekt',
    url: '/page/summary',
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  {
    title: 'Hantera projekt',
    url: '/page/handle',
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  {
    title: 'Inställningar',
    url: '/page/settings',
    iosIcon: settingsOutline,
    mdIcon: settingsSharp
  }
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>

        <IonList id="inbox-list">
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
        <div className="text_center mt-4">
          <img alt="logo" src="/assets/icon/timer_logo.png" style={{width: "40px"}}/>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
