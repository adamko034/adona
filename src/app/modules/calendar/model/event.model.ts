export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  created: Date;
  createdById: string;
  createdBy: string;
  teamId?: string;
}
