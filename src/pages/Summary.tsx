import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

interface DayInterface {
  name: string,
  date: string
}

interface ComponentProps {}

interface ComponentState {
  editDay: boolean
}

export default class Summary extends React.Component<ComponentProps, ComponentState> {

  state = {
    editDay: false
  }

  weekDays = [
    {
      name: 'Måndag',
      date: '2021-01-25',
    },
    {
      name: 'Tisdag',
      date: '2021-01-26'
    },
    {
      name: 'Onsdag',
      date: '2021-01-27'
    },
    {
      name: 'Torsdag',
      date: '2021-01-28'
    },
    {
      name: 'Fredag',
      date: '2021-01-29'
    },
    {
      name: 'Lördag',
      date: '2021-01-30'
    },
    {
      name: 'Söndag',
      date: '2021-01-31'
    },
  ]

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Sammanställ projekt</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonModal isOpen={this.state.editDay} cssClass="modal_centered" onDidDismiss={() => this.setState({editDay: false})}>
            <div className="p-4">
              <h3 className="text_center">Ändra grejer</h3>
              <p className="mt-4 font_small text_link">Kopiera senaste: "Dricka öl"</p>
            </div>
          </IonModal>
          <div className="mt-4 flex ion-justify-content-around">
            <div>
              <img alt="left" src="/assets/icon/arrow_left.png" className="arrow" />
            </div>
            <h2>
              Januari 2021
            </h2>
            <div>
              <img alt="right" src="/assets/icon/arrow_right.png" className="arrow" />
            </div>
          </div>
          <div className="mt-4 flex ion-justify-content-around">
            <div>
              <img alt="left" src="/assets/icon/arrow_left.png" className="arrow" />
            </div>
            <h2>
              Vecka 4
            </h2>
            <div>
              <img alt="right" src="/assets/icon/arrow_right.png" className="arrow" />
            </div>
          </div>
          <div className="mt-4">&nbsp;</div>

          {
            this.weekDays.map((day: DayInterface, index: number) => {
              const dayClass = index > 4 ? 'day_weekend' : ''
              return (
                <div key={"day_" + index} style={{borderBottom: "2px solid #4444"}}
                     className={"px-4 py-2 flex justify-between items-center " + dayClass}>
                  <div>
                    <h3>{day.name}</h3>
                    <p className="mt-2 font_small">{day.date}</p>
                  </div>
                  <div onClick={() => this.setState({editDay: true})}>
                    <img alt="plus" src="/assets/icon/plus.svg" className="arrow"/>
                  </div>
                </div>
              )
            })
          }
        </IonContent>
      </IonPage>
    )
  }
}
