import React from "react";
import {IonButton} from "@ionic/react";
import Api from "../services/Api";
import {LogInterface} from "../interfaces/LogInterface";
import {DayInterface} from "../interfaces/DayInterface";
import {ProjectInterface} from "../interfaces/ProjectInterface";

interface ComponentProps {
  save: Function
  log: LogInterface
  day: DayInterface
}

interface ComponentState {
  project: string
  projectId: number
  description: string
  hours: string
  error: string
  projects: Array<ProjectInterface>
}

export default class EditLog extends React.Component<ComponentProps, ComponentState> {

  private api = Api.getInstance()

  state = {
    project: this.props.log.project ? this.props.log.project : '',
    projectId: isNaN(this.props.log.projectId) ? 0 : this.props.log.projectId,
    description: this.props.log.description ? this.props.log.description : '',
    hours: isNaN(this.props.log.hours) ? '' : this.props.log.hours + '',
    projects: [],
    error: ''
  }

  componentDidMount() {
    if (!this.props.log.projectId) {
      this.getProjects()
    }
  }

  componentDidUpdate(prevProps: ComponentProps) {
    if (prevProps.log.id !== this.props.log.id || prevProps.day.date !== this.props.day.date) {
      this.setState({
        project: this.props.log.project ? this.props.log.project : '',
        description: this.props.log.description ? this.props.log.description : '',
        hours: isNaN(this.props.log.hours) ? '' : this.props.log.hours + '',
      })
    }
  }

  getProjects = () => {
    this.api.sess_get('projects').then(responseJson => {
      this.setState({projects: responseJson.projects})
    })
  }

  private save = () => {
    const data = {
      id: this.props.log.id ? this.props.log.id : 0,
      hours: this.state.hours,
      project_id: this.state.projectId ? this.state.projectId : 0,
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
    this.setState({hours: e.target.value});
  }

  private changeProject = (e: any) => {
    if (e.target.value === 'new') {
      console.log('new')
    } else if (e.target.value === '0') {
      console.log('no op')
    } else {
      const projectId = parseInt(e.target.value)
      if (!isNaN(projectId)) {
        this.setState({projectId: projectId})
      }
    }
  }

  render() {
    return (
      <div className="mt-4 text_center">

        <h3>{this.props.day.name} {this.props.day.dateShort}</h3>

        {
          this.props.log.projectId ? (
            <h3 className="mt-4">{this.props.log.project}</h3>
          ) : (
            <select name="project" onChange={(e) => this.changeProject(e)}>
              <option value={0}>Välj projekt</option>
              <option value="new">Lägg till project</option>
              {
                this.state.projects.map((project: ProjectInterface) => {
                  return (
                    <option key={"project_" + project.id} value={project.id}>{project.name}</option>
                  )
                })
              }
            </select>
          )
        }

        <div className="mt-8">
          <input style={{width: "36px"}} type="text" name="hours" value={this.state.hours}
                 onChange={(e) => this.handleHours(e)}/> timmar
        </div>

        <div className="mt-4">
          <textarea cols={30} rows={2} name="description" placeholder="Beskrivning" value={this.state.description}
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
