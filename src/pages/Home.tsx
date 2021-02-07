import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import Api from "../services/Api";
import {dayOfWeek, formatMonthYear, formatYYYYMMDD, getWeekFromDate} from "../helpers/dateFunctions";
import {daysShort} from "../helpers/dateStructs";
import {LogInterface} from "../interfaces/LogInterface";
import {DayInterface} from "../interfaces/DayInterface";
import EditLog from "../components/EditLog";

interface ComponentProps {}

interface ComponentState {
  editDay: boolean
  monday: Date
  week: number
  monthYear: string
  weekDays: Array<DayInterface>
  day: DayInterface
  log: LogInterface
}

class Home extends React.Component<ComponentProps, ComponentState> {

  api = Api.getInstance()
  monday = new Date()
  date: Date

  state = {
    editDay: false,
    week: 0,
    monthYear: '',
    monday: new Date(),
    weekDays: [],
    day: {} as DayInterface,
    log: {} as LogInterface
  }

  constructor(props: ComponentProps) {
    super(props)
    this.date = new Date()
  }

  componentDidMount() {
    this.setWeek()
  }

  setWeek = () => {
    this.monday = new Date(this.date)
    let dow = dayOfWeek(this.date)
    this.monday.setDate(this.date.getDate() - dow)
    let day = new Date(this.monday)
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
      monday: this.monday,
      week: getWeekFromDate(this.monday),
      monthYear: formatMonthYear(this.monday),
      weekDays: days
    })
    this.getData()
  }

  getData = () => {
    const firstDate = formatYYYYMMDD(this.monday)
    let endDate = new Date(this.monday)
    endDate.setDate(endDate.getDate() + 7)
    const lastDate = formatYYYYMMDD(endDate)
    const url = 'work_logs?first_date=' + firstDate + '&last_date=' + lastDate;
    this.api.sess_get(url).then(responseJson => {
      this.addLogs(responseJson.work_logs)
    })
  }

  addLogs = (logs: Array<LogInterface>) => {
    const weekDays = this.state.weekDays

    for (let weekDay of weekDays as Array<DayInterface>) {
      weekDay.logs = []
      for (let log of logs) {
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

  editLog = (day: DayInterface, log: LogInterface) => {
    this.setState({day: day, editDay: true, log: log})
  }

  saveLog = (changed: boolean) => {
    this.setState({editDay: false})
    if (changed) {
      this.getData()
    }
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
            <EditLog day={this.state.day} log={this.state.log} save={this.saveLog}/>
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
                <div key={"day_" + index} style={{borderBottom: "2px solid #444"}}
                     className={"px-4 py-2 flex justify-between " + dayClass}>
                  <div>
                    <h3>{day.name}</h3>
                    <p className="mt-2 font_small">{day.dateShort}</p>
                  </div>
                  <div className="font_small flex-grow mx-4">
                    {
                      day.logs.map((log: LogInterface, logIndex) => {
                        return (
                          <div key={"p_" + index + "_" + logIndex} className="mb-2"
                               onClick={() => this.editLog(day, log)}>
                            {log.project}: {log.hours} h
                            <p><i>{log.description}</i></p>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div onClick={() => this.editLog(day, {} as LogInterface)}>
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
