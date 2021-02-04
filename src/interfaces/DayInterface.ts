import {LogInterface} from "./LogInterface";

export interface DayInterface {
  name: string
  date: string
  dateShort: string
  logs: Array<LogInterface>
}
