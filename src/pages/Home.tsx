import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import Api from "../services/Api";
import {dayOfWeek, formatMonthYear, formatYYYYMMDD, getWeekFromDate} from "../helpers/dateFunctions";
import {daysLong, daysShort} from "../helpers/dateStructs";

interface LogInterface {
  id: number
  project: string
  description: string
  date: string
  hours: number
}
interface DayInterface {
  name: string
  date: string
  dateShort: string
  logs: Array<LogInterface>
}

interface ComponentProps {}

interface ComponentState {
  editDay: boolean
  monday: Date
  week: number
  monthYear: string
  weekDays: Array<DayInterface>
}

class Home extends React.Component<ComponentProps, ComponentState> {

  api = Api.getInstance()
  today = new Date()
  date: Date

  state = {
    editDay: false,
    week: 0,
    monthYear: '',
    monday: new Date(),
    weekDays: []
  }

  constructor(props: ComponentProps) {
    super(props)
    this.date = new Date()
  }

  componentDidMount() {
    this.setWeek()
  }

  setWeek = () => {
    let monday = new Date(this.date)
    let dow = dayOfWeek(this.date)
    monday.setDate(this.date.getDate() - dow)
    let day = monday
    const days = [] as Array<DayInterface>
    for (let i = 0; i < 7; i++) {
      days.push({
        name: daysShort[i],
        date: formatYYYYMMDD(day),
        dateShort: day.getDate() + '/' + (day.getMonth() + 1),
        logs: []
      })
      day.setDate(day.getDate() + 1)
    }
    this.setState({
      monday: monday,
      week: getWeekFromDate(monday),
      monthYear: formatMonthYear(monday),
      weekDays: days
    })
    this.getData()
  }

  getData = () => {
    const firstDate = formatYYYYMMDD(this.state.monday)
    let endDate = new Date(this.state.monday)
    endDate.setDate(endDate.getDate() + 7)
    const lastDate = formatYYYYMMDD(endDate)
    const url = 'work_logs?first_date=' + firstDate + '&last_date=' + lastDate;
    this.api.sess_get(url).then(responseJson => {
      this.addLogs(responseJson.work_logs)
    })
  }

  addLogs = (logs: Array<LogInterface>) => {
    const weekDays = this.state.weekDays
    for (let log of logs) {
      for (let weekDay of weekDays as Array<DayInterface>) {
        if (weekDay.date === log.date) {
          weekDay.logs.push(log)
          break
        }
      }
    }
    this.setState({weekDays: weekDays})
  }

  addMonth = (months: number)  => {
    this.date.setMonth(this.date.getDate() + months)
    this.setWeek()
  }

  addWeek = (weeks: number) => {
    this.date.setDate(this.date.getDate() + 7 * weeks)
    this.setWeek()
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Logga projekt</IonTitle>
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
            <div onClick={() => this.addMonth(-1)}>
              <img alt="left" src="/assets/icon/arrow_left.png" className="arrow" />
            </div>
            <h2>
              {this.state.monthYear}
            </h2>
            <div onClick={() => this.addMonth(1)}>
              <img alt="right" src="/assets/icon/arrow_right.png" className="arrow" />
            </div>
          </div>
          <div className="mt-4 flex ion-justify-content-around">
            <div onClick={() => this.addWeek(-1)}>
              <img alt="left" src="/assets/icon/arrow_left.png" className="arrow" />
            </div>
            <h2>
              Vecka {this.state.week}
            </h2>
            <div onClick={() => this.addWeek(1)}>
              <img alt="right" src="/assets/icon/arrow_right.png" className="arrow" />
            </div>
          </div>
          <div className="mt-4">&nbsp;</div>

          {
            this.state.weekDays.map((day: DayInterface, index: number) => {
              const dayClass = index > 4 ? 'day_weekend' : ''
              return (
                <div key={"day_" + index} style={{borderBottom: "2px solid #4444"}}
                     className={"px-4 py-2 flex justify-between " + dayClass}>
                  <div>
                    <h3>{day.name}</h3>
                    <p className="mt-2 font_small">{day.dateShort}</p>
                  </div>
                  <div className="font_small">
                    {
                      day.logs.map((log: LogInterface, logIndex) => {
                        return (
                          <div key={"p_" + index + "_" + logIndex} className="mb-2">
                            {log.project}: {log.hours} h
                            <p><i>{log.description}</i></p>
                          </div>
                        )
                      })
                    }
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

export default Home;
