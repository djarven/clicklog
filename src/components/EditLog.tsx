import React from "react";
import {IonButton} from "@ionic/react";
import Api from "../services/Api";
import {LogInterface} from "../interfaces/LogInterface";
import {DayInterface} from "../interfaces/DayInterface";

interface ComponentProps {
  save: Function
  log: LogInterface
  day: DayInterface
}

interface ComponentState {
  project: string
  id: number
  projectId: number
  description: string
  hours: number
  error: string
}

export default class EditLog extends React.Component<ComponentProps, ComponentState> {

  private api = Api.getInstance()

  state = {
    project: '',
    id: 0,
    projectId: 0,
    description: '',
    hours: 0,
    error: ''
  }

  private save = () => {
    const data = {
      id: this.state.id,
      hours: this.state.hours,
      project_id: this.state.projectId,
      date: this.props.day.date,
      description: this.state.description
    }
    this.api.post('work_log/save', data).then(response => {
      if (response.ok) {
        response.json().then(responseJson => {
          if (responseJson.status === 'ok') {
            this.props.save(true);
          } else {
            this.setState({error: responseJson.message})
          }
        })
      } else {
        alert(response.status)
      }
    });

  }

  private handleDescription = (e: any) => {
    this.setState({description: e.target.value});
  }

  private handleHours = (e: any) => {
    this.setState({hours: parseInt(e.target.value)});
  }

  render() {
    return (
      <div className="pt-4 text_center min-h-screen">
        <h2 className="color_white">Logga in</h2>

        <div className="mt-8">
          <input type="number" name="hours" placeholder="Timmar" value={this.props.log.hours}
                 onChange={(e) => this.handleHours(e)}/>
        </div>

        <div className="mt-4">
          <input type="text" name="description" placeholder="Beskrivning" value={this.props.log.description}
                 onChange={(e) => this.handleDescription(e)}/>
        </div>

        <div className="mt-4">
          <IonButton onClick={() => this.save()}>Spara</IonButton>
        </div>

        {
          this.state.error.length > 0 &&
          <div className="mt-8 bg_white p-4">{this.state.error}</div>
        }

      </div>
    )
  }
}
