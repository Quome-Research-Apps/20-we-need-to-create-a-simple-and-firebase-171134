export interface LoggedActivity {
  id: string;
  client: string;
  description: string;
  duration: number; // in seconds
  loggedAt: string; // ISO string
}
